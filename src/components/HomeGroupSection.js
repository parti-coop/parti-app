import React, { memo, PureComponent } from 'react';
import { View, SectionList, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import GroupLine from './GroupLine';
import ChannelLine from './ChannelLine';

class HomeGroupSection extends PureComponent {
  constructor(props) {
    super(props);
    console.log("constructor HomeGroupSection ", props.group.id);
  }

  renderCategorySectionHeader = ({section: {category}}) => {
    return (
      <Text>카테고리: {category.name}</Text>
    );
  }

  renderChannelItem = ({item: channel, index, section: category}) => {
    return (
      <ChannelLine key={channel.key} channel={channel} onChannelPressed={this.props.onChannelPressed} />
    );
  }

  sectionData = () => {
    console.log("constructor HomeGroupSection categories", this.props.group.categories);
    return (this.props.group.categories.map((category) => {
      return { category: category, data: category.channels }
    }) || []);
  }

  render() {
    console.log("render HomeGroupSection ", this.props.group.id);
    return (
      <View>
        <GroupLine group={this.props.group} onGroupPressed={this.onGroupPressed} />
        <SectionList
          sections={this.sectionData()}
          renderSectionHeader={this.renderCategorySectionHeader}
          renderItem={this.renderChannelItem}
          scrollEnabled={false} />
      </View>
    );
  }
}

export default HomeGroupSection;
