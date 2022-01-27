import React from 'react';
import { Platform, Dimensions, 
Image, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import NewsListScreen from '../screens/news/NewsListScreen';
import NewsMapScreen from '../screens/news/NewsMapScreen';
import NewsCategoryScreen from '../screens/news/NewsCategoryScreen';
import NewsAllCategoriesScreen from '../screens/news/NewsAllCategoriesScreen';
import COLORS from '../constants/Colors';
import ItemDrawer from '../components/ItemDrawer';
import DirectoryListScreen from '../screens/directory/DirectoryListScreen';

import UserProfileScreen from '../screens/UserProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import {getI18n} from '../i18n';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const imgurl = "./../assets/images/menu-news/";

const list = imgurl+'list.png';
const list_focus = imgurl+'list_focus.png';

const Sp = createStackNavigator(
  {
    Ini: SplashScreen
  }
);

const NewsListStack = createStackNavigator(
  {
    NewsList: NewsListScreen,
  },
  config,
);

NewsListStack.navigationOptions = {
  tabBarLabel: getI18n().t('Lista'),
  
  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(list_focus) : require(list);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

NewsListStack.path = '';

const NewsCategoryStack = createStackNavigator(
  {
    NewsCategory: NewsCategoryScreen,
  },
  config,
);


const NewsAllCategoriesStack = createStackNavigator(
  {
    NewsAllCategories: NewsAllCategoriesScreen,
  },
  config,
);

NewsAllCategoriesStack.navigationOptions = {
  tabBarLabel: getI18n().t('ultimas'),
  
  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(list_focus) : require(list);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

NewsAllCategoriesStack.path = '';


const UserProfileStack = createStackNavigator(
  {
    UserProfile: UserProfileScreen    
  },
);

const NewsTabNavigator = createBottomTabNavigator({
  
  NewsAllCategoriesStack,
  NewsListStack,

}, {
    tabBarOptions: {
        activeTintColor: COLORS.newsColor, // active icon color
        inactiveTintColor: COLORS.newsColor,  // inactive icon color
        style: {
            backgroundColor: '#FFF',
            height: 60,
            borderTopWidth: 1,
            borderTopColor: COLORS.newsColor,
            color: COLORS.newsColor,
            paddingTop: 7,
            paddingBottom: 5
        },
        labelStyle: {
          fontSize: 12
        }
    }
  });

NewsTabNavigator.path = '';

const ContentDraw = createDrawerNavigator({
  Latest: {
      screen: NewsTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer 
              icon="format-list-bulleted"
              label={getI18n().t('ultimas')}
              nav={navigation} 
              path={"NewsList"}>
            </ItemDrawer>
          </View>
      }
    }
  },
  NewsList: {
      screen: NewsTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer 
              icon="format-list-bulleted"
              label={getI18n().t('Lista')} 
              nav={navigation} 
              path={"NewsList"}>
            </ItemDrawer>
          </View>
      }
    }
  },

  Inicio: {
    screen: Sp,
    navigationOptions: ({navigation})=>{
      return{
        drawerLabel:
        <View style={styles.itemHome}>
          <ItemDrawer 
            profile={false} 
            icon="home"
            label={getI18n().t('Inicio')} 
            weight="bold" nav={navigation} 
            path={"Splash"}>
          </ItemDrawer>
        </View>
      }
    }
  },
  Profile: {
    screen: UserProfileStack,
    navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={{width: '100%',

                height: Dimensions.get('window').height * 0.4,
                flexDirection: 'column',
                
                justifyContent: 'space-between'}}>

            <View style={{alignItems: 'center', }}>
              <ItemDrawer profile={true} 
                        label={getI18n().t('perfil_usuario')} 
                        color="#FFF" 
                        icon="account"
                        colorIcon="#fff"
                        align="center"
                        weight="bold"
                        nav={navigation} 
                        path={"Profile"} 
                        colorBtn={COLORS.newsColor}>
              </ItemDrawer>
            </View>

            <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                <ItemDrawer profile={true} 
                        icon="logout"
                        label=" Logout "
                        colorBtn="#242B3A"
                        align="center"
                        colorIcon="#fff"
                        weight="bold"
                        color="#FFF" 
                        nav={navigation} 
                >

                </ItemDrawer>
            </View>
          </View>
        }
              
    }    
  }
},

{
contentOptions: {
    activeTintColor: '#000',

}
});

const styles = StyleSheet.create({
    item: {
      width: '100%',
      paddingLeft: 7,
    },
    itemHome: {
      width: '100%',
      paddingVertical: 7,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 15,
      paddingLeft: 5
    }
});

export default ContentDraw;