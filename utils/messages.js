const moment = require('moment');

const format_message = (username, text) => {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
};

module.exports = format_message;