# ember-lazy-responsive-image

[![CI](https://github.com/kaliber5/ember-lazy-responsive-image/workflows/CI/badge.svg)](https://github.com/kaliber5/ember-lazy-responsive-image/actions?query=workflow%3ACI+branch%3Amaster)

This ember-cli addon provides an ad-hoc replacement for the [responsive-image component](https://github.com/kaliber5/ember-responsive-image#the-responsive-image-component). It adds lazy-loading and LQIP (Low Quality Image Placeholder)-techniques to the [ember-responsive-image](https://github.com/kaliber5/ember-responsive-image) addon. It integrates the 
[lazysizes](https://github.com/aFarkas/lazysizes) library through [ember-cli-lazysizes](https://github.com/kaliber5/ember-cli-lazysizes).

See our [demo page](https://kaliber5.github.io/ember-lazy-responsive-image/)


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-lazy-responsive-image
```

Usage
------------------------------------------------------------------------------

The addon adds lazy-loading feature to the [responsive-image component](https://github.com/kaliber5/ember-responsive-image#the-responsive-image-component) without any need for changes in your configuration.
Furthermore it extends the configuration of the [ember-responsive-image](https://github.com/kaliber5/ember-responsive-image#basic-usage) addon with the new `lqip` option to enable LQIP-support:

```js
module.exports = function(environment) {
  let ENV = {
    'responsive-image': {
      // other options...
      lqip: {        
        type: 'inline',
        width: 150,
        quality: 50
      }      
    }
  }
}
```

**Note:** If you're using the responsive-background component, you have to enable the `bgset`-plugin for `ember-cli-lazysizes` in your `ember-cli-build.js` file, see: [plugins](https://github.com/kaliber5/ember-cli-lazysizes#plugins)

### Options

* **type:** The type of the LQIP, one of `inline` or `remote`. If type is `inline`, an placeholder-image will be generated as an base64-encoded string. There's no additional request necessary and the image is immediately available.
The downside is the application size increases because the encoded image becomes part of the application code. If type is `remote`, the image placeholder is one of the generated images, picked by the `width`-option.  
* **width:** (optional) If the `type`-option is `inline`, this will be the width of the inline placeholder-image. If type is `remote`, this has to be one of the `supportedWidths`-option. If you omit this option, the addon choose the lowest value from `supportedWidths`. 
* **quality:** (optional) If the `type`-option is `inline`, this is the quality of the inline placeholder-image. If not set, it inherits from the base configuration. This option has no effect if `type` is `remote`.

## The responsive-image component

The responsive image component replaces the origin [responsive-image component](https://github.com/kaliber5/ember-responsive-image#the-responsive-image-component) and supports laziness and LQIP out-of-the-box.
To disable lazyness and/or LQIP on a particular component, you can set the parameters `lazy` and/or `lqip` to false. 

```hbs
<ResponsiveImage @image="myImage.png" @lazy={{false}} @lqip={{false}}/>
```
## The responsive-background component

**Note:** If you're using the responsive-background component, you have to enable the `bgset`-plugin for `ember-cli-lazysizes` in your `ember-cli-build.js` file, see: [plugins](https://github.com/kaliber5/ember-cli-lazysizes#plugins)

The responsive background component replaces the origin [responsive-background component](https://github.com/kaliber5/ember-responsive-image#the-responsive-background-component) and supports laziness and LQIP out-of-the-box.
Like the responsive-image component, you can disable lazyness and/or LQIP through the parameters `lazy` and `lqip`. 

```hbs
<ResponsiveBackground @image="myImage.png" @lazy={{false}} @lqip={{false}}/>
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
