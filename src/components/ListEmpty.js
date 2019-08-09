import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Platform
} from 'react-native';

import commonColors from '../styles/colors';

const { height, width } = Dimensions.get('window');
const isLandscape = width > height;
const appBarHeight = (Platform.select({ ios: (isLandscape ? 32 : 44), android: 56 }));
const SCREEN_HEIGHT = (isLandscape ? width : height) - appBarHeight;

class ListEmpty extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{this.props.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: SCREEN_HEIGHT / 2,
  },
  message: {
    color: commonColors.darkGray,
    textAlign: 'center',
  },
});

export default ListEmpty;
