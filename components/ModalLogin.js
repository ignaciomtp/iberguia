import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ButtonStart from './ButtonStart';
import {Dimensions } from "react-native";
import COLORS from '../constants/Colors';
import { inject, observer } from 'mobx-react';
import URL from '../constants/Url';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';

const ModalLogin = props => {
    const [isLogged, setIsLogged] = useState(props.store.mainStore.isLogged);
    const [user, setUser] = useState();
    const [password, setPassword] = useState();
    const [mailOk, setMailOk] = useState(true);
    const [passOk, setPassOk] = useState(true);

    const validate = () => {
        let result = true;
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ml = reg.test(user);
        if(!ml){
            setMailOk(false);
            result = false;
        }

        if(!password || password.length == 0){
            setPassOk(false);
            result = false;
        }

        return result;
    }

    const persistItem = async(item, selectedValue) => {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    const startSession = async() => {
        const a = validate();

        if(a){
            const bd = {
            email: user,
            password: password
            };
            
            try {
            let response = await fetch(URL.BASE + 'api/login', 
                {
                    method: 'POST',
                    body: JSON.stringify(bd),
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                    },
                    
                }
            );
            let responseJson = await response.json();
            if(responseJson.state == 1){
                props.store.mainStore.setIsLogged(true);
                props.store.mainStore.setToken(responseJson.info.token);
                props.store.mainStore.setUser(responseJson.info.user);

                persistItem('user', JSON.stringify(responseJson.info.user));
                persistItem('token', responseJson.info.token);

                props.action();
            } else {
                alert(responseJson.error);
            }

            } catch (error) {
                console.error('*************', error);
            }             
        }
    }

    return(
        <View style={styles.modal}>
        
            <Text style={styles.loginTitle}>{getI18n().t('necesitas_sesion_comentar')}</Text>
            
            <View style={styles.form}>
                
                <View style={styles.formBackTop}>
                    <View style={{flexDirection: 'row', marginVertical: 15}}>
                        <MaterialCommunityIcons name="email" size={25} color={COLORS.newsColor} />
                        <TextInput style={mailOk ? styles.formItem : styles.formItemError}
                                onChangeText={(text) => setUser(text)}
                                autoCapitalize = 'none'
                                keyboardType='email-address'
                                placeholder={mailOk ? "Email" : getI18n().t('introduzca_email_valido')}
                                placeholderTextColor={mailOk ? 'grey' : 'red'}
                                onSubmitEditing={() => { this.passInput.focus(); }}
                                blurOnSubmit={false}
                        >
                        </TextInput>
                    </View>
                </View>

                <View style={styles.formBackBottom}>
                    <View style={{flexDirection: 'row', marginVertical: 15}}>
                        <MaterialCommunityIcons name="lock" size={25} color={COLORS.newsColor} />
                        <TextInput style={passOk ? styles.formItem : styles.formItemError}
                                onChangeText={(text) => setPassword(text)}
                                autoCapitalize = 'none'
                                secureTextEntry={true}
                                placeholder={passOk ? getI18n().t('Contraseña') : getI18n().t('Introduzca_una_contraseña_valida')}
                                placeholderTextColor={passOk ? 'grey' : 'red'}
                                ref={(input) => { this.passInput = input; }}
                        >
                        </TextInput>
                    </View>
                </View>

            </View>

            <View style={styles.tabBarInfoContainer}>
                
                    <View style={{flex: 1, alignItems: 'center'}}>
                            <ButtonStart 
                                title={getI18n().t('Olvido_contra')}
                                color="#fff"
                                textColor="#474343"
                                action={() =>{
                                    setModalVisible(false);
                                    props.navigation.navigate({routeName: 'Forgot'});
                                }}
                            />  
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                            <ButtonStart 
                                title={getI18n().t('Iniciar_Sesion')}
                                color={COLORS.newsColor}
                                textColor="#fff"
                                action={() => {
                                startSession()
                                }}
                            />  
                    </View>

            </View>

            <ButtonStart 
                    title={getI18n().t('Cancelar')}
                    color="red"
                    textColor="#fff"
                    action={() =>{
                        props.close()
                    }}
                />   
        
        </View>
    );

};

const styles = StyleSheet.create({
    form: {

        margin: 20,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'

    },
    formBackTop: {
        paddingHorizontal: 7,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '90%',
        marginBottom: 1,
        height: 50
    },
    formBackBottom: {
        paddingHorizontal: 7,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: '90%',
        marginTop: 1,
        height: 50
    },
    formItem: {
        fontSize: 16,
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 35,
        marginTop: 0,
        marginBottom: 10
    },
    formItemError: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 35,
        marginTop: 0,
        marginBottom: 10
    },

    loginTitle: {
        textAlign: 'center',

        fontSize: 20
    },
    
    tabBarInfoContainer: {
        flex: 2,
        flexDirection:'row'
    },
    modal: {
      backgroundColor: '#ecedec',
      paddingTop: 50, 
      height: '100%'
    }
});

export default inject('store')(observer(ModalLogin));