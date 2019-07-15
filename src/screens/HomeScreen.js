import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, SectionList, StyleSheet, Platform
} from 'react-native';
import { Root, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { homeSelectChannel } from '../store/actions';
import { authSignOut, homeLoadGroupsRequested } from '../store/effects';
import requiredCurrentUser from '../components/requiredCurrentUser';
import { goToHomeRootChannel } from './routes';
import { homeGroupsSelector } from '../store/selectors/home';
import { loadedIconsMap } from '../lib/AppIcons';
import commonColors from '../styles/colors';
import HomeGroupLine from '../components/HomeGroupLine';
import Category from '../store/models/Category';
import HomeChannelLine from '../components/HomeChannelLine';

const BUTTON_ID_MORE = 'BUTTON_ID_MORE';
const BUTTON_ID_NOTIFICATIONS = 'BUTTON_ID_NOTIFICATIONS';
const BUTTON_ID_SEARCH = 'BUTTON_ID_SEARCH';
const ACTION_SHEET_INDEX_SIGN_OUT = 0;

class HomeScreen extends Component {
  state = {
    activeActionSheet: false,
    expandedGroupIds: [],
  };

  constructor(props) {
    super(props);
    this.props.onLoadGroups();

    this.setNavigationOptions();
    this.navButtonListener = Navigation.events()
      .registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
  }

  componentWillUnmount() {
    if (this.navButtonListener) { this.navButtonListener.remove(); }
    this.navButtonListener = null;
  }

  setNavigationOptions = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        noBorder: true,
        background: {
          component: {
            name: 'HomeTopBarBackground',
          },
        },
        rightButtons: [
          {
            id: BUTTON_ID_MORE,
            icon: loadedIconsMap.more,
            color: commonColors.toolbarGray,
          },
          {
            id: BUTTON_ID_NOTIFICATIONS,
            icon: loadedIconsMap.notifications,
            color: commonColors.toolbarGray,
          },
          {
            id: BUTTON_ID_SEARCH,
            icon: loadedIconsMap.search,
            color: commonColors.toolbarGray,
          },
        ],
      },
    });
  }

  navigationButtonPressedHandler = (event) => {
    if (event.buttonId === BUTTON_ID_MORE) {
      if (this.state.activeActionSheet) { return; }

      this.setState(
        { activeActionSheet: true },
        ActionSheet.show(
          {
            options: ['로그아웃', '취소'],
            cancelButtonIndex: 1,
            title: '회원 상세'
          },
          (buttonIndex) => {
            this.setState({ activeActionSheet: false });
            if (buttonIndex === ACTION_SHEET_INDEX_SIGN_OUT) {
              const { onSignOut } = this.props;
              onSignOut();
            }
          }
        )
      );
    } else {
      alert('개발 중입니다');
    }
  };

  groupPressedHandler = async (group) => {
    // await this.props.onSelectGroup(group);
    // goToHomeRootGroup(this.props.componentId);
    this.setState((prevState) => {
      let { expandedGroupIds } = prevState;
      if (expandedGroupIds.includes(group.id)) {
        expandedGroupIds = expandedGroupIds.filter(id => id !== group.id);
      } else {
        expandedGroupIds = expandedGroupIds.concat(group.id);
      }

      return {
        expandedGroupIds
      };
    });
  };

  channelPressedHanlder = async (channel) => {
    await this.props.onSelectChannel(channel);
    goToHomeRootChannel(this.props.componentId);
  };

  renderSectionHeader = ({ section: { group } }) => {
    const isExpanded = this.state.expandedGroupIds.includes(group.id);
    return (
      <View style={styles.sectionHeader}>
        <HomeGroupLine
          group={group}
          onGroupPressed={this.groupPressedHandler}
          isExpanded={isExpanded}
        />
      </View>
    );
  }

  renderItem = ({ item, section: { group } }) => {
    const isCategory = Object.prototype.hasOwnProperty.call(item, 'channels');
    const isExpanded = this.state.expandedGroupIds.includes(group.id);

    let content;
    if (isCategory) {
      content = (
        <Text style={styles.categoryText}>
          {item.name}
        </Text>
      );
    } else {
      content = (
        <HomeChannelLine channel={item} onChannelPressed={this.channelPressedHanlder} />
      );
    }
    return (
      <View style={{ marginHorizontal: 16, height: (isExpanded ? null : 0) }}>
        {content}
      </View>
    );
  }

  renderHeader = () => (
    <View style={styles.welcomeContainer}>
      <LinearGradient colors={['#9741be', '#5c00c8']} style={styles.welcomeContainerLinearGradient}>
        <Text style={styles.welcomeLeadText}>
          안녕하세요,
          {this.props.currentUser.nickname}
          님!
        </Text>
        {this.renderSubWelcome()}
      </LinearGradient>
    </View>
  );

  renderSubWelcome = () => {
    const newCountTexts = [];
    if (this.props.currentUser.newMessagesCount && this.props.currentUser.newMessagesCount > 0) {
      newCountTexts.push(`새 알림 ${this.props.currentUser.newMessagesCount}개`);
    }
    if (this.props.currentUser.newMentionsCount && this.props.currentUser.newMentionsCount > 0) {
      newCountTexts.push(`새 멘션 ${this.props.currentUser.newMentionsCount}개`);
    }

    if (newCountTexts.length > 0) {
      return (
        <View style={styles.welcomeCountTextContainer}>
          <Text style={styles.welcomeCountText}>
            {newCountTexts.join(', ')}
            가 있습니다.
          </Text>
          <Text style={styles.welcomeCountLinkText}>
            바로가기
            <Icon size={16} color={styles.welcomeCountLinkText.color} name={Platform.select({ android: 'md-arrow-round-forward', ios: 'ios-arrow-round-forward' })} />
          </Text>
        </View>
      );
    }

    const hours = new Date().getHours();
    const isDayTime = hours > 3 && hours < 15;
    let message;
    if (isDayTime) {
      message = '멋진 하루 보내세요!';
    } else {
      message = '오늘 하루 어떻게 보내셨나요?';
    }

    return (
      <View style={styles.welcomeCountTextContainer}>
        <Text style={styles.welcomeCountText}>
          {message}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <Root>
        <SectionList
          style={styles.sectionList}
          sections={this.props.homeGroups}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListHeaderComponent={this.renderHeader}
          extraData={this.state}
        />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  sectionList: {
  },
  sectionHeader: {
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  welcomeContainer: {
    marginHorizontal: 16,
  },
  welcomeContainerLinearGradient: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  welcomeLeadText: {
    fontSize: 24,
    marginVertical: 8,
    color: 'white',
    fontWeight: '600',
  },
  welcomeCountTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  welcomeCountText: {
    color: 'white',
  },
  welcomeCountLinkText: {
    color: 'white',
  },
  item: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  categoryContainer: {
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    color: '#777',
    paddingTop: 20,
    paddingBottom: 10,
    fontWeight: '600'
  }
});

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  homeGroups: homeGroupsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(authSignOut()),
  // onSelectGroup: group => dispatch(homeSelectGroup(group)),
  onSelectChannel: channel => dispatch(homeSelectChannel(channel)),
  onLoadGroups: () => dispatch(homeLoadGroupsRequested()),
});

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(HomeScreen));
