const React = require('react');

// Simple primitive components that render their children; react-test-renderer
// will handle them as elements.
function createPrimitive(tag) {
  return function Primitive(props) {
    const { children, ...rest } = props || {};
    return React.createElement(tag, rest, children);
  };
}

module.exports = {
  View: createPrimitive('View'),
  Text: createPrimitive('Text'),
  Image: createPrimitive('Image'),
  TouchableOpacity: createPrimitive('TouchableOpacity'),
  TextInput: createPrimitive('TextInput'),
  FlatList: createPrimitive('FlatList'),
  ScrollView: createPrimitive('ScrollView'),
  StyleSheet: {
    create: (styles) => styles || {},
  },
  Alert: {
    alert: () => {},
  },
  Share: {
    share: () => Promise.resolve(),
  },
  Linking: {
    canOpenURL: () => Promise.resolve(true),
    openURL: () => Promise.resolve(),
  },
  Platform: {
    OS: 'android',
  },
  // Minimal Animated stub
  Animated: {
    Value: function() { return { _value: 0, addListener: () => {}, removeListener: () => {}, setValue: () => {} }; },
    timing: () => ({ start: () => {} }),
    parallel: () => ({ start: () => {} }),
  },
  // Other commonly used APIs
  Dimensions: {
    get: () => ({ width: 360, height: 640 }),
  },
};
