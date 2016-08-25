'use strict';

var React = require('react');
var {
  StyleSheet,
  TextInput,
  Text,
  View,
  AsyncStorage,
} = require('react-native');

import { setPasscode } from '../actions/alarm';

var PasscodeKeypad = React.createClass({
  getInitialState: function() {
    return {
      passcode: '',
      passcodeConfirm: '',
      passcodeMessage: 'Enter the alarm passcode'
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text>{this.state.passcodeMessage}</Text>
        <View style={styles.passcodeContainer}>
          <TextInput style={styles.text}
            autoFocus={true}
            keyboardType={'numeric'}
            password={true}
            onChangeText={this._onChange}
            ref={'passcodeTextInput'}
          />
        </View>
      </View>
    );
  },
  _onChange: async function(text) {
    if(this.state.passcode.length < 4){
      this.setState({passcode: text});
      if(text.length == 4){
        this.setState({passcodeMessage: 'Confirm alarm passcode'});
        this.refs.passcodeTextInput.setNativeProps({text: ''});
      }
    } else {
      if(text.length == 4){
        if(text == this.state.passcode) {
          await AsyncStorage.setItem(this.props.alarm.passcodeStorageKey, text);
          this.props.dispatch(setPasscode(text));
          this.props.navigator.pop();
        } else {
          this.setState({passcode: '', passcodeConfirm: '',
                        passcodeMessage: "Passcodes don't match. Please try again"});
          this.refs.passcodeTextInput.setNativeProps({text: ''});
        }
      } else {
        this.setState({passcodeConfirm: text});
      }
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 64,
  },
  text: {
    fontSize: 60,
    height: 60,
    color: '#333',
    textAlign: 'center',
  },
  passcodeContainer: {
    width: 180,
    marginTop: 64,
  }
});

module.exports = PasscodeKeypad;
