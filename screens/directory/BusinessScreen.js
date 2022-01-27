import React, { Component, useState, useRef, useEffect } from 'react';
import { StyleSheet, 
         ScrollView, 
         View, 
         Text, 
         ActivityIndicator, 
         Dimensions} from 'react-native';
import * as Localization from 'expo-localization';
import ImageHeader from '../../components/ImageHeader';
import ContactBusiness from '../../components/ContactBusiness';
import CommentItem from '../../components/CommentItem';
import BusinessActions from '../../components/BusinessActions';
import BusinessNewsItem from '../../components/BusinessNewsItem';
import YourOpinion from '../../components/YourOpinion';
import ImageCarousel from '../../components/ImageCarousel';
import BottomButtons from '../../components/BottomButtons';
import MapComponent from '../../components/MapComponent';
import Schedule from '../../components/Schedule';
import MapView  from "react-native-maps";
import { Marker } from 'react-native-maps';
import { showLocation } from 'react-native-map-link';
import KEY from '../../constants/Key';
import URL from '../../constants/Url';
import MapViewDirections from 'react-native-maps-directions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { inject, observer } from 'mobx-react';
import { verifyPermissions, 
        getUserLocation, 
        getUserLocationPromise,
        getBusinessLocation } from '../../constants/Helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LogoHeader from '../../components/LogoHeader';
import {getI18n} from '../../i18n';
import { EventRegister } from 'react-native-event-listeners';

const BusinessScreen = props => { 
    const [markers, setMarkers] = useState([]);  
    const [isFetching, setIsFetching] = useState(true);
    const [locationReady, setLocationReady] = useState(false);
    const [userLocation, setUserLocation] = useState();
    const [business, setBusiness] = useState();
    const [businessLocation, setBusinessLocation] = useState();
    const [comments, setComments] = useState([]);
    const [news, setNews] = useState([]);
    const [newsVisible, setNewsVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState();
    const [drawRoute, setDrawRoute] = useState(false);
    const [imgs, setImgs] = useState();
    const [seeBar, setSeeBar] = useState(true);
    const [mapHeight, setMapHeight] = useState(Dimensions.get('window').height - 230);
    const [textHeader, setTextHeader] = useState(getI18n().t('permita_ubicacion'));
    const [commentsPos, setCommentsPos] = useState();
    const [isFav, setIsFav] = useState(0);
    const [userLogged, setuserLogged] = useState(props.store.mainStore.isLogged);
    const myScroll = useRef(null);
    const commentSection = useRef(null);
    const id = props.navigation.getParam('busId');
      
    useEffect(() => {
        // locateUser();
        getBusinessFromApi(id);
        getCommentsFromApi(id);
        getNewsFromApi(id);
    }, []);

    useEffect(() => {
        if(business){
          
          let bl = {
            latitude: parseFloat(business.latitude),
            longitude: parseFloat(business.longitude)
          }

          getLocationHandler(bl);  
          setLocationReady(true);
                
          setIsFetching(false);
        }
        
    }, [business]);
        

    // const title = props.navigation.getParam('busTitle');
    

    const locateUser = async () => {
        if(!userLocation){
            setUserLocation(await getUserLocation());
        }
    }

    const addNewComment = (txt) =>{
      setComments([txt, ...comments]);
      
    }

    const goToMap = () => {
      myScroll.current.scrollToEnd();
    }

    const switchNewsVisible = () => {
      setNewsVisible(!newsVisible);
    }

    const goToComment = () => {
      commentSection.current.measure((width, height, px, py, fx, fy) => {
          const location = {
              fx: fx,
              fy: fy,
              px: px,
              py: py,
              width: width,
              height: height
          }

          myScroll.current.scrollTo({x: 0, y: location.fy - 80, animated: true});
      });
    }

    const getBusinessFromApi = async(id) => {
        let hdrs = {
            authorizationapp: URL.AUTH_APP,
            'language-user': props.store.mainStore.deviceLang
        };

        if(userLogged) hdrs.authorization = props.store.mainStore.token;

        try {
            let response = await fetch(URL.BASE + 'api/negocio/' + id, 
                {
                    method: 'GET',
                    headers: hdrs
                }
            );
            let responseJson = await response.json();

            let busi = responseJson.info;

            if((!busi.latitude && !busi.longitude) || 
            (parseFloat(busi.latitude) == 0.0 && parseFloat(busi.longitude) == 0.0) ){
              let adr = busi.address + ' ' + busi.locality + ' ' + busi.comunidad + busi.country;
              const coors = await getBusinessLocation(adr);
              busi.latitude = coors.latitude;
              busi.longitude = coors.longitude;
            }

            setBusiness(busi);
            setIsFav(busi.fav);

            let bl = {
              latitude: parseFloat(busi.latitude),
              longitude: parseFloat(busi.longitude)
            }

            setBusinessLocation(bl);      

            const imags = busi.images.map(elem => {
              let image = URL.BASE + 'uploads/' + elem.image;
              let img = {img: image};
              return img;
            });

            setImgs(imags);

        } catch (error) {
            console.error(error);
        } 
    }

    const getCommentsFromApi = async(id) => {
      try {
        let response = await fetch(URL.BASE + 'api/comentarios/' + id, 
              {
                  method: 'GET',
                  headers: {
                      authorizationapp: URL.AUTH_APP,
                      'language-user': props.store.mainStore.deviceLang
                  }
              }
          );
          let responseJson = await response.json();

          setComments(responseJson.data);

      } catch (error) {
            console.error(error);
        }
    }

    const getNewsFromApi = async(id) => {
      try {
        let response = await fetch(URL.BASE + 'api/shoppost/product/' + id, 
              {
                  method: 'GET',
                  headers: {
                      authorizationapp: URL.AUTH_APP,
                      'language-user': props.store.mainStore.deviceLang
                  }
              }
          );
          let responseJson = await response.json();


          setNews(responseJson.data);

      } catch (error) {
            console.error(error);
        }
    }

    const enablePermission = async () => {
      setIsFetching(true);
      setHasPermission(await verifyPermissions());
      if(!hasPermission){
 
        const ul = await getUserLocationPromise();

        if(ul){
          setUserLocation(ul);

          const mks = await [
              {
                  coordinates: {
                    latitude: parseFloat(ul.latitude),
                    longitude: parseFloat(ul.longitude)
                  },
                  title: getI18n().t('estas_aqui'),
                  color: 'green',
                  id: 1
              },
              {
                  coordinates: {
                    latitude: parseFloat(businessLocation.latitude),
                    longitude: parseFloat(businessLocation.longitude)
                  },
                  title: business.name,
                  color: 'red',
                  id: 2
              }
          ];

          setMarkers(await mks);

          setTextHeader(getI18n().t('acepte_dirigirse'));

          setIsFetching(false);
        }

      }
      
    }



    const getLocationHandler = async(bl) =>{
  
        if(!locationReady){
            if(!hasPermission){

              const coords = {
                latitude: parseFloat(bl.latitude),
                longitude: parseFloat(bl.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.005,                
              };

              const mks = [
                {
                  coordinates: coords,
                  title: business.name,
                  color: 'red',
                  id: 1
                },
                
              ]

              setMarkers(await mks);

              setUserLocation(coords);
  
            } else {
              setUserLocation(await getUserLocation());

            }

            setLocationReady(true);
            
            setIsFetching(false);

        }
    }

    const goToDestination = () => {

      setDrawRoute(true);
      setTextHeader(getI18n().t('mostrando_ruta'));
      setMapHeight(Dimensions.get('window').height - 150);
      setSeeBar(false);

      let destination = {
        latitude: businessLocation.latitude,
        longitude: businessLocation.longitude,
        sourceLatitude: userLocation.latitude,
        sourceLongitude: userLocation.longitude,
        // title: business.name
      };

      console.log('DESTINATION -> ' + JSON.stringify(destination));

      showLocation(destination); 

    }

    const drawMap = (directions, mkrs) => {

      return(
        <MapView 
            style={{width: Dimensions.get('window').width - 80, height: mapHeight}} 
            initialRegion={userLocation}>
            {mkrs.map(marker => (
                <Marker
                    coordinate={marker.coordinates}
                    title={marker.title}
                    pinColor={marker.color}
                    key={marker.id}
                >

                </Marker>
            ))}

            {directions ?
                <MapViewDirections
                    origin={userLocation}
                    destination={businessLocation}
                    apikey={KEY.googleKey}
                    strokeWidth={3}
                    strokeColor="grey"    
                /> : null
            }
            
        </MapView>     
      );
    }

    const showNews = (news) => {
      if(news.length > 0){
        return(<View style={styles.content}>
                <View style={styles.secButton}>
                    <Text style={{...styles.titleSection2, color: COLORS.directoryColor}}>
                      {getI18n().t('Noticias')}
                    </Text>
                    <TouchableOpacity onPress={() =>{
                        switchNewsVisible()
                    }}>
                        <MaterialCommunityIcons
                            name={newsVisible ? 'menu-up' : 'menu-down'}
                            size={40} 
                            color={COLORS.directoryColor}
                        />
                    </TouchableOpacity>
                </View>

                {
                  !newsVisible ? null : <View style={styles.separator} >                
                                          <ScrollView style={styles.borde} nestedScrollEnabled={true}>
                                          {
                                            news.map((item, idx) => {
                                              console.log("title en pantalla negocio: " + JSON.stringify(item));
                                              return(
                                                <BusinessNewsItem key={idx} post={item} navigation={props.navigation} color={COLORS.directoryColor} />
                                              );
                                            })
                                          }
                                          </ScrollView>
                                        </View>
                }
                
                
              </View>
              );

      } else {
        return null;
      }
    }

    const showComments = (comments) => {
      if(comments.length > 0){
        return (<View style={styles.content}>    
                  <View style={styles.separator}>
                    <Text style={{...styles.titleSection, color: COLORS.directoryColor}}>{getI18n().t('Comentarios')}</Text>
                    {
                      comments.map((item, idx) => {
                        return(
                          <CommentItem key={idx} comment={item} color={COLORS.directoryColor} />
                        );
                      })
                    }
                  </View>
              </View>);
      } else {
        return null;
      }
    }

    const printDescriptionByLanguage = () =>{
      let loc = Localization.locale.substring(0, 2);
      let desc;

      switch (loc) {
        case 'es':
          desc = business.description.trim();
          break;
        case 'fr':
          desc = business.descriptionfr.trim();
          break;
        case 'en':
          desc = business.descriptionen.trim();
          break;
        case 'pt':
          desc = business.descriptionit.trim();
          break;
        case 'de':
          desc = business.descriptionde.trim();
          break;
      
        default:
          desc = business.description.trim();
          break;
      }

      if(desc){
        return(
          <View style={styles.description} >
            <Text style={styles.descriptionText}>
            {desc}
            </Text>
          </View>
        );

      } else{
        return null;
      }
      

    }

    const drawBar = () =>{
        if(seeBar){
            if(hasPermission){
                return(<BottomButtons action={goToDestination} colorLine={COLORS.directoryColor} colorButton={COLORS.newsColor} icon="send" />);
            } else {
                return(<BottomButtons action={enablePermission} colorLine={COLORS.directoryColor} colorButton={COLORS.newsColor} icon="check-circle" />);
            }
        } else {
            return null;
        }

    }

/*
    if(!business){
      getBusinessFromApi(id);
      getCommentsFromApi(id);
      getNewsFromApi(id);
    } else {
      let bl = {
        latitude: parseFloat(business.latitude),
        longitude: parseFloat(business.longitude)
      }

      // getLocationHandler(bl);  
      setLocationReady(true);
            
      setIsFetching(false);
    }
*/

    if(!locationReady){
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.directoryColor} />
        </View>
      );
    } else {

      return (
          <ScrollView style={{backgroundColor: '#ecedec'}} 
                ref={myScroll}
           >
              <ImageHeader title={business.name} 
                          navigation={props.navigation}
                          img={URL.BASE + 'uploads/' + business.image}
                          score={parseFloat(business.ranking)}
                          city={business.locality}
                          votes={5}
                          country={business.country}
                          region={business.comunidad}
                          phone={business.phone}
                          phone2={business.phone2}
                          email={business.email}
                          province={business.state}
                          idBus={id}
                          isFav={isFav}
              >
              </ImageHeader>
              <View style={styles.content}>
                <View style={styles.separator}>
                  
                  <BusinessActions url={business.web} 
                            name={business.name} 
                            go={goToMap}
                            comment={goToComment}
                            address={business.address}
                            phone={business.phone}
                  />
                </View>
              </View>

              
                
              { printDescriptionByLanguage() }
                


              <View style={styles.content}>
                  <View style={styles.separator}>
                      <ImageCarousel images={imgs}></ImageCarousel>
                  </View>
              </View>

              <Schedule timetable={business.timetable} />

              {
                showNews(news)
              }
              

              {
                showComments(comments)
              }

              
              <View style={styles.content}>    
                  <View style={styles.separator}
                        ref={commentSection}
                        
                  >       
                    <Text style={{...styles.titleSection, color: COLORS.directoryColor}}>{getI18n().t('tu_opinion')}</Text>     
                    <YourOpinion color={COLORS.directoryColor} 
                                id={id}
                                action={addNewComment}
                                navigation={props.navigation}
                                
                    >
                    </YourOpinion>
                  </View>
              </View>

              <View style={styles.content}>

                  <Text style={{...styles.titleSection, color: COLORS.directoryColor}}>{getI18n().t('Localizacion')}</Text>
                    <Text>{textHeader}</Text>
              </View>

              <View style={{...styles.mapPreview, height: mapHeight}}>
                  { isFetching ? <ActivityIndicator size="large" color={COLORS.directoryColor} /> :  
                    drawMap(drawRoute, markers)    
                  }

                  
              </View>

              { 
                drawBar()
              }

              
          </ScrollView>
      );
  }
}

BusinessScreen.navigationOptions = navigationData => {
  const from2 = navigationData.navigation.getParam('from');
  
  return {
      headerTitle: '',
      headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              if(from2 ){
                if(from2 == 'favorites'){
                    EventRegister.emit('myCustomEvent', 'it works!!!');
                    navigationData.navigation.navigate('Favs');
                } else if(from2 == 'news'){
                    navigationData.navigation.navigate('Latest');
                } else {
                    navigationData.navigation.navigate('NearMe');
                }
                
              } else {
                navigationData.navigation.pop();
              }
              
            }}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.directoryColor} />
          </TouchableOpacity>
          
        ),
        headerRight: () => (
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
  secButton:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 10
    },
    content:{
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginVertical: 0,
    },
    description:{
      paddingVertical: 7,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    descriptionText:{
      fontSize: 19
    },
    separator:{
      flex: 1,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: COLORS.directoryColor
    },
    separator2:{
      flex: 1,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: COLORS.directoryColor,
      marginTop: -25
    },
    titleSection: {
      fontSize:25,
      fontWeight: 'bold'
    },
    titleSection2: {
      fontSize:20,
      fontWeight: 'bold'
    },
    mapPreview: {
      width: '100%',
      borderColor: '#ccc',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 2

  },
  centered: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'black'
  },
  borde: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 250,
  }
});


export default inject('store')(observer(BusinessScreen));