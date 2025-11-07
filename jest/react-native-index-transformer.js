const babelJest = require('babel-jest');
const transformer = babelJest.createTransformer();

module.exports = {
  process(src, filename, config, options) {
    if (filename && filename.indexOf('node_modules\\react-native\\index.js') !== -1) {
      // Remove simple TypeScript `as Type` casts like `} as ReactNativePublicAPI;`
      // and inline `(x as T)` occurrences which the Flow parser chokes on.
      src = src.replace(/\s+as\s+[A-Za-z0-9_<>., ]+/g, '');
      // Also strip generic type annotations in some patterns (best-effort).
      src = src.replace(/<[^>]+>/g, '');
    }
    return transformer.process(src, filename, config, options);
  },
};
