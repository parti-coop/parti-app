import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Navigation } from "react-native-navigation";
import { Provider } from 'react-redux';

import { loadIcons } from "./src/lib/AppIcons";
import { registerScreens } from './src/screens';
import { goToInitialize } from './src/screens/routes';

async function bootstrap(store) {
  registerScreens(store, Provider);
  await loadIcons();
}

export default (store) => {
  Navigation.events().registerAppLaunchedListener(() => {
    bootstrap(store).then(() => goToInitialize(store));
  });
}
