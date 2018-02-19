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
  'Integration: Responsive Background Component',
  function() {
    setupComponentTest('responsive-background', {
      integration: true
    });
    before(function() {
      initialize();
    });
    it('it renders lazy by default', function() {
      this.render(hbs`{{responsive-background image="lazy.jpg" size="100" class="bg"}}`);
      expect(find('div.bg').getAttribute('data-bgset')).to.have.string('/assets/images/responsive/lazy800w.jpg 800w');
      expect(find('div.bg').getAttribute('data-sizes')).to.equal('100vw');
      expect(find('div.bg').getAttribute('class')).to.contain('lazyload');
      expect(find('div.bg').hasAttribute('style')).to.be.false;
    });
    it('it skip lazy attributes if lazy is disabled', function() {
      this.render(hbs`{{responsive-background lazy=false image="lazy.jpg" size="100" class="bg"}}`);
      expect(find('div.bg').hasAttribute('style')).to.be.true;
      expect(find('div.bg').getAttribute('style')).to.have.string('background-image: url(');
      expect(find('div.bg').getAttribute('class')).to.not.contain('lazyload');
    });
    it('it supports lqip if configured', function() {
      this.set('image', 'remote.jpg');
      this.render(hbs`{{responsive-background image=image class="bg"}}`);
      expect(find('div.bg').getAttribute('style')).to.be.equal('background-image: url(\'/assets/images/responsive/remote50w.jpg\');');
      this.set('image', 'inline.jpg');
      expect(find('div.bg').getAttribute('style')).to.have.string('background-image: url(\'data:image/jpeg;base64,');
    });
    it('it skip lqip if disabled', function() {
      this.set('image', 'remote.jpg');
      this.render(hbs`{{responsive-background image=image lqip=false class="bg"}}`);
      expect(find('div.bg').hasAttribute('style')).to.be.false;
      this.set('image', 'inline.jpg');
      expect(find('div.bg').hasAttribute('style')).to.be.false;
    });
  }
);
