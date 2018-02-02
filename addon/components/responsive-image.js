import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import ResponsiveImageComponent from 'ember-responsive-image/components/responsive-image';

/**
 * This component extends the `ResponsiveImage`-Component in a lazy manner and supports LQIP technique
 *
 *
 * @class ResponsiveImage
 * @extends Ember.Component
 * @namespace Components
 * @public
 */
export default ResponsiveImageComponent.extend({

  attributeBindings: ['lqipSrc:src'],

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
  lazyClassName: computed('lazy', function() {
    if (this.get('lazy') && typeof FastBoot === 'undefined') {
      return window.lazySizesConfig.lazyClass;
    }
  }),

  /**
   * returns the inline base64 encoded image if exists
   *
   * @property inlineSrc
   * @returns string|null the image content
   * @private
   */
  inlineSrc: computed('image', 'mediaType', 'lqip', function() {
    let img = this.get('image');
    if (this.get('lqip') && this.get('responsiveImage').hasInlineImage(img)) {
      return `data:${this.get('mediaType')};base64,${this.get('responsiveImage').getInlineImage(img)}`;
    }
    return null;
  }),

  /**
   * returns the remote lqip image url or origin src if lazy is false
   *
   * @property remoteSrc
   * @returns string|null the image content
   * @private
   */
  remoteSrc: computed('image', 'lqip', 'lazy', function() {
    let img = this.get('image');
    if (this.get('lqip') && this.get('responsiveImage').hasLqip(img)) {
      let lqip = this.get('responsiveImage').getImages(img).findBy('width', this.get('responsiveImage').getLqipWidth(img));
      if (lqip && lqip.image) {
        return lqip.image;
      }
    }
    if (!this.get('lazy')) {
      return this.get('src');
    }
    return null;
  }),

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
  mediaType: computed('image', function() {
    let imageExtension = this.get('image').split('.').pop();
    if (imageExtension.toLowerCase() === 'jpg') {
      imageExtension = 'jpeg';
    }
    return `image/${imageExtension.toLowerCase()}`;
  }),

  init() {
    this._super(...arguments);
    if (this.get('lazy')) {
      // We have to replace the origin attribute bindings to avoid bind `src`, `srcset` and `sizes`
      let newBindings = this.get('attributeBindings')
      .filter((attr) => {
        return !['src', 'srcset', 'sizes'].includes(attr);
      })
      .concat(['srcset:data-srcset', 'sizes:data-sizes', 'src:data-src']);
      this.set('attributeBindings', newBindings);
    }
  }
});
