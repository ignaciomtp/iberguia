import React from 'react';
import { Platform } from 'react-native';
import {  createSwitchNavigator,
      createAppContainer, 
      createSwitchNavigator  } from 'react-navigation';
      import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';


import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotScreen from '../screens/ForgotScreen';
import SplashScreen from '../screens/SplashScreen';
import PostDetails from '../screens/news/PostDetails';
import NewsListScreen from '../screens/news/NewsListScreen';
import DirectoryListScreen from '../screens/directory/DirectoryListScreen';
import BusinessScreen from '../screens/directory/BusinessScreen';
import EmbassyListScreen from '../screens/EmbassyListScreen';
import ActivityScreen from '../screens/directory/ActivityScreen';
import MapScreen from '../screens/MapScreen';

class Hidden extends React.Component {
  render() {
    return null;
  }
};

const RegStack = createSwitchNavigator({ Register: RegisterScreen });
const LogStack = createSwitchNavigator({ Login: LoginScreen});
const ForgotStack = createSwitchNavigator({ Forgot: ForgotScreen });
const SplashStack = createSwitchNavigator({Splash: SplashScreen});


export default createAppContainer(createSwitchNavigator(
  {
    Home: HomeScreen,
    Register: RegStack,
    Login: LogStack,
    Forgot: ForgotStack,
    Splash: SplashStack,
    
  },
  {
    initialRouteName: 'Home',
  }
));


