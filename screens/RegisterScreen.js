import React, {Component, useState} from 'react';
import { Platform, 
         View, 
         Text, 
         StyleSheet, 
         TouchableOpacity,
         Image,
         CheckBox,
         Modal,
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
import {AsyncStorage} from 'react-native';
import axios from 'axios';

const RegisterScreen = props => {
    const [name, setName] = useState();
    const [nameOk, setNameOk] = useState(true);
    const [surname, setSurname] = useState();
    const [surnameOk, setSurnameOk] = useState(true);
    const [email, setEmail] = useState();
    const [email2, setEmail2] = useState();
    const [emailOk, setEmailOk] = useState(true);
    const [msgErrorMail, setMsgErrorMail] = useState();
    const [email2Ok, setEmail2Ok] = useState(true);
    const [msgErrorMail2, setMsgErrorMail2] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();
    const [passOk, setPassOk] = useState(true);
    const [pass2Ok, setPass2Ok] = useState(true);
    const [passError, setPassError] = useState();
    const [passError2, setPassError2] = useState();
    const [country, setCountry] = useState();
    const [countryRes, setCountryRes] = useState();
    const [terms, setTerms] = useState(false);
    const [showModal, setShowModal] = useState(false);       

    const validate = () => {
        let result = true;
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ml = reg.test(email);
        const ml2 = reg.test(email2);

        if(!name){
            setNameOk(false);
            result = false;
        }

        if(!surname){
            setSurnameOk(false);
            result = false;
        }

        if(!ml || !email){
            setEmailOk(false);
            setMsgErrorMail(getI18n().t('introduzca_email_valido'));
            result = false;
        }

        if(!ml2 || !email2){
            setEmail2Ok(false);
            setMsgErrorMail2(getI18n().t('introduzca_email_valido'));
            result = false;
        }

        if(email != email2){
            setEmailOk(false);
            setEmail2Ok(false);
            setMsgErrorMail(getI18n().t('emails_no_coinciden'));
            setMsgErrorMail2(getI18n().t('emails_no_coinciden'));
            result = false;
        }

        if(!pass || pass.length == 0){
            setPassOk(false);
            setPassError(getI18n().t('Introduzca_una_contraseña_valida'));
            result = false;
        }

        if(!pass2 || pass2.length == 0){
            setPass2Ok(false);
            setPassError2(getI18n().t('Introduzca_una_contraseña_valida'));
            result = false;
        }

        if(pass != pass2){
            setPassOk(false);
            setPass2Ok(false);
            setPassError(getI18n().t('contras_no_coinciden'));
            setPassError2(getI18n().t('contras_no_coinciden'));
            result = false;
        }
        
        if(!terms){
            alert(getI18n().t('debe_aceptar_terminos'));
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

    const displayError = (text, lg) => {
        if(text == "El mail introducido ya esta siendo utilizado por un usuario"){
            let msg;
            switch (lg) {
                case 'en':
                    msg = 'The email entered is already being used';
                    break;
                case 'es':
                    msg = text;
                    break;
                case 'gl':
                    msg = text;
                    break;
                case 'pt':
                    msg = 'O email inserido já está sendo usado por outro usuário';
                    break;
                case 'fr':
                    msg = "L'e-mail saisi est déjà utilisé par un autre utilisateur";
                    break;
                case 'de':
                    msg = 'Die eingegebene E-Mail wird bereits von einem anderen Benutzer verwendet';
                    break;
            
                        
                default:
                    msg = text;
                    break;
            }

            return msg;
        } 

        return text;
    }

    const register = async() => {
        
        const a = validate();

        if(a){
            let lg = props.store.mainStore.deviceLang;
            let ctry = lg.substring(lg.length - 2);
            let lang = lg.substring(0, 2);

            const bd = {
              name: name,
              surname: surname,
              email: email,
              repeatemail: email2,
              password: pass,  
              repassword: pass2,
              acceptterms: terms,
              country: ctry,
              country_residence: ctry,
              gender: "",
              locale: "",
              cover: ""
            }

            const url = URL.BASE + 'api/register';

            axios.post(url, bd, {headers: {
                          authorizationapp: URL.AUTH_APP,
                      }}).then(function(response){
                            let responseJson = response.data;

                            if(responseJson.state == 1){
                                props.store.mainStore.setIsLogged(true);
                                props.store.mainStore.setToken(responseJson.info.token);
                                props.store.mainStore.setUser(responseJson.info.user);

                                persistItem('user', JSON.stringify(responseJson.info.user));
                                persistItem('token', responseJson.info.token);

                                props.navigation.navigate({routeName: 'Splash', params: {
                                    welcome: getI18n().t('Bienvenido') + ' ' + responseJson.info.user.first_name
                                }})
                            } else {
                                alert(responseJson.error);
                            }

                      }).catch(function(error){

                          alert(displayError(error.response.data.error, lang));

                      });
          

        } // **
    }

    return (
        <View style={styles.container}>
        
            <View style={styles.top}>
            
                <Image
                    style={{resizeMode: 'contain', flex:1,width:'100%'}}
                    source={require('../assets/images/logo.png')}/>
                    <Text style={styles.car_top}>{getI18n().t('REGISTRARSE')}</Text>
                    
            </View>

            <ScrollView>
                <View style={styles.middle}>

                    <View style={styles.formBackTop}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="account" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={passOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setName(text)}
                                    placeholder={nameOk ? getI18n().t('Nombre') : getI18n().t('Introduzca_su_nombre')}
                                    placeholderTextColor={nameOk ? 'grey' : 'red'}
                                    onSubmitEditing={() => { this.surnameInput.focus(); }}
                                    blurOnSubmit={false}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.formBack}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="account" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={surnameOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setSurname(text)}
                                    placeholder={surnameOk ? getI18n().t('Apellidos') : getI18n().t('Introduzca_sus_apellidos')}
                                    placeholderTextColor={surnameOk ? 'grey' : 'red'}
                                    onSubmitEditing={() => { this.emailInput.focus() }}
                                    blurOnSubmit={false}
                                    ref={(input) => { this.surnameInput = input; }}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.formBack}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="email" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={emailOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setEmail(text)}
                                    autoCapitalize = 'none'
                                    keyboardType='email-address'
                                    placeholder={emailOk ? "Email" : msgErrorMail}
                                    placeholderTextColor={emailOk ? 'grey' : 'red'}
                                    onSubmitEditing={() => { this.email2Input.focus() }}
                                    blurOnSubmit={false}
                                    ref={(input) => { this.emailInput = input; }}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.formBack}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="email" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={email2Ok ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setEmail2(text)}
                                    autoCapitalize = 'none'
                                    keyboardType='email-address'
                                    placeholder={email2Ok ? getI18n().t('Confirme_su_email') : msgErrorMail2}
                                    placeholderTextColor={email2Ok ? 'grey' : 'red'}
                                    onSubmitEditing={() => { this.passInput.focus() }}
                                    blurOnSubmit={false}
                                    ref={(input) => { this.email2Input = input; }}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.formBack}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="lock" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={passOk ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setPass(text)}
                                    autoCapitalize = 'none'
                                    secureTextEntry={true}
                                    placeholder={passOk ? getI18n().t('Contraseña') : passError}
                                    placeholderTextColor={passOk ? 'grey' : 'red'}
                                    onSubmitEditing={() => { this.pass2Input.focus() }}
                                    blurOnSubmit={false}
                                    ref={(input) => { this.passInput = input; }}
                            >
                            </TextInput>
                        </View>
                    </View>
                      
                    <View style={styles.formBackBottom}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <View style={{paddingTop: 5}}>
                                <MaterialCommunityIcons name="lock" size={20} color={COLORS.directoryColor} />
                            </View>
                            <TextInput style={pass2Ok ? styles.formItem : styles.formItemError}
                                    onChangeText={(text) => setPass2(text)}
                                    autoCapitalize = 'none'
                                    secureTextEntry={true}
                                    placeholder={pass2Ok ? getI18n().t('Confirme_su_contraseña') : passError2}
                                    placeholderTextColor={pass2Ok ? 'grey' : 'red'}
                                   
                                    ref={(input) => { this.pass2Input = input; }}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.accept}>
                        <View style={{width: '50%'}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <ButtonStart 
                                        title={getI18n().t('ver_terminos')}
                                        color="#fff"
                                        textColor="#474343"
                                        action={() =>{
                                           setShowModal(true);
                                        }}
                                    />  
                            </View>

                        </View>
                        
                        <View style={{width: '50%'}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={{fontSize: 14}}>{getI18n().t('Acepto_los_terminos')}</Text>
                                <CheckBox thumbColor={COLORS.directoryColor}
                                    value={terms}
                                    onChange={() => {
                                        setTerms(!terms);
                                    }}
                                ></CheckBox>
                            </View>
                        </View>
                    </View>
                    
                </View>

                <View style={styles.bottom}>

                        <View style={{flex: 1,alignItems: 'center'}}>
                            <ButtonStart 
                                    title={getI18n().t('tiene_cuenta')}
                                    color="#fff"
                                    textColor="#474343"
                                    action={() =>{
                                        props.navigation.navigate({routeName: 'Login'})
                                    }}
                                />  
                        </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                        <ButtonStart 
                            title={getI18n().t('Registrarse')}
                            color={COLORS.directoryColor}
                            textColor="#fff"
                            action={register}
                        />  
                    </View>
                    
                </View>

                <View>
                    <Modal animationType="slide"
                    transparent={false}
                    visible={showModal}
                    
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => {
                                setShowModal(false);
                            }}>
                                <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
                                <Text>{getI18n().t('Volver')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.centered}>
                           <ScrollView>
                                <Text style={styles.car_top}>{getI18n().t('terminos')}</Text>

                                <Text>
Lorem fistrum mamaar se calle ustée quietooor ese que llega condemor diodeno me cago en tus muelas quietooor. Benemeritaar torpedo me cago en tus muelas apetecan ahorarr. A wan no puedor a wan ese que llega benemeritaar. Mamaar se calle ustée pupita jarl amatomaa torpedo. Me cago en tus muelas te voy a borrar el cerito va usté muy cargadoo apetecan tiene musho peligro al ataquerl caballo blanco caballo negroorl tiene musho peligro te va a hasé pupitaa se calle ustée va usté muy cargadoo. Quietooor a wan benemeritaar diodenoo me cago en tus muelas sexuarl pupita ese pedazo de papaar papaar. No te digo trigo por no llamarte Rodrigor ese hombree pecador no puedor torpedo papaar papaar por la gloria de mi madre fistro hasta luego Lucas a gramenawer.

                                </Text>
                           </ScrollView>

                        </View>

                    </Modal>
                </View>

            </ScrollView>

        
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecedec',
        padding:15,
        paddingBottom: 0
    },
    car_top:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft: 20,
        marginBottom: 20
    },
    formBack: {
        padding: 10,
        paddingVertical: 1,
        backgroundColor: '#fff',
        marginVertical: 1,
        width: '90%',
        height: 50
    },
    formBackTop: {
        padding: 10,
        paddingVertical: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '90%',
        marginBottom: 1,
        height: 50
    },
    formBackBottom: {
        padding: 10,
        paddingVertical: 1,
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
        marginVertical: 0
    },
    formItemError: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 35
    },
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row', 
        
    },
    top:{
        flex:2,
    },
    middle:{
        flex:2,
        alignItems: 'center',
    },
    bottom:{
        flex: 2,
        flexDirection:'row',
        alignItems: 'center',
        height: 120,
        marginBottom: -10,
        width: '100%',
        padding: 15,
        paddingVertical: 0
    }, 
    accept: {
        flexDirection: 'row', 
        marginVertical: 15, 
        width: '100%',
        paddingTop: 15
    },
    
});

export default inject('store')(observer(RegisterScreen));