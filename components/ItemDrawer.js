import React, {Component} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';

const ItemDrawer = (props) => {
  const logout = () => {
    props.store.mainStore.setIsLogged(false);
    props.store.mainStore.setUser('');
    props.store.mainStore.setToken('');

    deleteItem('user');
    deleteItem('token');

    props.nav.closeDrawer();
   
  }

  const deleteItem = async(item) => {
      try {
          await AsyncStorage.removeItem(item);
      } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
      }
  }

  if(props.profile && !props.store.mainStore.isLogged){
      return null;
  } else {
    return ( 
        <TouchableOpacity style={{...styles.btn, 
                                  backgroundColor: props.colorBtn || 'transparent',
                                  textAlign: props.align || 'left'
                                }} 
        onPress={()=>{
          if(props.path){
            props.nav.navigate(props.path);
          } else {
            logout();
          }
          
        }} >
          <View style={{flexDirection: 'row', 
              justifyContent: props.align || 'flex-start',
              alignItems: props.align || 'flex-start',
              }}>
              <MaterialCommunityIcons name={props.icon} size={20} color={props.colorIcon || '#6F6E6E'} />
              <Text style={{color: props.color || '#000', 
                  fontWeight: props.weight || 'normal', 
                  textAlign: props.align || 'left',
                  paddingLeft: 10}}>
                {props.label}
              </Text>
          </View>
          
        </TouchableOpacity>  
    );
  }
};

const styles = StyleSheet.create({
    btn: {
      width:'90%', 
      padding:15,
      borderRadius: 10,
      
    },
});

export default inject('store')(observer(ItemDrawer));