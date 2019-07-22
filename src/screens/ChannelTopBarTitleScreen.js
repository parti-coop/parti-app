import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, Platform, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import commonColors from '../styles/colors';

class ChannelTopBarTitleScreen extends PureComponent {
  handleTitlePressed = () => {
    this.props.onTitlePressed();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleTitlePressed}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>{this.props.channel?.title || '채널'}</Text>
            <View style={styles.iconContainer}>
              <Icon
                size={20}
                name={Platform.select({ android: 'md-information-circle-outline', ios: 'ios-information-circle-outline' })}
                style={styles.icon}
              />
            </View>
          </View>
        </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    color: commonColors.alpha50,
  },
});

export default ChannelTopBarTitleScreen;
