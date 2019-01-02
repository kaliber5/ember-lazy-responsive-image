import { expect } from 'chai';
import {
  setupTest
} from 'ember-mocha';
import {
  describe,
  it
} from 'mocha';

const meta = {
  "prepend": "",
  "inline.png": {
    lqip: {
      width: 150,
      image: '00e24234f1b58e32b935b1041432916f'
    },
    images: [
      {
        "image": "/assets/images/responsive/inline1000w.png",
        "width": 1000,
        "height": 1000
      },
      {
        "image": "/assets/images/responsive/inline500w.png",
        "width": 500,
        "height": 500
      }
    ]
  },
  "remote.png": {
    lqip: {
      width: 500
    },
    images: [
      {
        "image": "/assets/images/responsive/remote1000w.png",
        "width": 1000,
        "height": 1000
      },
      {
        "image": "/assets/images/responsive/remote500w.png",
        "width": 500,
        "height": 500
      }
    ]
  },
  "lazy.png": {
    images: [
      {
        "image": "/assets/images/responsive/lazy1000w.png",
        "width": 1000,
        "height": 1000
      },
      {
        "image": "/assets/images/responsive/lazy500w.png",
        "width": 500,
        "height": 500
      }
    ]
  }
};

describe(
  'ResponsiveImageService',
  function() {
    let hooks = setupTest();
    hooks.beforeEach(function() {
      this.service = this.owner.lookup('service:responsive-image');
      this.service.set('meta', meta);
    });

    it('provides lqip enabled info from meta', function() {
      expect(this.service.hasLqip('inline.png')).to.be.true;
      expect(this.service.hasLqip('remote.png')).to.be.true;
      expect(this.service.hasLqip('lazy.png')).to.be.false;
    });
    it('provides inline image info from meta', function() {
      expect(this.service.hasInlineImage('remote.png')).to.be.false;
      expect(this.service.hasInlineImage('lazy.png')).to.be.false;
      expect(this.service.hasInlineImage('inline.png')).to.be.true;
      expect(this.service.getInlineImage('inline.png')).to.be.equal(meta['inline.png'].lqip.image);
    });
    it('provides the width of the lqip', function() {
      expect(this.service.getLqipWidth('inline.png')).to.be.equal(meta['inline.png'].lqip.width);
      expect(this.service.getLqipWidth('remote.png')).to.be.equal(meta['remote.png'].lqip.width);
    });
  }
);
