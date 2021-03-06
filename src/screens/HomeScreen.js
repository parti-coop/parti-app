import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, SectionList, StyleSheet, Platform
} from 'react-native';
import Display from 'react-native-display';
import { Root, Text, ActionSheet } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder';

import { homeLoadGroupsRequested } from '../store/effects';
import { authSignOut } from '../store/actions';
import requiredCurrentUser from '../components/requiredCurrentUser';
import { goToHomeRootChannel } from './routes';
import { homeGroupsSelector } from '../store/selectors/home';
import { loadedIconsMap } from '../lib/AppIcons';
import commonColors from '../styles/colors';
import commonDimensions from '../styles/dimensions';
import HomeGroupLine from '../components/HomeGroupLine';
import HomeChannelLine from '../components/HomeChannelLine';
import ListEmpty from '../components/ListEmpty';

const BUTTON_ID_LOGO = 'BUTTON_ID_LOGO';
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
        rightButtons: [
          {
            id: BUTTON_ID_MORE,
            icon: loadedIconsMap.more,
            color: commonColors.darkGray,
          },
          {
            id: BUTTON_ID_NOTIFICATIONS,
            icon: loadedIconsMap.notifications,
            color: commonColors.darkGray,
          },
          {
            id: BUTTON_ID_SEARCH,
            icon: loadedIconsMap.search,
            color: commonColors.darkGray,
          },
        ],
        ...Platform.select({
          ios: {
            leftButtons: [
              {
                id: BUTTON_ID_LOGO,
                icon: loadedIconsMap.logo,
                color: commonColors.darkGray,
              }
            ],
          },
          android: {
            background: {
              component: {
                name: 'HomeTopBarBackground',
              }
            }
          }
        }),
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

  channelPressedHanlder = async (group, channel) => {
    goToHomeRootChannel(channel);
  };

  renderSectionHeader = ({ section: { group } }) => {
    const isExpanded = this.state.expandedGroupIds.includes(group.id);
    return (
      <View style={styles.sectionHeader} key={group.key}>
        <HomeGroupLine
          group={group}
          onGroupPressed={this.groupPressedHandler}
          isExpanded={isExpanded}
        />
        {
          this.props.isLoading && !this.state.expandedGroupIds.includes(group.id)
          && (
            <View>
              {
                [80, 30].map(placeHolderWidth => (
                  <Placeholder
                    Animation={Fade}
                    Left={props => (
                      <PlaceholderMedia
                        size={commonDimensions.homeChannelLogo}
                        style={props.style}
                      />
                    )}
                    style={styles.sectionPlaceHolder}
                    key={`group-placeholder-${group.key}-${placeHolderWidth}`}
                  >
                    <PlaceholderLine width={placeHolderWidth} />
                  </Placeholder>
                ))
              }
            </View>
          )
        }
      </View>
    );
  }

  renderItem = ({ item, section: { group } }) => {
    const isCategory = Object.prototype.hasOwnProperty.call(item, 'channels');
    const isExpanded = this.state.expandedGroupIds.includes(group.id)
      || (!this.props.isLoading && item.isUnread);

    let content;
    if (isCategory) {
      content = (
        <Text
          style={styles.categoryText}
        >
          {item.name}
        </Text>
      );
    } else {
      content = (
        <HomeChannelLine
          group={group}
          channel={item}
          onChannelPressed={this.channelPressedHanlder}
        />
      );
    }

    return (
      <Display key={item.key} enable={isExpanded} keepAlive style={styles.itemContainer}>
        {content}
      </Display>
    );
  };

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

  renderEmpty = () => {
    if (this.props.isLoading) {
      return (
        <View>
          {
          [].concat(...Array.from({ length: 5 }, () => [80, 30])).map((placeHolderWidth, index) => (
            <Placeholder
              Animation={Fade}
              Left={props => (
                <PlaceholderMedia
                  size={commonDimensions.homeChannelLogo}
                  style={props.style}
                />
              )}
              style={styles.emptyPlaceHolder}
              // eslint-disable-next-line react/no-array-index-key
              key={`epmty-placeholder-${index}`}
            >
              <PlaceholderLine width={placeHolderWidth} />
            </Placeholder>
          ))
        }
        </View>
      );
    }

    return (
      <ListEmpty message="아직 가입한 그룹이 없습니다" />
    );
  };

  render() {
    return (
      <Root>
        <SectionList
          sections={this.props.homeGroups}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmpty}
          extraData={[this.state.expandedGroupIds, this.props.isLoading]}
        />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  sectionPlaceHolder: {
    marginTop: 10,
    alignItems: 'center',
  },
  emptyPlaceHolder: {
    marginTop: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
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
  itemContainer: {
    paddingHorizontal: 16,
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
  isLoading: state.home.isLoading,
});

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(authSignOut()),
  onLoadGroups: () => dispatch(homeLoadGroupsRequested()),
});

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(HomeScreen));
