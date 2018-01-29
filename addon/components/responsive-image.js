import { computed, getWithDefault } from '@ember/object';
import { or } from '@ember/object/computed';
import ResponsiveImageComponent from 'ember-responsive-image/components/responsive-image';
import { getOwner } from '@ember/application';

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

  attributeBindings: ['lqipSrc:src', 'width', 'height'],

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
   * set the `width` attribute
   *
   * @property width
   * @type Number
   * @default null
   * @public
   */
  width: null,

  /**
   * set the `height` attribute
   *
   * @property height
   * @type Number
   * @default null
   * @public
   */
  height: null,

  /**
   * @property classNameBindings
   * @type string[]
   * @readOnly
   * @protected
   */
  classNameBindings: ['lazyClassName'],

  /**
   * returns the inline base64 encoded image
   *
   * @property inlineSrc
   * @returns {String} the image content
   * @public
   */
  lazyClassName: null,

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
   * returns the remote lqip image url
   *
   * @property remoteSrc
   * @returns string|null the image content
   * @private
   */
  remoteSrc: computed('image', 'lqip', function() {
    let img = this.get('image');
    if (this.get('lqip') && this.get('responsiveImage').hasLqip(img)) {
      return this.get('responsiveImage').getImageBySize(img, this.get('responsiveImage').getLqipWidth(img));
    }
    return null;
  }),

  /**
   * returns the LQIP image src or origin src as a fallback
   *
   * @property lqipSrc
   * @returns string the lqip image source
   * @private
   */
  lqipSrc: or('inlineSrc', 'remoteSrc', 'src'),

  /**
   * returns the media type based on the image extension
   *
   * @property mediaType
   * @returns {String} the media type
   * @private
   */
  mediaType: computed('image', function() {
    let imageExtension = this.get('image').split('.').pop();
    return `image/${imageExtension}`;
  }),

  init() {
    this._super(...arguments);
    if (this.get('lazy')) {
      // get the className from `ember-cli-lazysizes`-config
      let config = getOwner(this).resolveRegistration('config:environment');
      this.set('lazyClassName', getWithDefault(config, 'ember-cli-lazysizes.lazyClass', 'lazyload'));
      // We have to replace the origin attribute bindings to avoid bind `src`, `srcset` and `sizes`
      this.set('attributeBindings', ['srcset:data-srcset', 'sizes:data-sizes', 'src:data-src', 'lqipSrc:src', 'alt', 'width', 'height']);
    }
  }
});
