import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderButton from '../../components/HeaderButton';
import ListHeader from '../../components/ListHeader';
import ListButton from '../../components/ListButton';
import LogoHeader from '../../components/LogoHeader';
import COLORS from '../../constants/Colors';
import URL from '../../constants/Url';
import ImageCarousel from '../../components/ImageCarousel';
import {getI18n} from '../../i18n';

    const title = getI18n().t('Noticias');

   // let themeColor = props.store.mainStore.getThemeColor();

    const themeColor = COLORS.newsColor;

const NewsListScreen = (props) => {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState();
    const baseUrl = URL.BASE;
    

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
                    onSelect={() => {
                        props.navigation.navigate({routeName: 'NewsCategory', 
                                params:{
                                    title: itemData.item.name,
                                    id: itemData.item.id
                                }});
                    }}
                    textColor={themeColor}
                    id={itemData.item.id}
                />
            );        
    };


        return(
            <View style={styles.body}>
                <ListHeader titleSection={title} />
                {
                    isFetching ?  <View style={styles.content}><ActivityIndicator size="large" 
                                               color={COLORS.newsColor} 
                            /></View>
                            : <FlatList numColumns={2}
                                    data={categories}
                                    renderItem={renderButton}
                                    keyExtractor={(item, index) => item.id}
                                />

                }


            </View>
        );

};

NewsListScreen.navigationOptions = (navData) => {
    return{
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={themeColor}
            
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
        height: '100%'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//export default ListScreen;
export default inject('store')(observer(NewsListScreen));