import React, {Component} from 'react';
import { Platform, Image, TouchableOpacity, Dimensions,
 Text, View, StyleSheet } from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation';
  import {createStackNavigator} from 'react-navigation-stack';
    import {createBottomTabNavigator} from 'react-navigation-tabs';

import {createDrawerNavigator} from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import TabBarIcon from '../components/TabBarIcon';
import ItemDrawer from '../components/ItemDrawer';
import DirectoryListScreen from '../screens/directory/DirectoryListScreen';
import MainStore from '../stores/MainStore';
import NewsNearMeScreen from '../screens/directory/NearMeScreen';
import DirectoryFavsScreen from '../screens/directory/FavoritesScreen';
import DirectorySearchScreen from '../screens/directory/DirectorySearchScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import COLORS from '../constants/Colors';
import DirectoryMapScreen from '../screens/directory/DirectoryMapScreen';
import {getI18n} from '../i18n';
import { EventRegister } from 'react-native-event-listeners';

const imgurl = "./../assets/images/menu-directory/";

const list = imgurl+'list.png';
const nearme = imgurl+'nearme.png';
const fav = imgurl+'fav.png';
const search = imgurl+'search.png';
const map = imgurl+'map.png';

const list_focus = imgurl+'list_focus.png';
const nearme_focus = imgurl+'nearme_focus.png';
const fav_focus = imgurl+'fav_focus.png';
const search_focus = imgurl+'search_focus.png';
const map_focus = imgurl+'map_focus.png';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const Sp = createStackNavigator(
  {
    Ini: SplashScreen
  }
);

const DirectoryListStack = createStackNavigator(
  {
    NewsList: DirectoryListScreen,
  },
  config,
);

DirectoryListStack.navigationOptions = {
  tabBarLabel: getI18n().t('Lista'),

  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(list_focus) : require(list);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

DirectoryListStack.path = '';


const NearMeStack = createStackNavigator(
  {
    NearMe: {
      screen: NewsNearMeScreen,
      navigationOptions:{
        headerTitleStyle: {
          fontSize: 14,

        }
      }
    },
  },
  config
);

NearMeStack.navigationOptions = {
  tabBarLabel: getI18n().t('cerca_mi'),

  tabBarIcon: ({ focused }) =>{
    let icon  = focused ? require(nearme_focus) : require(nearme);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

NearMeStack.path = '';

const FavsStack = createStackNavigator(
  {
    Favs: DirectoryFavsScreen,
  },
  config
);

FavsStack.navigationOptions = {
  tabBarLabel: getI18n().t('Favoritos'),

  tabBarOnPress: ({ navigation, defaultHandler }) => {
         EventRegister.emit('myCustomEvent', 'it works!!!');
        defaultHandler()
  },
  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(fav_focus) : require(fav);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

FavsStack.path = '';

const SearchStack = createStackNavigator(
  {
    Search: DirectorySearchScreen,
  },
  config
);

SearchStack.navigationOptions = {
  tabBarLabel: getI18n().t('Buscar'),

  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(search_focus) : require(search);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

SearchStack.path = '';

const UserProfileStack = createStackNavigator(
  {
    UserProfile: UserProfileScreen    
  },
);

const DirectoryTabNavigator = createBottomTabNavigator({
  DirectoryListStack,
  NearMeStack,
  FavsStack,
  SearchStack,
}, {
    tabBarOptions: {
        activeTintColor: COLORS.directoryColor, // active icon color
        inactiveTintColor: COLORS.directoryColor,  // inactive icon color
        style: {
            backgroundColor: '#FFF',
            height: 60,
            borderTopWidth: 1,
            borderTopColor: COLORS.directoryColor,
            color: COLORS.directoryColor,
            paddingTop: 7,
            paddingBottom: 5
        },
        labelStyle: {
          fontSize: 12
        }
    }
  }
);

DirectoryTabNavigator.path = '';



const ContentDraw = createDrawerNavigator({

  NewsList: {
      screen: DirectoryTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer profile={false} 
              icon="format-list-bulleted"
              label={getI18n().t('Lista')} 
              nav={navigation} 
              path={"NewsList"}>
            </ItemDrawer>
          </View>
      }
    }
  },
  NearMe: {
      screen: DirectoryTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer profile={false} 
              icon="compass"
              label={getI18n().t('cerca_mi')} 
              nav={navigation} 
              path={"NearMe"}>
            </ItemDrawer>
          </View>
      }
    }
  },
  Favs: {
      screen: DirectoryTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer profile={false} 
              icon="heart-outline"
              label={getI18n().t('Favoritos')} 
              nav={navigation} 
              path={"Favs"}>
            </ItemDrawer>
          </View>
      }
    }
  },
  Search: {
      screen: DirectoryTabNavigator,
      navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <View style={styles.item}>
            <ItemDrawer profile={false} 
              icon="magnify"
              label={getI18n().t('Buscar')} 
              nav={navigation} 
              path={"Search"}>
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
          <ItemDrawer profile={false} 
            icon="home"
            label={getI18n().t('Inicio')} 
            weight="bold" 
            nav={navigation} 
            path={"Splash"}>
          </ItemDrawer>
        </View>
      }
    }
  },
/*  Route: {
    screen: RouteMapScreen,
    navigationOptions: ({ navigation })=>{
        return{
          drawerLabel: null
        }
              
    }        
  },  */
  Profile: {
    screen: UserProfileStack,
    navigationOptions: ({ navigation })=>{
        return{
          drawerLabel:
          <>
          <View style={{width: '100%',

                height: Dimensions.get('window').height * 0.4,
                flexDirection: 'column',
                
                justifyContent: 'space-between'}}>

            <View style={{alignItems: 'center', }}>
              <ItemDrawer profile={true} 
                          icon="account"
                          colorIcon="#fff"
                          label={getI18n().t('perfil_usuario')} 
                          color="#FFF" 
                          align="center"
                          weight="bold"
                          nav={navigation} 
                          path={"Profile"} 
                          colorBtn={COLORS.directoryColor}>
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


          </>
        }
              
    }    
  },
  

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
