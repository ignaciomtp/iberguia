import React, { Component } from 'react';
import { Text, View,StyleSheet,Image } from 'react-native';

export default class SimpleHeaderComponent extends Component{

    
constructor(props) {
    super(props);
    this.state = {};
  }
  
  render(){

  return (
 
   <View style={styles.content}>
        <View style={styles.center}> 
              <Image
              style={{resizeMode: 'contain', flex:1, width:'100%'}}
              source={require('../assets/images/logo.png')}
              />
        </View>

        <View>
            <Text style={styles.text_top}>{this.props.textTop}</Text>
            <Text style={styles.text_center}>{this.props.textCenter}</Text>
            <Text style={styles.text_bottom}>{this.props.textBottom}</Text>
        </View>
    </View>
  );}
}

const styles = StyleSheet.create({

    content:{
      flex:1,
      padding:15,
      paddingBottom: 0
    },

    center:{
        height: 150
    },

    text_top:{
        fontSize:20
      },
  
    text_center:{
        fontSize:30,
        fontWeight:"bold"
    },
  
    text_bottom:{
        width:'70%'
    },


});
