import React , { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import MapComponent from '../../components/MapComponent';
import ListHeaderEmb from '../../components/ListHeaderEmb2';
import BottomButtons from '../../components/BottomButtons';
import MapView  from "react-native-maps";
import { showLocation } from 'react-native-map-link'
import { Marker } from 'react-native-maps';
import { 
        getUserLocation, 
        getBusinessLocation } from '../../constants/Helpers'
import COLORS from '../../constants/Colors';
import LogoHeader from '../../components/LogoHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import KEY from '../../constants/Key';
import URL from '../../constants/Url';
import MapViewDirections from 'react-native-maps-directions';
import { getDistance } from 'geolib';
import {getI18n} from '../../i18n';

const EmbassyMapDetails = props => {
    const [isFetching, setIsFetching] = useState(true);
    const [userLocation, setUserLocation] = useState();
    const [allMarkers, setAllMarkers] = useState([]);
    const [directions, setDirections] = useState(false);
    const [seeUser, setSeeUser] = useState(false);
    const [seeBar, setSeeBar] = useState(true);
    const [mapHeight, setMapHeight] = useState(Dimensions.get('window').height - 190);
    const [textHeader, setTextHeader] = useState(getI18n().t('permita_ubicacion')); 


    useEffect(() => {
        locateUser();
    }, []);

    const myScroll = useRef(null);

    let item = props.navigation.getParam('item');


    const setEmbassy = async(embassy) => {
        if(embassy.latitude == 0 && embassy.longitude == 0){
            let adr = embassy.address + ' ' + embassy.locality + ' ' + embassy.state + embassy.country;
            const coors = await getBusinessLocation(adr);

            embassy.latitude = coors.latitude;
            embassy.longitude = coors.longitude;
            embassy.coordinates = coors;
        }

        if(userLocation){
            let embArray = [];
            embArray.push(embassy);
            findMarkers(embArray, userLocation);
        } else {
            if(allMarkers.length == 0){
                setAllMarkers([embassy]);
            }
            
            setIsFetching(false);

        }

    }

    const goToMap = () => {
      myScroll.current.scrollToEnd();
    }

    const findMarkers = (data, ul) => {
        const markers = data.map(elem => {
            let newMark = {}; 
            newMark.id = elem.id;
            newMark.latitude = parseFloat(elem.latitude);
            newMark.longitude = parseFloat(elem.longitude);
            newMark.coordinates = {
                latitude: parseFloat(elem.latitude),
                longitude: parseFloat(elem.longitude),
            }

            // calcular la distancia al usuario 
            let distance = getDistance(ul, newMark.coordinates, 1);

            newMark.distance = parseInt(distance / 1000);   
            newMark.name = elem.name;
            newMark.latitudeDelta = 0.00922;
            newMark.longitudeDelta =  0.00421;
            newMark.color = COLORS.embassyColor;
            return newMark;
        });


        setAllMarkers(markers);

        setIsFetching(false);
    }

    const markUserPosition = async() => {
        setIsFetching(true);
        let ul = {};
        ul.coordinates = userLocation;
        ul.coordinates.latitudeDelta = 0.00922;
        ul.coordinates.longitudeDelta =  0.00421;
        ul.latitude = userLocation.latitude;
        ul.longitude = userLocation.longitude;
        ul.latitudeDelta = 0.00922;
        ul.longitudeDelta =  0.00421;
        ul.name = getI18n().t('estas_aqui');
        ul.color = 'green';
        ul.id = 0;

        setAllMarkers(await [...[ul], ...allMarkers]);
        setTextHeader(getI18n().t('acepte_dirigirse'));
        setSeeUser(true);
        setIsFetching(false);
    }

    const drawRoute = () => {
        setTextHeader(getI18n().t('mostrando_ruta'));
        setDirections(true);
        setMapHeight(600);
        setSeeBar(false);

        let destination = {
            latitude: allMarkers[1].latitude,
            longitude: allMarkers[1].longitude,
            sourceLatitude: userLocation.latitude,
            sourceLongitude: userLocation.longitude,
            title: allMarkers[1].name
        };

        console.log('DESTINATION -> ' + JSON.stringify(destination));

        showLocation(destination);
    }


    const locateUser = async () => {
        if(!userLocation){
            setUserLocation(await getUserLocation());
        }
    }

    const drawMap = (draw, markers) => {
        return(
            <MapView 
                style={{width: Dimensions.get('window').width - 80, height: '100%'}} 
                initialRegion={markers[0]}>
                {markers.map(marker => (
                    <Marker
                        coordinate={marker.coordinates}
                        title={marker.name}
                        pinColor={marker.color}
                        key={marker.id}
                    >

                    </Marker>
                ))}

                {directions ?
                    <MapViewDirections
                        origin={markers[0]}
                        destination={markers[1]}
                        apikey={KEY.googleKey}
                        strokeWidth={3}
                        strokeColor="grey"    
                    /> : null
                }
                
            </MapView>    
        );
    }

    const drawBar = () =>{
        if(seeBar){
            if(seeUser){
                return(<BottomButtons action={drawRoute} colorLine={COLORS.embassyColor} colorButton={COLORS.embassyColor} icon="send" />);
            } else {
                return(<BottomButtons action={markUserPosition} colorLine={COLORS.embassyColor} colorButton={COLORS.embassyColor} icon="check-circle" />);
            }
        } else {
            return null;
        }

    }

    if(!allMarkers.length) {
        if(userLocation){
            setEmbassy(item);
        }
    }
   
    return(
        <View style={styles.body}>
            
            <ScrollView ref={myScroll}>
                <ListHeaderEmb item={item} text={textHeader} go={goToMap} />
                <View style={{...styles.mapPreview, height: mapHeight}}>
                    { isFetching ? <ActivityIndicator size="large" color={COLORS.embassyColor} /> :  
                        drawMap(directions, allMarkers)
                    }
                                
                </View>

                {
                    drawBar()
                }
            </ScrollView>
        </View>
    );
};

EmbassyMapDetails.navigationOptions = navigationData => {
    const title = navigationData.navigation.getParam('title');
    return {
        headerTitle: title,
        headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigationData.navigation.pop();
              }}>
              <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.embassyColor} />
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
    body: {
        backgroundColor: '#fff',
        height: '100%'
    },
    mapPreview: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -15,
        paddingTop: 2
    }
});

export default inject('store')(observer(EmbassyMapDetails));