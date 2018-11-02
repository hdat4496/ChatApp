import React, { Component } from 'react';
import Main from './Main';
import Sign from './Sign';
import { Actions } from '../constants';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    const { page } = this.props;
    switch (page) {
      case Actions.PAGE_MAIN:
        return <Main/>;
      case Actions.PAGE_SIGN:
        return <Sign/>;
      default:
        return <Sign/>;
    }
  }
}



const mapStateToProps = state => ({
    page: state.page
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

