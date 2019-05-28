import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';

import { authAutoSignIn } from "../store/effects";

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
    this.props.onAutoSignIn();
  }

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

const mapDispatchToProps = dispatch => {
  return {
    onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(null, mapDispatchToProps)(InitializingScreen);
