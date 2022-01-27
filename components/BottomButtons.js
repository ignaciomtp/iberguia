
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import COLORS from '../constants/Colors';
import { verifyPermissions, 
        getUserLocation, 
        getBusinessLocation } from '../constants/Helpers'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomButtons = props => {

        return(
            <View style={{...styles.container, borderTopColor: props.colorLine}}>


                <TouchableOpacity style={styles.button}
                                onPress={props.action}
                >
                    <MaterialCommunityIcons name={props.icon} size={40} color={props.colorButton} />
                </TouchableOpacity>            
            </View>
        );        


};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        padding: 7,
        backgroundColor: '#fff',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        borderTopWidth: 1,
        marginVertical: 0,
        alignItems: 'center'
    },
    button: {
        width: 40,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default BottomButtons;
