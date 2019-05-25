import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

const BUTTON_ID_CLOSE = 'closeButton';

class GroupScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: true,
        hideOnScroll: true,
        animate: false,
        background: {
          color: 'transparent'
        }
      }
    };
  }

  setupTopBar = async () => {
    try {
      const closeIcon = await Icon.getImageSource(Platform.select({android: "md-close", ios: "ios-close"}), 30);
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          leftButtons: [{
            id: BUTTON_ID_CLOSE,
            icon: closeIcon,
          }],
          title: {
            text: this.props.group?.title
          }
        }
      });
    } catch(err) {
      console.log('GroupScreen 메뉴 오류');
      console.log(err);
    }
  }

  navigationButtonPressedHandler = (event) => {
    if(event.buttonId == BUTTON_ID_CLOSE) {
      Navigation.dismissModal(this.props.componentId);
    }
  };

  constructor(props) {
    super(props);

    this.setupTopBar();
    this.navButtonListener = Navigation.events().registerNavigationButtonPressedListener(this.navigationButtonPressedHandler);
  }

  componentWillUnmount() {
    if(this.navButtonListener) {
      this.navButtonListener.remove();
    }
    this.navButtonListener = null;
  }

  render() {
    if(!this.props.group) {
      return (
        <View style={styles.container}>
          <Text>선택된 그룹이 없습니다</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container}>
          <Text>{this.props.group.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return {
    group: state.home.selectedGroup,
  }
};

export default connect(mapStateToProps, null)(GroupScreen);
