'use strict';

var React = require('react');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = require('react-native');

var GarageDoorAPI = require('../api/garage_door'),
    deviceWidth   = require('Dimensions').get('window').width;

var GarageDoor = React.createClass({
  toggle: function() {
    GarageDoorAPI.toggle();
  },
  render: function() {
    return (
      <TouchableHighlight style={this.garageDoorContainerStyle()}
                            onPress={this.toggle}>
        <View style={styles.centered}>
          <Text style={styles.garageDoorText}>
            Garage Door
          </Text>
          <Text style={[styles.garageDoorText, styles.garageDoorStatus]}>
            {this.props.status.toUpperCase()}
          </Text>
        </View>
      </TouchableHighlight>
    );
  },
  garageDoorContainerStyle: function() {
    var style = {
      backgroundColor: '#555',
      alignItems: 'center',
      padding: 30,
      borderRadius: 4,
      width: deviceWidth - 20,
      marginTop: 10,
    }

    if(this.props.status == "open") {
      style.backgroundColor = '#aaa';
      style.borderColor = '#555';
      style.borderWidth = 2;
    }

    return style;
  }
});

var styles = StyleSheet.create({
  garageDoorText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  garageDoorStatus: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
  },
});

module.exports = GarageDoor;
