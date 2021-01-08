import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration: Responsive Background Component', function (hooks) {
  setupRenderingTest(hooks);
  setupResponsiveImage(hooks);

  test('it renders lazy by default', async function (assert) {
    await render(
      hbs`<ResponsiveBackground @image="lazy.jpg" @size="100" class="bg"/>`
    );
    assert
      .dom('div.bg')
      .hasAttribute(
        'data-bgset',
        new RegExp('/assets/images/responsive/lazy800w.jpg 800w')
      );
    assert.dom('div.bg').hasAttribute('data-sizes', '100vw');
    assert.dom('div.bg').hasClass('lazyload');
    assert.dom('div.bg').doesNotHaveAttribute('style');
  });
  test('it skip lazy attributes if lazy is disabled', async function (assert) {
    await render(
      hbs`<ResponsiveBackground @lazy={{false}} @image="lazy.jpg" @size="100" class="bg"/>`
    );
    assert
      .dom('div.bg')
      .hasAttribute('style', new RegExp('background-image: url'));
    assert.dom('div.bg').hasNoClass('lazyload');
  });
  test('it supports lqip if configured', async function (assert) {
    this.set('image', 'remote.jpg');
    await render(hbs`<ResponsiveBackground @image={{this.image}} class="bg"/>`);
    assert
      .dom('div.bg')
      .hasAttribute(
        'style',
        "background-image: url('/assets/images/responsive/remote50w.jpg');"
      );
    this.set('image', 'inline.jpg');
    assert
      .dom('div.bg')
      .hasAttribute('style', new RegExp('background-image: url'));
  });
  test('it skip lqip if disabled', async function (assert) {
    this.set('image', 'remote.jpg');
    await render(
      hbs`<ResponsiveBackground @image={{this.image}} @lqip={{false}} class="bg"/>`
    );
    assert.dom('div.bg').doesNotHaveAttribute('style');
    this.set('image', 'inline.jpg');
    assert.dom('div.bg').doesNotHaveAttribute('style');
  });
});
