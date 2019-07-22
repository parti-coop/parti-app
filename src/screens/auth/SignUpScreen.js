import React, { Component } from 'react';
import {
  Platform, View, Text, StyleSheet
} from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import { goToAuthRootSignIn } from '../routes';

class SignUpScreen extends Component {
  goToSignInHandler = () => {
    goToAuthRootSignIn();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>(준비 중)</Text>
        <Button
          transparent
          dark
          style={{ alignSelf: 'center' }}
          onPress={this.goToSignInHandler}
        >
          <Text>이미 가입하셨나요? </Text>
          <Text style={{ fontWeight: 'bold' }}>로그인하기</Text>
          <Icon
            size={15}
            name={Platform.select({ android: 'md-arrow-round-forward', ios: 'ios-arrow-round-forward' })}
          />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SignUpScreen;
