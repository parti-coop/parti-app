import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class ChannelTopBarTitleScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1}>{this.props.channel?.title || '채널'}</Text>
          <View style={styles.iconContainer}>
            <Icon
              size={16}
              color="#ccc"
              name={Platform.select({ android: 'md-arrow-down', ios: 'ios-arrow-down' })}
              style={styles.icon}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: -20,
    top: 0,
    height: '100%',
    justifyContent: 'center',
  },
  icon: {
    flex: 1,
  },
});

export default ChannelTopBarTitleScreen;
