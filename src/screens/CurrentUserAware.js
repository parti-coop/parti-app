import React, { Component } from 'react';
import { connect } from "react-redux";

import { currentUserLoadInfo, currentUserLoadGroups } from '../store/actions/index';

class CurrentUserAware extends Component {
  constructor(props) {
    super(props);
    this.props.onCurrentUserLoadInfo();
    if(props.groups) {
      this.props.onCurrentUserLoadGroups();
    }
  }

  render() {
    return false;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrentUserLoadInfo: () => dispatch(currentUserLoadInfo()),
    onCurrentUserLoadGroups: () => dispatch(currentUserLoadGroups()),
  };
};

export default connect(null, mapDispatchToProps)(CurrentUserAware);

