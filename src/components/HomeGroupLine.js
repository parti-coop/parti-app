import React, { PureComponent } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class HomeGroupLine extends PureComponent {
  handleGroupPressed = () => {
    this.props.onGroupPressed(this.props.group);
  }

  render() {
    const iconName = this.props.isExpanded
      ? Platform.select({ android: 'md-arrow-up', ios: 'ios-arrow-up' })
      : Platform.select({ android: 'md-arrow-down', ios: 'ios-arrow-down' });

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.handleGroupPressed}
          style={styles.touchable}
        >
          <Text style={styles.title} numberOfLines={1}>{this.props.group.title}</Text>
          <Icon
            size={styles.title.fontSize}
            color="#ccc"
            name={iconName}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.85)',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10,
    flex: 1,
  },
});

export default HomeGroupLine;
