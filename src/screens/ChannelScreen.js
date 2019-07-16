import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, FlatList, Image, StyleSheet, Platform, Dimensions, ImageBackground
} from 'react-native';
import {
  Root, Text
} from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';

import { channelClearAll } from '../store/actions';
import { authSignOut, channelLoadMorePostsRequested } from '../store/effects';
import requiredCurrentUser from '../components/requiredCurrentUser';
import { loadedIconsMap } from '../lib/AppIcons';
import commonColors from '../styles/colors';
import commonStyles from '../styles/common';
import SmartMoment from '../components/SmartMoment';


const BUTTON_ID_SEARCH = 'BUTTON_ID_SEARCH';
const CARD_PADDING_H = 16;
const CARD_PADDING_V = 12;
const CARD_PADDING_V_LAST_STROKED = 8;

class ChannelScreen extends Component {
  state = {
    currentChannel: null,
  };

  constructor(props) {
    super(props);

    this.setNavigationOptions();
    this.navButtonListener = Navigation.events()
      .registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);

    if (this.props.selectedChannel) {
      this.props.onClearAll();
      this.props.onLoadMorePosts(this.props.selectedChannel);
    }
  }

  componentDidMount() {
    this.setState({
      currentChannel: this.props.selectedChannel,
    }, () => {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            component: {
              passProps: {
                channel: this.state.currentChannel,
              },
            }
          },
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  setNavigationOptions = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          component: {
            name: 'ChannelTopBarTitle',
            alignment: 'fill',
          }
        },
        rightButtons: [
          {
            id: BUTTON_ID_SEARCH,
            icon: loadedIconsMap.search,
            color: commonColors.darkGray,
          }
        ],
      }
    });
  }

  navigationButtonPressedHandler = () => {
    alert('개발 중입니다');
  };

  renderPost = ({ item: post }) => {
    const hasLastStroked = !!post.lastStroked?.text && !!post.lastStroked?.at;

    return (
      <View>
        <View style={itemStyles.divider} />
        <View style={
          [
            itemStyles.container,
            { marginTop: (hasLastStroked ? CARD_PADDING_V_LAST_STROKED : CARD_PADDING_V) }
          ]}
        >
          {
            hasLastStroked
            && (
            <View style={itemStyles.lastStroked}>
              <Text style={itemStyles.lastStrokedTex}>
                {post.lastStroked.text}
                <SmartMoment style={itemStyles.lastStrokedAt}>{post.lastStroked.at}</SmartMoment>
              </Text>
            </View>
            )
          }
          <View style={itemStyles.postMeta}>
            <View style={itemStyles.postMetaLeft}>
              <Image source={{ uri: post.user.imageUrl }} style={itemStyles.postMetaUserImage} />
              <View>
                <Text style={itemStyles.postMetaUserNickname}>{post.user.nickname}</Text>
                <SmartMoment style={itemStyles.postMetaCreatedAt}>{post.createdAt}</SmartMoment>
              </View>
            </View>
            <View>
              <Icon size={15} name={Platform.select({ android: 'md-more', ios: 'ios-more' })} />
            </View>
          </View>
          {
            !!post.body && post.body.length > 0
            && (
              <View>
                <HTML
                  html={post.body}
                  imagesMaxWidth={Dimensions.get('window').width}
                  ignoredStyles={['display', 'width', 'height', 'font-family']}
                  containerStyle={itemStyles.postBodyContainer}
                  baseFontStyle={itemStyles.postBody}
                />
              </View>
            )
          }
          <View style={itemStyles.actionButtons}>
            <View>
              <View style={commonStyles.flexRow}>
                <Icon size={15} color={commonColors.alpha50} name={Platform.select({ android: 'md-heart', ios: 'ios-heart' })} />
                <Text style={itemStyles.actionButton}>
                  공감
                  {
                    post.upvotesCount > 0
                    && <Text style={itemStyles.actionCount}>{post.upvotesCount}</Text>
                  }
                </Text>
              </View>
            </View>
            <View>
              <View style={commonStyles.flexRow}>
                <Icon size={15} color={commonColors.alpha50} name={Platform.select({ android: 'md-text', ios: 'ios-text' })} />
                <Text style={itemStyles.actionButton}>
                  댓글
                  {
                    post.commentsCount > 0
                    && <Text style={itemStyles.actionCount}>{post.commentsCount}</Text>
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderHeader = () => (
    <View style={headerStyles.container}>
      <View style={headerStyles.logoContainer}>
        <ImageBackground
          style={headerStyles.logoBackground}
          resizeMode="cover"
          source={{ url: this.state.currentChannel.logoUrl }}
          blurRadius={30}
        />
        <View style={headerStyles.logoImageContainer}>
          <Image
            source={{ url: this.state.currentChannel.logoUrl }}
            blurRadius={1}
            style={headerStyles.logoImage}
          />
        </View>
      </View>
      <View style={headerStyles.channelMetaContainer}>
        <Text style={headerStyles.groupTitle}>
          {this.state.currentChannel.group.title}
        </Text>
        <Text style={headerStyles.channleTitle}>
          {this.state.currentChannel.title}
        </Text>
        <View style={headerStyles.actionButtons}>
          <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-notifications-outline', ios: 'ios-notifications-outline' })} />
          <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-person-add', ios: 'ios-person-add' })} />
          <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-open', ios: 'ios-open' })} />
        </View>
      </View>
    </View>
  );

  render() {
    if (!this.state.currentChannel) {
      return (
        <View style={noCurrentChannelStyles.container}>
          <Text style={noCurrentChannelStyles.text}>로딩 중...</Text>
        </View>
      );
    }

    return (
      <Root>
        <FlatList
          data={this.props.posts}
          renderItem={this.renderPost}
          ListHeaderComponent={this.renderHeader}
        />
      </Root>
    );
  }
}

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  logoContainer: {
    position: 'relative',
  },
  logoBackground: {
    height: 128,
    width: '100%',
    opacity: 0.6,
  },
  logoImageContainer: {
    position: 'absolute',
    top: 65,
    width: '100%',
    alignItems: 'center',
  },
  logoImage: {
    width: 84,
    height: 84,
    borderRadius: 5
  },
  channelMetaContainer: {
    height: 121,
    marginTop: 25,
    alignItems: 'center',
    marginHorizontal: CARD_PADDING_H,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: commonColors.darkGray,
  },
  channleTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111'
  },
  actionButtons: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 130
  }
});

const itemStyles = StyleSheet.create({
  divider: {
    height: 8,
    backgroundColor: commonColors.alpha10,
  },
  container: {
    paddingBottom: 12,
  },
  lastStroked: {
    fontSize: 14,
    marginBottom: CARD_PADDING_V_LAST_STROKED,
    marginHorizontal: CARD_PADDING_H,
    borderRadius: 5,
    backgroundColor: commonColors.lightGray,
    padding: CARD_PADDING_V_LAST_STROKED,
  },
  lastStrokedTex: {
    color: commonColors.darkGray,
  },
  lastStrokedAt: {
    marginLeft: 4,
    color: commonColors.darkGray,
  },
  postMeta: {
    marginBottom: 8,
    marginHorizontal: CARD_PADDING_H,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  postMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMetaUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8
  },
  postMetaUserNickname: {
    fontWeight: '600',
    fontSize: 16,
  },
  postMetaCreatedAt: {
    color: commonColors.alpha34,
    fontSize: 14
  },
  postBodyContainer: {
    paddingLeft: CARD_PADDING_H,
    paddingRight: CARD_PADDING_H
  },
  postBody: {
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 8,
    marginHorizontal: CARD_PADDING_H,
    flexDirection: 'row'
  },
  actionButton: {
    marginLeft: 5,
    marginRight: 15,
    color: commonColors.alpha50,
  },
  actionCount: {
    marginLeft: 8,
    color: commonColors.alpha50,
  },
});

const noCurrentChannelStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    margin: 30
  }
});

const mapStateToProps = state => ({
  posts: state.channel.posts,
  currentUser: state.currentUser,
  selectedGroup: state.home.selectedGroup,
  selectedChannel: state.home.selectedChannel,
  homeActiveDrawer: state.ui.homeActiveDrawer,
});

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(authSignOut()),
  onClearAll: () => dispatch(channelClearAll()),
  onLoadMorePosts: channel => dispatch(channelLoadMorePostsRequested(channel)),
});

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(ChannelScreen));
