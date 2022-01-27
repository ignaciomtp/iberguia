import React, {Component, useState} from 'react';
import { Platform, 
         View, 
         Text, 
         StyleSheet, 
         TouchableOpacity,
         ActivityIndicator,
         Image,
         TextInput,
         ScrollView,
         Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import ButtonStart from '../components/ButtonStart';
import Key from '../constants/Key';
import COLORS from '../constants/Colors';
import URL from '../constants/Url';
import SimpleHeaderComponent from '../components/SimpleHeaderComponent2';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import {AsyncStorage} from 'react-native';
import * as Facebook from 'expo-facebook';
import axios from 'axios';


const LoginScreen = props => {
    const [isFetching, setIsFetching] = useState(false);
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [mailOk, setMailOk] = useState(true);
    const [passOk, setPassOk] = useState(true);

    const validate = () => {
        let result = true;
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ml = reg.test(email);
        if(!ml){
            setMailOk(false);
            result = false;
        }

        if(!pass || pass.length == 0){
            setPassOk(false);
            result = false;
        }

        return result;
    }

    const facebookLogin = async() => {
        
        try {
            await Facebook.initializeAsync(Key.FacebookAppId);
            const {
                type,
                token, // <- this is your access token
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(Key.FacebookAppId, 
            { permissions: ['public_profile', 'email'], });

            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me/?fields=id,first_name,last_name,email,picture&access_token=${token}`); //<- use the token you got in your request
                const userInfo = await response.json();
                setIsFetching(true);
                try {
                    let response = await fetch(URL.BASE + 'api/access/facebook', 
                        {
                            method: 'GET',
                            headers: {
                                authorizationapp: URL.AUTH_APP,
                                token: token,
                                user: JSON.stringify(userInfo)
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

                        props.navigation.navigate({routeName: 'Splash', params: {
                            welcome: getI18n().t('Hola') + ' ' + responseJson.info.user.first_name
                        }});
                    } else {
                        alert(responseJson.error);
                    }           

                } catch (error) {
                    console.error('*************', error);
                }  

                setIsFetching(false);

            } else {
                // type === 'cancel'
            }

        } catch ({ message }) {
            console.log(`Facebook Login Error: ${message}`);
        }


    }

    const googleLogin = async() => {
        console.log('login gooogle');
        setIsFetching(true);
        const config = {
            androidClientId: Key.OAuthAndroid,
            androidStandaloneAppClientId : Key.OAuthAndroidStandalone,
            iosClientId: Key.OAuthIos
        };

        const { type, accessToken, user } = await Google.logInAsync(config);

        console.log('type: ', type);
        console.log('accessToken: ', accessToken);
        console.log('user: ', JSON.stringify(user));
/*
        if (type === 'success') {
            // Then you can use the Google REST API
            let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log('UserInfoResponse: ', userInfoResponse);
        }   */



        try {
            let response = await fetch(URL.BASE + 'api/access/google', 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        token: accessToken,
                        user: JSON.stringify(user)
                    },
                    
                }
            );

              //let responseJson = await response.json();
            let responseJson = await response.json();

            if(responseJson.state == 1){

                if(responseJson.info.user.email){
                    // usuario logueado correctamente

                    props.store.mainStore.setIsLogged(true);
                    props.store.mainStore.setToken(responseJson.info.token);
                    props.store.mainStore.setUser(responseJson.info.user);

                    persistItem('user', JSON.stringify(responseJson.info.user));
                    persistItem('token', responseJson.info.token);

                    props.navigation.navigate({routeName: 'Splash', params: {
                        welcome: getI18n().t('Hola') + ' ' + responseJson.info.user.first_name
                    }});

                } else {
                    // entrar sin login
                    props.navigation.navigate({routeName: 'Splash'});
                }

                
            } else {
                alert(responseJson.error);
            }            

        } catch (error) {
                console.error('*************', error);
        }  

        setIsFetching(false);

    }

    const persistItem = async(item, selectedValue) => {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    const startSession = async() =>{
        const a = validate();
        
        if(a){
            
            const bd = {
              email: email,
              password: pass
            }   

            let url = URL.BASE + 'api/login';

            axios.post(url, bd, {
                headers: {
                        authorizationapp: URL.AUTH_APP,
                    }
            }).then(function(response){
                
                let responseJson = response.data;

                if(responseJson.state == 1){
                    props.store.mainStore.setIsLogged(true);
                    props.store.mainStore.setToken(responseJson.info.token);
                    props.store.mainStore.setUser(responseJson.info.user);

                    persistItem('user', JSON.stringify(responseJson.info.user));
                    persistItem('token', responseJson.info.token);

                    props.navigation.navigate({routeName: 'Splash', params: {
                        welcome: getI18n().t('Hola') + ' ' + responseJson.info.user.first_name
                    }});
                } else {
                    alert(responseJson.error);
                }

            }).catch(function(error){
                console.log(error);
            });


        } // **
  
    }

    return (
        <View style={styles.container}>
        { isFetching ? <ActivityIndicator size="large" color={COLORS.newsColor} /> : 
            <ScrollView>
                <View style={{flex:2 }}>
                    <SimpleHeaderComponent textCenter={getI18n().t('INICIAR_SESION')} ></SimpleHeaderComponent>
                    <View style={styles.social}>
                        <View style={styles.socialBtn}>
                            <TouchableOpacity onPress={() => {
                                facebookLogin()
                            }}>
                                <Image
                                    source={require('../assets/images/facebook.png')}
                                    style={{height: 40, width: 40}}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>



                        <View style={styles.socialBtn}>
                            <TouchableOpacity onPress={() => {
                                googleLogin()
                            }}>
                                <Image
                                    source={require('../assets/images/google2.png')}
                                    style={{height: 40, width: 40}}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </View>

                <View style={{flex:2, alignItems: 'center'}}>
                    <View style={{textAlign: 'left', alignItems: 'flex-start'}}>
                        <Text style={{color: 'grey', fontSize: 17}}>{ getI18n().t('inicie_sesion_correo') }</Text>
                    </View>
                    <View style={styles.formBackTop}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 8}}>
                                <MaterialCommunityIcons name="email" size={20} color={COLORS.newsColor} />
                            </View>
                            
                            <TextInput style={mailOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setEmail(text)}
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
                        <View style={{flexDirection: 'row', marginVertical: 7}}>
                            <View style={{paddingTop: 8}}>
                                <MaterialCommunityIcons name="lock" size={20} color={COLORS.newsColor} />
                            </View>
                            
                            <TextInput style={passOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setPass(text)}
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

                <View style={styles.buttons}>
                    <View style={styles.tabBarInfoContainer}>
                        <View style={{flex: 1, alignItems: 'center', paddingTop: 15}}>
                            <ButtonStart 
                                title={getI18n().t('Olvido_contra')}
                                color="#fff"
                                textColor="#474343"
                                action={() =>{
                                    props.navigation.navigate({routeName: 'Forgot'})
                                }}
                            />  
                        </View>
                
                        <View style={{flex: 1, alignItems: 'center', paddingTop: 15}}>
                            <ButtonStart 
                                title={getI18n().t('Iniciar_Sesion')}
                                color={COLORS.newsColor}
                                textColor="#fff"
                                action={() => {startSession()}}
                            />  
                        </View>
            
                    </View>

                    <View style={{flex:1}}>
                        <ButtonStart 
                                title={getI18n().t('Entrar_sin')}
                                color={COLORS.directoryColor}
                                textColor="#fff"
                                action={() =>{
                                props.navigation.navigate({routeName: 'Splash'})
                                }}
                            />             
                    </View>
                </View>
        

            </ScrollView>
        }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#ecedec',
        padding:15,
    },
    formBack: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        height: 50
    },
    formBackTop: {
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '90%',
        marginBottom: 1,
        height: 50
    },
    formBackBottom: {
        paddingHorizontal: 10,
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
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row', 
        
    },
    social: {
        flexDirection: 'row', 
        textAlign: 'left', 
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 1
    },
    buttons: {
        marginTop: 0,
        marginBottom: 0,
        height: 165
    },
    socialBtn: {
        marginHorizontal: 15,
        height: 40,
        width: 40
    }
});

export default inject('store')(observer(LoginScreen));