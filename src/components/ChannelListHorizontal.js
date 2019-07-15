import React, { PureComponent } from 'react';
import {
  View, ScrollView, Text, StyleSheet, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ChannelCard from './ChannelCard';

class ChannelListHorizontal extends PureComponent {
  constructor(props) {
    super(props);
    console.log('constructor ChannelListHorizontal ', props.group.id, props.category.id);
  }

  render() {
    console.log('render ChannelListHorizontal ', this.props.group.id, this.props.category.id);
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {
          this.props.channels.map(channel => (
            <ChannelCard
              channel={channel}
              style={{ margin: 10 }}
              key={channel.id}
              onPress={this.props.onPress}
            />
          ))
        }
        {
          this.props.hasMoreReadableChannels && (
            <View style={[{ width: 80, height: 110, margin: 10 }, this.props.style]}>
              <View style={{ width: 80, height: 80, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                  size={28}
                  color="#777"
                  name={Platform.select({android: 'md-more', ios: 'ios-more'})}
                />
              </View>
              <Text numberOfLines={2} style={{ marginTop: 4, textAlign: 'center' }}>더 보기</Text>
            </View>
          )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: 150
  },
});

export default ChannelListHorizontal;
