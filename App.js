import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Navigation } from "react-native-navigation";

import { goToInitialize } from './src/screens/routes';

export default () =>
  Navigation.events().registerAppLaunchedListener(() => goToInitialize());
