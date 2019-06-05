import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Navigation } from "react-native-navigation";

import { loadIcons } from "./src/lib/AppIcons";
import { goToInitialize } from './src/screens/routes';

async function bootstrap(store) {
  await loadIcons();
}

export default (store) => {
  Navigation.events().registerAppLaunchedListener(() => {
    bootstrap(store).then(() => goToInitialize(store));
  });
}
