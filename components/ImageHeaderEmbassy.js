import React, { Component, useState } from 'react';
import { Text, 
         View, 
         StyleSheet, 
         Image, 
         Modal, 
         Linking,
         TextInput,
         TouchableOpacity } from 'react-native';
import ButtonStart from './ButtonStart';
import ModalLogin from './ModalLogin';
import { Icon } from 'react-native-elements';
import {Dimensions } from "react-native";
import COLORS from '../constants/Colors';
import StarRating from 'react-native-star-rating';
import { inject, observer } from 'mobx-react';
import URL from '../constants/Url';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ImageHeaderEmbassy = props =>{
  
  const image = props.country;
  let imgRoute;
  const screenWidth = Math.round(Dimensions.get('window').width);

  const printPhone2 = () => {
    if(props.phone2){
      return(
        <TouchableOpacity 
          onPress={() =>{
                        Linking.openURL(`tel:${props.phone2}`)
                    }} 
          style={{...styles.btn, ...styles.btnPhone, backgroundColor: COLORS.directoryColor}}>
            <MaterialCommunityIcons style={{marginRight: 7}}
                name="phone" 
                size={20} 
                color={'white'}
            />

            <Text style={styles.btnText}>{props.phone2}</Text>
        </TouchableOpacity>
      );
    }
  }


  if(!image){
    imgRoute = require('../assets/images/logo.png');
  } else {
    if(image == 'ES'){
      imgRoute = require('../assets/images/esp.png');
    }else{
      imgRoute = require('../assets/images/portugal.png')
    }

  }

  return (
 
   <View style={styles.content}>
      <View style={styles.center}> 
              <Image
              style={{width: screenWidth, height: screenWidth / 2}}
              source={imgRoute}
              />

        <View style={{flex: 1, flexDirection: 'row', position:'absolute', bottom:-30}}>
         
         <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Icon
              raised
              name='thumbs-up'
              type='font-awesome'
              color={COLORS.embassyColor}
              onPress={() => {
                
              }} />
         </View>
     
   </View>

    </View>

        <View style={{marginTop:25, marginLeft:15}}>
                <Text style={styles.text_title}>{props.title} </Text>
        </View>

        <View style={styles.stars}>
            
        </View>

<View style={{margin:5}}>
        <TouchableOpacity 
          onPress={() =>{
                        Linking.openURL(`mailto:${props.email}`)
                    }} 
          style={{...styles.btn, ...styles.btnMail}}
          >
            <MaterialCommunityIcons style={{marginRight: 7}}
                name="email" 
                size={20} 
                color={'black'}
            />

            <Text >{props.email}</Text>
        </TouchableOpacity>
</View>
        <Text style={{marginLeft: 10}}>{props.country} / {props.region} / {props.province} / {props.city} </Text>

        <View style={styles.contactBar}>
            <TouchableOpacity 
              onPress={() =>{
                            Linking.openURL(`tel:${props.phone}`)
                        }} 
              style={{...styles.btn, ...styles.btnPhone, backgroundColor: COLORS.embassyColor}}>
                <MaterialCommunityIcons style={{marginRight: 7}}
                    name="phone" 
                    size={20} 
                    color={'white'}
                />

                <Text style={styles.btnText}>{props.phone}</Text>
            </TouchableOpacity>

            {
              printPhone2()
            }
            

        </View>
        


    </View>
  );
}

const styles = StyleSheet.create({

    content:{
      flex:1,
      
    },

    center:{
        flex:3,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },
    stars: {
      width: '50%',
      margin: 10,
      flexDirection: 'row'
    },

    text_title:{
        fontSize:30,
        fontWeight:'bold',
    },

    form: {

        margin: 20,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'

    },
    formBackTop: {
        paddingHorizontal: 7,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '90%',
        marginBottom: 1,
        height: 50
    },
    formBackBottom: {
        paddingHorizontal: 7,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: '90%',
        marginTop: 1,
        height: 50
    },
    formItem: {
        fontSize: 16,
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 35,
        marginTop: 0,
        marginBottom: 10
    },
    formItemError: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 35,
        marginTop: 0,
        marginBottom: 10
    },

    loginTitle: {
        textAlign: 'center',

        fontSize: 20
    },
    
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row'
    },
    modal: {
      backgroundColor: '#ecedec',
      marginTop: 50, 
      height: '100%'
    },
    btn: {
        
        paddingHorizontal: 7,
        paddingVertical: 5,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        
    },
    btnPhone:{
        margin: 10,
        maxWidth: 160
    },
    btnMail: {
        maxWidth: 280,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
    },
    btnText: {
        fontWeight: 'bold', 
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contactBar: {
        marginTop: 5,
        marginBottom: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    }
});

export default inject('store')(observer(ImageHeaderEmbassy));