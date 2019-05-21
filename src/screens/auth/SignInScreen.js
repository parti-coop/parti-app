import React, { Component } from 'react';
import { connect } from "react-redux";
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import Spinner from 'react-native-loading-spinner-overlay';

import { goToAuthRootEmailSignIn, goToAuthRootSignUp } from '../../screens/routes';
import BasicInput from "../../components/BasicInput";
import { authSignIn } from "../../store/actions/index";

class SignInScreen extends Component {
  goToSignUpHandler = () => {
    goToAuthRootSignUp();
  }

  goToEmailSignInHandler = () => {
    goToAuthRootEmailSign(this.props.componentId);
  }

  signInHandler = (accessToken) => {
    const authData = {
      provider: 'facebook',
      assertion: accessToken
    };
    this.props.onSignIn(authData);
  }

  facebookSignInHandler = async () => {
    try {
      let result = await LoginManager.logInWithReadPermissions(["email"]);
      if (result.isCancelled) {
        alert('취소했습니다.');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        this.signInHandler(data.accessToken.toString());
      }
    } catch(err) {
      console.log(err);
      alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.props.isLoading}
          textContent={'로딩 중...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.signInControlContainer}>
          <Button primary style={styles.signInButton}
            onPress={this.facebookSignInHandler}>
            <Icon
              size={28}
              color="white"
              name="logo-facebook"
            />
            <Text style={styles.signInButtonText}> 페이스북 로그인</Text>
          </Button>
          <Button primary style={styles.signInButton}
            onPress={this.goToEmailSignInHandler}>
            <Icon
              size={28}
              color="white"
              name={Platform.select({android: "md-mail", ios: "ios-mail"})}
            />
            <Text style={styles.signInButtonText}> 이메일 로그인</Text>
          </Button>
        </View>
        <Button transparent dark
          style={{ alignSelf: 'center' }}
          onPress={this.goToSignUpHandler}>
          <Text>처음 오셨습니까? </Text>
          <Text style={{ fontWeight: 'bold' }}>가입하기</Text>
          <Icon
            size={15}
            name={Platform.select({android: "md-arrow-round-forward", ios: "ios-arrow-round-forward"})}
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
  signInControlContainer: {
    width: '50%',
    marginTop: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  signInButton: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 6
  },
  signInButtonText: {
    color: 'white'
  },
  spinnerTextStyle: {
    color: '#fff'
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignIn: (authData) => dispatch(authSignIn(authData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
