import React from 'react';
import {  
      createAppContainer  } from 'react-navigation';
      import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotScreen from '../screens/ForgotScreen';
import SplashScreen from '../screens/SplashScreen';
import PostDetails from '../screens/news/PostDetails';
import BusinessScreen from '../screens/directory/BusinessScreen';
import ActivityScreen from '../screens/directory/ActivityScreen';
import NewsCategoryScreen from '../screens/news/NewsCategoryScreen';
import NewsTabNavigator from './NewsTabNavigator';
import DirectoryTabNavigator from './DirectoryTabNavigator';
import EmbassyTabNavigator from './EmbassyTabNavigator';
import EmbassyMapScreen from '../screens/Embassy/EmbassyMapScreen';
import EmbassyMapDetails from '../screens/Embassy/EmbassyMapDetails';
import EmbassyListScreen from '../screens/Embassy/EmbassyListScreen';
import NewsListScreen from '../screens/news/NewsListScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import UpdateUserProfile from '../screens/UpdateUserProfile';

class Hidden extends React.Component {
  render() {
    return null;
  }
};

const PostDetailsStack = createStackNavigator(
  {PostDetails: PostDetails},
);

const NewsCategoryStack = createStackNavigator(
  {NewsCategoryPage: NewsCategoryScreen}
);

const SplashStack = createStackNavigator(
  {Splash: SplashScreen},
  {
    headerMode: 'none'
  },

);

const NewsListStack = createStackNavigator(
  { News: NewsTabNavigator, 
    PostPage: PostDetailsStack,
    NewsCategory: NewsCategoryStack
    },
  {
    headerMode: 'none'
  },

);

const directoryActivity = createStackNavigator(
  {Activity: ActivityScreen,
  },
);

const directoryBunisses = createStackNavigator(
  {BusPage: BusinessScreen,
  },
);

const DirectoryListStack = createStackNavigator(
  { DirectoryListPage: DirectoryTabNavigator, 
    ActivityPage: directoryActivity,
    BusPage: directoryBunisses,
 },{
  headerMode: 'none'
},

);

const EmbassyListScreenStack = createStackNavigator(
  {
    EmbassyListScreen: EmbassyListScreen
  },
);

const EmbassyMapDetailsStack = createStackNavigator(
  {
    EmbassyMapDetails: EmbassyMapDetails
    
  },
);



const EmbassyListStack = createStackNavigator(
  {
    EmbassyListPage: EmbassyTabNavigator, 
    EmbassyMapDetails: EmbassyMapDetailsStack,
    EmbassyListScreen: EmbassyListScreenStack
  },
  {
    headerMode: 'none'
  },

);

const UserProfileStack = createStackNavigator(
  {
    UserProfile: UserProfileScreen    
  },
);

const UpdateProfileStack = createStackNavigator(
  {
    UpdateProfile: UpdateUserProfile
  }
);

export default createAppContainer(createStackNavigator(
  {
    Home: HomeScreen,
    Register: RegisterScreen,
    Login: LoginScreen,
    Forgot: ForgotScreen,
    List: SplashStack,
    News: NewsListStack,
    Directory: DirectoryListStack,
    Embassy: EmbassyListStack,
    UserProfile: UserProfileStack,
    UpdateProfile: UpdateProfileStack,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  },
  
));