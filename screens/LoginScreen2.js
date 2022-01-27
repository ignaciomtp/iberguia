import React, {Component, useState} from 'react';
import { Platform, 
         View, 
         Text, 
         StyleSheet, 
         TouchableOpacity,
         Image,
         TextInput,
         ScrollView,
         Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import ButtonStart from '../components/ButtonStart';
import COLORS from '../constants/Colors';
import URL from '../constants/Url';
import SimpleHeaderComponent from '../components/SimpleHeaderComponent';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = props => {
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

    const startSession = async() =>{
        console.log('Esto es startSession');
        const a = validate();

        console.log('Validate: ', a);
        
        if(a){
            const bd = {
              email: email,
              password: pass
            }
          
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
                props.navigation.navigate({routeName: 'Splash'})
              } else {
                alert(responseJson.error);
              }

            } catch (error) {
                  console.error('*************', error);
            }  
        } // **
  
    }

    return (
        <View style={styles.container}>
            <View style={{flex:2 }}>
                <SimpleHeaderComponent textTop={''} textCenter={getI18n().t('INICIAR_SESION')}  textBottom={''}></SimpleHeaderComponent>
                <View style={styles.social}>
                    <View style={{marginHorizontal: 10}}>
                        <Image
                            source={require('../assets/images/facebook.png')}
                        />
                    </View>

                    <View style={{marginHorizontal: 10}}>
                        <Image
                            source={require('../assets/images/twitter.png')}
                        />
                    </View>

                    <View style={{marginHorizontal: 10}}>
                        <Image
                            source={require('../assets/images/google.png')}
                        />
                    </View>
                </View>
            </View>

            <View style={{flex:1, alignItems: 'center'}}>
                <View style={{textAlign: 'left', alignItems: 'flex-start'}}>
                    <Text style={{color: 'grey', fontSize: 17}}>{ getI18n().t('inicie_sesion_correo') }</Text>
                </View>
                <View style={styles.formBackTop}>
                    <View style={{flexDirection: 'row', marginVertical: 15}}>
                        <MaterialCommunityIcons name="email" size={30} color={COLORS.newsColor} />
                        <TextInput style={mailOk ? styles.formItem : styles.formItemError}
                                onChangeText={(text) => setEmail(text)}
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
                        <MaterialCommunityIcons name="lock" size={30} color={COLORS.newsColor} />
                        <TextInput style={passOk ? styles.formItem : styles.formItemError}
                                onChangeText={(text) => setPass(text)}
                                placeholder={passOk ? getI18n().t('Contraseña') : getI18n().t('Introduzca_una_contraseña_valida')}
                                placeholderTextColor={mailOk ? 'grey' : 'red'}
                                ref={(input) => { this.passInput = input; }}
                        >
                        </TextInput>
                    </View>
                </View>
            </View>

            <View style={{flex: 1}}>
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
    



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecedec',
        padding:15,
    },
    formBack: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%'
    },
    formBackTop: {
        padding: 7,
        paddingVertical: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '90%',
        marginBottom: 1
    },
    formBackBottom: {
        padding: 7,
        paddingVertical: 3,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: '90%',
        marginTop: 1
    },
    formItem: {
        fontSize: 20,
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 37,
        marginVertical: 0
    },
    formItemError: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 40
    },
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row', 
        
    },
    social: {
        flexDirection: 'row', 
        textAlign: 'left', 
        marginTop: -30,
        marginBottom: 20,
        marginLeft: 1
    }
});

export default inject('store')(observer(LoginScreen));