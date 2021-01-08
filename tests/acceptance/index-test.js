import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);

  test('renders the lazy images', async function (assert) {
    await visit('/');
    assert
      .dom('.inline')
      .hasAttribute('src', new RegExp('data:image/jpeg;base64,'));
    assert
      .dom('.remote')
      .hasAttribute('src', '/assets/images/responsive/remote50w.jpg');
    assert.dom('.lazy').doesNotHaveAttribute('src');
    assert
      .dom('.bg-inline')
      .hasAttribute('style', new RegExp('background-image: url'));
    assert
      .dom('.bg-remote')
      .hasAttribute(
        'style',
        "background-image: url('/assets/images/responsive/remote50w.jpg');"
      );
    assert.dom('.bg-lazy').doesNotHaveAttribute('style');
  });
});
