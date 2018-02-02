import { find } from 'ember-native-dom-helpers';
import { expect } from 'chai';
import { initialize } from 'ember-responsive-image/instance-initializers/responsive-meta';
import {
  setupComponentTest,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {
  before,
  describe
} from 'mocha';

describe(
  'Integration: Responsive Image Component',
  function() {
    setupComponentTest('responsive-image', {
      integration: true
    });
    before(function() {
      initialize();
    });
    it('it renders lazy by default', function() {
      this.render(hbs`{{responsive-image image="lazy.png" size="100"}}`);
      expect(find('img').getAttribute('data-srcset')).to.have.string('/assets/images/responsive/lazy1000w.png 1000w');
      expect(find('img').getAttribute('data-sizes')).to.equal('100vw');
      expect(find('img').hasAttribute('data-src')).to.be.true;
      expect(find('img').getAttribute('class')).to.contain('lazyload');
      expect(find('img').hasAttribute('src')).to.be.false;
      expect(find('img').hasAttribute('srcset')).to.be.false;
      expect(find('img').hasAttribute('sizes')).to.be.false;
    });
    it('it skip lazy attributes if lazy is disabled', function() {
      this.render(hbs`{{responsive-image lazy=false image="lazy.png" size="100"}}`);
      expect(find('img').hasAttribute('src')).to.be.true;
      expect(find('img').hasAttribute('srcset')).to.be.true;
      expect(find('img').hasAttribute('sizes')).to.be.true;
      expect(find('img').getAttribute('class')).to.not.contain('lazyload');
      expect(find('img').hasAttribute('data-src')).to.be.false;
      expect(find('img').hasAttribute('data-srcset')).to.be.false;
      expect(find('img').hasAttribute('data-sizes')).to.be.false;
    });
    it('it supports lqip if configured', function() {
      this.set('image', 'remote.png');
      this.render(hbs`{{responsive-image image=image}}`);
      expect(find('img').getAttribute('src')).to.be.equal('/assets/images/responsive/remote50w.png');
      this.set('image', 'inline.png');
      expect(find('img').getAttribute('src')).to.have.string('data:image/png;base64,');
    });
    it('it skip lqip if disabled', function() {
      this.set('image', 'remote.png');
      this.render(hbs`{{responsive-image image=image lqip=false}}`);
      expect(find('img').hasAttribute('src')).to.be.false;
      this.set('image', 'inline.png');
      expect(find('img').hasAttribute('src')).to.be.false;
    });
  }
);
