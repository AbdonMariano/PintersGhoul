const React = require('react');
module.exports = {
  LinearGradient: function LinearGradient(props) {
    const { children, style, ...rest } = props || {};
    return React.createElement('LinearGradient', { style, ...rest }, children);
  },
};
