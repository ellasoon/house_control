/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  AsyncStorage,
  Text,
  View,
  AlertIOS,
} = React;

var STORAGE_KEY    = 'HouseControlApp:passcode',
    PasscodeKeypad = require('./PasscodeKeypad'),
    HouseKeypad    = require('./HouseKeypad'),
    GarageDoorAPI  = require('./GarageDoorAPI'),
    AlarmAPI       = require('./AlarmAPI'),
    WatchManager   = require('./WatchManager.js'),
    subscription;

WatchManager.activate();

var HouseControl = React.createClass({
  getInitialState: function() {
    return {
      passcode: null,
      initialRoute: null
    };
  },
  componentDidMount: function() {
    subscription =
      WatchManager.addMessageListener(function(message) {
        if (message.garageDoor) {
          GarageDoorAPI.toggle();
        } else if(message.alarm) {
          switch(message.alarm) {
            case "off":
              AlarmAPI.off();
              break;
            case "away":
              AlarmAPI.away();
              break;
            case "stay":
              AlarmAPI.stay();
              break;
          }
        } else if(message.update) {
          AlarmAPI.status().then(function(response) {
            response.json().then(function(data) {
              WatchManager.sendMessage({
                garageDoor: data.garage_door,
                alarmDisplay: data.alarm.human_status
              });
            });
          });
        }
      }, this);
  },
  componentDidUmnount: function() {
    WatchManager.removeMessageListener(subscription);
  },
  _load: function() {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value !== null){
          this.setState({
            passcode: value,
            initialRoute: {
              title: 'House Keypad',
              component: HouseKeypad,
              passProps: { passcode: value }
            }
          });
          AlarmAPI.setPasscode(value);
        } else {
          this.setState({
            initialRoute: {
              title: 'Passcode Keypad',
              component: PasscodeKeypad,
              passProps: { storageKey: STORAGE_KEY }
            }
          });
        }
      });
  },
  render: function() {
    if(this.state.initialRoute == undefined || this.state.initialRoute == null)
      this._load();

    var landing;

    if(this.state.initialRoute != undefined){
      landing = (
        <NavigatorIOS
          ref={'navigator'}
          style={styles.navContainer}
          navigationBarHidden={true}
          initialRoute={this.state.initialRoute}
        />
      );
    } else {
      landing = (
        <View style={styles.loadingContainer}>
          <Text>You look nice today 😀</Text>
        </View>
      )
    }

    return landing;
  }
});

var styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  navContainer: {
    flex: 1,
    backgroundColor: 'white',
  }
});

AppRegistry.registerComponent('HouseControl', () => HouseControl);
