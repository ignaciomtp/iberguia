import React from 'react';
import { Platform, Dimensions, 
Image, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
         import {createStackNavigator} from 'react-navigation-stack';
            import {createBottomTabNavigator} from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import ItemDrawer from '../components/ItemDrawer';
import COLORS from '../constants/Colors';
import EmbassySelectScreen from '../screens/Embassy/EmbassySelectScreen';
import EmbassyMapScreen from '../screens/Embassy/EmbassyMapScreen';
import EmbassyListScreen from '../screens/Embassy/EmbassyListScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import {getI18n} from '../i18n';

const imgurl = "./../assets/images/menu-embassy/";

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

const UserProfileStack = createStackNavigator(
  {
    UserProfile: UserProfileScreen    
  },
);

const EmbassyListStack = createStackNavigator(
  {
    NewsList: EmbassySelectScreen,
    EmbassyListScreen: EmbassyListScreen
  },
  config,
);

EmbassyListStack.navigationOptions = {
  tabBarLabel: getI18n().t('Lista'),
  
  tabBarIcon: ({ focused }) => {
    let icon  = focused ? require(list_focus) : require(list);
    return <Image style={{ width: 28, height: 28 }} source={icon}/>    
  }
};

EmbassyListStack.path = '';

const ContentDraw = createDrawerNavigator({
  NewsList: {
      screen: EmbassyListStack,
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
            weight="bold" 
            nav={navigation} 
            path={"Splash"}></ItemDrawer>
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
                      colorBtn={COLORS.embassyColor}>
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
