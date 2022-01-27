
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonStartIos2 = props => {
    return (
        <View style={{flex:1,width:'90%', paddingTop:5, paddingLeft: 5}}>
            <TouchableOpacity style={styles.button1}
                onPress={props.action}
                color={props.color}>

                <Text style={{color: props.textColor, 
                            textAlign: 'left',
                            fontWeight:'bold',
                            }}>{props.title}
                </Text>
               <MaterialCommunityIcons name="menu-down" size={20} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});

export default ButtonStartIos2;