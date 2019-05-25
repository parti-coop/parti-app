import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Content, Button, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

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
          renderItem={({item}) => (
            <Card style={{ borderRadius: 0, marginLeft: 0, marginRight: 0 }}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: 'Image URL'}} />
                  <Body>
                    <Text>{item.id}</Text>
                    <Text note>{item.body}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent>
                    <Icon active name="thumbs-up" />
                    <Text>12 Likes</Text>
                  </Button>
                </Left>
                <Body>
                  <Button transparent>
                    <Icon active name="chatbubbles" />
                    <Text>4 Comments</Text>
                  </Button>
                </Body>
                <Right>
                  <Text>11h ago</Text>
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
