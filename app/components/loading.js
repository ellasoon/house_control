import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';

const STORAGE_KEY = 'HouseControlApp:passcode';

import { setPasscode } from '../actions/alarm.js';

class Loading extends Component {
  componentDidMount() {
    if(!this.props.passcode) {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((value) => {
          if (value !== null){
            this.props.dispatch(setPasscode(value));
            this.props.navigator.push({title: 'HouseKeypad', index: 1});
          } else {
            this.props.navigator.push({title: 'PasscodeKeypad', index: 1});
          }
        });
    }
  }
  render() {
    return (
      <View style={styles.loadingContainer}>
        <Text>You look nice today 😀</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
});

export default Loading
