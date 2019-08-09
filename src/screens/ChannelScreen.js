import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, FlatList, Image, StyleSheet, Platform,
  Dimensions, ActivityIndicator
} from 'react-native';
import Display from 'react-native-display';
import {
  Root, Text
} from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';

import { channelPostsSelector } from '../store/selectors/channel';
import { channelLoadMorePostsRequested } from '../store/effects';
import requiredCurrentUser from '../components/requiredCurrentUser';
import { loadedIconsMap } from '../lib/AppIcons';
import commonColors from '../styles/colors';
import commonStyles from '../styles/common';
import SmartMoment from '../components/SmartMoment';
import ListEmpty from '../components/ListEmpty';

const BUTTON_ID_SEARCH = 'BUTTON_ID_SEARCH';
const CARD_PADDING_H = 16;
const CARD_PADDING_V = 12;
const CARD_PADDING_V_LAST_STROKED = 8;

class ChannelScreen extends Component {
  state = {
    isExpandedHeader: false,
  };

  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();

    this.setNavigationOptions();
    this.navButtonListener = Navigation.events()
      .registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
  }

  componentDidMount() {
    if (!this.props.currentChannel) {
      return;
    }
    this.props.onLoadMorePosts(this.props.currentChannel);
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
            passProps: {
              channel: this.props.currentChannel,
              onTitlePressed: this.handleTopBarTitlePressed,
            },
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
    alert('개발 중입니다!!');
  };

  loadMoreData = () => {
    if (this.props.noMoreData) {
      return;
    }
    if (this.props.isLoading) {
      return;
    }
    this.props.onLoadMorePosts(this.props.currentChannel);
  }

  handleTopBarTitlePressed = () => {
    this.flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    this.setState(prevSatate => ({
      isExpandedHeader: !prevSatate.isExpandedHeader
    }));
  }

  handleMomentumScrollBegin = () => {
    this.setState({
      isExpandedHeader: false
    });
  }

  renderFooter = () => {
    if (this.props.isLoading) {
      return (
        <View style={indicatorStyles.container}>
          <ActivityIndicator style={indicatorStyles.indicator} />
        </View>
      );
    }

    return null;
  }

  renderEmpty = () => {
    if (this.props.isLoading || !this.props.noMoreData || this.props.posts?.length > 0) {
      return null;
    }
    return (
      <ListEmpty message="아직 게시글이 없습니다. 가장 먼저 게시글을 등록해 보세요." />
    );
  }

  renderPost = ({ item: post }) => {
    const hasLastStroked = !!post.lastStroked?.text && !!post.lastStroked?.at;

    return (
      <View style={
        [
          itemStyles.container,
          { paddingTop: (hasLastStroked ? CARD_PADDING_V_LAST_STROKED : CARD_PADDING_V) }
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
    );
  }

  renderHeader = () => (
    <Display enable={this.state.isExpandedHeader} keepAlive style={headerStyles.container}>
      <View style={[headerStyles.logoImageContainer, { alignItems: (this.state.isExpandedHeader ? 'center' : 'auto') }]}>
        <Image
          style={headerStyles.logoBackground}
          resizeMode="cover"
          source={{ uri: this.props.currentChannel.logoSmUrl }}
          blurRadius={Platform.select({ ios: 7, android: 5 })}
        />
        <Image
          source={{ uri: this.props.currentChannel.logoMdUrl }}
          style={headerStyles.logoImage}
        />
      </View>
      <View style={headerStyles.channelMetaContainer}>
        <Text style={headerStyles.groupTitle}>
          {this.props.currentChannel.group.title}
        </Text>
        <Text style={headerStyles.channleTitle}>
          {this.props.currentChannel.title}
        </Text>
        {
          this.state.isExpandedHeader
          && (
          <View style={headerStyles.actionButtons}>
            <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-notifications-outline', ios: 'ios-notifications-outline' })} />
            <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-person-add', ios: 'ios-person-add' })} />
            <Icon size={21} color={commonColors.alpha50} name={Platform.select({ android: 'md-open', ios: 'ios-open' })} />
          </View>
          )
        }
      </View>
      <View style={itemStyles.divider} />
    </Display>
  );

  renderSeparator = () => <View style={itemStyles.divider} />;

  render() {
    if (!this.props.currentChannel) {
      return (
        <View style={noCurrentChannelStyles.container}>
          <Text style={noCurrentChannelStyles.text}>채널을 선택해 주세요.</Text>
        </View>
      );
    }

    return (
      <Root>
        <FlatList
          ref={this.flatListRef}
          data={this.props.posts}
          renderItem={this.renderPost}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.renderSeparator}
          onEndReached={this.loadMoreData}
          extraData={[this.props.isLoading, this.state.isExpandedHeader]}
          onEndReachedThreshold={100}
          scrollEventThrottle={16}
          onMomentumScrollBegin={this.handleMomentumScrollBegin}
          contentContainerStyle={listStyles.listContent}
          style={listStyles.list}
        />
      </Root>
    );
  }
}

const listStyles = StyleSheet.create({
  list: {
    backgroundColor: commonColors.alpha10
  },
  listContent: {
    flexGrow: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  logoBackground: {
    height: '100%',
    width: '100%',
    opacity: 0.6,
  },
  logoImageContainer: {
    height: 128,
    width: '100%',
  },
  logoImage: {
    width: 84,
    height: 84,
    borderRadius: 5,
    position: 'absolute',
    bottom: -20,
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
    backgroundColor: 'white',
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

const indicatorStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  indicator: {
    height: 45,
  },
});

const mapStateToProps = (state, props) => ({
  posts: channelPostsSelector(state, props.currentChannel),
  noMoreData: state.channel.noMoreData?.[props.currentChannel?.id],
  isLoading: state.channel.isLoading?.[props.currentChannel?.id],
  currentUser: state.currentUser,
  homeActiveDrawer: state.ui.homeActiveDrawer,
});
const mapDispatchToProps = dispatch => ({
  onLoadMorePosts: channel => dispatch(channelLoadMorePostsRequested(channel)),
});

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(ChannelScreen));
