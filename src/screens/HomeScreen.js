import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Image,
  ScrollView, SectionList,
  TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Root, Content, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';

import { uiStartLoading, uiStopLoading, homeSelectGroup, homeSelectChannel } from '../store/actions';
import { authSignOut, homeLoadGroupsRequested } from '../store/effects';
import requiredCurrentUser from '../components/requiredCurrentUser';
import ChannelListHorizontal from '../components/ChannelListHorizontal';
import GroupSectionHeader from '../components/GroupSectionHeader';
import { goToHomeRootGroup, goToHomeRootChannel } from './routes';
import { homeGroupsSelector } from '../store/selectors/home';
import { loadedIconsMap } from '../lib/AppIcons';

const ACTION_SHEET_INDEX_SIGN_OUT = 0;
const BUTTON_ID_CURRENT_USER = 'currentUserButton';
const BUTTON_ID_DRAWER_MENU = 'drawerMenuButton';

class HomeScreen extends Component {
  state = {
    activeActionSheet: false,
    activeDrawer: false,
  };

  setNavigationOptions = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        leftButtons: [
          {
            id: BUTTON_ID_DRAWER_MENU,
            icon: loadedIconsMap.drawerMenu,
          }
        ],
        rightButtons: [
          {
            id: BUTTON_ID_CURRENT_USER,
            icon: loadedIconsMap.currentUser,
          }
        ],
      }
    });
  }

  navigationButtonPressedHandler = (event) => {
    if(event.buttonId === BUTTON_ID_CURRENT_USER) {
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
            this.setState({ activeActionSheet: false });
            if(buttonIndex == ACTION_SHEET_INDEX_SIGN_OUT) {
              this.props.onSignOut();
            }
          }
        )
      );
    } else if(event.buttonId === BUTTON_ID_DRAWER_MENU) {
      this.setState(prevState => {
        return {
          activeDrawer: !prevState.activeDrawer
        }
      });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: this.state.activeDrawer,
          }
        }
      })
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

    this.setNavigationOptions();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
    this.props.onStartLoading();
    this.props.onLoadGroups();
  }

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  renderSectionHeader = ({section: {group}}) => {
    console.log('Section GroupID', group.id)
    return (<GroupSectionHeader group={group} onGroupPressed={this.onGroupPressedHandler} />);
  }

  renderItem = ({item, index, section: {group}}) => {
    return (
      <View
        style={styles.item}
        key={item.key}>
        {
          item.type == "channels" &&
            <ChannelListHorizontal
              itemType={index}
              group={group}
              channels={item.channels}
              hasChannelsJoinable={item.hasChannelsJoinable}
              onPress={this.onChannelPressedHanlder}
            />
        }
        {
          item.type == "category" &&
            <View>
              <View style={{marginTop: 5, paddingTop: 5, paddingBottom: 5, borderBottomColor: '#eee', borderBottomWidth: 1}}>
                <Text style={{fontSize: 14, color: '#777'}}>{item.name}</Text>
              </View>
              <ChannelListHorizontal
                itemType={index}
                group={group}
                channels={item.channels}
                hasChannelsJoinable={item.hasChannelsJoinable}
                onPress={this.onChannelPressedHanlder}
              />
            </View>
        }
      </View>
    );
  }

  render() {
    let loadCompleted = !!this.props.currentUser && this.props.homeGroups?.length > 0;
    if(loadCompleted) {
      setTimeout(() => this.props.onStopLoading(), 2000);
    }

    let newCountTexts = [];
    if(this.props.currentUser.newMessagesCount && this.props.currentUser.newMessagesCount > 0) {
      newCountTexts.push(`새 알림 ${this.props.currentUser.newMessagesCount}개`);
    }
    if(this.props.currentUser.newMentionsCount && this.props.currentUser.newMentionsCount > 0) {
      newCountTexts.push(`새 멘션 ${this.props.currentUser.newMentionsCount}개`);
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

    console.log('render...');
    return (
      <Root>
        <Spinner
          visible={this.props.isLoading}
          textContent={'로딩 중...'}
          textStyle={styles.spinnerTextStyle}
        />
        <SectionList
          initialNumToRender={10}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          sections={this.props.homeGroups}
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
  item: {
    paddingLeft: 10,
    paddingRight: 10
  }
});

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    homeGroups: homeGroupsSelector(state),
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onSignOut: () => dispatch(authSignOut()),
    onStartLoading: () => dispatch(uiStartLoading()),
    onStopLoading: () => dispatch(uiStopLoading()),
    onSelectGroup: (group) => dispatch(homeSelectGroup(group)),
    onSelectChannel: (channel) => dispatch(homeSelectChannel(channel)),
    onLoadGroups: () => dispatch(homeLoadGroupsRequested()),
  };
};

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(HomeScreen));
