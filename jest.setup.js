// Setup for Jest tests
// Silence native Animated warnings if the helper exists (different RN versions)
// Setup for Jest tests
// Silence native Animated warnings if the helper exists. Different RN
// versions place this helper in slightly different paths, so guard with
// try/catch to avoid throwing during test setup.
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e1) {
  try {
    // Alternative path used in some RN versions
    jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
  } catch (e2) {
    // If neither exists, skip mocking — tests should still run.
    // console.warn('NativeAnimatedHelper mock skipped: module not found');
  }
}

// Optionally mock expo modules used in tests if they don't provide JS implementations
try {
  jest.mock('expo-constants', () => ({
    manifest: {},
  }));
} catch (e) {
  // noop
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Reanimated for AnimatedButton
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
