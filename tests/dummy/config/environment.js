'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    'responsive-image': [
      {
        sourceDir: 'assets/images/inline',
        destinationDir: 'assets/images/responsive',
        quality: 5,
        // justCopy: true,
        removeSourceDir: true,
        supportedWidths: [1000, 500],
        lqip: {
          type: 'inline',
          width: 150,
          quality: 1
        }
      },
      {
        sourceDir: 'assets/images/remote',
        destinationDir: 'assets/images/responsive',
        quality: 5,
        // justCopy: true,
        removeSourceDir: true,
        supportedWidths: [1000, 500, 150],
        lqip: {
          type: 'remote'
        }
      },
      {
        sourceDir: 'assets/images/lazy',
        destinationDir: 'assets/images/responsive',
        quality: 5,
        // justCopy: true,
        removeSourceDir: true,
        supportedWidths: [1000, 500, 150]
      }
    ]
  };


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.rootURL = '/ember-lazy-responsive-image/';
    // here you can enable a production-specific feature
  }

  return ENV;
};
