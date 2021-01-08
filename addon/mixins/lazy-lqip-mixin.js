import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

/**
 * The Base Mixin for the responsive mixins
 *
 * @class LazyLqip
 * @namespace Mixins
 * @private
 */
export default Mixin.create({
  /**
   * set to false if you want to disable lazy loading
   *
   * @property lazy
   * @type boolean
   * @default true
   * @public
   */
  lazy: true,

  /**
   * set to false if you want to disable lqip feature
   *
   * @property lqip
   * @type boolean
   * @default true
   * @public
   */
  lqip: true,

  /**
   * @property classNameBindings
   * @type string[]
   * @readOnly
   * @protected
   */
  classNameBindings: ['lazyClassName'],

  /**
   * returns the lazysizes classname for lazy loading
   *
   * @property lazyClassName
   * @returns {String} name of the class
   * @private
   */
  lazyClassName: computed('lazy', function () {
    return this.lazy && typeof FastBoot === 'undefined'
      ? window.lazySizesConfig.lazyClass
      : undefined;
  }),

  /**
   * returns the inline base64 encoded image if exists
   *
   * @property inlineSrc
   * @returns string|null the image content
   * @private
   */
  inlineSrc: computed(
    'image',
    'lqip',
    'mediaType',
    'responsiveImage',
    function () {
      let img = this.image;
      if (this.lqip && this.responsiveImage.hasInlineImage(img)) {
        return `data:${
          this.mediaType
        };base64,${this.responsiveImage.getInlineImage(img)}`;
      }
      return null;
    }
  ),

  /**
   * returns the remote lqip image url or origin src if lazy is false
   *
   * @property remoteSrc
   * @returns string|null the image content
   * @private
   */
  remoteSrc: computed(
    'image',
    'lazy',
    'lqip',
    'responsiveImage',
    'src',
    function () {
      let img = this.image;
      if (this.lqip && this.responsiveImage.hasLqip(img)) {
        let lqip = this.responsiveImage
          .getImages(img)
          .findBy('width', this.responsiveImage.getLqipWidth(img));
        if (lqip && lqip.image) {
          return lqip.image;
        }
      }
      if (!this.lazy) {
        return this.src;
      }
      return null;
    }
  ),

  /**
   * returns the LQIP image src or origin src via remoteSrc
   *
   * @property lqipSrc
   * @returns string the lqip image source
   * @private
   */
  lqipSrc: or('inlineSrc', 'remoteSrc'),

  /**
   * returns the media type based on the image extension
   *
   * @property mediaType
   * @returns {String} the media type
   * @private
   */
  mediaType: computed('image', function () {
    let imageExtension = this.image.split('.').pop();
    if (imageExtension.toLowerCase() === 'jpg') {
      imageExtension = 'jpeg';
    }
    return `image/${imageExtension.toLowerCase()}`;
  }),
});
