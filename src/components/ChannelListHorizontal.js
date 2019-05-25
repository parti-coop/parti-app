import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ChannelCard from './ChannelCard';

const ChannelListHorizontal = props => {
  if(props.channels.length <= 0) {
    return null;
  }

  return (
  <ScrollView
    style={{ width: '100%', height: 150 }}
    horizontal={ true }
    showsHorizontalScrollIndicator={ false } >
    <Text>{ props.hasChannelsJoinable }</Text>
    {
      props.channels.map((channel) => (
        <ChannelCard
          channel={channel}
          style={{ margin: 10 }}
          key={channel.id}
          onPress={props.onPress} />
      ))
    }
    {
      props.hasChannelsJoinable && (
        <View style={[{ width: 80, height: 110, margin: 10 }, props.style]}>
          <View style={{ width: 80, height: 80, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              size={28}
              color="#777"
              name={Platform.select({android: "md-more", ios: "ios-more"})}
            />
          </View>
          <Text numberOfLines={2} style={{ marginTop: 4, textAlign: 'center' }}>더 보기</Text>
        </View>
      )
    }
  </ScrollView>
  );
}

export default ChannelListHorizontal;
