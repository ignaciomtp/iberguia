import React, { Component, useState, useEffect } from 'react';
import { View, 
        Text, 
        TouchableOpacity,
        StyleSheet, 
        FlatList, 
        ActivityIndicator, 
        Picker, 
        Dimensions, 
        Modal } from 'react-native';
import { inject, observer } from 'mobx-react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import EmbassyList from '../../components/EmbassyList';
import ListHeader from '../../components/ListHeader';
import ListButton from '../../components/ListButton';
import ButtonStart from '../../components/ButtonStart';
import ButtonStartIos from '../../components/ButtonStartIos';
import LogoHeader from '../../components/LogoHeader';
import COLORS from '../../constants/Colors';
import URL from '../../constants/Url';
import ImageCarousel from '../../components/ImageCarousel';
import {getI18n} from '../../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { verifyPermissions, 
        getUserLocation, 
        getUserLocationPromise,
        getBusinessLocation } from '../../constants/Helpers';
import paisesEs from '../../constants/paisesEs';
import paisesEn from '../../constants/paisesEn';
import paisesGl from '../../constants/paisesGl';
import paisesPt from '../../constants/paisesPt';
import paisesFr from '../../constants/paisesFr';
import paisesDe from '../../constants/paisesDe';

const title = getI18n().t('Embajadas');

const themeColor = COLORS.embassyColor;

const baseUrl = URL.BASE;

const EmbassyListScreen = (props) => {
    const [isFetching, setIsFetching] = useState(true);
    const [allEmbassies, setAllEmbassies] = useState();
    const [embassies, setEmbassies] = useState();
    const [userLocation, setUserLocation] = useState();
    const [hasPermission, setHasPermission] = useState();
    const [selectedContryName, setSelectedContryName] = useState(getI18n().t('todos_los_paises'));
    const [showModal, setShowModal] = useState(false);
    const [countriesList, setCountriesList] = useState();


    useEffect(() => {
        locateUser();
    }, []);

    useEffect(() => {
        if(!embassies){
            getEmbassiesFromApi();
        }
        
    }, [userLocation]);


    const country = props.navigation.getParam('country');

    const esEmb = props.navigation.getParam('type');

    const pTitle = esEmb ? getI18n().t('Embajadas') : getI18n().t('Consulados');

    let devLang = props.store.mainStore.deviceLang.substring(0, 2);

    const setCountries = () => {
        let paises;
        switch (devLang) {
            case 'es':
                paises = paisesEs;
                break;
            case 'en':
                paises = paisesEn;
                break;
            case 'gl':
                paises = paisesGl;
                break;
            case 'pt':
                paises = paisesPt;
                break;
            case 'fr':
                paises = paisesFr;
                break;
            case 'de':
                paises = paisesDe;
                break;
        
            default:
                paises = paisesEn;
                break;
        }
        setCountriesList(paises);       
    }

    const locateUser = async () =>{
        setHasPermission(await verifyPermissions());
        if(!hasPermission){
            const ul = await getUserLocationPromise();
            setUserLocation(ul);
        }
    }

    const getEmbassiesFromApi = async () =>{
        let _headers = {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
        };

        if(userLocation){
            _headers.latitud = userLocation.latitude,
            _headers.longitud = userLocation.longitude
        }

        try {
            let response = await fetch(URL.BASE + 'api/embajada?countryisocode=' + 
                                country + '&es_embajada=' + esEmb, 
                {
                    method: 'GET',
                    headers: _headers
                }
            );

            let responseJson = await response.json();

            if(responseJson.state == 1 && responseJson.total == 0){
                setAllEmbassies([]);
                setEmbassies([]);
                setIsFetching(false);
            } else {
                const markers = responseJson.data.map(elem => {
                    let newMark = {}; 
                    newMark.id = elem.id;
                    newMark.latitude = parseFloat(elem.latitude);
                    newMark.longitude = parseFloat(elem.longitude);
                    newMark.coordinates = {
                        latitude: parseFloat(elem.latitude),
                        longitude: parseFloat(elem.longitude),
                    }
                    newMark.name = elem.name;
                    newMark.countryisocode = elem.countryisocode;
                    newMark.address = elem.address;
                    newMark.locality = elem.locality;
                    newMark.state = elem.state;
                    newMark.country = elem.countrystreet;
                    newMark.phone = elem.phone;
                    newMark.latitudeDelta = 0.00922;
                    newMark.longitudeDelta =  0.00421;
                    newMark.color = COLORS.embassyColor;
                    newMark.type = esEmb;
                    newMark.web = elem.web;
                    newMark.description = elem.description;
                    return newMark;
                });
                
                setAllEmbassies(markers);
                setEmbassies(markers);
                setIsFetching(false);
            }

        } catch (error) {
            console.error(error);
        }  
    }

    const toggleSelectedCountry = (name = '') => {
        if(selectedContryName != name){
            setSelectedContryName(name);
            filterByCountry(name);
        } 
    }

    const filterByCountry = (country) => {
        if(country == getI18n().t('todos_los_paises')){
            setEmbassies(allEmbassies);
        } else {

            let p = countriesList.find(element => element.name == country);
            let pe = props.navigation.getParam('country');
            let cc;

            if(pe == 'ES') {
                cc = paisesEs.find(elem => elem.code == p.code);
            } else {
                cc = paisesPt.find(elem => elem.code == p.code);
            }

            let embs = allEmbassies.filter(elem => {
                return elem.country == cc.name;
            });

            setEmbassies(embs);

        }
    }

    const renderHeader = () => {
        if(Platform.OS === 'ios'){
            return(
            <>
                <View style={{width: '50%', paddingHorizontal: 10, alignItems: 'center'}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        
                        <Text style={{marginHorizontal: 10}}> {pTitle} {getI18n().t('en')}: </Text>
                    </View>
                        
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        
                        <Text style={{color: COLORS.embassyColor}}> {selectedContryName}</Text>
                    </View>
                        
                    
                </View>

                <View style={{width: '50%', paddingHorizontal: 10, paddingVertical: 0, alignItems: 'center'}}>
                    <ButtonStartIos
                        title={getI18n().t('filtrar_categorias')}
                        color={COLORS.embassyColor}
                        textColor="#fff"
                        action={() =>{
                            setShowModal(true)
                        }}
                    />  
                </View>
            </>
            );
        } else {
            return(
            <>
                <View style={{
                    width: '40%',
                    padding: 7, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'row',
                    
                }}>
                    
                    <Text style={{
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: 16,
                        marginHorizontal: 10
                    }}>{pTitle} {getI18n().t('en')}: </Text>
                    
                </View>

                <View style={{
                    width: '60%', 
                    justifyContent: 'center'
                }}>
                    <View style={{...styles.pickerStyle, backgroundColor: COLORS.embassyColor}}>
                        <Picker
                            selectedValue={selectedContryName}
                            style={{
                                height: 40, 
                                width: '100%', 
                                color: '#FFF',
                                
                            }}
                            mode='dropdown'
                            onValueChange={(itemValue, itemIndex) =>{
                                
                                toggleSelectedCountry(itemValue);
                                filterByCountry(itemValue);
                            }}>
                            <Picker.Item label={getI18n().t('todos_los_paises')} value={ getI18n().t('todos_los_paises') } key="AC" />
                            {
                                countriesList.map((n) =>{
                                    return (
                                        <Picker.Item label={n.name} value={n.name} key={n.code} />
                                    );
                                })
                            }
                        </Picker>
                    </View>
                </View>
            </>
            );
        }
    }

    // función para mostrar el contenido de la modal en IOS, en vez del picker
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
                            data={countriesList}
                            renderItem={renderCountry}
                            keyExtractor={(item, index) => item.code}
                        />                           
                    </View>
                </View>
            </>
        );
    }

    const renderCountry = (itemData) => {

        let ic = "checkbox-blank-outline";
        if(itemData.item.name == selectedContryName){
            ic = "checkbox-marked";
        } else {
            ic = "checkbox-blank-outline";
        }
        
         return(
            <TouchableOpacity onPress={() => {
                                toggleSelectedCountry(itemData.item.name);
                                filterByCountry(itemData.item.name);
                                setShowModal(false);
                            }}>
                <View style={styles.cell}>


                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: Dimensions.get('window').width < 411 ? 12 : 15}}>
                            {itemData.item.name}
                        </Text>
                    </View>



                </View>
            </TouchableOpacity>
        );
    }

    const showEmbassies = (data, bool) => {
        if(bool){
            return(
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.embassyColor} />
                </View>
            );
        } else if(data.length > 0){
             return (
                <>
                <View style={styles.header}>
                    {
                        renderHeader()
                    }
                </View>
                <EmbassyList listData={data} navigation={props.navigation} />

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

                </>
            );
        } else {
            console.log('NO HAY DATOS');
            return (
                <>
                <View style={styles.header}>
                    {
                        renderHeader()
                    }
                </View>
                <View style={styles.centered}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>{title}</Text>
                    <Text style={{color: 'black'}}>{getI18n().t('no_hay_embajadas')} </Text>
                    
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
                </>
            );
        }
        
    }




    if(!countriesList){
        setCountries();
    }

    return (
        showEmbassies(embassies, isFetching)
    );


}


EmbassyListScreen.navigationOptions = (navData) => {
    return{
        headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navData.navigation.navigate('NewsList');
              }}>
              <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.embassyColor} />
            </TouchableOpacity>
        ),
        headerRight: (
            <TouchableOpacity onPress={() =>{
                  navData.navigation.navigate('Splash');  
                }
            }>
            <LogoHeader />
          </TouchableOpacity>
        )
    };
    
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centered: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        
    },
    header: {
        height: 65,
        backgroundColor: '#fff',
        marginTop: -10,
        marginBottom: 7,
        paddingTop: 20,
        paddingBottom: 5,
        flexDirection: 'row'
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
    pickerStyle: {
        height: 40, 
        paddingHorizontal: Dimensions.get('window').width < 411 ? 0 : 3,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: Dimensions.get('window').width < 411 ? 2 : 7
    }
});


export default inject('store')(observer(EmbassyListScreen));