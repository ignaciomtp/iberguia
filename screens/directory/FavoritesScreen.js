import React, { Component, useState, useEffect, useRef } from 'react';
import { View, 
         ScrollView, 
         StyleSheet, 
         ActivityIndicator, 
         Text,
         FlatList,
         TouchableOpacity,
         Modal} from 'react-native';
import { inject, observer } from 'mobx-react';
import COLORS from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import GoToLogin from '../../components/GoToLogin';
import LogoHeader from '../../components/LogoHeader';
import ListHeader from '../../components/ListHeader';
import URL from '../../constants/Url';
import TopListComponent from '../../components/TopListComponent';
import CircleItemComponent from '../../components/CircleItemComponent';
import SquareItemComponent from '../../components/SquareItemComponent';
import { verifyPermissions, 
        getUserLocation, 
        getUserLocationPromise,
        getBusinessLocation } from '../../constants/Helpers';
import { getDistance } from 'geolib';
import {getI18n} from '../../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';

const title = getI18n().t('Favoritos');

const themeColor = COLORS.newsColor;

const FavoritesScreen = props => {
    const isLogged = props.store.mainStore.isLogged;
    const [isFetching, setIsFetching] = useState(true);
    const [hasPermission, setHasPermission] = useState();
    const [userLocation, setUserLocation] = useState();
    const [myFavs, setMyFavs] = useState([]);
    const [found, setFound] = useState(false);
    const [categoriesFav, setCategoriesFav] = useState([]);
    const [selectedCat, setSelectedCat] = useState(0);
    const [visibleFavs, setVisibleFavs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [data2, setData2] = useState();
    const categoryScroll = useRef(null);
    const businessScroll = useRef(null);

    useEffect(() => {
        let mounted = true;

        this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
            //setData2(data);
            if(!mounted) return;
            setIsFetching(true);
            locateUser();
            
        });  

        return () => { // Runs when component will unmount
            mounted = false;
        };
        
    }, []);

    useEffect(() => {
        getMyFavoritesFromApi();
    }, [userLocation]);
    
    const showAll = () => {
        setShowModal(true);
    }

    const showAllCategories = () => {
        setShowModal2(true);
    }

    const locateUser = async () => {
        await verifyPermissions();
        setUserLocation(await getUserLocationPromise());
    }

    const getMyFavoritesFromApi = async() =>{       
        try {
            let response = await fetch(URL.BASE + 'api/areaprivada/fav/', 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        Authorization: props.store.mainStore.token,
                        'language-user': props.store.mainStore.deviceLang
                    }
                }
            );
          
            let responseJson = await response.json();
            

            if(responseJson.state == 1){
                if(userLocation){
                    let favsDist = responseJson.data.map((n)=>{
                        let coors = {
                            latitude: n.latitude,
                            longitude: n.longitude
                        }

                        let distance = getDistance(userLocation, coors, accuracy = 1);

                        let nn = n;
                        nn.distance = parseInt(distance / 1000);
                        return nn;
                    });

                    favsDist.sort((a, b) => {
                        return a.distance - b.distance;
                    });

                    setMyFavs(favsDist);
                    setVisibleFavs(favsDist);
                } else {
                    setMyFavs(responseJson.data);
                    setVisibleFavs(responseJson.data);
                }

                let tempArray = [];
                let categories = [];

                responseJson.data.forEach((m) => {
                    tempArray = [...tempArray, ...m.category];
                   
                });

                for(var i = 0; i < tempArray.length; i++){
                   let ni = tempArray[i];

                   let index = categories.findIndex(item => item.id == ni.id);
                   
                   if(index < 0){
                        ni.num = 1;
                        categories.push(ni);

                   } else {
                        categories[index].num++;                        
                        
                   }
                }

                categories.sort((a, b) => a.name.localeCompare(b.name));

                setCategoriesFav(categories);
                setIsFetching(false);
            }
            

        } catch (error) {
            console.error(error);
        }  
    }

    const filterByCat = (val) =>{
        if(val == selectedCat){
            setSelectedCat(0);
            setVisibleFavs(myFavs);
        } else {
            setSelectedCat(val);
            const filteredFavs = myFavs.filter(elem => {
                if(elem.category.findIndex(item => item.id == val) >= 0) return elem;
            });

            setVisibleFavs(filteredFavs);
        }

        businessScroll.current.scrollTo({x: 0, y: 0, animated: true});
    }

    const renderResult = (itemData) => {
        return(
            <TouchableOpacity key={itemData.item.id} onPress={() => {
                setShowModal(false);
                props.navigation.navigate({routeName: 'BusPage', params: {
                            busId: itemData.item.id,
                            busTitle: itemData.item.title
                }});
            }}>
                <View style={{height:300,width:180}} >
                    <SquareItemComponent
                        title={itemData.item.name}
                        //img='https://nexoiberico.ticrevolution.com/uploads/bar20200121.jpg'
                        img={URL.BASE + 'uploads/' + itemData.item.image}
                        color={COLORS.directoryColor} 
                        score={itemData.item.ranking}
                        id={itemData.item.id}
                        distance={itemData.item.distance}
                    ></SquareItemComponent>
                </View>
            </TouchableOpacity>
        );        
    }

    const renderCat = (itemData) => {
         return(
            <TouchableOpacity key={itemData.item.id} onPress={() => {
                setShowModal2(false);
                filterByCat(itemData.item.id)
            }}>
                <View style={{height:160, 
                                width:140, 
                                borderRadius: 10,
                               }} >
                    <CircleItemComponent 
                        title={itemData.item.name} 
                        num={itemData.item.num}
                        id={itemData.item.id}
                        image={itemData.item.image}
                        color={selectedCat == itemData.item.id ? COLORS.directoryColor : '#fff'}
                        colorIcon={selectedCat == itemData.item.id ? '#fff' : '#000'}
                    >                        
                    </CircleItemComponent>
                </View>
            </TouchableOpacity>
        );
    }

    const showScreen = (val) =>{
        if(val){
            return(
                <ScrollView style={styles.body} ref={categoryScroll}>
                    <ListHeader titleSection={title} />
                    
                        
                        <>
                            <TopListComponent color={COLORS.directoryColor} 
                                            fontSize={18}
                                            action={showAllCategories}
                                            title={getI18n().t('por_tipo_comercio')}></TopListComponent>
                            <View style={{height: 180}}>
                            {
                                isFetching ? <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.directoryColor}  /></View>:
                            
                                        <ScrollView horizontal = {true}>
                                            {
                                                categoriesFav.map((n)=>{
                                                    return(
                                                        <TouchableOpacity key={n.id} onPress={() => {filterByCat(n.id)}}>
                                                            <View style={{height:160, 
                                                                        width:140, 
                                                                        borderRadius: 10,
                                                                        }} >
                                                                <CircleItemComponent 
                                                                    title={n.name} 
                                                                    num={n.num}
                                                                    id={n.id}
                                                                    color={selectedCat == n.id ? COLORS.directoryColor : '#fff'}
                                                                    colorIcon={selectedCat == n.id ? '#fff' : '#000'}
                                                                ></CircleItemComponent>
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                            

                                        </ScrollView>
                            }

                            </View>
                            
                            

                            <TopListComponent color={COLORS.directoryColor} 
                                            fontSize={18}
                                            title={getI18n().t('por_cercania')}
                                            action={showAll}
                                            ></TopListComponent>

                            <View style={{height: 320}}>
                            {
                                 isFetching ? <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.directoryColor}  /></View>:

                                <ScrollView horizontal = {true} ref={businessScroll}>
                                    
                                    {
                                        visibleFavs.map((n)=>{ 
                                            return(
                                                <TouchableOpacity key={n.id} onPress={() => {
                                                    props.navigation.navigate({routeName: 'BusPage', params: {
                                                                busId: n.id,
                                                                busTitle: n.title,
                                                                fav: true,
                                                                from: 'favorites'
                                                    }});
                                                }}>
                                                    <View style={{height:300,width:180}} >
                                                        <SquareItemComponent
                                                            title={n.name}
                                                            //img='https://nexoiberico.ticrevolution.com/uploads/bar20200121.jpg'
                                                            img={URL.BASE + 'uploads/' + n.image}
                                                            color={COLORS.directoryColor} 
                                                            score={n.ranking}
                                                            id={n.id}
                                                            distance={n.distance}
                                                        ></SquareItemComponent>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }

                                </ScrollView>

                            }
                            </View>

                        </>
                    

                <View>
                    <Modal animationType="slide"
                    transparent={false}
                    visible={showModal}
                    
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => {
                                setShowModal(false);
                            }}>
                                <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
                                <Text>{getI18n().t('Volver')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.centered}>
                            <FlatList numColumns={2}
                                data={visibleFavs}
                                renderItem={renderResult}
                                keyExtractor={(item, index) => item.id}
                            />                                

                        </View>

                    </Modal>
                </View>

                <View>
                    <Modal animationType="slide"
                    transparent={false}
                    visible={showModal2}
                    
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => {
                                setShowModal2(false);
                            }}>
                                <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
                                <Text>{getI18n().t('Volver')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.centered}>
                            <FlatList numColumns={2}
                                data={categoriesFav}
                                renderItem={renderCat}
                                keyExtractor={(item, index) => item.id}
                            />                                

                        </View>

                    </Modal>
                </View>
                </ScrollView>            
            );
        } else {
            return(
                <GoToLogin navigation={props.navigation} />
            );
        }
    }


    if(isLogged && !userLocation){
        locateUser();

    } 

    return(showScreen(isLogged));
};

FavoritesScreen.navigationOptions = navData => {
    return{
        headerTitle: '',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={themeColor}>
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        ),
        headerRight: () => (
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
        flex:1,
    },
    header: {
        height: 60,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    scroll:{
       height:500,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});


export default inject('store')(observer(FavoritesScreen));