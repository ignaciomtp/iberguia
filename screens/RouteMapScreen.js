import React, { Component, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import COLORS from '../constants/Colors';
import KEY from '../constants/Key';
import MapViewDirections from 'react-native-maps-directions';

const RouteMapScreen = props => {

    const businessLocation = props.navigation.getParam('businessPos');

    const userLocation = props.navigation.getParam('userPos');
/*
    let businessLocation;

    let markers = [];


    if(bl && userLocation){
        businessLocation = {
                latitude: bl.lat,
                longitude: bl.lng
        };

        markers = [
            {
                coordinates: userLocation,
                title: 'Estás aquí',
                color: 'green',
                id: 1
            },
            {
                coordinates: businessLocation,
                title: props.navigation.getParam('businessName'),
                color: 'red',
                id: 2
            }
        ];

        directions = true;
    }
*/

    return(
        
        <View style={styles.body}>

            <View style={styles.mapPreview}>
                <MapView 
                    style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} 
                    initialRegion={userLocation}>



                    <MapViewDirections
                        origin={userLocation}
                        destination={businessLocation}
                        apikey={KEY.googleKey}
                        strokeWidth={3}
                        strokeColor="grey"    
                    /> 
            
                    
                </MapView>              
              
            </View>
        </View>
        
    );

};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%'
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 400,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default RouteMapScreen;