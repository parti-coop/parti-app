import React, { PureComponent } from 'react';
import {
  View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';

import withPreventDoubleClick from './withPreventDoubleClick';
import commonDimensions from '../styles/dimensions';

class HomeChannelLine extends PureComponent {
  channelPressedHandler = () => this.props.onChannelPressed(this.props.group, this.props.channel);

  render() {
    const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);
    return (
      <TouchableOpacityEx onPress={this.channelPressedHandler}>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={{ uri: this.props.channel.logoXsUrl }}
          />
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { marginRight: (this.props.channel.isUnread ? 55 : 0) }]}
              numberOfLines={1}
            >
              {this.props.channel.title}
            </Text>
            {
              this.props.channel.isUnread
              && (
                <View style={styles.newBadgeContainer}>
                  <Text style={styles.newBadge}>N</Text>
                </View>
              )
            }
          </View>
        </View>
      </TouchableOpacityEx>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logo: {
    width: commonDimensions.homeChannelLogo,
    height: commonDimensions.homeChannelLogo,
    marginRight: 8,
    borderRadius: 5,
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 16,
  },
  newBadgeContainer: {
    position: 'relative',
    right: 45,
    width: 16,
    height: 16,
    borderRadius: 14,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    color: 'white',
    fontWeight: '500',
    fontSize: 11,
  },
});

export default HomeChannelLine;
