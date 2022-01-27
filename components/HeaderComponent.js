import React, { Component } from 'react';
import { Text, 
        View,
        StyleSheet,
        TouchableOpacity,
        Platform,
        Image,
        BackHandler } from 'react-native';
import {getI18n} from '../i18n';

export default class HeaderComponent extends Component{

    
constructor(props) {
    super(props);
  }
  
  render(){

  return (
 
   <View style={styles.content}>
        <View style={styles.top}>
        {
          Platform.OS === 'ios' ? null : <TouchableOpacity
                    onPress={() => {
                        BackHandler.exitApp()

                    }}
                >
                  <Text style={{fontWeight:'bold'}}>{getI18n().t('SALIR')}</Text>
                </TouchableOpacity>
        }
        
        </View>
          <View style={styles.center}> 
              <Image
              style={{resizeMode: 'contain', flex:1,width:'100%'}}
              source={require('../assets/images/iberguialogo.png')}
              />
        </View>
    </View>
  );}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    content:{
      flex:1,
      padding:15,
    },

    top:{
        flex:1,
        alignItems:'flex-end',
    
    },
    center:{
        flex:3,
    },
});
