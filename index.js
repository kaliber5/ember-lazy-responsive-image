'use strict';
const sharp = require('sharp');

module.exports = {
  name: 'ember-lazy-responsive-image',

  /**
   * contains images as base64 encoded strings
   */
  inlineImages: {},

  /**
   * array of already processed images
   */
  processed: [],

  isDevelopingAddon() {
    return true;
  },

  included() {
    this._super.included.apply(this, arguments);

    let responsiveImageAddon = this.project.findAddonByName('ember-responsive-image');
    if(responsiveImageAddon) {
      responsiveImageAddon.addMetadataExtension(this.addMetaData, this);
      responsiveImageAddon.addImagePostProcessor(this.imagePreProcessor, this);
    }
  },

  /**
   * Add metadata for LQIP-feature
   *
   * @param image
   * @param metadata
   * @param config
   * @return {*} the metadata
   * @private
   */
  addMetaData(image, metadata, config) {
    if (config.lqip) {
      metadata.lqip = { width: config.lqip.width };
      if (config.lqip.type === 'inline' && this.inlineImages[image]) {
        metadata.lqip.image = this.inlineImages[image];
      }
    }

    return metadata;
  },

  /**
   * The image preprocessor provides the image data as a base64 string if necessary
   *
   * @param {sharp} sharped the sharp-object contains the image
   * @param image the origin image name
   * @param width
   * @param config
   * @return {sharp|Promise}
   * @private
   */
  imagePreProcessor(sharped, image, width, config) {
    if (this.processed.includes(image) || !this.canProcessImage(config)) {
      return sharped;
    }
    if (config.lqip && config.lqip.type === 'inline') {
      this.processed.push(image);
      return sharped.toBuffer().then((buffer) => {
        let quality = config.lqip.quality || config.quality;
        return sharp(buffer).resize(config.lqip.width, null)
        .withoutEnlargement(true)
        .jpeg({
          quality: quality,
          progressive: true,
          force: false
        })
        .toBuffer();
      }).then((buffer) => {
        this.inlineImages[image] = buffer.toString('base64');
        return sharped;
      });
    } else {
      return sharped;
    }
  },

  /**
   * Check if we have to add our custom image process
   *
   * @param config
   * @return {boolean}
   * @private
   */
  canProcessImage(config) {
    if (config.lqip) {
      this.validateConfig(config);
      return config.lqip.type === 'inline';
    }

    return false;
  },

  /**
   * validates the configuration
   *
   * @param config
   * @throws Error if the config is wrong
   *
   * @private
   */
  validateConfig(config) {
    if (!config.lqip.type || !['inline', 'remote'].includes(config.lqip.type)) {
      throw Error('You have to provide either \'inline\' or \'remote\' as \'type\' to enable lqip');
    }
    if (!config.lqip.width) {
      throw Error('You have to provide a \'width\' to enable lqip');
    }
    if (config.lqip.type === 'remote' && !config.supportedWidths.includes(config.lqip.width)) {
      throw Error('The \'width\' of \'lqip\' has to be one of the \'supportedWidths\'');
    }
  }
};
