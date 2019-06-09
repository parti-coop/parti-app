import React from 'react';
import { Input } from 'native-base';

class VerticalGroupList extends PureComponent {
}

const renderGroup = ({ item: group }) => (
  <TouchableOpacity style={styles.groupTouchable} onPress={() => this.onGroupPressedHandler(group)}>
    <Grayscale amount={group.id === this.props.selectedGroup.id ? 0 : 0.8}>
      <Thumbnail source={{ uri: group.logoUrl }} style={styles.groupThumnail} />
    </Grayscale>
    <Text numberOfLines={1} ellipsizeMode='tail' style={{color: "#eee", fontSize: 9, paddingTop: 3, paddingLeft: 3, paddingRight: 3}}>{group.title}</Text>
  </TouchableOpacity>
);

const VerticalGroupList = props => (
  <View>
    <FlatList
      style={styles.groupsList}
      data={this.props.groups}
      renderItem={this.renderGroup}
    />
  </View>
);
