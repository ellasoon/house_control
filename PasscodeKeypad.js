'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TextInput,
  Text,
  View,
  AsyncStorage,
} = React;

var HouseKeypad = require('./HouseKeypad');

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
  _onChange: function(text) {
    if(this.state.passcode.length < 4){
      this.setState({passcode: text});
      if(text.length == 4){
        this.setState({passcodeMessage: 'Confirm alarm passcode'});
        this.refs.passcodeTextInput.setNativeProps({text: ''});
      }
    } else {
      if(text.length == 4){
        if(text == this.state.passcode) {
          console.log(this.props.storageKey);
          AsyncStorage.setItem(this.props.storageKey, text)
            .then(() => {
              console.log(this.state.passcode);
              console.log(text);
              this.props.navigator.push({
                title: 'House Keypad',
                component: HouseKeypad,
                props: { passcode: text }
              });
            })
            .catch((error) => {
              console.log("Error!");
            })
            .done();
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
