import React, { Component } from 'react';
import { View } from 'react-native';

import WatchManager from '../vendor/watch_manager';

WatchManager.activate();

class WatchConnectivity extends Component {
  componentDidMount() {
    const { GarageDoorAPI, AlarmAPI } = this.props;

    this.subscription = WatchManager.addMessageListener((message) => {
      if(message.garageDoor) {
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
              alarmDisplay: data.alarm.human_status});
          });
        });
      }
    }, this);
  }
  componentDidUmnount() {
    WatchManager.removeMessageListener(this.subscription);
  }
  render () {
    return (<View />)
  }
}

export default WatchConnectivity;
