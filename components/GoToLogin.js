import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/Colors';
import {getI18n} from '../i18n';

const GoToLogin = props => {
    return(
        <View style={styles.content}>
            <Text style={styles.txt}>
            {getI18n().t('necesitas_sesion_usar')}
            </Text>

            <TouchableOpacity style={{...styles.button1, ...{backgroundColor: COLORS.directoryColor}}}
                onPress={() => {
                    props.navigation.navigate('Login');
                }}
                color='#fff'>

                <Text style={{color: '#fff', 
                            textAlign: 'center',
                            fontWeight:'bold',
                            }}> {getI18n().t('ir_iniciar_sesion')} </Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt: {
        width: '80%',
        marginVertical: 20,
        fontSize: 20,
        textAlign: 'center'
    },
    button1: {
        height: 40,
        width: 200,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default GoToLogin;