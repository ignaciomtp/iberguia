import React, { useState, useEffect } from 'react';
import { View, 
         Text, 
         StyleSheet, 
         Modal,
         FlatList,
         ScrollView, 
         Picker,
         TextInput,
         ActivityIndicator,
         Dimensions,
         Image, 
         TouchableOpacity } from 'react-native';

import { inject, observer } from 'mobx-react';
import ButtonStart from '../components/ButtonStart';
import ButtonStartIos2 from '../components/ButtonStartIos2';
import LogoHeader from '../components/LogoHeader';
import COLORS from '../constants/Colors';
import URL from '../constants/Url';
import { getFormatedDate } from '../constants/Helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getI18n} from '../i18n';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import paisesEs from '../constants/paisesEs';
import paisesEn from '../constants/paisesEn';
import paisesGl from '../constants/paisesGl';
import paisesPt from '../constants/paisesPt';
import paisesFr from '../constants/paisesFr';
import paisesDe from '../constants/paisesDe';

const UpdateUserProfile = (props) => {
    let us = props.navigation.getParam('user');
    
    const [name, setName] = useState(us.first_name);
    const [nameOk, setNameOk] = useState(true);
    const [lastName, setLastName] = useState(us.last_name);
    const [lastNameOk, setLastNameOk] = useState(true);
    const [telf, setTelf] = useState(us.phone);
    const [email, setEmail] = useState(us.email);
    const [emailOk, setEmailOk] = useState(true);
    const [address, setAddress] = useState(us.street);
    const [prov, setProv] = useState(us.state);
    const [country, setCountry] = useState(us.country);
    const [countryRes, setCountryRes] = useState(us.country_residence ? us.country_residence : us.country);
    const [selectedContryName, setSelectedContryName] = useState(getI18n().t('todos_los_paises'));
    const [selectedContryResName, setSelectedContryResName] = useState(getI18n().t('todos_los_paises'));
    const [loc, setLoc] = useState(us.locality);
    const [cp, setCp] = useState(us.postalcode);
    const [photo, setPhoto] = useState();
    const [photoName, setPhotoName] = useState();
    const [countriesList, setCountriesList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    
    useEffect(() => {
        getPermissionAsync();
        setCountries();
    });

    useEffect(() => {
        if(countriesList.length){
            let c = countriesList.find(element => element.code == us.country);
            if(c) toggleSelectedCountry(c.name);  
            let cc = countriesList.find(element => element.code == us.country_residence);

            if(cc){
                toggleSelectedCountryRes(cc.name);  
            } else {
                toggleSelectedCountryRes(c.name);  
            }
        }
        
    }, [countriesList]);

    let devLang = props.store.mainStore.deviceLang.substring(0, 2);

    const setCountries = () => {
        let paises;
        switch (devLang) {
            case 'es':
                paises = paisesEs;
                break;
            case 'en':
                paises = paisesEn;
                break;
            case 'gl':
                paises = paisesGl;
                break;
            case 'pt':
                paises = paisesPt;
                break;
            case 'fr':
                paises = paisesFr;
                break;
            case 'de':
                paises = paisesDe;
                break;
        
            default:
                paises = paisesEn;
                break;
        }
        setCountriesList(paises);       
    }

    const toggleSelectedCountry = (name = '') => {
        if(selectedContryName != name){
            setSelectedContryName(name);
        } 
    }

    const toggleSelectedCountryRes = (name = '') => {
        if(selectedContryResName != name){
            setSelectedContryResName(name);
        } 
    }

    const validate = () => {
        let result = true;
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ml = reg.test(email);
        

        if(!name){
            setNameOk(false);
            result = false;
        }

        if(!lastName){
            setLastNameOk(false);
            result = false;
        }

        if(!ml || !email){
            setEmailOk(false);
            result = false;
        }

        return result;
    }

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    const handleChoosePhoto = async() => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setPhoto(result);
            let name = result.uri.split('/').pop();
            setPhotoName(name);
        }

    }


    const uploadImage = async() => {
        let localUri = photo.uri;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();

        formData.append('file', { uri: localUri, name: filename, type });

        console.log(JSON.stringify(formData));

        let hds = {
            Authorization: props.store.mainStore.token,
            Authorizationapp: URL.AUTH_APP,
            "Content-Type": "multipart/form-data",
            "language-user": props.store.mainStore.deviceLang,
            
        };

        const url = URL.BASE + 'api/areaprivada/edit/avatar';

        axios.post(url, formData, {headers: hds}).then(function(response){
            let responseJson = response.data;

            if(responseJson.state != 0){
                saveChanges(responseJson.info.name);
            } else {
                alert(responseJson.error);
            }

        }).catch(function(error){
            console.log(error);
        });

    }

    const saveChanges = async(image = null) => {
        const a = validate();
        let route = 'Splash';
        if(a){
            us.first_name = name;
            us.last_name = lastName;
            us.phone = telf;
            us.email = email;
            us.street = address;
            us.state = prov;
            us.country = country;
            us.country_residence = countryRes;
            us.locality = loc;
            us.postalcode = cp;
            us.modified = getFormatedDate();
            us.name = name + ' ' + lastName;
            if(image != null){
                us.picture = image;

            }
            console.log('---------- enviado a actulizar ----------');
            console.log(JSON.stringify(us));
            
            const url = URL.BASE + 'api/areaprivada/edit/save';

            axios.post(url, us, {headers: {
                            Authorization: props.store.mainStore.token,
                            Authorizationapp: URL.AUTH_APP,
                            'language-user': props.store.mainStore.deviceLang                      
                        }}).then(function(response){
                            let responseJson = response.data;

                            if(responseJson.state != 0){
                                alert(getI18n().t('actualizado_exito'));
                                props.store.mainStore.setUser(responseJson.info.user);
                                console.log('---------- respuesta ----------');
                                console.log(JSON.stringify(responseJson.info.user));
                                props.navigation.navigate(route);
                            } else {
                                alert(responseJson.error);
                            }
                        }).catch(function(error){
                            console.log(error);
                        });

        }

    }

    const save = () => {
        if(photo) {
            uploadImage();
        } else {
            saveChanges();
        }
    }

    const renderSelect = () => {
        if(Platform.OS === 'ios'){
            return(
                <ButtonStartIos2
                        title={selectedContryName}
                        color="#FFF"
                        textColor="#000"
                        action={() =>{
                            setShowModal(true)
                        }}
                    />  
            );
        } else {
            return(
                <Picker
                    selectedValue={selectedContryName}
                    style={{
                        width: '100%', 
                        color: '#000',
                        marginTop: -8,
                    }}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) =>{
                        toggleSelectedCountry(itemValue);
                        let cc = countriesList.find(elem => elem.name == itemValue);
                        setCountry(cc.code);
                    }}>
                    <Picker.Item label={getI18n().t('todos_los_paises')} value={ getI18n().t('todos_los_paises') } key="AC" />
                    {
                        countriesList.map((n) =>{
                            return (
                                <Picker.Item label={n.name} value={n.name} key={n.code} />
                            );
                        })
                    }
                </Picker>

            );
        }
        
    }

    const renderSelect2 = () => {
        if(Platform.OS === 'ios'){
            return(
                <ButtonStartIos2
                        title={selectedContryResName}
                        color="#FFF"
                        textColor="#000"
                        action={() =>{
                            setShowModal2(true)
                        }}
                    />  
            );
        } else {
            return(
                <Picker
                    selectedValue={selectedContryResName}
                    style={{
                        width: '100%', 
                        color: '#000',
                        marginTop: -8,
                    }}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) =>{
                        toggleSelectedCountryRes(itemValue);
                        let cc = countriesList.find(elem => elem.name == itemValue);
                        setCountryRes(cc.code);
                    }}>
                    <Picker.Item label={getI18n().t('todos_los_paises')} value={ getI18n().t('todos_los_paises') } key="AC" />
                    {
                        countriesList.map((n) =>{
                            return (
                                <Picker.Item label={n.name} value={n.name} key={n.code} />
                            );
                        })
                    }
                </Picker>

            );
        }
        
    }

    const renderModalContent = () => {
        return(
            <>
                <View style={styles.headerModal}>
                    <TouchableOpacity onPress={() => {
                        
                        setShowModal(false);
                    }}>
                        <View style={{flexDirection: 'row', 
                            alignItems: 'center',
                            paddingHorizontal: 7}}>
                            <MaterialCommunityIcons name="arrow-left" size={25} color="black" />
                            <Text> {getI18n().t('Volver')}</Text>
                        </View>
                        
                    </TouchableOpacity>
                </View>

                <View style={styles.centered2}>
                    <View style={styles.content}>
                        <FlatList numColumns={2}
                            data={countriesList}
                            renderItem={renderCountry}
                            keyExtractor={(item, index) => item.code}
                        />                           
                    </View>
                </View>
            </>
        );
    }

    const renderModalContent2 = () => {
        return(
            <>
                <View style={styles.headerModal}>
                    <TouchableOpacity onPress={() => {
                        
                        setShowModal2(false);
                    }}>
                        <View style={{flexDirection: 'row', 
                            alignItems: 'center',
                            paddingHorizontal: 7}}>
                            <MaterialCommunityIcons name="arrow-left" size={25} color="black" />
                            <Text> {getI18n().t('Volver')}</Text>
                        </View>
                        
                    </TouchableOpacity>
                </View>

                <View style={styles.centered2}>
                    <View style={styles.content}>
                        <FlatList numColumns={2}
                            data={countriesList}
                            renderItem={renderCountry2}
                            keyExtractor={(item, index) => item.code}
                        />                           
                    </View>
                </View>
            </>
        );
    }

    const renderCountry = (itemData) => {

        let ic = "checkbox-blank-outline";
        if(itemData.item.name == selectedContryName){
            ic = "checkbox-marked";
        } else {
            ic = "checkbox-blank-outline";
        }
        
         return(
            <TouchableOpacity onPress={() => {
                                toggleSelectedCountry(itemData.item.name);
                                let cc = countriesList.find(elem => elem.name == itemData.item.name);
                                setCountry(cc.code);
                                setShowModal(false);
                            }}>
                <View style={styles.cell}>


                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: Dimensions.get('window').width < 411 ? 12 : 15}}>
                            {itemData.item.name}
                        </Text>
                    </View>



                </View>
            </TouchableOpacity>
        );
    }

    const renderCountry2 = (itemData) => {

        let ic = "checkbox-blank-outline";
        if(itemData.item.name == selectedContryResName){
            ic = "checkbox-marked";
        } else {
            ic = "checkbox-blank-outline";
        }
        
         return(
            <TouchableOpacity onPress={() => {
                                toggleSelectedCountryRes(itemData.item.name);
                                let cc = countriesList.find(elem => elem.name == itemData.item.name);
                                setCountryRes(cc.code);
                                setShowModal2(false);
                            }}>
                <View style={styles.cell}>


                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: Dimensions.get('window').width < 411 ? 12 : 15}}>
                            {itemData.item.name}
                        </Text>
                    </View>



                </View>
            </TouchableOpacity>
        );
    }

    return(
        <View style={styles.body}>
            <ScrollView >
                <View >
                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Nombre')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={nameOk ? styles.input : styles.inputError}
                                onChangeText={(text) => setName(text)}
                                defaultValue={us.first_name || ''}
                                onSubmitEditing={() => { this.surnameInput.focus(); }}
                                blurOnSubmit={false}
                            />

                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Apellidos')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={lastNameOk ? styles.input : styles.inputError}
                                onChangeText={(text) => setLastName(text)}
                                defaultValue={us.last_name || ''}
                                onSubmitEditing={() => { this.emailInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.surnameInput = input; }}
                            />

                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>Email: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={emailOk ? styles.input : styles.inputError}
                                onChangeText={(text) => setEmail(text)}
                                defaultValue={us.email || ''}
                                onSubmitEditing={() => { this.phoneInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.emailInput = input; }}
                            />

                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Telefono')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setTelf(text)}
                                defaultValue={us.phone || ''}
                                onSubmitEditing={() => { this.provinceInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.phoneInput = input; }}
                            />

                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Provincia')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setProv(text)}
                                defaultValue={us.state || ''}
                                onSubmitEditing={() => { this.cityInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.provinceInput = input; }}
                            />

                        </View>
                    </View>

                    
                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Localidad')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setLoc(text)}
                                defaultValue={us.locality || ''}
                                onSubmitEditing={() => { this.addressInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.cityInput = input; }}
                            />

                        </View>
                    </View>     

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Direccion')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setAddress(text)}
                                defaultValue={us.street || ''}
                                onSubmitEditing={() => { this.pcInput.focus() }}
                                blurOnSubmit={false}
                                ref={(input) => { this.addressInput = input; }}
                            />

                        </View>
                    </View>                  

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('codigo_postal')}: </Text>
                        </View>
                        <View style={{flex: 4}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setCp(text)}
                                defaultValue={us.postalcode || ''}
                                ref={(input) => { this.pcInput = input; }}
                            />

                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('pais_nacimiento')}: </Text>
                        </View>
                        <View style={{
                            flex: 4,
                            height: 33, 
                            borderColor: 'gray', 
                            borderWidth: 1,
                            backgroundColor: 'white',
                            borderRadius: 7
                        }}>
                            {
                                renderSelect()
                            }
                            
                            
                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('pais_residencia')}: </Text>
                        </View>
                        <View style={{
                            flex: 4,
                            height: 33, 
                            borderColor: 'gray', 
                            borderWidth: 1,
                            backgroundColor: 'white',
                            borderRadius: 7
                        }}>
                            {
                                renderSelect2()
                            }
                            
                            
                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <View style={styles.label}>
                            <Text style={{fontWeight: 'bold'}}>{getI18n().t('Foto')}: </Text>
                        </View>

                        <View style={{flex: 2}}>
                            <TouchableOpacity style={styles.choose}
                                onPress={() =>{
                                    handleChoosePhoto()
                                }}
                                
                            >
                                <Text style={{color: '#fff', 
                                            textAlign: 'center',
                                            fontWeight:'bold',
                                            }}>{getI18n().t('Elegir')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2}}>
                            <Text>{photoName}</Text>
                            
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row', marginTop: 50}}>

                        <View style={{flex: 2, alignItems: 'center'}}>
                                <ButtonStart 
                                    title={getI18n().t('guardar_datos')}
                                    color={COLORS.newsColor}
                                    textColor="#fff"
                                    action={() => {
                                        save()
                                    }}
                                />  
                        </View>

                        <View style={{flex: 2, alignItems: 'center'}}>

                            <ButtonStart 
                                title={getI18n().t('Cancelar')}
                                color={COLORS.directoryColor}
                                textColor="#fff"
                                action={() =>{
                                    props.navigation.navigate('UserProfile');
                                }}
                            />      
                        </View> 

                    </View>

                </View>
            </ScrollView>
            <View>
                <>
                    <Modal animationType="none"
                        transparent={false}
                        visible={showModal}
                    
                    >
                    {
                        renderModalContent()
                    }

                    </Modal>

                </>
            </View>
            <View>
                <>
                    <Modal animationType="none"
                        transparent={false}
                        visible={showModal2}
                    
                    >
                    {
                        renderModalContent2()
                    }

                    </Modal>

                </>
            </View>
        </View>
    );

}

UpdateUserProfile.navigationOptions = navigationData => {
  return {
      headerLeft: (
          <TouchableOpacity
            onPress={() => {
              navigationData.navigation.pop();
            }}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.directoryColor} />
          </TouchableOpacity>
          
        ),
        headerRight: (
            <LogoHeader />
        ),
        title: getI18n().t('editar_perfil')
  };
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%', 
        padding: 15, 
    },
    header: {
        height: 180,
        paddingTop: 20,
        backgroundColor: '#fff',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000'
    },
    horS: {
        flexDirection: 'row',
    },
    cell: {
        
        textAlign: 'center',
        paddingHorizontal: 5,
        marginBottom: 10
    },
    editProfile: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.directoryColor  
    },
    formItem: {
        flexDirection: 'row',
        marginVertical: 2
    },
    input: {
        height: 33, 
        borderColor: 'gray', 
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingLeft: 7,
        borderRadius: 7
    },
    inputError: {
        height: 33, 
        borderColor: 'red', 
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingLeft: 7
    },
    label: {
        flex: 2,
        textAlign: 'center',
        justifyContent: 'center',
        
    },
    choose: {
        height: 33,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242B3A'
    },
    centered: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    }, 
    centered2: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        
    }, 
    headerModal: {
        height: 50,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',

    }, 
    cell: {
        flexDirection: 'row',
        height: 55,
        width: Dimensions.get('window').width < 411 ? 160 : 200,
        borderBottomWidth: 1,
        borderBottomColor: '#ecedec',
        paddingVertical: Dimensions.get('window').width < 411 ? 15 : 10,
        borderRightWidth: 1,
        borderRightColor: '#ecedec',
        backgroundColor: '#FFF'
    }, 
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default inject('store')(observer(UpdateUserProfile));