import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Image
} from 'react-native';
import { loadedIconsMap } from '../lib/AppIcons';

class HomeTopBarBackgroundScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image source={loadedIconsMap.logo} style={styles.logo} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 24,
    marginLeft: 16,
  },
});

export default HomeTopBarBackgroundScreen;
