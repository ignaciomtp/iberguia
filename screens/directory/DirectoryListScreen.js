import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import ListHeader from '../../components/ListHeader';
import ListButton from '../../components/ListButton';
import LogoHeader from '../../components/LogoHeader';
import COLORS from '../../constants/Colors';
import URL from '../../constants/Url';
import {getI18n} from '../../i18n';

const DirectoryListScreen = props => {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState();
    const title = getI18n().t('Directorio');
    const baseUrl = URL.BASE;
    const themeColor = COLORS.directoryColor;

    //const token = props.store.mainStore.token;

    const getActivitiesFromApi = async () => {
        try {
            let response = await fetch(baseUrl + 'api/negocios/category/all', 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
                    }
                }
            );
            let responseJson = await response.json();

            setCategories(responseJson.data);

            setIsFetching(false);

        } catch (error) {
            console.error(error);
        }
    }
   
    if(!categories){
        getActivitiesFromApi();
    }

    const renderButton = (itemData) => {
        return(
            <ListButton 
                title={itemData.item.name} 
                id={itemData.item.id}
                image={itemData.item.image}
                onSelect={() => {
                    
                    props.navigation.navigate({routeName: 'ActivityPage', 
                                               params: {
                                                 title: itemData.item.name,
                                                 id: itemData.item.id
                                               }
                                            });
                }}
                textColor={themeColor}
            />
        );
    };

    return(
        
        <View style={styles.body}>
            <ListHeader titleSection={title} />
            
            { isFetching ?  <View style={styles.content}><ActivityIndicator size="large" 
                                               color={COLORS.directoryColor} 
                            /></View>
                        :
                        
                            <FlatList numColumns={2}
                                data={categories}
                                renderItem={renderButton}
                                keyExtractor={(item, index) => item.id}
                                
                            />      
                        
            }

        </View>
    );
};

DirectoryListScreen.navigationOptions = (navData) => {
    return{
        headerTitle: '',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={this.themeColor}
            
            >
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        ),
        headerRight: () => (
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
        height: '100%',
        
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//export default ListScreen;
export default inject('store')(observer(DirectoryListScreen));