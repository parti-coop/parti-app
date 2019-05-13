import React, { Component } from 'react';
import { connect } from "react-redux";
import { Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Form, Item } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { selectSignUpTabOnAuth } from '../../screens/routes';
import { tryToSignIn } from "../../store/actions/index";
import BasicInput from "../../components/BasicInput";

class SignInScreen extends Component {
  state = {
    controls: {
      email: {
        value: ""
      },
      password: {
        value: ""
      }
    }
  };

  goToSignUpHandler = () => {
    selectSignUpTabOnAuth();
  }

  tryToSignInHandler = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.onTryToSignIn(authData);
  }

  updateInputState = (key, value) => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          [key]: {
            ...prevState.controls[key],
            value: value
          }
        }
      };
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Form style={styles.signInForm}>
          <Item>
            <BasicInput
              placeholder="이메일"
              keyboardType="email-address"
              value={this.state.controls.email.value}
              onChangeText={val => this.updateInputState("email", val)}/>
          </Item>
          <Item>
            <BasicInput
              placeholder="비밀번호"
              value={this.state.controls.password.value}
              onChangeText={val => this.updateInputState("password", val)}
              secureTextEntry/>
          </Item>
          <View style={styles.signInControlContainer}>
            { this.props.isLoading ?
              (
                <ActivityIndicator style={styles.signInIndicator} />
              )
              :
              (
                <Button primary style={styles.signInButton}
                  onPress={this.tryToSignInHandler}>
                  <Text style={styles.signInButtonText}>로그인</Text>
                </Button>
              )
            }
          </View>
        </Form>
        <Button transparent dark
          style={{ alignSelf: 'center' }}
          onPress={this.goToSignUpHandler}>
            <Text>처음 오셨습니까? </Text>
            <Text style={{ fontWeight: 'bold' }}>가입하기</Text>
            <Icon
              size={15}
              name={Platform.select({android: "md-arrow-round-forward", iso: "ios-arrow-round-forward"})}
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
  },
  signInForm: {
    width: '80%'
  },
  signInControlContainer: {
    width: '50%',
    marginTop: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  signInButton: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  signInIndicator: {
    height: 45,
  },
  signInButtonText: {
    color: 'white'
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryToSignIn: (authData) => dispatch(tryToSignIn(authData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
