import React, { memo, Component, PureComponent } from 'react';
import { View, FlatList, Image,
  ScrollView, SectionList,
  TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class GroupSectionHeader extends PureComponent {
  constructor(porps) {
    super(porps);
    console.log("constructor GroupSectionHeader ", this.props.group.id);
  }

  groupPressedHandler = () => this.props.onGroupPressed(this.props.group);

  render() {
    console.log("render GroupSectionHeader ", this.props.group.id);
    return (
      <View>
        <TouchableOpacity onPress={this.groupPressedHandler}>
        <View
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eee', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}}>
          <Text style={{fontWeight: 'bold', paddingTop: 5, paddingBottom: 5}}>{this.props.group.title}</Text>
          <Icon size={20} color="#999" name={Platform.select({android: "md-arrow-dropright", ios: "ios-arrow-dropright"})} />
        </View>
        </TouchableOpacity>
      </View>
    );
  }
}


export default GroupSectionHeader;
