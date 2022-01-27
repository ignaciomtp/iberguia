import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ListHeader from '../../components/ListHeader';
import { ASSEMBLY_SPAIN } from '../../data/dummy-data';
import { ASSEMBLY_PORTUGAL } from '../../data/dummy-data';
import ListButton2 from '../../components/ListButton2';
import LogoHeader from '../../components/LogoHeader';
import COLORS from '../../constants/Colors';
import HeaderButton from '../../components/HeaderButton';
import {getI18n} from '../../i18n';

const EmbassySelectScreen = props => {

    const title = getI18n().t('Embajadas');

    const themeColor = COLORS.embassyColor;
   
    const renderButton = (itemData) => {
        return(
            <ListButton2 
                title={itemData.item.title} 
                onSelect={() => {
                    props.navigation.navigate('EmbassyListScreen');
                }}
                textColor={themeColor}
            />
        );
    };

    return(
        <View style={styles.body}>
            <ListHeader titleSection={title} text={getI18n().t('seleccione_embajada')} />

            <View style={{flex:1}}>

                <Image
                style={{resizeMode: 'contain', flex:2, width:'100%'}}
                source={require('../../assets/images/esp.png')}
                />

                <View style={{flexDirection: 'row'}}>
                    <ListButton2 
                        title={getI18n().t('Embajada')}
                        onSelect={() => {
                            props.navigation.navigate({routeName: 'EmbassyListScreen', 
                                                        params: {
                                                            country: 'ES',
                                                            type: 1,    
                            }});
                        }}
                        buttonColor='#fff'
                        textColor='#000'
                    />

                    <ListButton2 
                        title={getI18n().t('Consulado')}
                        onSelect={() => {
                            props.navigation.navigate({routeName: 'EmbassyListScreen', 
                                                        params: {
                                                            country: 'ES',
                                                            type: 0,    
                            }});
                        }}
                        buttonColor='#fff'
                        textColor='#000'
                    />
                </View>


            </View>

            <View style={{flex:1}}>

                <Image
                style={{resizeMode: 'contain', flex:2, width:'100%'}}
                source={require('../../assets/images/portugal.png')}
                />

                <View style={{flexDirection: 'row'}}>
                    <ListButton2 
                        title={getI18n().t('Embajada')}
                        onSelect={() => {
                            props.navigation.navigate({routeName: 'EmbassyListScreen', 
                                                        params: {
                                                            country: 'PT',
                                                            type: 1,    
                            }});
                        }}
                        buttonColor='#fff'
                        textColor='#000'
                    />

                    <ListButton2 
                        title={getI18n().t('Consulado')}
                        onSelect={() => {
                            props.navigation.navigate({routeName: 'EmbassyListScreen', 
                                                        params: {
                                                            country: 'PT',
                                                            type: 0,    
                            }});
                        }}
                        buttonColor='#fff'
                        textColor='#000'
                    />
                </View>


            </View>

        </View>
    );
};

EmbassySelectScreen.navigationOptions = (navData) => {
    return{
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={this.themeColor}
            
            >
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        ),
        headerRight: (
            <TouchableOpacity onPress={() =>{
                  navData.navigation.navigate('Splash');  
                }
            }>
            <LogoHeader />
          </TouchableOpacity>
        )
    };
    
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        flex:1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//export default ListScreen;
export default inject('store')(observer(EmbassySelectScreen));