import React, { Component, useState } from 'react';
import { Text, 
         View, 
         StyleSheet, 
         Image, 
         Modal,
         TextInput,
         Platform } from 'react-native';
import ButtonStart from './ButtonStart';
import ModalLogin from './ModalLogin';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { inject, observer } from 'mobx-react';
import URL from '../constants/Url';
import COLORS from '../constants/Colors';
import { getFormatedDate } from '../constants/Helpers';
import {getI18n} from '../i18n';
import axios from 'axios';


const YourOpinion = props => {
    const [rating, setRating] = useState(0);
    const [isLogged, setIsLogged] = useState(props.store.mainStore.isLogged);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState();

    let arr = [1,2,3,4,5];

    const setUserLogged = () => {
        setIsLogged(true);
        closeModal();
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const postComment = async() => {
        const body = {
            title: "title",
            texto: comment,
            ranking: rating,
            idproduct: props.id
        }

        const url = URL.BASE + 'api/comentarios/add';

        axios.post(url, body, {headers: {
                          Authorization: props.store.mainStore.token,
                          Authorizationapp: URL.AUTH_APP,
                          'language-user': props.store.mainStore.deviceLang                      
                      }}).then(function(response){
                          let responseJson = response.data;

                          if(responseJson.state != 0){
                                //let cd = getFormatedDate();
                                const cmt = {
                                    id: 117,
                                    username: responseJson.info.username,
                                    email: responseJson.info.email,
                                    image: responseJson.info.image,
                                    ranking: body.ranking,
                                    texto: body.texto,
                                    idproduct: body.idproduct,
                                    title: "",
                                    iduser: responseJson.info.iduser,
                                    //creationdate: cd

                                }

                                props.action(cmt);
                            } else {
                                alert(responseJson.error);
                            }

                      }).catch(function(error){
                          console.log(error);
                      });

            
    }

    return (
    
    <View style={styles.content}>
        <View style={{flex:1, flexDirection:'row'}}>

                {arr.map((n)=>{
                    
                    return (
                        <View key={n} style={{flex:1, padding:5}}>
                            <TouchableOpacity style={{...styles.scoreContent, 
                                    backgroundColor: rating == n ? props.color : 'transparent',
                                    color: rating == n ? '#fff' : 'grey',
                                    borderWidth: rating == n ? 0 : 1
                                    }}
                                onPress={() =>{
                                    setRating(n);                              
                                }}
                            >
                                <Text style={rating == n ? styles.scoreTextActive : styles.scoreText}>{n}</Text>
                                <Icon style={styles.scoreIcon} size = {15} color={rating == n ? '#fff' : 'grey'}  name='star' />
                            </TouchableOpacity>
                        </View>
                    );
                })}

            </View>

            <View style={{paddingTop:10, flex:1, alignItems:"flex-start"}}>

                { isLogged ?  <View style={{width: '100%'}}>
                                    <TextInput
                                        style={styles.textBox}
                                        multiline={true}
                                        numberOfLines={Platform.OS === 'ios' ? null : 5}
                                        minHeight={Platform.OS === 'ios' ? 100 : null}
                                        underlineColorAndroid="transparent"
                                        placeholder={getI18n().t('escriba_comentario')}
                                        placeholderTextColor="red"
                                        onChangeText={(text) => setComment(text)}
                                    />

                                    <ButtonStart 
                                        title={getI18n().t('Enviar')}
                                        color={props.color}
                                        textColor="#fff"
                                        action={() =>{
                                            postComment();
                                        }}
                                    />  

                                </View> 
                            :

                                <View style={{width:170}}>
                                    <ButtonStart 
                                        title={getI18n().t('añadir_comentario')}
                                        color="#fff"
                                        textColor="#474343"
                                        action={() =>{
                                            setIsLogged(props.store.mainStore.isLogged);
                                            if(!props.store.mainStore.isLogged) setModalVisible(true);
                                        }}
                                    />  
                                </View>

                }



            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
            >
                <ModalLogin action={setUserLogged} close={closeModal} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    content:{
      flex:1,
      paddingBottom:25
    },

    avatarContent:{
        flex:1
    },

    dataContent:{
        flex:5,
        padding:7,
    },

    name:{
        fontWeight:"bold", 
        fontSize:17,
    },

    userTime:{
        fontSize:10,
    },

    scoreContent:{
        flex:1, 
        padding:10, 
        flexDirection:'row', 
        borderRadius:5,  
        alignItems:'center',
        borderColor: 'grey',
    },

    scoreText:{
        flex:1, 
        textAlign:'center', 

    },

    scoreTextActive:{
        flex:1, 
        textAlign:'center', 
        color:'#fff',
    },

    scoreIcon:{
        flex:1,
    },

    center:{
        flex:3,
        backgroundColor:'pink',
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },

    text_title:{
        fontSize:30,
        fontWeight:'bold',
    },

    form: {

        margin: 20,
        justifyContent: 'center',
        textAlign: 'center',

    },

    formItem: {
        marginVertical: 20
    },

    loginTitle: {
        textAlign: 'center',

        fontSize: 20
    },
    
    tabBarInfoContainer: {
        flex:1,
        flexDirection:'row'
    },
    textBox: {
        backgroundColor: '#fff', 
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        padding: 7,
    }
});

export default inject('store')(observer(YourOpinion));