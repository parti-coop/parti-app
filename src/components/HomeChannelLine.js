import React, { PureComponent } from 'react';
import {
  View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';

const LOGO_SIZE = 36;

class HomeChannelLine extends PureComponent {
  channelPressedHandler = () => this.props.onChannelPressed(this.props.channel);

  render() {
    const logoHeight = this.props.isExpanded ? LOGO_SIZE : 0;
    return (
      <TouchableOpacity onPress={this.channelPressedHandler}>
        <View style={styles.container}>
          <Image
            source={{ url: this.props.channel.logoUrl }}
            style={[styles.logo, { height: logoHeight }]}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.channel.title}</Text>
            {
              this.props.channel.isUnread
              && <View style={styles.newBadge}><Text style={styles.newBadgeText}>N</Text></View>
            }
          </View>
        </View>
      </TouchableOpacity>
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
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginRight: 8,
    borderRadius: 5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
  },
  newBadge: {
    width: 16,
    height: 16,
    marginLeft: 4,
    borderRadius: 14,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'white',
  },
});

export default HomeChannelLine;
