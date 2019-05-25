import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Image,
  ScrollView, SectionList,
  TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Root, Content, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';

import { authSignOut,
  messagesGetNewCounts,
  uiStartLoading,
  uiStopLoading,
  homeSelectGroup,
  homeSelectChannel,
  homeLoadGroups } from '../store/actions/index';
import requireAuth from '../components/requireAuth';
import ChannelListHorizontal from '../components/ChannelListHorizontal';
import { goToHomeRootGroup, goToHomeRootChannel } from './routes';
import { homeGroupsSelector } from '../store/selectors/home';

const ACTION_SHEET_INDEX_SIGN_OUT = 0;
const BUTTON_ID_CURRENT_USER = 'currentUserButton';

class HomeScreen extends Component {
  state = {
    activeActionSheet: false
  };

  setupTopBar = async () => {
    try {
      const currentUserIcon = await Icon.getImageSource(Platform.select({android: "md-person", ios: "ios-person"}), 30);
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
  };

  navigationButtonPressedHandler = (event) => {
    if(event.buttonId == BUTTON_ID_CURRENT_USER) {
      if(this.state.activeActionSheet) {
        return;
      }

      this.setState({ activeActionSheet: true },
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
            this.setState({ activeActionSheet: false });
          }
        )
      );
    }
  };

  onGroupPressedHandler = async (group) => {
    await this.props.onSelectGroup(group);
    goToHomeRootGroup(this.props.componentId);
  };

  onChannelPressedHanlder = async (channel) => {
    await this.props.onSelectChannel(channel);
    goToHomeRootChannel(this.props.componentId);
  };

  constructor(props) {
    super(props);

    this.setupTopBar();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
    this.navComponentDidAppearListener = Navigation.events().registerComponentDidAppearListener(this.componentDidAppearHandler);
    this.props.onStartLoading();
    this.props.onLoadGroups();
  }

  componentDidAppearHandler =  ({componentId, componentName}) => {
    this.props.onMessagesGetNewCounts();
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
    let loadCompleted = !!this.props.currentUser.nickname && this.props.newMessagesCount >= 0 && this.props.newMentionsCount >= 0;
    if(loadCompleted) {
      setTimeout(() => this.props.onStopLoading(), 2000);
    }

    let newCountTexts = [];
    if(this.props.newMessagesCount && this.props.newMessagesCount > 0) {
      newCountTexts.push(`새 알림 ${this.props.newMessagesCount}개`);
    }
    if(this.props.newMentionsCount && this.props.newMentionsCount > 0) {
      newCountTexts.push(`새 멘션 ${this.props.newMentionsCount}개`);
    }

    let subWelcome;
    if(newCountTexts.length > 0) {
      subWelcome = `${newCountTexts.join(", ")}가 있습니다.`
    } else {
      const hours = new Date().getHours();
      const isDayTime = hours > 3 && hours < 15;

      if(isDayTime) {
        subWelcome = "멋진 하루 보내세요!";
      } else {
        subWelcome = "오늘 하루 어떻게 보내셨나요?";
      }
    }

    return (
      <Root>
        <Spinner
          visible={this.props.isLoading}
          textContent={'로딩 중...'}
          textStyle={styles.spinnerTextStyle}
        />
        <SectionList
          ListHeaderComponent={
            loadCompleted && <View style={{alignItems: 'center', paddingTop: 10, paddingBottom: 10}}>
              <Text style={styles.welcome}>
                안녕하세요,
                {this.props.currentUser.nickname}님!
              </Text>
              <Text>{subWelcome}</Text>
            </View>
          }
          renderSectionHeader={({section: {group}}) => (
            <View>
              <TouchableOpacity onPress={() => this.onGroupPressedHandler(group)}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eee', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}}>
                <Text style={{fontWeight: 'bold', paddingTop: 5, paddingBottom: 5}}>{group.title}</Text>
                <Icon size={20} color="#999" name={Platform.select({android: "md-arrow-dropright", ios: "ios-arrow-dropright"})} />
              </View>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({item, index, section: {group}}) => (
            <View
              style={{paddingLeft: 10, paddingRight: 10}}
              key={Math.random().toString(36).substring(2, 15)}>
              {{
                "channels":
                  <ChannelListHorizontal
                    channels={item.channels}
                    hasChannelsJoinable={item.hasChannelsJoinable}
                    onPress={this.onChannelPressedHanlder}
                  />,
                "category":
                  <View>
                    <View style={{marginTop: 5, paddingTop: 5, paddingBottom: 5, borderBottomColor: '#eee', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 14, color: '#777'}}>{item.name}</Text>
                    </View>
                    <ChannelListHorizontal
                      channels={item.channels}
                      hasChannelsJoinable={item.hasChannelsJoinable}
                      onPress={this.onChannelPressedHanlder}
                    />
                  </View>
              }[item.type]}
            </View>
          )}
          sections={this.props.homeGroupsSelector}
          keyExtractor={(item, index) => item.key}
        />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 24
  },
  spinnerTextStyle: {
    color: '#fff'
  },
});

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    homeGroupsSelector: homeGroupsSelector(state),
    newMessagesCount: state.messages.newMessagesCount,
    newMentionsCount: state.messages.newMentionsCount,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onMessagesGetNewCounts: () => dispatch(messagesGetNewCounts()),
    onSignOut: () => dispatch(authSignOut()),
    onStartLoading: () => dispatch(uiStartLoading()),
    onStopLoading: () => dispatch(uiStopLoading()),
    onSelectGroup: (group) => dispatch(homeSelectGroup(group)),
    onSelectChannel: (channel) => dispatch(homeSelectChannel(channel)),
    onLoadGroups: () => dispatch(homeLoadGroups()),
  };
};

export default requireAuth(connect(mapStateToProps, mapDispatchToProps)(HomeScreen));
