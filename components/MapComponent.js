import React , { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView  from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import {getI18n} from '../i18n';
import COLORS from '../constants/Colors';

export default class MapComponent extends Component{
  constructor(props) {
    super(props);

    const screenWidth = Math.round(Dimensions.get('window').width);
    this.state = {
      width: screenWidth,
      markers: [
        {
          coordinates: {
            latitude: parseFloat(props.region.latitude),
            longitude: parseFloat(props.region.longitude)
          },
          title: props.user ? getI18n().t('estas_aqui') : props.business,
          color: props.user ? 'green' : 'red',
          id: 1,
          idBus: 0
        },
        
      ]
    };

    if(props.hasOwnProperty('businessLocation') && props.businessLocation != undefined){
      this.state.markers.push({
          coordinates: {
            latitude: parseFloat(props.businessLocation.latitude),
            longitude: parseFloat(props.businessLocation.longitude)
          },
          title: props.business,
          color: 'red',
          id: 2,
          idBus: 0
        });

    }

    if(props.hasOwnProperty('markers')){
       if(props.markers.length > 0){
          
          let a = 2;
          props.markers.forEach(elem => {
              let marker = {
                coordinates: {
                    latitude: parseFloat(elem.latitude),
                    longitude: parseFloat(elem.longitude)
                  },
                  title: elem.name,
                  color: 'red',
                  idBus: elem.idBus,
                  id: a
              };

              this.state.markers.push(marker);
              a++;
          });
      }

    }

  }


  onRegionChange(region) {
    this.setState({ region });
  }

  

  render() {
    return (
      <MapView
        style={
            {
                position:'absolute',
                top:0,
                bottom:0,
                left:0,
                right:0,
                height: '100%',
                width: this.state.width
            }
        }

        initialRegion={this.props.region}
      >

            {this.state.markers.map(marker => (
              <Marker
                coordinate={marker.coordinates}
                title={marker.title || getI18n().t('estas_aqui')}
                pinColor={marker.color}
                key={marker.id}
              >

                <Callout
                  onPress={() => {
                    if(marker.idBus != 0){
                        this.props.navigation.navigate({routeName: 'BusPage', params: {
                          busId: marker.idBus,
                          from: 'near'
                      }});  
                    }
                    
                  }}
                >
                  <Text style={{...styles.busName, color: COLORS.directoryColor}}>{marker.title || getI18n().t('estas_aqui')}</Text>
                  {
                    marker.idBus != 0 ?  <Text style={styles.press}>{getI18n().t('pulsa_para_ver')}</Text>
                    : null
                  }
                 
                </Callout>

              </Marker>


            ))}


      </MapView>
    );
  }
}

const styles = StyleSheet.create({

    content:{
      width:300,
      height:300,
      position:'relative'
    },
    busName: {
      fontSize: 18
    },
    press: {
      paddingVertical: 5
    }


});