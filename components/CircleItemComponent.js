import React, { UseState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showIcon } from '../constants/Helpers';

const CircleItemComponent = (props) => {

  return (
 
   <View style={styles.content}>
      <View style={{...styles.circle, backgroundColor: props.color}}>
        <MaterialCommunityIcons name={props.image ? props.image : showIcon(props.id)} size={70} color={props.colorIcon} />
      </View>

      <View style={{flex:1}}>
        <Text style={{textAlign:'center'}}>{props.title}</Text>
        <Text style={{textAlign:'center'}}>({props.num})</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    content:{
      flex:1,
      padding:15,
    },
    circle: {
      flex :4, 
      width: '100%', 
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    }
});

export default CircleItemComponent;