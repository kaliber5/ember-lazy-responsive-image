import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { readOnly } from '@ember/object/computed';
import LazyLqipMixin from 'ember-lazy-responsive-image/mixins/lazy-lqip-mixin';
import { htmlSafe } from '@ember/string';
import ResponsiveBackgroundComponent from 'ember-responsive-image/components/responsive-background';

/**
 * This component extends the `ResponsiveBackground`-Component in a lazy manner and supports LQIP technique
 *
 *
 * @class ResponsiveBackground
 * @extends Ember.Component
 * @namespace Components
 * @public
 */
export default ResponsiveBackgroundComponent.extend(LazyLqipMixin, {

  attributeBindings: ['data-bgset', 'data-sizes'],

  /**
   * insert the stylesheets with the background image to the consumer
   *
   * @property style
   * @type string
   * @private
   */
  style: computed('lqipSrc', function() {
    if (isPresent(this.get('lqipSrc'))) {
      return htmlSafe(`background-image: url('${this.get('lqipSrc')}');`);
    }
    return null;
  }),

  /**
   * takes the image which fits at best and bind to the src attribute
   *
   * @property src
   * @type string
   * @private
   */
  src: readOnly('suitableSrc'),

  /**
   * the available images for background image
   *
   * @property data.bgset
   * @type string
   * @private
   */
  'data-bgset': computed('lazy', 'image', function() {
    if (this.get('lazy') === true) {
      return this.get('responsiveImage').getImages(this.get('image')).map((item) => {
        return `${item.image} ${item.width}w`;
      }, this).join(', ');
    } else {
      return null;
    }
  }),

  /**
   * the available sizes for background image
   *
   * @property data.bgset
   * @type string
   * @private
   */
  'data-sizes': computed('lazy', 'size', function() {
    if (this.get('lazy') === true &&  isPresent(this.get('size'))) {
      return this.get('size') + 'vw';
    }
    return null;
  })
});
