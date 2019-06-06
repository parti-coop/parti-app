import React, { Component } from 'react';
import { View, Text, FlatList,
  TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { getInset } from 'react-native-safe-area-view';
import { Navigation } from 'react-native-navigation';

import { homeLoadGroupsRequested } from '../store/effects';
import { goToHomeRootGroup, goToHomeRootChannel } from './routes';
import { drawerGroupsSelector, drawerChannelsSelector } from '../store/selectors/drawer';
import { homeSelectGroup, homeSelectChannel,
  uiHomeActiveDrawer, uiHomeInactiveDrawer } from '../store/actions';

class DrawerScreen extends Component {
  onGroupPressedHandler = async (group) => {
    await this.props.onSelectGroup(group);
    goToHomeRootChannel(true);
  };

  onChannelPressedHandler = async (channel) => {
    await this.props.onSelectChannel(this.props.selectedGroup, channel);
    goToHomeRootChannel();
  };

  renderGroup = ({ item: group }) => (
    <TouchableOpacity style={styles.groupTouchable} onPress={() => this.onGroupPressedHandler(group)}>
      <Thumbnail source={{ uri: group.logoUrl }} style={styles.groupThumnail} />
    </TouchableOpacity>
  );

  renderChannel = ({ item: channel }) => {
    const selected = (this.props.selectedChannel?.id === channel?.id);
    return (
      <TouchableOpacity style={[styles.channelTouchable, (selected && styles.selectedChannelTouchable)]} onPress={() => this.onChannelPressedHandler(channel)}>
        <Text style={[styles.channelText, (selected && styles.selectedChannelText)]}>#{channel.title}</Text>
      </TouchableOpacity>
    );
  }

  constructor(props) {
    super(props);

    this.props.onLoadGroups();

    this.componentDidAppearListener = Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
      if (componentId === this.props.componentId) {
        this.props.onHomeActiveDrawer();
      }
    });

    this.componentDidDisappearListener = Navigation.events().registerComponentDidDisappearListener(({ componentId }) => {
      if (componentId === this.props.componentId) {
        this.props.onHomeInactiveDrawer();
      }
    });
  }

  componentWillUnmount() {
    if(this.componentDidAppearListener) {
      this.componentDidAppearListener.remove();
    }
    this.componentDidAppearListener = null;

    if(this.componentDidDisappearListener) {
      this.componentDidDisappearListener.remove();
    }
    this.componentDidDisappearListener = null;
  }

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
            renderItem={this.renderGroup}
          />
        </View>
        <View style={[styles.channelsContainer, { paddingTop: topPadding }]}>
          <FlatList
            style={styles.channels}
            data={this.props.channels}
            renderItem={this.renderChannel}
          />
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
  },
  channels: {
    width: '100%',
  },
  channelTouchable: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  selectedChannelTouchable: {
    backgroundColor: '#0052cd',
  },
  channelText: {
    color: '#eee',
  },
  selectedChannelText: {
    color: 'white',
  },
});

const mapStateToProps = state => {
  return {
    groups: drawerGroupsSelector(state),
    channels: drawerChannelsSelector(state),
    currentUser: state.currentUser,
    selectedGroup: state.home.selectedGroup,
    selectedChannel: state.home.selectedChannel,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadGroups: () => dispatch(homeLoadGroupsRequested()),
    onSelectGroup: (group) => dispatch(homeSelectGroup(group)),
    onSelectChannel: (group, channel) => dispatch(homeSelectChannel(group, channel)),
    onHomeActiveDrawer: () => dispatch(uiHomeActiveDrawer()),
    onHomeInactiveDrawer: () => dispatch(uiHomeInactiveDrawer()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
