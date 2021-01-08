import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);
  setupResponsiveImage(hooks);

  test('it renders lazy by default', async function (assert) {
    await render(hbs`<ResponsiveImage @image="lazy.jpg" @size="100"/>`);
    assert
      .dom('img')
      .hasAttribute(
        'data-srcset',
        new RegExp('/assets/images/responsive/lazy800w.jpg 800w')
      );
    assert.dom('img').hasAttribute('data-sizes', '100vw');
    assert.dom('img').hasAttribute('data-src');
    assert.dom('img').hasClass('lazyload');
    assert.dom('img').doesNotHaveAttribute('src');
    assert.dom('img').doesNotHaveAttribute('srcset');
    assert.dom('img').doesNotHaveAttribute('sizes');
  });
  test('it skip lazy attributes if lazy is disabled', async function (assert) {
    await render(
      hbs`<ResponsiveImage @lazy={{false}} @image="lazy.jpg" @size="100"/>`
    );
    assert.dom('img').hasAttribute('src');
    assert.dom('img').hasAttribute('srcset');
    assert.dom('img').hasAttribute('sizes');
    assert.dom('img').hasNoClass('lazyload');
    assert.dom('img').doesNotHaveAttribute('data-src');
    assert.dom('img').doesNotHaveAttribute('data-srcset');
    assert.dom('img').doesNotHaveAttribute('data-sizes');
  });
  test('it supports lqip if configured', async function (assert) {
    this.set('image', 'remote.jpg');
    await render(hbs`<ResponsiveImage @image={{this.image}}/>`);
    assert
      .dom('img')
      .hasAttribute('src', '/assets/images/responsive/remote50w.jpg');
    this.set('image', 'inline.jpg');
    assert
      .dom('img')
      .hasAttribute('src', new RegExp('data:image/jpeg;base64,'));
  });
  test('it skip lqip if disabled', async function (assert) {
    this.set('image', 'remote.jpg');
    await render(hbs`<ResponsiveImage @image={{this.image}} @lqip={{false}}/>`);
    assert.dom('img').doesNotHaveAttribute('src');
    this.set('image', 'inline.jpg');
    assert.dom('img').doesNotHaveAttribute('src');
  });
});
