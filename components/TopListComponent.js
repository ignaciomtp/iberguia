import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {getI18n} from '../i18n';

const TopListComponent = props => {
    return(
        <View style={styles.container}>
            <View style={{flex:1,alignContent:'flex-start',width:100}}>
                <Text style={{color: props.color, 
                            fontSize: props.fontSize, 
                            fontWeight: 'bold'}}>{props.title}</Text>
            </View>
            <View style={{ alignContent:'flex-end'}}>
                <TouchableOpacity onPress={props.action}>
                    <Text>{getI18n().t('ver_todos')} ></Text>
                </TouchableOpacity>
                
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignContent:'space-around',
        padding:15
    }
});

export default TopListComponent;