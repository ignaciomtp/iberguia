import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import COLORS from '../constants/Colors';
import Card from './Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const showFlag = (country) => {
    
    if(country == 'ES'){
        return(
            <ImageBackground source={require('../assets/images/esp.png')} style={styles.bgImage} >
                            
            </ImageBackground> );
    } else {
        return(
            <ImageBackground source={require('../assets/images/portugal.png')} style={styles.bgImage} >
                            
            </ImageBackground> );
    } 

}

const EmbassyItem = props => {
    //console.log('Name: ' + props.name);
    //console.log('Address: ' + props.address);
    return (
        <Card style={{...styles.item, borderBottomColor: COLORS.embassyColor}}>
            <TouchableOpacity onPress={props.onSelectbus}>
                <View>
                    <View style={{...styles.busRow, ...styles.busHeader}}>
                    {
                        showFlag(props.country)
                    }
                          
                    </View>
                    <View style={{...styles.busRow, ...styles.busDetail}}>
                        <Text style={styles.title} numberOfLines={1} >{props.name}</Text>
                        
                        <View style={{flexDirection: 'row', 
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}>
                            <MaterialCommunityIcons 
                                name={'map-marker'} size={20} color={'#6F6E6E'} 
                            />

                            <Text style={styles.data}>                            
                                {props.address}, {props.locality} ({props.state})
                            </Text>

                        </View>

                        <View style={{flexDirection: 'row', 
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}>
                            <MaterialCommunityIcons 
                                name={'phone'} size={20} color={'#6F6E6E'} />
                            <Text style={styles.data}> {props.phone}</Text>
                        </View>
 
                    </View>
                    
                </View>
            </TouchableOpacity>
        </Card>
        

    );
};

const styles = StyleSheet.create({
    busRow: {
        flexDirection: 'column'
    },
    busItem: {
        height: 300,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
        borderBottomColor: 'red',
        borderBottomWidth: 1,
    },
    item: {
        height: 300,
        margin: 20,
        borderRadius: 10,
        elevation: 7,
        overflow: Platform.OS == 'android' && Platform.Version >= 21 
            ? 'hidden' 
            : 'visible',
        
    },
    busHeader: {
        borderBottomColor: 'yellow',
        borderBottomWidth: 2,
        overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    busDetail: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '15%'
    },
    bgImage: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end'
    },
    title: {

        fontSize: 20,
        color: 'black',
        paddingVertical: 5,
        
        textAlign: 'left'
    },
    data: {
        paddingLeft: 8,
        fontSize: 15
    }
});

export default EmbassyItem;