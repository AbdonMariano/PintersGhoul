// Lightweight stub for react-native/jest/mock to avoid parsing Flow/TS mixed syntax
// in the upstream file inside node_modules.

module.exports = function mock(moduleRef, factoryRef) {
  function deref(ref) {
    // moduleRef is normally like 'm#module/path' — strip the leading two chars
    return String(ref).substring(2);
  }

  if (factoryRef === undefined) {
    jest.mock(deref(moduleRef));
  } else {
    const mockFactory = deref(factoryRef);
    jest.mock(deref(moduleRef), () => jest.requireActual(mockFactory));
  }
};
