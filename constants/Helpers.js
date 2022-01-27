import React from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

import Geocoder from 'react-native-geocoding';
//import Geolocation from 'react-native-geolocation-service';
import KEY from './Key';
import {getI18n} from '../i18n';

Geocoder.init(KEY.googleKey); 

export  const verifyPermissions = async () => {
    
    const result = await Location.requestForegroundPermissionsAsync();
    
    if(result.status != 'granted'){
        return false;
    }

    return true;
}

export const getFormatedDate = () => {
    const now = new Date();
    const yy = now.getFullYear();
    let mm = now.getMonth();
    if(mm < 10) mm = '0' + mm;
    let dd = now.getDate();
    if(dd < 10) dd = '0' + dd;
    let hh = now.getHours();
    if(hh < 10) hh = '0' + hh;
    let min = now.getMinutes();
    if(min < 10) min = '0' + min;

    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00';
}

export const getUserLocation = async () => {
    let userLocation;

     try{
/*       console.log('TRYING...');
       const location = await Location.getCurrentPositionAsync({timeout: 15000});

       console.log('SUCCESS....', location);
       
       userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
        };
  
RIBEIRA ************/
        userLocation = {
            latitude: 42.5612131,
            longitude: -8.9914677,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
        };

/* SUIZA  
        const userLocation = {
            latitude: 46.9845569,
            longitude: 6.9024444,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
        };
*/ 

       

    } catch(err) {

      console.log('ERROR: ', err);

      if(verifyPermissions()){
              Alert.alert(getI18n().t('no_se_pudo'), 
                  getI18n().t('intentelo'),
                  [{ text: 'OK' }]            
              );
      }

    }

    return userLocation;
}

export const getUserRegion = async(lat, lon) => {
    //Geocoder.init(KEY.googleKey); 

    return Geocoder.from(lat, lon)
        .then(json => {
            let addressComponent = json.results[0].address_components;
            let ccaa = addressComponent.find(elem => elem.types[0] == 'administrative_area_level_2');
            console.log('******* ', ccaa.long_name);
            return ccaa.long_name; 
                   
        })
        .catch(error => console.warn(error));

}

export const getUserLocationPromise = () => {
    return new Promise((resolve, reject) => {
        let location = getUserLocation();
        if (location){
            resolve(location);
        } else {
            reject(Error('Error message'));
        }
            
    });
}

export const getBusinessLocation = async (businessAddress) => {

    

    return Geocoder.from(businessAddress)
        .then(json => {
            var location = json.results[0].geometry.location;   
            const result = {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lng)
            };
            return result;                
        })
        .catch(error => console.warn(error));
    
}

export const showIcon = (idCategory) => {
    
    let iconName;
    switch (idCategory) {
      case '1':
        iconName = 'scale-balance';
        break;
      case '2':
        iconName = 'animation-play';
        break;
      case '15':
        iconName = 'baguette';
        break;
      case '12':
        iconName = 'bed-empty';
        break;
      case '14':
        iconName = 'hanger';
        break;
      case '13':
        iconName = 'home-city';
        break;
      case '17':
        iconName = 'silverware-fork-knife';
        break;
      case '4':
        iconName = 'coffee';
        break;
      case '5':
        iconName = 'bone';
        break;
      case '6':
        iconName = 'sofa';
        break;
      case '7':
        iconName = 'glass-cocktail';
        break;
      case '8':
        iconName = 'shovel';
        break;
      case '9':
        iconName = 'theater';
        break;
      case '10':
        iconName = 'school';
        break;
      case '11':
        iconName = 'coffin';
        break;
      case '18':
        iconName = 'dog-side';
        break;
      case '19':
        iconName = 'file';
        break;
      case '20':
        iconName = 'dumbbell';
        break;
      case '21':
        iconName = 'school';
        break;
      case '22':
        iconName = 'beer';
        break;
      case '24':
        iconName = 'hospital-box';
        break;
      case '25':
        iconName = 'tooth-outline';
        break;
      case '26':
        iconName = 'store';
        break;
      case '27':
        iconName = 'wrench';
        break;
      case '28':
        iconName = 'train';
        break;
      case '30':
        iconName = 'content-cut';
        break;
      case '31':
        iconName = 'car-side';
        break;
      case '32':
        iconName = 'brush';
        break;
      case '33':
        iconName = 'doctor';
        break;
      case '34':
        iconName = 'bank';
        break;
      case '35':
        iconName = 'hospital-box';
        break;
      case '36':
        iconName = 'briefcase';
        break;
      case '37':
        iconName = 'finance';
        break;
      case '38':
        iconName = 'hanger';
        break;
      case '39':
        iconName = 'airplane';
        break;
      case '40':
        iconName = 'shovel';
        break;
      case '41':
        iconName = 'home-city';
        break;
      case '42':
        iconName = 'hamburger';
        break;
      case '43':
        iconName = 'account-group';
        break;
      case '44':
        iconName = 'soccer';
        break;
      case '45':
        iconName = 'theater';
        break;
      case '46':
        iconName = 'briefcase';
        break;
      case '47':
        iconName = 'foot-print';
        break;
      default:
        iconName = 'adjust'
        break;
    }

    return iconName;

  }