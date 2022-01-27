import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {getI18n} from '../i18n';

const ListHeaderEmb = props => {
    return(
        <View style={styles.header}>


            <View style={styles.titleBox}>
                <Text style={styles.title}>{props.titleSection}</Text>

                <Text>{props.text || getI18n().t('seleccione_tipo_comercio')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#fff',
        marginTop: -10,
        marginBottom: 7,
        paddingBottom: 7
    },
    titleBox: {
        paddingTop: 10,
        paddingHorizontal: 10,
        
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000'
    }
});

export default ListHeaderEmb;