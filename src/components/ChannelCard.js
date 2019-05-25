import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ChannelCard = props => (
  <TouchableOpacity onPress={() => {
    props.onPress(props.channel)}
  }>
    <View style={[{ width: 80, height: 110 }, props.style]}>
      <Image source={{ url: props.channel.imageUrl }} style={{ width: 80, height: 80 }} />
      <Text numberOfLines={2} style={{ marginTop: 4, textAlign: 'center' }}>{ props.channel.title }</Text>
    </View>
  </TouchableOpacity>
);

export default ChannelCard;
