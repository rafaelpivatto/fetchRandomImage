module.exports = {
  express: {
    port: 3000,
  },
  credential: {
    customSearch: {
      cloundPlatformKey: process.env.CLOUD_PLATFORM_KEY || 'NOT_EXISTS',
      searchEngineId: process.env.SEARCH_ENGINE_ID || 'NOT_EXISTS',
    }
  }
};