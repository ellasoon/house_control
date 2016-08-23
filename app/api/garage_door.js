var GarageDoorAPI = function() {
  var serverURL = require('../config/server_url.js');

  return {
    toggle: function() {
      fetch(serverURL + '/toggle', {
        method: 'post'
      });
    },

    status: function() {
      fetch(serverURL + '/status')
    }
  }
}();

module.exports = GarageDoorAPI;
