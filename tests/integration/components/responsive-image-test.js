import { expect } from 'chai';
import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import {
  setupRenderingTest,
} from 'ember-mocha';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  it,
  describe
} from 'mocha';

describe(
  'Integration: Responsive Image Component',
  function() {
    let hooks = setupRenderingTest();
    setupResponsiveImage(hooks);

    it('it renders lazy by default', async function() {
      await render(hbs`{{responsive-image image="lazy.jpg" size="100"}}`);
      expect(find('img').getAttribute('data-srcset')).to.have.string('/assets/images/responsive/lazy800w.jpg 800w');
      expect(find('img').getAttribute('data-sizes')).to.equal('100vw');
      expect(find('img').hasAttribute('data-src')).to.be.true;
      expect(find('img').getAttribute('class')).to.contain('lazyload');
      expect(find('img').hasAttribute('src')).to.be.false;
      expect(find('img').hasAttribute('srcset')).to.be.false;
      expect(find('img').hasAttribute('sizes')).to.be.false;
    });
    it('it skip lazy attributes if lazy is disabled', async function() {
      await render(hbs`{{responsive-image lazy=false image="lazy.jpg" size="100"}}`);
      expect(find('img').hasAttribute('src')).to.be.true;
      expect(find('img').hasAttribute('srcset')).to.be.true;
      expect(find('img').hasAttribute('sizes')).to.be.true;
      expect(find('img').getAttribute('class')).to.not.contain('lazyload');
      expect(find('img').hasAttribute('data-src')).to.be.false;
      expect(find('img').hasAttribute('data-srcset')).to.be.false;
      expect(find('img').hasAttribute('data-sizes')).to.be.false;
    });
    it('it supports lqip if configured', async function() {
      this.set('image', 'remote.jpg');
      await render(hbs`{{responsive-image image=image}}`);
      expect(find('img').getAttribute('src')).to.be.equal('/assets/images/responsive/remote50w.jpg');
      this.set('image', 'inline.jpg');
      expect(find('img').getAttribute('src')).to.have.string('data:image/jpeg;base64,');
    });
    it('it skip lqip if disabled', async function() {
      this.set('image', 'remote.jpg');
      await render(hbs`{{responsive-image image=image lqip=false}}`);
      expect(find('img').hasAttribute('src')).to.be.false;
      this.set('image', 'inline.jpg');
      expect(find('img').hasAttribute('src')).to.be.false;
    });
  }
);
