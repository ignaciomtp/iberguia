import React, {useRef} from 'react';
import { View, 
         Text, 
         Linking,
         TouchableOpacity,
         StyleSheet, 
         Dimensions,
         Image } from 'react-native';
import {getI18n} from '../i18n';
import COLORS from '../constants/Colors';
import EmbassyActions from './EmbassyActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListHeaderEmb = props => {
    
    const image = props.item.countryisocode;
    let imgRoute;
    const screenWidth = Math.round(Dimensions.get('window').width);
    let phones = props.item.phone.split('/');

    if(!image){
        imgRoute = require('../assets/images/logo.png');
    } else {
        if(image == 'ES'){
            imgRoute = require('../assets/images/esp.png');
        }else{
            imgRoute = require('../assets/images/portugal.png')
        }

    }

    const printPhone2 = () => {
        if(phones.length > 1){
            return(
                <TouchableOpacity 
                    onPress={() =>{
                                    Linking.openURL(`tel:${phones[1].trim()}`)
                                }} 
                    style={{...styles.btn, ...styles.btnPhone, backgroundColor: COLORS.embassyColor}}>
                        <MaterialCommunityIcons style={{marginRight: 7}}
                            name="phone" 
                            size={20} 
                            color={'white'}
                        />

                        <Text style={styles.btnText}>{phones[1].trim()}</Text>
                </TouchableOpacity>
            );
        }
    }

    return(
        <View style={styles.header}>
            <View style={styles.titleBox}>
                <Image style={{width: screenWidth, height: screenWidth / 2}}
                    source={imgRoute}
                />

                <View style={{marginTop:25, marginLeft:15}}>
                    <Text style={styles.text_title}>{props.item.name} </Text>

                    <Text style={styles.location}>{props.item.country} / {props.item.state} / {props.item.locality} </Text>

                </View>

                <View style={styles.separator} >
                    <EmbassyActions 
                    go={props.go}
                    url={props.item.web}
                />
                </View>

                <View style={styles.contactBar}>
                    <TouchableOpacity 
                        onPress={() =>{
                                        Linking.openURL(`tel:${phones[0].trim()}`)
                                    }} 
                        style={{...styles.btn, ...styles.btnPhone, backgroundColor: COLORS.embassyColor}}>
                            <MaterialCommunityIcons style={{marginRight: 7}}
                                name="phone" 
                                size={20} 
                                color={'white'}
                            />

                            <Text style={styles.btnText}>{phones[0].trim()}</Text>
                    </TouchableOpacity>

                    {
                        printPhone2()
                    }
                    

                </View>

                <View style={styles.description} >
                    
                    <Text style={styles.descriptionText}>
                    {props.item.description}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        marginTop: -10,
        marginBottom: 7,
        paddingBottom: 7
    },
    location: {
        fontSize: 15,
    },
    titleBox: {
        paddingTop: 10,
        paddingHorizontal: 10,
        
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000'
    },
    text_title:{
        fontSize:24,
        fontWeight:'bold',
    },
    description:{
      paddingVertical: 7,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    descriptionText:{
      fontSize: 19
    },
    separator:{
      flex: 1,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: COLORS.embassyColor,
      marginVertical: 20,
      marginHorizontal: 10
    },
    contactBar: {
        marginTop: 5,
        marginBottom: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    btn: {
        
        paddingHorizontal: 7,
        paddingVertical: 5,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        
    },
    btnPhone:{
        margin: 10,
        maxWidth: 160
    },
    btnText: {
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});

export default ListHeaderEmb;