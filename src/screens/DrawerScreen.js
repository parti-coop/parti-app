import React, { Component } from 'react';
import { View, Text, FlatList, SectionList,
  TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { getInset } from 'react-native-safe-area-view';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Grayscale } from 'react-native-color-matrix-image-filters';

import { homeLoadGroupsRequested } from '../store/effects';
import { goToHomeRootGroup, goToHomeRootChannel } from './routes';
import { drawerGroupsSelector, drawerChannelsGroupByCategory }
  from '../store/selectors/drawer';
import { homeSelectGroup, homeSelectChannel,
  uiHomeActiveDrawer, uiHomeInactiveDrawer } from '../store/actions';
import Channel from '../store/models/Channel';
import Category from '../store/models/Category';
import commonStyles from '../styles/common';

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
      <Grayscale amount={group.id === this.props.selectedGroup.id ? 0 : 0.8}>
        <Thumbnail source={{ uri: group.logoUrl }} style={styles.groupThumnail} />
      </Grayscale>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{color: "#eee", fontSize: 9, paddingTop: 3, paddingLeft: 3, paddingRight: 3}}>{group.title}</Text>
    </TouchableOpacity>
  );

  renderCategory = ({section: category, index}) => {
    return (
      <View style={styles.categoryContainer}>
        <Icon size={14} color="white" name={Platform.select({android: "md-arrow-dropright", ios: "ios-arrow-dropright"})} />
        <Text style={{fontSize: 14, color: 'white', marginLeft: 5}}>{category.name}</Text>
      </View>
    );
  };

  renderChannel = ({item: channel}) => {
    const selected = (this.props.selectedChannel?.id === channel.id);
    return (
      <View style={styles.channelContainer}>
        <TouchableOpacity style={[styles.channelTouchable, (selected && styles.selectedChannelTouchable)]} onPress={() => this.onChannelPressedHandler(channel)}>
          <Text style={[styles.channelText, (selected && styles.selectedChannelText)]}># {channel.title}</Text>
        </TouchableOpacity>
      </View>
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
    const bottomPadding = getInset('bottom', landScape);
    const styleSafeArea = { paddingTop: topPadding, paddingBottom: bottomPadding }

    let categoriesView;
    if(!!this.props.selectedGroup) {
      if(this.props.channelsGroupByCategory?.length > 0) {
        categoriesView = (
          <View style={commonStyles.flexContainer}>
            <View style={styles.groupHeaderContainer}>
              <Thumbnail source={{ url: this.props.selectedGroup.logoUrl }} />
              <Text numberOfLines={2} ellipsizeMode='tail' style={styles.groupHeaderTitle}>
                {this.props.selectedGroup.title}
              </Text>
            </View>
            <SectionList
              style={styles.categoriesList}
              renderSectionHeader={this.renderCategory}
              renderItem={this.renderChannel}
              sections={this.props.channelsGroupByCategory}
            />
          </View>
        );
      } else {
        categoriesView = (
          <View style={commonStyles.flexCenterContainer}>
            <Text style={{ color: 'white' }}>로딩 중...</Text>
          </View>
        );
      }
    } else {
      categoriesView = (
        <View style={commonStyles.flexCenterContainer}>
          <Text style={{ color: 'white' }}>그룹을 선택해 주세요!</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={[styles.groupsContainer, styleSafeArea]}>
          <FlatList
            style={styles.groupsList}
            data={this.props.groups}
            renderItem={this.renderGroup}
          />
        </View>
        <View style={[styles.categoriesContainer, styleSafeArea]}>
          {categoriesView}
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
  groupsList: {
    width: '100%',
  },
  groupsContainer: {
    width: 80,
    backgroundColor: '#160b27',
  },
  groupHeaderContainer: {
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 20,
  },
  groupHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
  },
  groupTouchable: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  groupThumnail: {
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: '#271446',
  },
  categoriesList: {
    width: '100%',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: '#271446',
  },
  categoryContainerDefault: {
    paddingTop: 20,
  },
  channelContainer: {
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
    channelsGroupByCategory: drawerChannelsGroupByCategory(state),
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
