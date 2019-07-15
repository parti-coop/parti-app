import React, { PureComponent } from 'react';
import { View, FlatList, Text } from 'react-native';

import ChannelLine from './ChannelLine';
import Category from '../store/models/Category';

class HomeCategorySection extends PureComponent {
  constructor(props) {
    super(props);
    console.log('constructor HomeCategorySection ', props.category);
  }

  renderHeader = () => {
    if (Category.isNullObject(this.props.category) && !this.props.category.hasSibling) {
      return <View />;
    }

    return (
      <Text>
        카테고리:
        {this.props.category.name}
      </Text>
    );
  };

  renderItem = ({ item: channel }) => (
    <ChannelLine
      key={channel.key}
      channel={channel}
      onChannelPressed={this.props.onChannelPressed}
    />
  );

  render() {
    console.log('render HomeCategorySection ', this.props.category);
    return (
      <FlatList
        data={this.props.category.channels}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        scrollEnabled={false}
        initialNumToRender={50}
      />
    );
  }
}

export default HomeCategorySection;
