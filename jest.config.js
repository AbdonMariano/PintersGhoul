module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  // Ensure Jest transforms react-native and selected expo packages.
  transformIgnorePatterns: [
    '/node_modules/(?!(react-native|@react-native|expo|@expo|expo-linear-gradient|expo-media-library|expo-sharing|@react-navigation)/)'
  ],
  moduleNameMapper: {
    // Replace react-native's jest mock (which may contain Flow/TS mixed syntax)
    // with a simple JS stub we control so Jest doesn't try to parse it.
    '^react-native/jest/mock$': '<rootDir>/jest/react-native-jest-mock.js',
    // Map the 'react-native' package itself to a lightweight JS shim for tests
    '^react-native$': '<rootDir>/jest/react-native-shim.js',
  '^expo-linear-gradient$': '<rootDir>/jest/expo-linear-gradient-shim.js',
  '^expo-media-library$': '<rootDir>/jest/expo-media-library-shim.js',
  '^expo-sharing$': '<rootDir>/jest/expo-sharing-shim.js',
  '^expo-haptics$': '<rootDir>/jest/expo-haptics-shim.js',
  '^expo-file-system$': '<rootDir>/jest/expo-file-system-shim.js',
  '^expo-image-picker$': '<rootDir>/jest/expo-image-picker-shim.js',
  },
  transform: {
    // Specific transformer for react-native's jest mock (match path in
    // node_modules) to strip the TypeScript 'as' cast that causes the
    // parser to fail.
    'node_modules[\\\\/]react-native[\\\\/]jest[\\\\/]mock\\.js$': '<rootDir>/jest/react-native-mock-transformer.js',
  // Preprocess react-native's main index to remove TypeScript `as` casts
  // that break the Flow parser used by some Babel presets.
  'node_modules[\\\\/]react-native[\\\\/]index\\.js$': '<rootDir>/jest/react-native-index-transformer.js',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
