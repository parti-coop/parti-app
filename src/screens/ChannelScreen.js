import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Image,
  ScrollView,
  TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Root, Content, Text, ActionSheet,
  Button, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import HTML from 'react-native-render-html';

import { uiStartLoading, uiStopLoading,
  homeSelectGroup, homeSelectChannel,
  channelClearAll } from '../store/actions';
import { authSignOut, channelLoadMorePostsRequested } from '../store/effects';
import requiredCurrentUser from '../components/requiredCurrentUser';
import ChannelListHorizontal from '../components/ChannelListHorizontal';
import { goToHomeRootGroup, goToHomeRootChannel, NAV_ID_HOME_CONTAINER } from './routes';
import { homeGroupsSelector } from '../store/selectors/home';
import { loadedIconsMap } from '../lib/AppIcons';
import commonStyles from '../styles/common';

const ACTION_SHEET_INDEX_SIGN_OUT = 0;
const BUTTON_ID_CURRENT_USER = 'currentUserButton';
const BUTTON_ID_DRAWER_MENU = 'drawerMenuButton';

class ChannelScreen extends Component {
  state = {
    activeActionSheet: false,
    currentChannel: null,
  };

  setNavigationOptions = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: this.props.selectedChannel?.title
        },
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
            if(buttonIndex === ACTION_SHEET_INDEX_SIGN_OUT) {
              this.props.onSignOut();
            }
          }
        )
      );
    } else if(event.buttonId === BUTTON_ID_DRAWER_MENU) {
      Navigation.mergeOptions(NAV_ID_HOME_CONTAINER, {
        sideMenu: {
          left: {
            visible: !this.props.homeActiveDrawer,
          }
        }
      });
    }
  };

  // onGroupPressedHandler = async (group) => {
  //   await this.props.onSelectGroup(group);
  //   goToHomeRootChannel();
  // };

  // onChannelPressedHanlder = async (group, channel) => {
  //   await this.props.onSelectChannel(group, channel);
  //   goToHomeRootChannel();
  // };

  constructor(props) {
    super(props);

    this.setNavigationOptions();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);

    if(!!this.props.selectedChannel) {
      this.props.onClearAll();
      this.props.onLoadMorePosts(this.props.selectedChannel);
    }
  }

  componentDidMount() {
    this.setState({
      currentChannel: this.props.selectedChannel,
    });
  }

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  renderPost = ({ item: post }) => (
    <Card style={{ borderRadius: 0, marginLeft: 0, marginRight: 0 }}>
      {
        !!post.lastStroked.text && !!post.lastStroked.at &&
        <CardItem style={{ backgroundColor: '#eee', padding: 5 }}>
          <Text>{post.lastStroked.text} {post.lastStroked.at}</Text>
        </CardItem>
      }
      <CardItem header>
        <Left>
          <Thumbnail source={{ uri: post.user.imageUrl }} />
          <Body>
            <Text style={{ fontWeight: 'bold' }}>{post.user.nickname} {post.key}</Text>
            <Text style={{ color: '#aaa' }}>{post.user.nickname}</Text>
          </Body>
        </Left>
        <Right>
          <Icon size={15} name={Platform.select({android: "md-more", ios: "ios-more"})} />
        </Right>
      </CardItem>
      {
        !!post.body && post.body.length > 0 &&
        <CardItem cardBody>
          <Left>
            <HTML html={post.body}
              imagesMaxWidth={Dimensions.get('window').width}
              ignoredStyles={['display', 'width', 'height', 'font-family']}
              containerStyle={{ paddingLeft: 15, paddingRight: 15 }}
            />
          </Left>
        </CardItem>
      }
      <CardItem>
        <Left>
          <Button transparent>
            <Icon size={15} name={Platform.select({android: "md-heart", ios: "ios-heart"})} />
            <Text style={{ marginLeft: 5 }}>공감해요 {post.upvotesCount > 0 && post.upvotesCount}</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent style={{ justifyContent: 'center' }}>
            <Icon size={15} name={Platform.select({android: "md-text", ios: "ios-text"})} />
            <Text style={{ marginLeft: 5 }}>댓글달기 {post.commentsCount > 0 && post.commentsCount}</Text>
          </Button>
        </Body>
        <Right>
          <Button transparent>
            <Icon size={15} name={Platform.select({android: "md-share-alt", ios: "ios-share-alt"})} />
            <Text style={{ marginLeft: 5 }}>공유하기</Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  );

  // renderSectionHeader = ({section: {group}}) => {
  //   console.log('Section GroupID', group.id)
  //   return (<GroupSectionHeader group={group} onGroupPressed={this.onGroupPressedHandler} />);
  // }

  // renderItem = ({item, index, section: {group}}) => {
  //   return (
  //     <View
  //       style={styles.item}
  //       key={item.key}>
  //       {
  //         item.type == "channels" &&
  //           <ChannelListHorizontal
  //             itemType={index}
  //             group={group}
  //             channels={item.channels}
  //             hasChannelsJoinable={item.hasChannelsJoinable}
  //             onPress={this.onChannelPressedHanlder}
  //           />
  //       }
  //       {
  //         item.type == "category" &&
  //           <View>
  //             <View style={{marginTop: 5, paddingTop: 5, paddingBottom: 5, borderBottomColor: '#eee', borderBottomWidth: 1}}>
  //               <Text style={{fontSize: 14, color: '#777'}}>{item.name}</Text>
  //             </View>
  //             <ChannelListHorizontal
  //               itemType={index}
  //               group={group}
  //               channels={item.channels}
  //               hasChannelsJoinable={item.hasChannelsJoinable}
  //               onPress={this.onChannelPressedHanlder}
  //             />
  //           </View>
  //       }
  //     </View>
  //   );
  // }

  render() {
    if(!this.state.currentChannel) {
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

      return (
        <Root>
          <View style={commonStyles.flexCenterContainer}>
            <Text>어서오세요, {this.props.currentUser.nickname}님!</Text>
            <Text>{subWelcome}</Text>
            <Text>오른쪽 상단의 햄버거를 눌러</Text>
            <Text>그룹과 채널을 선택해 주세요.</Text>
          </View>
        </Root>
      );
    }

    return (
      <Content contentContainerStyle={commonStyles.flexContainer}>
        <View style={styles.headerContainer}>
          <Image source={{ url: this.state.currentChannel.logoUrl }} style={{ width: 80, height: 80 }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.currentChannel.title}</Text>
          </View>
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={this.props.posts}
          renderItem={this.renderPost}
        />
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#eee"
  },
});

const mapStateToProps = state => {
  return {
    posts: state.channel.posts,
    currentUser: state.currentUser,
    selectedGroup: state.home.selectedGroup,
    selectedChannel: state.home.selectedChannel,
    homeActiveDrawer: state.ui.homeActiveDrawer,
    //homeGroups: homeGroupsSelector(state),
    // isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onSignOut: () => dispatch(authSignOut()),
    // onSelectGroup: (group) => dispatch(homeSelectGroup(group)),
    // onSelectChannel: (group, channel) => dispatch(homeSelectChannel(group, channel)),
    onClearAll: () => dispatch(channelClearAll()),
    onLoadMorePosts: (channel) => dispatch(channelLoadMorePostsRequested(channel)),
  };
};

export default requiredCurrentUser(connect(mapStateToProps, mapDispatchToProps)(ChannelScreen));
