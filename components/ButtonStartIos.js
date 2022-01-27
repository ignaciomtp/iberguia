
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonStartIos = props => {
    return (
        <View style={{flex:1,width:'100%'}}>
            <TouchableOpacity style={{...styles.button1, ...{backgroundColor: props.color}}}
                onPress={props.action}
                color={props.color}>

                <Text style={{color: props.textColor, 
                            textAlign: 'center',
                            fontWeight:'bold',
                            }}>{props.title}
                </Text>
                {
                    props.desplegable ? <MaterialCommunityIcons name="menu-down" size={20} color="#FFF" /> : null
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ButtonStartIos;