module.exports = function(config) {
  config.set({
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress', 'dashboard'],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off',
    maxConcurrentTestRunners: 6,
    /*thresholds: {
      high: 80,
      low: 60,
      break: null,
    },*/
    mutate: [
      'src/main/**/*.js',
      '!src/__tests__/**/*.js',
      '!src/**/*.config.js',
      '!src/main/application.js',
    ],
  });
};
