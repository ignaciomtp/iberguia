
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonClose = props => {
    return (
        <View style={{flex:1,width:'100%',padding:15}}>
            <TouchableOpacity style={{...styles.button1, ...{backgroundColor: props.color}}}
                onPress={props.action}
                color={props.color}>

                <MaterialCommunityIcons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
        height: 40,
        width: 40,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ButtonClose;