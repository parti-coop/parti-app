import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";

import { currentUserLoadInfo } from '../store/actions/index';
import { goToAuthRoot } from '../screens/routes';

export default function (ComposedComponent) {
  class Authenticate extends Component {
    constructor(props) {
      super(props);
      let isAuthenticated = this._checkAndRedirect()
      if(isAuthenticated) {
        this.props.onCurrentUserLoadInfo();
      }
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      const { isAuthenticated, redirect } = this.props;

      if (!isAuthenticated) {
        goToAuthRoot();
      }

      return isAuthenticated;
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
          { this.props.isAuthenticated ? <ComposedComponent {...this.props} /> : null }
        </View>
      )
    }
  }

  const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  };

  const mapDispatchToProps = dispatch => {
    return {
      onCurrentUserLoadInfo: () => dispatch(currentUserLoadInfo()),
    }
  };

  return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
}


