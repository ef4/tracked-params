import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | basics', function (hooks) {
  setupApplicationTest(hooks);

  test('tracked params can initialize from visit arguments', async function (assert) {
    await visit('/first?q=hello');
    assert.dom('[data-test="q"]').hasValue('hello');

    // potential footgun: currentURL reflects what the classic router sees, and
    // we are hiding our params from it.
    assert.strictEqual(currentURL(), '/first');
  });

  test('interopability with traditional query params', async function (assert) {
    await visit('/interop?interop=123');
    assert.dom('[data-test="interop"]').matchesText('123');
    await click('[data-test="update"]');
    assert.dom('[data-test="interop"]').matchesText('123!');
    assert.strictEqual(currentURL(), '/interop?interop=123!');
  });
});
