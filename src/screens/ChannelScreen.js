import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Content, Button, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import HTML from 'react-native-render-html';

import { channelLoadPostsRequested } from '../store/effects';
import { channelResetError } from '../store/actions';


class ChannelScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: true,
        hideOnScroll: true,
        animate: false
      }
    };
  }

  setupTopBar = async () => {
    try {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: this.props.channel?.title
          }
        }
      });
    } catch(err) {
      console.log('ChannelScreen 메뉴 오류');
      console.log(err);
    }
  }

  navigationButtonPressedHandler = (event) => {
  };

  constructor(props) {
    super(props);

    if(this.props.channel) {
      this.props.onLoadPosts(this.props.channel);
    }
    this.setupTopBar();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.error && this.props.error) {
      // show the alert
    }
  }

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  render() {
    if(!this.props.channel) {
      return (
        <View style={styles.container}>
          <Text>선택된 채널이 없습니다</Text>
        </View>
      );
    }

    return (
      <Content contentContainerStyle={styles.container}>
        <View style={{ width: '100%', flexDirection: 'row',
        paddingTop: 50, paddingBottom: 50, paddingLeft: 10, paddingRight: 10,
        backgroundColor: "#eee" }}>
          <Image source={{ url: this.props.channel.imageUrl }} style={{ width: 80, height: 80 }} />
          <View style={{ marginLeft: 10 }}>
            <Text>{this.props.channel.group.title}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.props.channel.title}</Text>
          </View>
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={this.props.posts}
          renderItem={({ item: post }) => (
            <Card style={{ borderRadius: 0, marginLeft: 0, marginRight: 0 }}>
              { !!post.lastStroked.text && !!post.lastStroked.at &&
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
              <CardItem cardBody>
                <Left>
                  <HTML html={post.body}
                    imagesMaxWidth={Dimensions.get('window').width}
                    ignoredStyles={['display', 'width', 'height', 'font-family']}
                    containerStyle={{ paddingLeft: 15, paddingRight: 15 }}
                  />
                </Left>
              </CardItem>
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
          )}
        />
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
});

const mapStateToProps = state => {
  return {
    channel: state.home.selectedChannel,
    posts: state.channel.posts,
    error: state.ui.error,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadPosts: (channel) => dispatch(channelLoadPostsRequested(channel)),
    onResetError: (channel) => dispatch(channelResetError())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen);
