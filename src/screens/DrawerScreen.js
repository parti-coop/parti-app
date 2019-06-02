import React, { Component } from 'react';
import { View, SafeAreaView, Text, FlatList,
  TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { getInset } from 'react-native-safe-area-view';

import { drawerGroupsSelector } from '../store/selectors/drawer';

class DrawerScreen extends Component {
  renderGroups = ({ item: group }) => (
    <TouchableOpacity style={styles.groupTouchable}>
      <Thumbnail source={{ uri: group.logoUrl }} style={styles.groupThumnail} />
    </TouchableOpacity>
  )


  render() {
    const { width, height } = Dimensions.get('window');
    const landScape = width > height;
    const topPadding = getInset('top', landScape);

    return (
      <View style={styles.container}>
        <View style={[styles.groupsContainer, { paddingTop: topPadding }]}>
          <FlatList
            style={styles.groups}
            data={this.props.groups}
            renderItem={this.renderGroups}
          />
        </View>
        <View style={[styles.channelsContainer, { paddingTop: topPadding }]}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#160b27'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  groups: {
    width: '100%',
  },
  groupsContainer: {
    width: 80,
    backgroundColor: '#160b27',
  },
  groupTouchable: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  groupThumnail: {
  },
  channelsContainer: {
    flex: 1,
    backgroundColor: '#271446',
  }
});

const mapStateToProps = state => {
  return {
    groups: drawerGroupsSelector(state),
  }
};

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
