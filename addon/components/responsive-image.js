import LazyLqipMixin from 'ember-lazy-responsive-image/mixins/lazy-lqip-mixin';
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
export default ResponsiveImageComponent.extend(LazyLqipMixin, {
  attributeBindings: ['lqipSrc:src'],

  init() {
    this._super(...arguments);
    if (this.lazy) {
      // We have to replace the origin attribute bindings to avoid bind `src`, `srcset` and `sizes`
      let newBindings = this.attributeBindings
        .filter((attr) => {
          return !['src', 'srcset', 'sizes'].includes(attr);
        })
        .concat(['srcset:data-srcset', 'sizes:data-sizes', 'src:data-src']);
      this.set('attributeBindings', newBindings);
    }
  },
});
