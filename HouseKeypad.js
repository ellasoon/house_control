'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  TouchableHighlight,
  AlertIOS,
} = React;

var EventSource   = require('NativeModules').RNEventSource,
    ServerURL     = require('./server_url.js'),
    SlideTo       = require('./SlideTo'),
    GarageDoorAPI = require('./GarageDoorAPI'),
    GarageDoor    = require('./GarageDoor'),
    QuickActions  = require('react-native-quick-actions'),
    WatchManager  = require('./WatchManager.js'),
    AlarmAPI      = require('./AlarmAPI'),
    DateHelper    = require('./DateHelper'),
    TimerMixin    = require('react-timer-mixin'),
    subscriptions;

var HouseKeypad = React.createClass({
  getInitialState: function() {
    return {
      garageDoor: 'Connecting',
      error: null,
      alarm: null,
      lastUpdated: null,
    };
  },
  getDefaultProps: function() {
    return {
      url: ServerURL,
      deviceWidth: require('Dimensions').get('window').width
    };
  },
  componentDidMount: function() {
    AlarmAPI.setPasscode(this.props.passcode);
    var self = this;

    subscriptions = [
      DeviceEventEmitter.addListener(
        'EventSourceMessage', function(message) {
          self.setState({error: null, lastUpdated: new Date()});
          if(message.event == "garage_door"){
            self.setState({garageDoor: message.data});
            WatchManager.sendMessage({garageDoor: message.data});
          }
          else if(message.event == "status") {
            var status = JSON.parse(message.data);

            self.setState({alarm: status});
            WatchManager.sendMessage({
              alarmDisplay: status.human_status}
            );
          }
      }),
      DeviceEventEmitter.addListener(
        'EventSourceError', function(data) {
          self.setState({error: data, garage_door: 'Connecting', alarm: null});
          console.log(data);
          if(data.code == 2) {
            EventSource.connectWithURL(self.props.url + '/stream');
            console.log('reconnected');
          }
          WatchManager.sendMessage({
            alarmDisplay: 'Connecting ...',
            garageDoor: 'Connecting ...',
            error: data
          });
      }),
      DeviceEventEmitter.addListener(
        'EventSourceConnected', function() {
        self.setState({error: null});
      }),
      DeviceEventEmitter.addListener(
        'quickActionShortcut', self.handleQuickAction)
    ];

    EventSource.connectWithURL(this.props.url + '/stream');
    this.handleQuickAction(QuickActions.popInitialAction());


    AlarmAPI.status().then(function(response) {
      response.json().then(function(data) {
        self.setState({
          garageDoor:  data.garage_door,
          alarm:       data.alarm,
          lastUpdated: new Date(data.last_updated)
        });
      });
    });
  },
  componentDidUmnount: function() {
    subscriptions.map(function(s) { s.remove() });
    EventSource.close();
  },
  handleQuickAction:  function(data) {
    if(data == null) return false;
    if(data.type == 'com.housecontrol.app.leave'){
      AlarmAPI.away();
      GarageDoorAPI.toggle();
    } else if(data.type == 'com.housecontrol.app.arrive'){
      AlarmAPI.off();
      GarageDoorAPI.toggle();
    }
  },
  _toggleGarage: function(e) {
    GarageDoorAPI.toggle();
  },
  _off: function() {
    AlarmAPI.off();
  },
  _away: function() {
    AlarmAPI.away();
  },
  _stay: function() {
    AlarmAPI.stay();
  },
  _panic: function() {
    AlarmAPI.panic();
    AlertIOS.alert(
      'Alarm Panic',
      'Hang in there. Everything will be ok'
    );
  },
  render: function() {
    var alarmDisplay = (
      <View style={this.alarmContainerStyle()}>
        <Text style={this.alarmDisplayStyle()}>
          {this.alarmDisplay()}
        </Text>
      </View>
    );

    var error;

    if(this.state.error) {
      error = (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {this.state.error.description}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {alarmDisplay}
        <View style={styles.alarmControlsContainer}>
          <TouchableHighlight onPress={this._off}
          underlayColor={'#3071A9'} style={styles.button}>
            <Text style={styles.alarmOff}>Off</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._away}
            underlayColor={'#843534'} style={styles.button}>
            <Text style={styles.alarmDanger}>Away</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._stay}
            underlayColor={'#843534'} style={styles.button}>
            <Text style={styles.alarmDanger}>Stay</Text>
          </TouchableHighlight>
        </View>
        <GarageDoor status={this.state.garageDoor} />
        <View style={styles.panic}>
          <SlideTo message={'slide to panic'} callback={this._panic} />
        </View>
        {error}
        <LastUpdate time={this.state.lastUpdated}
                    style={styles.lastUpdatedContainer} />
      </View>
    );
  },
  alarmContainerStyle: function() {
    var status  = this.state.alarm,
        style = {
          borderRadius: 4,
          backgroundColor: '#eee',
          padding: 15,
          alignItems: 'center',
          width: this.props.deviceWidth - 20,
        };

    if(status){
      if(status.alarm_sounding || status.fire){
        style.backgroundColor = '#d9534f';
      } else if(status.ready) {
        style.backgroundColor = '#3c763d';
      }
    }

    return style;
  },
  alarmDisplayStyle: function() {
    var status  = this.state.alarm,
        style = {
          fontSize: 40,
          color: '#555',
        };

    if(status){
      if(status.alarm_sounding || status.fire || status.ready){
        style.color = '#fff';
      } else if(status.armed_home || status.armed_away) {
        style.color = '#d9534f';
      }
    }

    return style;
  },
  alarmDisplay: function() {
    var status  = this.state.alarm;

    if(status)
      return status.human_status;
    else
      return "Connecting";

  },
  garageDoorContainerStyle: function() {
    var style = {
      backgroundColor: '#555',
      alignItems: 'center',
      padding: 30,
      borderRadius: 4,
      width: this.props.deviceWidth - 20,
      marginTop: 10,
    }

    if(this.state.garageDoor == "open") {
      style.backgroundColor = '#aaa';
      style.borderColor = '#555';
      style.borderWidth = 2;
    }

    return style;
  }
});

var LastUpdate = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps: function() {
    return {
      time: null
    };
  },
  componentDidMount: function() {
    this.setInterval(function() {
      this.forceUpdate();
    }, 30000);
  },
  render: function() {
    if(this.props.time) {
      return (
        <View style={this.props.style}>
          <Text style={{textAlign: 'center', color: '#aaa'}}>
            updated {DateHelper.time_ago_in_words_with_parsing(this.props.time)}
          </Text>
        </View>
      )
    } else {
      return ( <View /> )
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 32,
    padding: 10,
  },
  garageDoorText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  garageDoorStatus: {
    fontSize: 16,
    marginTop: 10,
  },
  alarmControlsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
  },
  alarmOff: {
    color: '#428BCA',
    padding: 20,
    fontSize: 28,
    textAlign: 'center',
  },
  alarmDanger: {
    color: '#A94442',
    padding: 20,
    fontSize: 28,
    textAlign: 'center',
  },
  button: {
    borderRadius: 4,
  },
  panic: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: require('Dimensions').get('window').height / 2,
    left: 10,
    right: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  lastUpdatedContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  }
});

module.exports = HouseKeypad;
