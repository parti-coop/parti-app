import React, { PureComponent } from 'react';
import {
  View, Image, Text, TouchableOpacity
} from 'react-native';

class HomeChannelLine extends PureComponent {
  channelPressedHandler = () => this.props.onChannelPressed(this.props.channel);

  render() {
    return (
      <TouchableOpacity onPress={this.channelPressedHandler} >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <Image
            source={{ url: this.props.channel.logoUrl }}
            style={{ width: 36, height: 36, marginRight: 8, borderRadius: 5 }}
          />
          <Text style={{ flex: 1, fontSize: 16 }}>{this.props.channel.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default HomeChannelLine;
