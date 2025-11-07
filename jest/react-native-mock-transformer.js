const babelJest = require('babel-jest');

const transformer = babelJest.createTransformer();

module.exports = {
  process(src, filename, config, options) {
    // If the file is React Native's jest mock, strip TypeScript 'as' casts like
    // `(ref as string)` -> `(ref)` so the Flow parser in metro preset doesn't choke.
    if (filename && filename.indexOf('node_modules\\react-native\\jest\\mock.js') !== -1) {
      src = src.replace(/\(ref as string\)/g, '(ref)');
    }
    return transformer.process(src, filename, config, options);
  },
};
