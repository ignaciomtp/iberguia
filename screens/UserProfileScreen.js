import React, { useState, useEffect } from 'react';
import { View, 
         Text, 
         StyleSheet, 
         ScrollView, 
         TextInput,
         ActivityIndicator,
         Image, 
         Platform,
         TouchableOpacity } from 'react-native';

import { inject, observer } from 'mobx-react';
import ButtonStart from '../components/ButtonStart';
import LogoHeader from '../components/LogoHeader';
import COLORS from '../constants/Colors';
import URL from '../constants/Url';
import { getFormatedDate } from '../constants/Helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getI18n} from '../i18n';

const UserProfileScreen = (props) => {
    const [user, setUser] = useState();
    const [avatar, setAvatar] = useState(require('../assets/images/robot-dev.png'));

    useEffect(() => {
        let foto = props.navigation.getParam('foto');
        if(foto){
            setAvatar({uri: 'https://nexoiberico.ticrevolution.com/uploads/' + foto});
        }
    });

    const uu = props.store.mainStore.user;
    
    let us = {
        id: uu.id,
        first_name: uu.first_name,
        last_name: uu.last_name,
        email: uu.email,
        gender: uu.gender,
        locale: uu.locale,
        cover: uu.cover,
        picture: uu.picture,
        link: uu.link,
        modelcar: uu.modelcar,
        state: uu.state,
        country: uu.country,
        country_residence: uu.country_residence,
        locality: uu.locality,
        created: uu.created,
        modified: uu.modified,
        password: uu.password,
        blocked: uu.blocked,
        acceptterms: uu.acceptterms,
        accepttermsdate: uu.accepttermsdate,
        name: uu.name,
        cif: uu.cif,
        phone: uu.phone,
        street: uu.street,
        city: uu.city,
        postalcode: uu.postalcode
    };

    if(!user){
        setUser(us);
        if(uu.picture != null) setAvatar({uri: 'https://nexoiberico.ticrevolution.com/uploads/' + uu.picture});
    }


    return(
        <View >
            <ScrollView style={styles.body}>
                <View style={styles.header}>
                    <View style={styles.centered}>
                         <Image
                            style={styles.pic}
                            source={avatar}
                        />
                    </View>
                   

                    <View style={styles.button}>
                            <TouchableOpacity style={styles.editProfile} 
                                            onPress={() => {
                                                props.navigation.navigate({routeName: 'UpdateProfile', params: {
                                                            user: us,
                    
                                                }});
                                            }}
                            >
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>{getI18n().t('editar_perfil')}</Text>
                            </TouchableOpacity>                    
                    </View>


                    <View style={styles.cell}>
                        <Text style={styles.title}>{us.first_name } {us.last_name }</Text>
                    </View>

                        

                    
                </View>

                <View style={styles.content}>
                    <View style={styles.horS}>
                        <View style={{width: '30%'}}>
                            <Text style={{...styles.dataItemText, fontWeight: 'bold'}}>Email: </Text>
                        </View>

                        <View style={{width: '70%'}}>
                            <Text style={styles.dataItemText}>{us.email}</Text>
                        </View>
                        
                        
                    </View>

                    <View style={styles.horS}>
                        <View style={{width: '30%'}}>
                           <Text style={{...styles.dataItemText,fontWeight: 'bold'}}>{getI18n().t('Telefono')}: </Text>
                        </View>

                        <View style={{width: '70%'}}>
                            <Text style={styles.dataItemText}>{us.phone}</Text>
                        </View>
                        
                        
                    </View>

                    <View style={styles.horS}>
                        <View style={{width: '30%'}}>
                             <Text style={{...styles.dataItemText,fontWeight: 'bold'}}>{getI18n().t('Localidad')}: </Text>
                        </View>

                        <View style={{width: '70%'}}>
                            <Text style={styles.dataItemText}>{us.locality}</Text>
                        </View>
                                               
                    </View>

                    <View style={styles.horS}>
                        <View style={{width: '30%'}}>
                            <Text style={{...styles.dataItemText,fontWeight: 'bold'}}>{getI18n().t('Provincia')}: </Text>
                        </View>

                        <View style={{width: '70%'}}>
                            <Text style={styles.dataItemText}>{us.state}</Text>
                        </View>
                        
                    </View>

                    <View style={styles.horS}>
                        <View style={{width: '30%'}}>
                            <Text style={{...styles.dataItemText,fontWeight: 'bold'}}>{getI18n().t('Pais')}: </Text>
                        </View>

                        <View style={{width: '70%'}}>
                            <Text style={styles.dataItemText}>{us.country}</Text>
                        </View>
                        
                    </View>

                </View>
                    
            </ScrollView>


        </View>
        
    );

}

UserProfileScreen.navigationOptions = navigationData => {
  return {
      headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
                navigationData.navigation.pop();
            }}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.directoryColor} />
          </TouchableOpacity>
          
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() =>{
                  navigationData.navigation.navigate('Splash');  
                }
            }>
            <LogoHeader />
          </TouchableOpacity>
        ),
        title: getI18n().t('perfil_usuario')
  };
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%',
    },
    centered: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 20,
        backgroundColor: '#fff',     
        borderBottomWidth: 1, 
        borderBottomColor: '#000'
    },
    pic: {
        resizeMode: 'contain', 
        width: 200,
        height: 200,
        borderRadius: Platform.OS === 'ios' ? 200 / 2 : 200,
        marginBottom: 20,

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000'
    },
    horS: {
        flexDirection: 'row',
        marginVertical: 7
    },
    dataItem: {
        flexDirection: 'row',
        marginVertical: 15,
        
    },
    dataItemText: {
        fontSize: 18
    },
    cell: {
        
        textAlign: 'center',
        paddingHorizontal: 5,
        marginBottom: 10
    },
    button: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: 10
    },
    editProfile: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 10,
        backgroundColor: COLORS.directoryColor  
    },
    formItem: {
        flexDirection: 'row'
    },
    content: {
        padding: 15
    }
});

export default inject('store')(observer(UserProfileScreen));