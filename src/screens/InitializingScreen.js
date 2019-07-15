import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { persistStore as persistStoreRaw } from 'redux-persist';

import { authAutoSignIn } from '../store/effects';

class InitializingScreen extends Component {
  static options() {
    return {
      _statusBar: {
        backgroundColor: 'transparent',
        style: 'dark',
        drawBehind: true
      }
    };
  }

  componentDidMount() {
    this.persistStore(this.props.store).then(() => {
      this.props.onAutoSignIn();
    });
  }

  /**
   * Wait till our store is persisted
   * @param {store} storeToPersist - The redux store to persist
   * @returns {Promise} - Promise that resolves when the store is rehydrated
   */
  persistStore = storeToPersist => new Promise((resolve) => {
    persistStoreRaw(storeToPersist, undefined, () => {
      resolve();
    });
  });

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.slogan}>로딩 중...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slogan: {
    fontSize: 24,
    textAlign: 'center',
    margin: 30
  }
});

const mapDispatchToProps = dispatch => ({
  onAutoSignIn: () => dispatch(authAutoSignIn())
});

export default connect(null, mapDispatchToProps)(InitializingScreen);
