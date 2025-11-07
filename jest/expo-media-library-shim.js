module.exports = {
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  createAssetAsync: async (uri) => ({ id: 'asset1', uri }),
  createAlbumAsync: async (name, asset, copy) => ({}),
};
