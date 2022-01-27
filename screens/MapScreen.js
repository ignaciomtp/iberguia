import React, { Component, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, 
         Text, 
         StyleSheet, 
         ActivityIndicator, 
         Dimensions,
         TouchableOpacity } from 'react-native';
import COLORS from '../constants/Colors';
import KEY from '../constants/Key';
import LogoHeader from '../components/LogoHeader';
import MapViewDirections from 'react-native-maps-directions';
import { verifyPermissions, 
        getUserLocation, 
        getBusinessLocation } from '../constants/Helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getI18n} from '../i18n';
import { inject, observer } from 'mobx-react';

const MapScreen = props => {
    const [userLocation, setUserLocation] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const [markers, setMarkers] = useState([]);

    let color = props.store.mainStore.activeColor;
    
    useEffect(() =>{
        if(userLocation){
            let marker = {
                coordinates: {
                    longitude: userLocation.longitude,
                    latitude: userLocation.latitude,
                },
                title: getI18n().t('estas_aqui'),
                color: 'green',
                id: 1
            };
            setMarkers([marker]);
            setIsFetching(false);
        }
    }, [userLocation]);

    const getLocation = async() => {
        const hasPerm = await verifyPermissions();
        if(hasPerm){
            setUserLocation(await getUserLocation());
        } else {
            setUserLocation('');
        }
    }

    if(!userLocation){
        getLocation();
    }

    return(
        <View style={styles.body}>
            {
                isFetching ? <View style={styles.centered}><ActivityIndicator size="large" color={color} /></View> :
                <View style={styles.mapPreview}>
                    <MapView 
                        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} 
                        initialRegion={userLocation}>
                        {markers.map(marker => (
                            <Marker
                                coordinate={marker.coordinates}
                                title={marker.title}
                                pinColor={marker.color}
                                key={marker.id}
                            >

                            </Marker>
                        ))}

                        
                    </MapView>              
                
                </View>
            }
        </View>

    );

};

MapScreen.navigationOptions = (navigationData) => {

    return {
        title: getI18n().t('Mapa'),
        headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigationData.navigation.pop();
              }}>
              <MaterialCommunityIcons name="arrow-left" size={30} color='#000' />
            </TouchableOpacity>
            
          ),
          headerRight: () => (
              <LogoHeader />
          )

    };
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%',
        alignItems: 'center'
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default inject('store')(observer(MapScreen));