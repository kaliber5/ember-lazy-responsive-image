import { expect } from 'chai';
import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import { setupRenderingTest } from 'ember-mocha';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { it, describe } from 'mocha';

describe('Integration: Responsive Background Component', function () {
  let hooks = setupRenderingTest();
  setupResponsiveImage(hooks);

  it('it renders lazy by default', async function () {
    await render(
      hbs`{{responsive-background image="lazy.jpg" size="100" class="bg"}}`
    );
    expect(find('div.bg').getAttribute('data-bgset')).to.have.string(
      '/assets/images/responsive/lazy800w.jpg 800w'
    );
    expect(find('div.bg').getAttribute('data-sizes')).to.equal('100vw');
    expect(find('div.bg').getAttribute('class')).to.contain('lazyload');
    expect(find('div.bg').hasAttribute('style')).to.be.false;
  });
  it('it skip lazy attributes if lazy is disabled', async function () {
    await render(
      hbs`{{responsive-background lazy=false image="lazy.jpg" size="100" class="bg"}}`
    );
    expect(find('div.bg').hasAttribute('style')).to.be.true;
    expect(find('div.bg').getAttribute('style')).to.have.string(
      'background-image: url('
    );
    expect(find('div.bg').getAttribute('class')).to.not.contain('lazyload');
  });
  it('it supports lqip if configured', async function () {
    this.set('image', 'remote.jpg');
    await render(hbs`{{responsive-background image=image class="bg"}}`);
    expect(find('div.bg').getAttribute('style')).to.be.equal(
      "background-image: url('/assets/images/responsive/remote50w.jpg');"
    );
    this.set('image', 'inline.jpg');
    expect(find('div.bg').getAttribute('style')).to.have.string(
      "background-image: url('data:image/jpeg;base64,"
    );
  });
  it('it skip lqip if disabled', async function () {
    this.set('image', 'remote.jpg');
    await render(
      hbs`{{responsive-background image=image lqip=false class="bg"}}`
    );
    expect(find('div.bg').hasAttribute('style')).to.be.false;
    this.set('image', 'inline.jpg');
    expect(find('div.bg').hasAttribute('style')).to.be.false;
  });
});
