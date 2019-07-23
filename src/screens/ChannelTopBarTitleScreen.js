import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, Platform, TouchableOpacity, Image
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
            <Icon
              name="ios-information-circle-outline"
              size={Platform.select({ ios: 16, android: 20 })}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        paddingHorizontal: 32,
      },
      android: {
        paddingRight: 30,
      }
    }),
  },
  titleContainer: {
    position: 'relative',
    overflow: 'visible',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    position: 'absolute',
    color: commonColors.alpha50,
    ...Platform.select({
      ios: {
        right: -16,
        top: 3,
      },
      android: {
        right: -25,
        top: 3,
      },
    }),
  },
});

export default ChannelTopBarTitleScreen;
