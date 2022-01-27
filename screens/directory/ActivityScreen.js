import React, { Component, useState, useEffect } from 'react';

import { View, 
    Text, 
    StyleSheet, 
    Dimensions,
    Picker,
    Button, 
    ScrollView,
    FlatList, 
    TouchableOpacity,
    Platform,
    Modal,
    ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import ButtonStart from '../../components/ButtonStart';
import ButtonStartIos from '../../components/ButtonStartIos';
import BusList from '../../components/BusinessList';
import ButtonClose from '../../components/ButtonClose';
import LogoHeader from '../../components/LogoHeader';
import PaginationButtons from '../../components/PaginationButtons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './../../constants/Colors';
import PROVINCIAS from './../../constants/ProvinciasEsp';
import PROVINCIASPT from './../../constants/ProvinciasPt';
import URL from '../../constants/Url';
import {getI18n} from '../../i18n';
import { showMessage, hideMessage } from "react-native-flash-message";
import { verifyPermissions, 
        getUserLocation, 
        getBusinessLocation,
        getUserRegion} from '../../constants/Helpers';
import { getDistance } from 'geolib';
import { SliderPicker } from 'react-native-slider-picker';
import PickerBox from 'react-native-picker-box';
import paisesEs from '../../constants/paisesEs';
import paisesEn from '../../constants/paisesEn';
import paisesGl from '../../constants/paisesGl';
import paisesPt from '../../constants/paisesPt';
import paisesFr from '../../constants/paisesFr';
import paisesDe from '../../constants/paisesDe';


const ActivityScreen = props => {   
    const [isFetching, setIsFetching] = useState(true);
    const [isReloading, setIsReloading] = useState(false);
    const [businesses, setBusinesses] = useState();
    const [numPages, setNumPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState();
    const [region, setRegion] = useState();
    const [userRegion, setUserRegion] = useState();
    const [provincias, setProvincias] = useState([]);
    const [paisesIos, setPaisesIos] = useState([]);
    const [country, setCountry] = useState('ES');
    const [userLocation, setUserLocation] = useState();
    const [showModal, setShowModal] = useState(false);
    const [distance, setDistance] = useState(25);
    const [countriesList, setCountriesList] = useState([]);
    const [showIosCountries, setShowIosCountries] = useState(false);
    const [buttonIosCountry, setButtonIosCountry] = useState(getI18n().t('Pais'));
    const [showIosRegions, setShowIosRegions] = useState(false);
    const [buttonIosRegion, setButtonIosRegion] = useState(getI18n().t('Provincia'));

    useEffect(() => {
        setCountries();
        locateUser();
        
    }, []);

    useEffect(() => {
        if(userLocation){
            findRegion(userLocation.latitude, userLocation.longitude);
            getBusinessesFromApi();
            
            setRegions();
        }
        
    }, [userLocation]);

/*
    useEffect(() => {
        getBusinessesFromApi(filter);
       
    }, [filter]);
*/

    useEffect(() => {
        setRegions();
    }, [country]);

    const title = props.navigation.getParam('title');
    const idAct = props.navigation.getParam('id');

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

        let ps2 = paises.map((item, index) => {
            let nItem = item;
            nItem.id = index + 1;
            nItem.label = item.name;
            nItem.value = item.code;
            return nItem;
        });

        setPaisesIos(ps2);

    }

    const setRegions = async () => {
        let provs = await fetchRegions(country);

        if(provs == null || provs.length == 0){
            alert(getI18n().t('no_hay_negocios_pais'));
        } else {
            let provs2 = provs.map((elem, index) => {
                let nItem = elem;
                nItem.id = index + 1;
                nItem.label = elem.state;
                nItem.value = elem.state;
                return nItem;
            });


            setProvincias(provs2);
        }

    }

    const showCountryName = (code) => {
        let c = countriesList.find(item => item.code == code);
        console.log(c);
        return c.name;
        
    }

    const locateUser = async () => {
        await verifyPermissions();
        setUserLocation(await getUserLocation());
    }

    const findRegion = async (lt, ln) => {
        let reg = await getUserRegion(lt, ln);

        if(reg == 'La Coruña') reg = 'A Coruña';

        setUserRegion(reg);
        // setRegion(reg);
    }

    const closeModal = () =>{
      setShowModal(false);
    }

    const showLoadingMoreMessage = () => {
        showMessage({
                message: getI18n().t('Cargando_mas') ,
                type: "danger",
                position: {
                    top: 160,
                    left: 40,
                    right: 0,
                    bottom: 0
                },
                icon: 'info',
                duration: 3000

        });
    }
    
    const changeFilter = (val) => {
       
        if(val != filter){
            getBusinessesFromApi(val); 
            setFilter(val); 
        }        
             
    }

    const getBusinessesFromApi = async (nFilter = null) => {
        console.log('Esto es getBusinessesFromApi y el filtro es: ', nFilter);
        console.log('REGION: ', region);
        setIsFetching(true);
        setCurrentPage(1);

        let bsns = await fetchBusinesses(idAct, nFilter);

        let numPags = 1;

        setBusinesses(bsns.data);


        if(bsns.total <= 21){
            setNumPages(1);
        } else {
            
            if(bsns.total % 21 == 0){
                numPags = bsns.total / 21;
            } else {
                numPags = Math.floor(bsns.total / 21) + 1;
            }
            
            setNumPages(numPags);
        }

        setIsFetching(false);

    }

    const fetchRegions = async (country) => {
        let url = URL.BASE + 'api/negocios/states';

        let _headers = {
            authorizationapp: URL.AUTH_APP,
            'language-user': props.store.mainStore.deviceLang,
            'Country-User': country
        };

        try {
            let response = await fetch(url, 
                {
                    method: 'GET',
                    headers: _headers
                }
            );
            let responseJson = await response.json();
            
            if(responseJson.state == 1){
                return responseJson.data;
            }
           

        } catch (error) {
            console.error(error);
        }           

        return null;
    }

    const fetchBusinesses = async (idCat, nFilter = null, offset = null) => {
        let url = URL.BASE + 'api/negocios/category/' + idAct;
        if(offset != null) url += '/' + offset * 21;


        let _headers = {
            authorizationapp: URL.AUTH_APP,
            'language-user': props.store.mainStore.deviceLang
        };

        if(userLocation && (nFilter == null || nFilter == 'prox')){
            _headers.latitud = userLocation.latitude,
            _headers.longitud = userLocation.longitude
        }

        if(nFilter != null){
            if(nFilter == 'provincia' && region){
                
                url += '?query=' + region;
            }
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
            console.error(error);
        }           
    }

    const getBusinessesPage = async (page) => {

        setIsReloading(true);
        let bb = await fetchBusinesses(idAct, null, page);
   
        setBusinesses(bb.data);

        setIsReloading(false);

        
    }

    const getMoreBusinesses = async() => {

        if(currentPage < numPages){
           // setIsReloading(true);
            showLoadingMoreMessage();
            let nextPage = currentPage + 1;

            let moreBusinesses = await fetchBusinesses(idAct, null, nextPage);

            if(moreBusinesses.state == 1) setBusinesses([...businesses, ...moreBusinesses.data]);
            
            setCurrentPage(currentPage + 1);
            console.log('Página actual: ' + currentPage);

         //   setIsReloading(false);
        }

    }

    const showFilterBar = () => {
        return (
            <View style={styles.header2}>
                <View style={{
                    width: '50%', 
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity onPress={() => {filterByProvince()}} style={[styles.btn, showModal ? {backgroundColor: '#FC8E93'} : {backgroundColor: COLORS.directoryColor}]}>
                        <Text style={styles.btnText}>{getI18n().t('Provincia')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '50%', 
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}>

                    <TouchableOpacity onPress={() => {filterByDistance()}} style={[styles.btn, showModal ? {backgroundColor: '#FC8E93'} : {backgroundColor: COLORS.directoryColor}]}>
                        <Text style={styles.btnText}>{getI18n().t('proximidad')}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    const filterByProvince = () => {
        setShowModal(true)
    }

    const filterByDistance = () => {
        setFilter('prox');
        getBusinessesFromApi('prox');
    }

    const filterBus = () => {
        setFilter('provincia'); 
        getBusinessesFromApi('provincia');
        setShowModal(false);
    }


    const showModalContent = () => {

        if(Platform.OS === 'ios'){
            return(
                <>
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
                                closeModal()
                            }}
                        />  
                    </View>
                </View>

                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{getI18n().t('filtrar_por')} {getI18n().t('Provincia')}</Text>
                </View>
                <View style={styles.filters}>
                                
                    <View style={{width: '50%', padding: 5}}>
                        <ButtonStartIos
                            title={buttonIosCountry}
                            color={COLORS.directoryColor}
                            desplegable={true}
                            textColor="#fff"
                            action={() =>{
                                setShowIosCountries(true);
                            }}
                        />  

                        
                    </View>

                    <View style={{width: '50%', padding: 5}}>
                        <ButtonStartIos
                            title={buttonIosRegion}
                            color={COLORS.directoryColor}
                            desplegable={true}
                            textColor="#fff"
                            action={() =>{
                                setShowIosRegions(true);
                            }}
                        />  

                    </View>

                </View>
                </>
            );
        } else {
            return(
                <>
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
                                closeModal()
                            }}
                        />  
                    </View>
                </View>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{getI18n().t('filtrar_por')} {getI18n().t('Provincia')}</Text>
                </View>
                <View style={styles.filters}>
                                
                    <View style={{width: '50%', padding: 5}}>
                        <View style={{...styles.pickerStyle, backgroundColor: COLORS.directoryColor}}>
                            <Picker
                                selectedValue={country}
                                style={{
                                    height: 40, 
                                    width: '100%', 
                                    color: '#FFF',
                                    
                                }}
                                mode='dropdown'
                                onValueChange={(itemValue, itemIndex) =>{
                                    //changeFilter(itemValue);
                                    setCountry(itemValue);
                                }}>

                               

                                {
                                    countriesList.map((n) =>{
                                        return (
                                            <Picker.Item label={n.name} value={n.code} key={n.code} />
                                        );
                                    })
                                }


                            </Picker>
                        </View>

                    </View>

                    <View style={{width: '50%', padding: 5}}>
                        <View style={{...styles.pickerStyle, backgroundColor: COLORS.directoryColor}}>
                            <Picker
                                selectedValue={region ? region.toString() : ''}
                                style={{
                                    height: 40, 
                                    width: '100%', 
                                    color: '#FFF',
                                    
                                }}
                                mode='dropdown'
                                onValueChange={(itemValue, itemIndex) =>{
                                    
                                    setRegion(itemValue);
                                    
                                }}>

                                <Picker.Item 
                                                label={getI18n().t('elija_provincia')}
                                                value=""
                                                key="0" />


                                {
                                    provincias.map(element => {
                                        return(
                                            <Picker.Item 
                                                label={element.state} 
                                                value={element.state} 
                                                key={element.id} />
                                        );
                                    })
                                }
                            </Picker>

                        </View>

                    </View>

                </View>
                </>
            );
        }


    }

    const renderCountry = (itemData) => {

         return(
            <TouchableOpacity onPress={() => {
                            /*    toggleSelectedCountry(itemData.item.name);
                                filterByCountry(itemData.item.name);
                                setShowModal(false);    */

                                setCountry(itemData.item.value);
                                setButtonIosCountry(showCountryName(itemData.item.value));
                                
                                setShowIosCountries(false);
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

    const renderProv = (itemData) => {

         return(
            <TouchableOpacity onPress={() => {

                                setRegion(itemData.item.value);
                               // setButtonIosCountry(showCountryName(itemData.item.value));
                                setButtonIosRegion(itemData.item.value);
                                setShowIosRegions(false);
                            }}>
                <View style={styles.cell}>


                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: Dimensions.get('window').width < 411 ? 12 : 15}}>
                            {itemData.item.label}
                        </Text>
                    </View>



                </View>
            </TouchableOpacity>
        );
    }

    const showBusinesses = () => {
        if(businesses.length === 0){
            return(
                <>
                { showFilterBar() }
                <View style={styles.centered}>
                    <Text style={{color: 'black'}}>{getI18n().t('no_hay_negocios')} </Text>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>{title}</Text>
                </View>
                </>
            ); 
        } else {
            return (
                <>
                { showFilterBar() }
                <BusList listData={businesses}
                    refreshing={isReloading}
                    navigation={props.navigation} 
                    getmore={getMoreBusinesses}    
                />


                </>
            );
        }
        
        
    }
    

    return (
        <>
        
        <View style={styles.centered}>
        {
            isFetching ? <ActivityIndicator size="large" color={COLORS.directoryColor} />
            : showBusinesses()

        }
        </View>

        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                >
                <View
                    style={{
                    height: '45%',
                    marginTop: 'auto',
                    
                    }}>

                    <View style={styles.centered2}>
                        
                            {
                             showModalContent()   
                            }
                            

                            <ButtonStart 
                                title={getI18n().t('Filtrar')}
                                color={'#242B3A'}
                                textColor="#fff"
                                action={() =>{
                                    filterBus()
                                }}
                            />  
                      

                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={false}
                visible={showIosCountries}
            >

                <View style={styles.headerModal}>
                    <TouchableOpacity onPress={() => {
                        
                        setShowIosCountries(false);
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
                            data={paisesIos}
                            renderItem={renderCountry}
                            keyExtractor={(item, index) => item.code}
                        />                           
                    </View>
                </View>

            </Modal>

            <Modal
                animationType="slide"
                transparent={false}
                visible={showIosRegions}
            >

                <View style={styles.headerModal}>
                    <TouchableOpacity onPress={() => {
                        
                        setShowIosRegions(false);
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
                            data={provincias}
                            renderItem={renderProv}
                            keyExtractor={(item, index) => item.id}
                        />                           
                    </View>
                </View>

            </Modal>


        </View>
         
        
        </>
    );

}

ActivityScreen.navigationOptions = navigationData => {
    const title = navigationData.navigation.getParam('title');
    return {
        headerTitle: title,
        headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navigationData.navigation.pop();
              }}>
              <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.directoryColor} />
            </TouchableOpacity>
            
          ),
          headerRight: (
              
            <TouchableOpacity onPress={() =>{
                  navigationData.navigation.navigate('Splash');  
                }
            }>
                <LogoHeader />
            </TouchableOpacity>
          )

    };
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#ecedec',
        padding:15,
    },
    centered: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        backgroundColor: '#ecedec',
    },
    centered2: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        backgroundColor: '#ecedec',
        borderTopWidth: 2,
        borderTopColor: COLORS.directoryColor,
        paddingTop: 10
    },
    header2: {
        height: 70,
        width: '100%',
        paddingTop: 0,
        paddingBottom: 10,
        paddingHorizontal: 5,
        flexDirection: 'row'
    },
    pickerStyle: {
        height: 40, 
        
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    btn: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 5
    },
    filters: {
        marginVertical: 10,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        padding: 5
    },
    modalHeader: {
        marginVertical: 10
    },
    modalTitle: {
        fontSize: 20
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



});

export default inject('store')(observer(ActivityScreen));