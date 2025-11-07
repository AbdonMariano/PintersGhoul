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
