import React, { memo, PureComponent } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ChannelCard extends PureComponent {
  constructor(props) {
    super(props);
    console.log('constructor ChannelCard channel', this.props.channel.id);
  }

  render() {
    let props = this.props;
    console.log("render ChannelCard ", props.channel.id);
    return (
      <TouchableOpacity onPress={() => {
        props.onPress(props.channel)}
      }>
        <View style={[{ width: 80, height: 110 }, props.style]}>
          <Image source={{ url: props.channel.logoUrl }} style={{ width: 80, height: 80 }} />
          <Text numberOfLines={2} style={{ marginTop: 4, textAlign: 'center' }}>{ props.channel.title }</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ChannelCard;
