import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, Image, Modal, TextInput, TouchableOpacity } from 'react-native';
import COLORS from '../constants/Colors';
import URL from '../constants/Url';
import {getI18n} from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BusinessNewsItem = (props) => {
    console.log(props.post.creationdate);
    console.log(props.post.title);
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={() => {
                    props.navigation.navigate({routeName: 'PostPage', params: {
                        item: props.post,
                        from: props.post.id
                    }});
                }}>
                <Text style={styles.title}>{props.post.title}</Text>
            </TouchableOpacity>
   
            
            <Text style={styles.date}>{props.post.creationdate}</Text>
  

        </View>
    )


}

const styles = StyleSheet.create({
    row: {
        height: 45,
        marginVertical: 7,
        
    },
    title: {
        
        fontSize: 20,
        fontWeight: 'bold',
        color: '#780006',
    },
    date: {
        color: '#000000'
    }
});

export default BusinessNewsItem;