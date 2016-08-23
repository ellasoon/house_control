'use strict';

import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Navigator, AsyncStorage, View, Text
} from 'react-native';
// import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import AlarmAPI from '../api/alarm';
import GarageDoorAPI from '../api/garage_door';
import { setPasscode } from '../actions/alarm.js';
import * as appViews from '../components';

class HouseControlApp extends Component {
  renderRoute(route, navigator) {
    switch(route.title) {
      case 'PasscodeKeypad':
        return (<appViews.PasscodeKeypad {...this.props} />);
        break;
      case 'HouseKeypad':
        return (<appViews.HouseKeypad {...this.props} />);
        break;
      default:
        return (<appViews.Loading dispatch={this.props.dispatch}
                 passcode={this.props.alarm.passcode}
                 navigator={navigator} />);
    }
  }
  render() {
    return (
      <Navigator
        initialRoute={{title: 'HouseKeypad', index: 0}}
        renderScene={this.renderRoute.bind(this)}
        style={styles.navContainer}
      />
    );
  }
}

var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: 'white',
  }
});

export default connect(state => state)(HouseControlApp);
