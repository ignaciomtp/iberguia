
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

const ButtonStart2 = props => {
    return (
        <View style={{flex:1,width:'100%'}}>
            <TouchableOpacity style={{...styles.button1, ...{backgroundColor: props.color}}}
                onPress={props.action}
                color={props.color}>

                <Text style={{color: props.textColor, 
                            textAlign: 'center',
                            fontWeight:'bold',
                            }}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ButtonStart2;