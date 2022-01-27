import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showIcon } from '../constants/Helpers';

const ListButton = props => {
    return (
        <TouchableOpacity style={styles.gridItem} onPress={props.onSelect}>
            <View style={{...styles.container, ...{backgroundColor: props.buttonColor || '#fff'}}}>
                <MaterialCommunityIcons name={props.image ? props.image : showIcon(props.id)} size={20} color={props.colorIcon} />
                <Text style={{...styles.title, ...{color: props.textColor}}} 
                numberOfLines={2}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 5,
        height: 60
    },
    container: {
        flex: 1,
        borderRadius: 15,        
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {

        fontSize: 16,
        textAlign: 'center'
    }
});

export default ListButton;

