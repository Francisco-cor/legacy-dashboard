module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular-mocks.js',
      'app.js',
      'test/*.spec.js'
    ],
    browsers: ['ChromeHeadless'],
    reporters: ['progress'],
    singleRun: true
  });
};