import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';

import {createStackNavigator} from 'react-navigation-stack';
export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainNavigator
  })
);
