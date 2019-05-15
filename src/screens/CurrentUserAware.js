import React, { Component } from 'react';
import { connect } from "react-redux";

import { currentUserPrepare } from '../store/actions/index';

class CurrentUserAware extends Component {
  constructor(props) {
    super(props);
    this.props.onCurrentUserPrepare();
    console.log('test');
  }

  render() {
    return false;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrentUserPrepare: () => dispatch(currentUserPrepare())
  };
};

export default connect(null, mapDispatchToProps)(CurrentUserAware);
