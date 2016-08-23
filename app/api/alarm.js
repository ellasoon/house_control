var AlarmAPI = function() {
  var serverURL = require('../config/server_url.js'),
      passcode;

  var _sendKey = function(key) {
    return fetch(serverURL + '/write' + '?key=' + String(passcode) + key, {
      method: 'post'
    });
  };

  return {
    setPasscode: function(newPasscode) {
      passcode = newPasscode;
    },
    off: function() {
      _sendKey("1");
    },
    away: function() {
      _sendKey("2");
    },
    stay: function() {
      _sendKey("3");
    },
    panic: function() {
      fetch(ServerURL + '/panic', { method: 'post' });
    },
    status: function() {
      return fetch(serverURL + '/status.json?timestamp=' + (new Date).toJSON());
    }
  }
}();

module.exports = AlarmAPI;
