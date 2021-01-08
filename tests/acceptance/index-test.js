import { describe, it } from 'mocha';
import { setupApplicationTest } from 'ember-mocha';
import { expect } from 'chai';
import { visit, find } from '@ember/test-helpers';

describe('Acceptance | index', function () {
  setupApplicationTest();

  it('renders the lazy images', async function () {
    await visit('/');
    expect(find('.inline').getAttribute('src')).to.have.string(
      'data:image/jpeg;base64,'
    );
    expect(find('.remote').getAttribute('src')).to.be.equal(
      '/assets/images/responsive/remote50w.jpg'
    );
    expect(find('.lazy').hasAttribute('src')).to.be.false;
    expect(find('.bg-inline').getAttribute('style')).to.have.string(
      "background-image: url('data:image/jpeg;base64,"
    );
    expect(find('.bg-remote').getAttribute('style')).to.be.equal(
      "background-image: url('/assets/images/responsive/remote50w.jpg');"
    );
    expect(find('.bg-lazy').hasAttribute('style')).to.be.false;
  });
});
