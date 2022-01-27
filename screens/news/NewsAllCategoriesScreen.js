import React, { Component, useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ButtonStart from '../../components/ButtonStart';
import ButtonClose from '../../components/ButtonClose';
import HeaderButton from '../../components/HeaderButton';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Modal } from 'react-native';
import { inject, observer } from 'mobx-react';
import { NEGOCIOS } from '../../data/dummy-data';
import NewsList from '../../components/NewsList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LogoHeader from '../../components/LogoHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './../../constants/Colors';
import URL from '../../constants/Url';
import {getI18n} from '../../i18n';
import { verifyPermissions, 
        getUserLocation, 
        getUserLocationPromise,
        getBusinessLocation } from '../../constants/Helpers';
import { SliderPicker } from 'react-native-slider-picker';
import PickerBox from 'react-native-picker-box';
import axios from 'axios';

const themeColor = COLORS.newsColor;
const title = getI18n().t('Noticias');

const NewsAllCategoriesScreen = props => {   
    const [isFetching, setIsFetching] = useState(true);
    const [news, setNews] = useState();
    const [numPages, setNumPages] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [isReloading, setIsReloading] = useState(false);
    const [userLocation, setUserLocation] = useState();
    const [hasPermission, setHasPermission] = useState();
    const [showModal, setShowModal] = useState(false);
    const [distance, setDistance] = useState(100);
    const [filter, setFilter] = useState();

    useEffect(() => {
        locateUser();
    }, []);

    useEffect(() => {
        if(userLocation){
            setFilter('prox');
        }
        
    }, [userLocation]);

    useEffect(() => {
        getNewsFromApi();
    }, [filter]);

    const themeColor = COLORS.newsColor;

    const locateUser = async () =>{
        setHasPermission(await verifyPermissions());
        if(!hasPermission){
            const ul = await getUserLocationPromise();
            setUserLocation(ul);
        }
    }

    const getAllNews = () => {
        setIsFetching(true);
        setFilter('all');
        
    }

    const getNewsFromApi = async () => {

        const tempNews = await fetchNews();

        setNews(tempNews.data);
        let np;
        if(tempNews.total <= 21){
            np = 1;
            setNumPages(np);
        } else {
            
            if(tempNews.total % 21 == 0){
                np = tempNews.total / 21;
            } else {
                np = Math.floor(tempNews.total / 21) + 1;
            }

            setNumPages(np);
        }
        
        console.log('Número de páginas: ' + np);

        setIsFetching(false);

    }


    const fetchNews = async (offset = 0) => {
        let num = offset * 21;
        let url = URL.BASE + 'api/shoppost/';

        let _headers = {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
        };

        console.log('FILTER: ' + filter);

        if(userLocation && filter == 'prox'){
            _headers.latitud = userLocation.latitude,
            _headers.longitud = userLocation.longitude,
            _headers.distancia = distance
        }

        if(num > 0) url += num;
        
        try {
            let response = await fetch(url, 
                {
                    method: 'GET',
                    headers: _headers
                }
            );
            let responseJson = await response.json();

            if(responseJson.state == 1){
                return responseJson;
            }
            

        } catch (error) {
            console.error(error);
        }

    }

    const getMoreNews = async() => {
        console.log('página actual: ' + currentPage);
        if(currentPage <= numPages){
            setIsReloading(true);
            let nextPage = currentPage + 1;

            let moreNews = await fetchNews(nextPage);

            if(moreNews.state == 1) setNews([...news, ...moreNews.data]);
            
            setCurrentPage(nextPage);

            setIsReloading(false);
        }

    }

    const showFilterBar = () => {
        return (
            <>
                <View style={{
                    width: '50%', 
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity onPress={() => { setShowModal(true) }} style={[styles.btn, showModal ? {backgroundColor: '#47A062'} : {backgroundColor: COLORS.newsColor}]}>
                        <Text style={styles.btnText}>{ getI18n().t('proximidad') }</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '50%', 
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}>

                    <TouchableOpacity onPress={() => { getAllNews() }} style={[styles.btn, showModal ? {backgroundColor: '#47A062'} : {backgroundColor: COLORS.newsColor}]}>
                        <Text style={styles.btnText}>{ getI18n().t('ver_todas') }</Text>
                    </TouchableOpacity>

                </View>
            </>
        );
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
                            color={COLORS.newsColor}
                            textColor="#fff"
                            action={() =>{
                                closeModal()
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
                        fillColor={'green'}
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
                        <Text style={styles.modalTitle}>{getI18n().t('noticias_radio')}</Text>
                        <Text style={{...styles.modalTitle2, color:COLORS.newsColor}}>{distance} Km</Text>
                    </View>
                    


                </View>
                <ButtonStart 
                    title={getI18n().t('Filtrar')}
                    color={'#242B3A'}
                    textColor="#fff"
                    action={() =>{
                        setFilter('prox');
                        setShowModal(false);
                    }}
                />  

            </View>   
        )    

    }

    const closeModal = () => {
        setShowModal(false);
    }

    const showNews = (data, bool) => {
        if(bool){
            return(
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.newsColor} />
                </View>
            );
        } else if(data.length > 0){
             return (
                <>
                <View style={styles.header}>
                    {
                        showFilterBar()
                    }
                </View>
                <NewsList listData={data} getmore={getMoreNews} navigation={props.navigation} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                >

                    {
                        showModalContent()
                    }
                    
                    
                </Modal>
                </>
            );
        } else {
            console.log('NO HAY DATOS');
            return (
                <View style={styles.centered}>
                    <Text style={{color: 'black'}}>{getI18n().t('no_hay_noticias')} </Text>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>{title}</Text>
                </View>
            );
        }
        
    }

/*
    if(!news){
        getNewsFromApi();
    }
 */ 
    return (
         
        showNews(news, isFetching)
         
    );

}

NewsAllCategoriesScreen.navigationOptions = navigationData => {
    
    return {
        headerTitle: title,
        headerLeft: (
             <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={themeColor}
            
            >
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navigationData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
            
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
    centered: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    modalHeader: {
        paddingTop: 20,
        justifyContent: 'flex-end'
    },
    modalTitle: {
        fontSize: 20,
        marginVertical: 20
    },
    modalTitle2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20
    },
    header: {
        height: 70,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        backgroundColor: '#ecedec',
    },
    header2: {
        height: 70,
        width: '100%',
        paddingVertical: 10,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 15,
        
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 5
    },

});

export default inject('store')(observer(NewsAllCategoriesScreen));