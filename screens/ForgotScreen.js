import React, {useState} from 'react';
import { Platform, 
         View, 
         Text, 
         StyleSheet, 
         TouchableOpacity,
         Modal,
         Image,
         TextInput,
         ScrollView,
         Alert, 
          } from 'react-native';
import ButtonStart from '../components/ButtonStart';
import COLORS from '../constants/Colors'; 
import SimpleHeaderComponent from '../components/SimpleHeaderComponent';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import URL from '../constants/Url';
import t from 'tcomb-form-native';

const Form = t.form.Form;
 
const options = {
  auto: 'placeholders',
  fields: {
    phone: {placeholder: 'Vía SMS'},
    email: {placeholder: 'Vía email'}
  }
};

const ForgotScreen = props => {
    const [email, setEmail] = useState();
    const [mailOk, setMailOk] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const validate = () => {
        let result = true;
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ml = reg.test(email);
        if(!ml){
            setMailOk(false);
            result = false;
        }

        return result;
    }

    const retrievePass = async() =>{
      if(validate()){

        const bd = {
          email: email
        }

        try{
          let response = await fetch(URL.BASE + 'api/recovery', 
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
            setShowModal(true);            
          }

        } catch(error){
            console.error('*************', error);
        }  
      }
    }

    const closeModal = () =>{
      setShowModal(false);
      props.navigation.navigate({routeName: 'Login'});
    }

    return (
        <View style={styles.container}>
          <View style={{flex:3}}>
            <SimpleHeaderComponent 
              textTop={getI18n().t('OLVIDO_SU')} 
              textCenter={getI18n().t('CONTRASEÑA')}  
              textBottom={getI18n().t('email_recuperar')}></SimpleHeaderComponent>
          </View>

          <View style={{flex:2, alignItems: 'center'}}>
              <View style={styles.formBack}>
                  <View style={{flexDirection: 'row', marginVertical: 15}}>
                      <MaterialCommunityIcons name="email" size={30} color={COLORS.newsColor} />
                      <TextInput style={mailOk ? styles.formItem : styles.formItemError}
                              onChangeText={(text) => setEmail(text)}
                              autoCapitalize = 'none'
                              placeholder={mailOk ? "Email" : getI18n().t('introduzca_email_valido')}
                              placeholderTextColor={mailOk ? 'grey' : 'red'}
                              
                      >
                      </TextInput>
                  </View>
              </View>
              
          </View>
    
          <View style={styles.tabBarInfoContainer}>    
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <View style={{width:'40%'}}>
                  <ButtonStart 
                        title={getI18n().t('Enviar')}
                        color={COLORS.newsColor}
                        textColor="#fff"
                        action={() =>{
                          retrievePass()
                        }}
                    />  
                </View>
              </View>
          </View>

          <View>
            <Modal animationType="slide"
            transparent={false}
            visible={showModal}
            
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        closeModal()
                    }}>
                        <View style={{flexDirection: 'row', 
                            alignItems: 'center',
                            paddingHorizontal: 7}}>
                            <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
                            <Text> {getI18n().t('Volver')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.centered}>
                    <ScrollView>
                        <Text style={styles.newpass}>{getI18n().t('Te_hemos')}</Text>

                        <ButtonStart 
                            title={getI18n().t('Volver')}
                            color={COLORS.directoryColor}
                            textColor="#fff"
                            action={() =>{
                              closeModal()
                            }}
                        />  
                    </ScrollView>

                </View>

            </Modal>
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
      newpass:{
        fontSize: 18,
        paddingHorizontal: 10,
        textAlign: 'center'
      },
      header: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
      tabBarInfoContainer: {
        flex:1,
        flexDirection:'row'
      },
      formBack: {
        padding: 15,
        paddingVertical: 3,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        marginVertical: 7
      },
      formItem: {
        fontSize: 20,
        paddingLeft: 7,
        marginLeft: 10,
        width: '85%',
        height: 37,
        marginVertical: 0
    },
    centered: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'black'
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
});

export default ForgotScreen;