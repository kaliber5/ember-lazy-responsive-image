'use strict';
const sharp = require('sharp');

module.exports = {
  name: require('./package').name,

  /**
   * contains images as base64 encoded strings
   */
  inlineImages: {},

  /**
   * array of already processed images
   */
  processed: [],

  included() {
    this._super.included.apply(this, arguments);

    let responsiveImageAddon = this.project.findAddonByName('ember-responsive-image');
    if(responsiveImageAddon) {
      responsiveImageAddon.addMetadataExtension(this.addMetaData, this);
      responsiveImageAddon.addImagePreProcessor(this.imagePreProcessor, this);
    }
  },

  /**
   * Add metadata for LQIP-feature
   *
   * @param image
   * @param metadata
   * @param config
   * @return {*} the metadata
   * @throws Error if there's no generated image for inline option
   * @private
   */
  addMetaData(image, metadata, config) {
    if (config.lqip) {
      let width = this.getLqipWidth(config);
      metadata.lqip = { width };
      if (config.lqip.type === 'inline') {
        if (!this.inlineImages[image]) {
          throw Error(`There's no generated image for ${image}`);
        }
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
    if (this.processed.indexOf(image) > -1 || !this.canProcessImage(config)) {
      return sharped;
    }
    this.processed.push(image);
    if (config.lqip && config.lqip.type === 'inline') {
      return sharped.toBuffer().then((buffer) => {
        let quality = config.lqip.quality || config.quality;
        return sharp(buffer).resize(this.getLqipWidth(config), null, {
          withoutEnlargement: true
        })
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
   * returns the width for lqip
   *
   * @param config
   * return {Number} the width
   *
   * @private
   */
  getLqipWidth(config) {
    return config.lqip.width || config.supportedWidths.reduce((acc, val) => Math.min(acc, val), Number.MAX_SAFE_INTEGER);
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
    if (!config.lqip.type || ['inline', 'remote'].indexOf(config.lqip.type) < 0) {
      throw Error('You have to provide either \'inline\' or \'remote\' as \'type\' to enable lqip');
    }
    if (config.lqip.type === 'remote' && config.lqip.width && config.supportedWidths.indexOf(config.lqip.width) < 0) {
      throw Error('If you specify a \'width\' on a \'lqip\' \'remote\'-type it has to be one of the \'supportedWidths\'');
    }
  }
};
