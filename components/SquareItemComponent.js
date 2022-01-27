import React, { Component } from 'react';
import { Text, 
         View,
         StyleSheet,
         Image
          } from 'react-native';
import { Icon } from 'react-native-elements';

export default class SquareItemComponent extends Component{

    
  constructor(props) {
      super(props);
  }
  

  render(){

  return (

      <View style={styles.content}>
          <Image
            style={{resizeMode: 'cover', flex:4, width:'100%', borderRadius:25}}
            source={{uri: this.props.img}}
          />

          <View style={{flex:1}}>
            <Text style={{textAlign:'center',
                          
                          fontSize: 15
            }}>{this.props.title}</Text>
            
            <View style={{flex:1, flexDirection:'row'}}>
                <Icon style={styles.scoreIcon} size = {15} color={this.props.color} name='star' />
                <Text style={{color: this.props.color, textAlign:'left'}}>{this.props.score}</Text>
                {
                  this.props.distance == undefined ? null : <Text style={{textAlign:'right'}}> - {this.props.distance} Km</Text>
                }
                 
            </View>
          </View>        
      </View>
    
  );}
}

const styles = StyleSheet.create({
    content:{
      flex:1,
      padding:15,
    },

    scoreIcon:{
        flex:1,
    },

});
