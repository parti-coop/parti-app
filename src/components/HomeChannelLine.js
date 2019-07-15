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
          <Text style={styles.title}>{this.props.channel.title}</Text>
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
  title: {
    flex: 1,
    fontSize: 16,
  },
});

export default HomeChannelLine;
