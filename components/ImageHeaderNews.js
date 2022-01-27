import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, Image, Modal, TextInput } from 'react-native';
import ButtonStart from './ButtonStart';
import { Icon } from 'react-native-elements';
import {Dimensions } from "react-native";
import COLORS from '../constants/Colors';
import StarRating from 'react-native-star-rating';
import { inject, observer } from 'mobx-react';
import URL from '../constants/Url';

const ImageHeaderNews = props =>{
  const [isLogged, setIsLogged] = useState(props.store.mainStore.isLogged);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState();
  const [password, setPassword] = useState();

  const image = props.img;
  let imgRoute;
  const screenWidth = Math.round(Dimensions.get('window').width);

  if(!image){
    imgRoute = require('../assets/images/logo.png');
  } else {
    imgRoute = {
      uri: image
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
         

     
   </View>

    </View>

        <View style={{marginTop:25, marginLeft:15}}>
                <Text style={styles.text_title}>{props.title} </Text>
        </View>

        <View>
            <Text style={styles.text}>
                {props.date}
            </Text>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({

    content:{
      flex:1,
      backgroundColor: '#f2f2f3'
    },

    center:{
        flex:3,
        backgroundColor:'pink',
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

    text: {
        fontSize: 18,
        color: '#000',
        paddingLeft: 15
    },

    form: {

        margin: 20,
        justifyContent: 'center',
        textAlign: 'center',

    },

    formItem: {
        marginVertical: 20
    },

    loginTitle: {
        textAlign: 'center',

        fontSize: 20
    },
    
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row'
    }
});

export default inject('store')(observer(ImageHeaderNews));