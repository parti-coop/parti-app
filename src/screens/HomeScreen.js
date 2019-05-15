import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, StyleSheet, Platform } from 'react-native';
import { Root, Content, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { authSignOut, messagesGetNewCounts } from '../store/actions/index';
import CurrentUserAware from './CurrentUserAware';

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
            this.props.onSignOut();
          }
        }
      );
    }
  };

  constructor(props) {
    super(props);

    this.setupTopBar();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
    this.navComponentDidAppearListener = Navigation.events().registerComponentDidAppearListener(this.componentDidAppearHandler);
  }

  componentDidAppearHandler =  ({ componentId, componentName }) => {
    this.props.onMessageGetNewCounts();
  };

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;

    if(this.navComponentDidAppearListener) {
      this.navComponentDidAppearListener.remove();
    }
    this.navComponentDidAppearListener = null;
  }

  render() {
    let newCounts =  null;

    let newCountTexts = [];
    if(this.props.newMessagesCount && this.props.newMessagesCount > 0) {
      newCountTexts.push(`새 알림 ${this.props.newMessagesCount}개`);
    }
    if(this.props.newMentionsCount && this.props.newMentionsCount > 0) {
      newCountTexts.push(`새 멘션 ${this.props.newMentionsCount}개`);
    }
    if(newCountTexts.length > 0) {
      newCounts = (<Text>
        {newCountTexts.join(", ")}가 있습니다.
      </Text>)
    }
    return (
      <Root>
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.welcome}>
            안녕하세요,
            {this.props.currentUser.nickname}님!
          </Text>
          {newCounts}
        </Content>
        <CurrentUserAware />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
  }
});

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    newMessagesCount: state.messages.newMessagesCount,
    newMentionsCount: state.messages.newMentionsCount
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onMessageGetNewCounts: () => dispatch(messagesGetNewCounts()),
    onSignOut: () => dispatch(authSignOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
