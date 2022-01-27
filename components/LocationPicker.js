import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapComponent from './MapComponent';

const LocationPicker = props => {
    const [isFetching, setIsFetching] = useState(true);
    const [pickedLocation, setPickedLocation] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if(result.status !== 'granted'){
            Alert.alert(
                'No tienes permiso',
                'Necesitas activar permiso de localización',
                [{ text: 'OK' }]
            );
            return false;
        }

        return true;
    }

    const getLocationHandler = async() =>{
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return;
        }

        setIsFetching(true);
        try{
            const location = await Location.getCurrentPositionAsync({timeout: 5000});
/*            
            setPickedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.05,
            });
*/
            setPickedLocation({
                latitude: 42.5612131,
                longitude: -8.9914677,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            });

            console.log(pickedLocation);

        } catch(err) {
            Alert.alert('No se pudo obtener la localización', 
                'Inténtelo de nuevo más tarde',
                [{ text: 'OK' }]            
            );
        }

        setIsFetching(false);
    }

    return (
        <View style={styles.locationPicker}>
            <View style={styles.mapPreview}>
                { isFetching ? <ActivityIndicator size="large" color="green" /> :  
                    <MapComponent region={pickedLocation} />
                }
                
            </View>

            <Button title="Obtener localización" 
                    color="green" 
                    onPress={getLocationHandler} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    locationPicker:{
        marginBottom: 15
    },
    mapPreview: {
        marginBottom: 10,
        width: 300,
        height: 300,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LocationPicker;