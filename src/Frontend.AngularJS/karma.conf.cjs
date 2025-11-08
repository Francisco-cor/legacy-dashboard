// karma.conf.cjs
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
    ],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app.karma.js',
      'tests/*.spec.js'
    ],
    preprocessors: {},
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    client: {
      clearContext: false
    }
  });
};
