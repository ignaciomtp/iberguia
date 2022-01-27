import React, { Component } from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Button, 
    Share,
    Linking } from 'react-native';
import ButtonStart from './ButtonStart';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';
import { withNavigation } from 'react-navigation';
import {getI18n} from '../i18n';

const ContactBusiness = (props) => {

    return(
       <View style={styles.container}>
            <View style={{width: '40%'}}>
                <TouchableOpacity style={{...styles.button1, ...{backgroundColor: props.color}}}
                    onPress={() =>{
                        Linking.openURL(`tel:${props.phone}`)
                    }}
                    color={COLORS.directoryColor}>

                    <View style={{alignItems: 'center'}}>
                        <MaterialCommunityIcons name={'phone'} size={25} color={COLORS.directoryColor} />
                    </View>

                    <Text style={{color: COLORS.directoryColor, 
                                textAlign: 'center',
                                fontWeight:'bold',
                                }}>{props.phone}</Text>
                </TouchableOpacity>


            </View>

            <View style={{width: '60%'}}>
                

                <TouchableOpacity style={{...styles.button1, ...{backgroundColor: props.color}}}
                    onPress={() =>{
                        Linking.openURL('mailto:support@example.com')
                        
                    }}
                    color={COLORS.directoryColor}>

                    <View style={{alignItems: 'center'}}>
                        <MaterialCommunityIcons name={'email'} size={25} color={COLORS.directoryColor} />
                    </View>

                    <Text style={{color: COLORS.directoryColor, 
                                textAlign: 'center',
                                fontWeight:'bold',
                                }}>{props.email}</Text>
                </TouchableOpacity>

            </View>

       </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cell: {
        width: '50%'
    },
    button1: {
        borderColor: COLORS.directoryColor,
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginHorizontal: 5
    }
});

export default ContactBusiness;