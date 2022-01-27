import React , { Component, useState, useEffect } from 'react';
import { StyleSheet, 
        ScrollView, 
        View, 
        FlatList, 
        TouchableOpacity,
        Modal,
        Picker,
        Platform,
        Text, 
        ActivityIndicator,
        Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import ImageHeader from '../../components/ImageHeader';
import MapComponent from '../../components/MapComponent';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import ListHeader from '../../components/ListHeader';
import ButtonStart from '../../components/ButtonStart';
import ButtonStart2 from '../../components/ButtonStart2';
import ButtonClose from '../../components/ButtonClose';
import GoToLogin from '../../components/GoToLogin';
import { NEGOCIOS } from '../../data/dummy-data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { showIcon } from '../../constants/Helpers';
import Geocoder from 'react-native-geocoding';
import KEY from '../../constants/Key';
import URL from '../../constants/Url';
import { verifyPermissions, 
        getUserLocation, 
        getBusinessLocation,
        getUserRegion} from '../../constants/Helpers'
import { inject, observer } from 'mobx-react';
import LogoHeader from '../../components/LogoHeader';
import { getDistance } from 'geolib';
import {getI18n} from '../../i18n';
import MapView  from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import { SliderPicker } from 'react-native-slider-picker';

const title = getI18n().t('Localizacion');

const NearMeScreen = props => {
    const isLogged = props.store.mainStore.isLogged;
    const [isFetching, setIsFetching] = useState(true);
    const [userLocation, setUserLocation] = useState();
    const [mapHeight, setMapHeight] = useState(Dimensions.get('window').height - 150);
    const [allMarkers, setAllMarkers] = useState([]);
    const [foundBusinesses, setFoundBusinesses] = useState();
    const [visibleMarkers, setVisibleMarkers] = useState([]);
    const [found, setFound] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [numVisibles, setNumVisibles] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState(getI18n().t('todas_las_categorias'));
    const [region, setRegion] = useState();
    const [distance, setDistance] = useState(100);

    useEffect(() => {
        locateUser();

    }, []);

    useEffect(() => {
        if(userLocation){
            findRegion(userLocation.latitude, userLocation.longitude);
           
        }
        
    }, [userLocation]);

    useEffect(() => {
        if(region){
            getActivitiesFromApi();
            getBusinessesFromApi();

        }
    }, [region]);


    useEffect(() => {
        if(foundBusinesses){
            findMarkers(foundBusinesses, userLocation, allMarkers);
        }
    }, [foundBusinesses]);


    useEffect(() => {

        getBusinessesFromApi();
        
    }, [distance]);


    const locateUser = async () => {
        await verifyPermissions();
        setUserLocation(await getUserLocation());
    }

    const findRegion = async (lt, ln) => {
        setRegion(await getUserRegion(lt, ln));
    }

    const toggleSelectedCat = (id, name = '') => {
        if(selectedCategory == id){
            setSelectedCategory(0);
            setSelectedCategoryName(getI18n().t('todas_las_categorias'));
            
        } else {
            setSelectedCategory(id);
            setSelectedCategoryName(name);
        }

        
    }

    const getActivitiesFromApi = async () => {
        try {
            let response = await fetch(URL.BASE + 'api/negocios/category/all', 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
                    }
                }
            );
            let responseJson = await response.json();

            setCategories(responseJson.data);

        } catch (error) {
            console.error(error);
        }
    }

    const getBusinessesFromApi = async() => {

        let bsns = await fetchBusinesses();

        /* Si hay más de 21 resultados hacemos peticiones hasta que empiecen
        a llegar resultados a más de 100 kilómetros del usuairo */

        if(bsns.total <= 21){
            setFoundBusinesses(bsns.data);

        } else {
            let numPags = Math.floor(bsns.total / 21);

            var b = [];
            
            for(let i = 0; i <= numPags; i++){
                let a = i * 21;
                let dt = await fetchBusinesses(a);
                
                if(dt.data.length > 0){
                    b = [...b, ...dt.data];
                    if(dt.data[dt.data.length - 1].distance > distance) break;
                }

                // limitamos los resultados a 300 porque en Madrid salen miles
                if(b.length >= 300) break;
            }
            
            let cc = [...new Set(b)];

            let results = cc.filter(elem => {
                return elem.distance <= distance;
            });


            setFoundBusinesses(results);
            
        }
    }

    const fetchBusinesses = async (offset = null) => {
        let url = URL.BASE + 'api/negocios';
        if(offset != null) url += '/' + offset;
        if(region) url += '?query=' + region;

        let _headers = {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
        };

        if(userLocation){
            _headers.latitud = userLocation.latitude,
            _headers.longitud = userLocation.longitude
        }

        try {
            let response = await fetch(url, 
                {
                    method: 'GET',
                    headers: _headers
                }
            );
            let responseJson = await response.json();
            
            return responseJson;            

        } catch (error) {
            console.error('Esto es un error en el fetch ' + error);
            console.error('headers: ' + _headers);
        }           
    }

    const findMarkers = (data, ul, am) => {

        if(ul){
            if(am.length === 0){

                const markers = data.map(elem => {
                    let newMark = {
                        coordinates: {
                            latitude: parseFloat(elem.latitude),
                            longitude: parseFloat(elem.longitude)
                        },
                        latitude: parseFloat(elem.latitude),
                        longitude: parseFloat(elem.longitude),
                        name: elem.name,
                        idBus: elem.id
                    }

                    return newMark;
                });

                console.log('Negocios totales: ', markers.length);

                const userMarker = [
                    {
                        coordinates: {
                            latitude: parseFloat(ul.latitude),
                            longitude: parseFloat(ul.longitude)
                        },
                        title: getI18n().t('estas_aqui'),
                        color: 'green',
                        id: 1,
                        idBus: 0
                    }
                ];

                setAllMarkers([...userMarker, ...markers]);
                setVisibleMarkers([...userMarker, ...markers]);
                setNumVisibles(markers.length);
                setFound(true);
                setIsFetching(false);


            }

        } 

    }

    const filterByCategory = (idC) => {
        if(idC == selectedCategory || idC == 0){
            setVisibleMarkers(allMarkers);
            if(allMarkers.length > 0) setNumVisibles(allMarkers.length - 1);
        } else {
            const filteredBusinesses = foundBusinesses.filter(elem => {
                if(elem.category.findIndex(item => item.id == idC) >= 0) return elem;
            });

           
            const fm = filteredBusinesses.map(elem => {
                let newMark = {
                    coordinates: {
                            latitude: parseFloat(elem.latitude),
                            longitude: parseFloat(elem.longitude)
                    },
                    latitude: parseFloat(elem.latitude),
                    longitude: parseFloat(elem.longitude),
                    name: elem.name,
                    idBus: elem.id
                }

                return newMark;
            });
            
            const userMarker = [
                {
                    coordinates: {
                        latitude: parseFloat(userLocation.latitude),
                        longitude: parseFloat(userLocation.longitude)
                    },
                    title: getI18n().t('estas_aqui'),
                    color: 'green',
                    id: 1,
                    idBus: 0
                }
            ];

            setVisibleMarkers([...userMarker, ...fm]);
            setNumVisibles(fm.length);

        }
    }

    const renderModalContent = () => {
        return(
            <>
                <View style={styles.headerModal}>
                    <TouchableOpacity onPress={() => {
                        
                        setShowModal(false);
                    }}>
                        <View style={{flexDirection: 'row', 
                            alignItems: 'center',
                            paddingHorizontal: 7}}>
                            <MaterialCommunityIcons name="arrow-left" size={25} color="black" />
                            <Text> {getI18n().t('Volver')}</Text>
                        </View>
                        
                    </TouchableOpacity>
                </View>

                <View style={styles.centered}>
                    <View style={styles.content}>
                        <FlatList numColumns={2}
                            data={categories}
                            renderItem={renderCat}
                            keyExtractor={(item, index) => item.id.toString()}
                        />                           
                    </View>
                </View>
            </>
        );
    }

    const renderCat = (itemData) => {

        let ic = "checkbox-blank-outline";
        if(itemData.item.id == selectedCategory){
            ic = "checkbox-marked";
        } else {
            ic = "checkbox-blank-outline";
        }
        
         return(
            <TouchableOpacity onPress={() => {
                                toggleSelectedCat(itemData.item.id, itemData.item.name);
                                filterByCategory(itemData.item.id);
                                setShowModal(false);
                            }}>
                <View style={styles.cell}>
                    <View style={styles.cell1}>
                        <MaterialCommunityIcons name={showIcon(itemData.item.id)} size={20} color="black" />
                    </View>

                    <View style={{width: '60%', justifyContent: 'center'}}>
                        <Text style={{fontSize: Dimensions.get('window').width < 411 ? 12 : 15}}>
                            {itemData.item.name}
                        </Text>
                    </View>

                    <View style={styles.cell1}>
                       <MaterialCommunityIcons name={ic} size={25} color={COLORS.directoryColor} />
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    const renderHeader = () => {
        if(Platform.OS === 'ios'){
            return(
            <View style={styles.header}>
                <View style={{width: '32%', padding: 5, alignItems: 'center'}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{...styles.title, color: COLORS.directoryColor, paddingLeft: 18}}>{numVisibles} </Text>
                        <Text style={{marginHorizontal: 0, fontSize: 14,}}> {getI18n().t('Resultados')} </Text>
                    </View>
                        
                </View>

                <View style={{
                    width: '25%', 
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setShowModal2(!showModal2)
                        }}
                    >
                        <Text style={styles.white}>Radio</Text>
                    </TouchableOpacity>

                </View>

                <View style={{width: '43%'}}>
                    <ButtonStart2 
                        title={getI18n().t('filtrar_categorias')}
                        color={COLORS.directoryColor}
                        textColor="#fff"
                        action={() =>{
                            setShowModal(true)
                        }}
                    />  
                </View>
            </View>
            );
        } else {
            return(
            <View style={styles.header}>
                <View style={{
                    width: '32%',
                    padding: 7, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'row',
                    
                }}>
                    <Text style={{...styles.title, color: COLORS.directoryColor, paddingLeft: 18}}>{numVisibles}</Text>
                    <Text style={{
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: 14,
                        marginHorizontal: 10
                    }}>{getI18n().t('Resultados')} </Text>
                    
                </View>

                <View style={{
                    width: '25%', 
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setShowModal2(!showModal2)
                        }}
                    >
                        <Text style={styles.white}>Radio</Text>
                    </TouchableOpacity>

                </View>

                <View style={{
                    width: '43%', 
                    justifyContent: 'center'
                }}>
                    <View style={{...styles.pickerStyle, backgroundColor: COLORS.directoryColor}}>
                        <Picker
                            selectedValue={selectedCategory}
                            style={{
                                height: 40, 
                                width: '100%', 
                                color: '#FFF',
                                
                            }}
                            mode='dropdown'
                            onValueChange={(itemValue, itemIndex) =>{
                                
                                toggleSelectedCat(itemValue);
                                filterByCategory(itemValue);
                            }}>
                            <Picker.Item label={getI18n().t('todas_las_categorias')} value="0" key="0" />
                            {
                                categories.map((n) =>{
                                    return (
                                        <Picker.Item label={n.name} value={n.id} key={n.id} />
                                    );
                                })
                            }
                            </Picker>
                    </View>
                </View>
            </View>
            );
        }
    }

    const showModalContent = () => {
        return(
            <View
                style={{
                height: '50%',
                marginTop: 'auto',
                backgroundColor: '#FFFFFF'
                }}>

                <View style={styles.header2}>
                    <View style={{
                        width: '80%', 
                        justifyContent: 'center',
                        paddingHorizontal: 10
                    }}>
                    </View>
                    <View style={{
                        width: '20%', 
                        justifyContent: 'center',
                        paddingHorizontal: 10
                    }}>
                        <ButtonClose
                            color={COLORS.directoryColor}
                            textColor="#fff"
                            action={() =>{
                                setShowModal2(false);
                            }}
                        />  
                    </View>
                </View>

                <View style={styles.container}>
                    <SliderPicker 
                        minLabel={'0'}
                        midLabel={'100'}
                        maxLabel={'200'}
                        maxValue={200}
                        callback={(position) => {
                            setDistance(position);
                            
                        }}
                        defaultValue={distance}
                        labelFontColor={"#6c7682"}
                        labelFontWeight={'600'}
                        showFill={true}
                        fillColor={'red'}
                        labelFontWeight={'bold'}
                        showNumberScale={true}
                        showSeparatorScale={true}
                        buttonBackgroundColor={'#fff'}
                        buttonBorderColor={"#6c7682"}
                        buttonBorderWidth={1}
                        scaleNumberFontWeight={'300'}
                        buttonDimensionsPercentage={6}
                        heightPercentage={1}
                        widthPercentage={80}
                    />
                    
                    <View style={{flexDirection:'row', justifyContent: 'center', flexWrap:'wrap'}}>
                        <Text style={styles.modalTitle}>{getI18n().t('negocios_radio', {distance: distance})}</Text>
                        
                    </View>

                </View>
                <ButtonStart 
                    title={getI18n().t('Filtrar')}
                    color={'#242B3A'}
                    textColor="#fff"
                    action={() =>{                        
                        findMarkers(foundBusinesses, userLocation, []);
                        setShowModal2(false);
                    }}
                />  

            </View>   
        )    

    }

    const showScreen = (val) => {
        if(val){
            return(
                <View style={styles.body}>
                    <View style={styles.headbar}>

                        {
                            renderHeader()
                        }

                        <Text style={{fontSize: 18}}>
                            { getI18n().t('negocios_radio', {distance: distance}) }
                        </Text>

                    </View>

                    <View style={{...styles.mapPreview, height: mapHeight}}>
                        { isFetching ? <ActivityIndicator size="large" color={COLORS.directoryColor} /> :  
       

      <MapView
        style={
            {
                position:'absolute',
                top:0,
                bottom:0,
                left:0,
                right:0,
                height: '100%',
                width: '100%'
            }
        }

        initialRegion={userLocation}
      >

            {visibleMarkers.map(marker => (
              <Marker
                coordinate={marker.coordinates}
                title={marker.name}
                pinColor={marker.color}
                key={marker.idBus}
              >

                <Callout
                  onPress={() => {
                    if(marker.idBus != 0){
                        props.navigation.navigate({routeName: 'BusPage', params: {
                          busId: marker.idBus,
                          from: 'near'
                      }});  
                    }
                    
                  }}
                >
                  <Text style={{...styles.busName, color: COLORS.directoryColor}}>{marker.name || getI18n().t('estas_aqui')}</Text>
                  {
                    marker.idBus != 0 ?  <Text style={styles.press}>{getI18n().t('pulsa_para_ver')}</Text>
                    : null
                  }
                 
                </Callout>

              </Marker>


            ))}


      </MapView>


                        }

                        
                    </View>

                    <View>
                        <>
                            <Modal animationType="none"
                                transparent={false}
                                visible={showModal}
                            
                            >
                            {
                                renderModalContent()
                            }

                            </Modal>

                        </>
                    </View>

                    <View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showModal2}
                        >

                            {
                                showModalContent()
                            }
                            
                            
                        </Modal>
                    </View>
                    
                </View>                 
            );
        } else {
            return(
                <GoToLogin navigation={props.navigation} />
            );
        }

    }


    return(showScreen(isLogged));

};

NearMeScreen.navigationOptions = (navData) => {
    return{
        headerTitle: '',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={COLORS.directoryColor}>
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>

        ),
        headerRight: () => (
            <>

            <TouchableOpacity onPress={() =>{
                  navData.navigation.navigate('Splash');  
                }
            }>
                <LogoHeader />
            </TouchableOpacity>
            </>
        )
    };
    
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',
        height: '100%'
    },
    button: {
        backgroundColor: '#c3181f',
        borderRadius: 15,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    white: {
        color: '#fff'
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 400,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -15
    },
    headbar: {
        height: 100,
        paddingVertical: 12,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        marginTop: -10,
        paddingVertical: 7,
        flexDirection: 'row'
    },
    header2: {
        height: 70,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
       
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecedec',
    },
    content: {

        marginVertical: 15,
        backgroundColor: '#FFF',
        borderRadius: 15,
        overflow: 'hidden'
    },
    headerModal: {
        height: 50,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',

    },
    cell: {
        flexDirection: 'row',
        height: 55,
        width: Dimensions.get('window').width < 411 ? 160 : 200,
        borderBottomWidth: 1,
        borderBottomColor: '#ecedec',
        paddingVertical: Dimensions.get('window').width < 411 ? 15 : 10,
        borderRightWidth: 1,
        borderRightColor: '#ecedec',
        backgroundColor: '#FFF'
    },
    cell1: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    busName: {
      fontSize: 18
    },
    press: {
      paddingVertical: 5
    },
    pickerStyle: {
        height: 40, 
        paddingHorizontal: Dimensions.get('window').width < 411 ? 0 : 3,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: Dimensions.get('window').width < 411 ? 2 : 7
    }
});

//export default NearMeScreen;
export default inject('store')(observer(NearMeScreen));
