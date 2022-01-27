import React, { Component } from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Button, 
    Share,
    Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';
import { withNavigation } from 'react-navigation';
import {getI18n} from '../i18n';


const EmbassyActions = (props) => {
    let icon4 = props.url ? "web" : "magnify";
    let text4 = props.url ? "Website" : getI18n().t('Buscar');


    const goTo = () => {
        if(props.url){
            Linking.canOpenURL(props.url).then(supported => {
                if (supported) {
                    Linking.openURL(props.url);
                } else {
                    console.log("Don't know how to open URI: " + this.props.url);
                }
            });
        } else {
            props.navigation.navigate({routeName: 'Search'});
        }
    }

    const onShare = () => {
        let msg = getI18n().t('te_recomiendo') + ' \n' + props.name + ' \n';
        msg += props.url + '\n' + props.address + '\n' + props.phone;
        Share.share({
            title: getI18n().t('te_recomiendo'),
            url: props.url,
            message: msg
        }, {
            dialogTitle: getI18n().t('Compartir')
        });
    }


    return(
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {props.go()}}
                >
                    <MaterialCommunityIcons
                        name="compass" 
                        size={30} 
                        color={COLORS.embassyColor}
                    />
                    <Text style={styles.textButton}>{getI18n().t('Ir')}</Text>
                
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {Linking.openURL(`tel:${props.phone}`)}}
                >
                    <MaterialCommunityIcons
                        name="phone" 
                        size={30} 
                        color={COLORS.embassyColor}
                    />
                    <Text style={styles.textButton}>{getI18n().t('Llamar')}</Text>
                
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {Linking.openURL(`mailto:${props.email}`)}}
                >
                    <MaterialCommunityIcons
                        name="email" 
                        size={30} 
                        color={COLORS.embassyColor}
                    />
                    <Text style={styles.textButton}>Email</Text>
                
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        goTo()
                    }}
                >
                    <MaterialCommunityIcons
                        name={icon4}
                        size={30} 
                        color={COLORS.embassyColor}
                    />
                    <Text style={styles.textButton}>{text4}</Text>
                
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: -5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bar: {
        width: '100%',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        width: 60,
        height: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton: {
        fontSize: 12,
        textAlign: 'center',
        color: COLORS.embassyColor
    }
});

export default withNavigation(EmbassyActions);