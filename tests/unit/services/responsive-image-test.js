import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const meta = {
  prepend: '',
  'inline.png': {
    lqip: {
      width: 150,
      image: '00e24234f1b58e32b935b1041432916f',
    },
    images: [
      {
        image: '/assets/images/responsive/inline1000w.png',
        width: 1000,
        height: 1000,
      },
      {
        image: '/assets/images/responsive/inline500w.png',
        width: 500,
        height: 500,
      },
    ],
  },
  'remote.png': {
    lqip: {
      width: 500,
    },
    images: [
      {
        image: '/assets/images/responsive/remote1000w.png',
        width: 1000,
        height: 1000,
      },
      {
        image: '/assets/images/responsive/remote500w.png',
        width: 500,
        height: 500,
      },
    ],
  },
  'lazy.png': {
    images: [
      {
        image: '/assets/images/responsive/lazy1000w.png',
        width: 1000,
        height: 1000,
      },
      {
        image: '/assets/images/responsive/lazy500w.png',
        width: 500,
        height: 500,
      },
    ],
  },
};

module('ResponsiveImageService', function (hooks) {
  setupTest(hooks);
  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:responsive-image');
    this.service.set('meta', meta);
  });

  test('provides lqip enabled info from meta', function (assert) {
    assert.equal(this.service.hasLqip('inline.png'), true);
    assert.equal(this.service.hasLqip('remote.png'), true);
    assert.equal(this.service.hasLqip('lazy.png'), false);
  });
  test('provides inline image info from meta', function (assert) {
    assert.equal(this.service.hasInlineImage('remote.png'), false);
    assert.equal(this.service.hasInlineImage('lazy.png'), false);
    assert.equal(this.service.hasInlineImage('inline.png'), true);
    assert.equal(
      this.service.getInlineImage('inline.png'),
      meta['inline.png'].lqip.image
    );
  });
  test('provides the width of the lqip', function (assert) {
    assert.equal(
      this.service.getLqipWidth('inline.png'),
      meta['inline.png'].lqip.width
    );
    assert.equal(
      this.service.getLqipWidth('remote.png'),
      meta['remote.png'].lqip.width
    );
  });
});
