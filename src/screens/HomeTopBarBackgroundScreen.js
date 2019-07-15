import React, { PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import commonColors from '../styles/colors';

class HomeTopBarBackgroundScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoGroups}>GROUPS.</Text>
          <Text style={styles.logoParti}>PARTI</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 18,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoParti: {
    fontSize: 18,
    color: commonColors.toolbarGray,
  },
  logoGroups: {
    fontSize: 24,
    color: commonColors.toolbarGray,
  },
});

export default HomeTopBarBackgroundScreen;
