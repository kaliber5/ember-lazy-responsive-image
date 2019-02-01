'use strict';

module.exports = {
  normalizeEntityName() {
  },
  afterInstall() {
    return this.addAddonToProject('ember-responsive-image');
  }
};
