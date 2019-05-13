import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, StyleSheet, Platform } from 'react-native';
import { Root, Content, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { authLogout } from '../store/actions/index';

const ACTION_SHEET_INDEX_SIGN_OUT = 0;
const BUTTON_ID_CURRENT_USER = 'currentUserButton';

class HomeScreen extends Component {
  setupTopBar = async () => {
    try {
      const currentUserIcon = await Icon.getImageSource(Platform.select({ android: "md-person", ios: "ios-person"}), 30);
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          leftButtons: [],
          rightButtons: [
            {
              id: BUTTON_ID_CURRENT_USER,
              icon: currentUserIcon,
            }
          ],
        }
      });
    } catch(err) {
      console.log('현재 사용자 상세 메뉴 오류');
      console.log(err);
    }
  }

  navigationButtonPressedHandler = (event) => {
    if(event.buttonId == BUTTON_ID_CURRENT_USER) {
      ActionSheet.show(
        {
          options: ["로그아웃", "취소"],
          cancelButtonIndex: 1,
          title: "회원 상세"
        },
        buttonIndex => {
          if(buttonIndex == ACTION_SHEET_INDEX_SIGN_OUT) {
            this.props.onLogout();
          }
        }
      );
    }
  };

  constructor(props) {
    super(props);

    this.setupTopBar();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
  }

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  render() {
    return (
      <Root>
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.help}>
            홈 화면
          </Text>
        </Content>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  help: {
    fontSize: 24,
    textAlign: 'center',
  }
});


const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogout())
  };
};

export default connect(null, mapDispatchToProps)(HomeScreen);
