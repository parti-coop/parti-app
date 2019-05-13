import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './src/store/configureStore';
import { registerScreens } from './src/screens';
import startApp from './App';

registerScreens(configureStore(), Provider);
startApp();
