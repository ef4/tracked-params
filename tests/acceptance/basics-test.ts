import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { getOwner } from '@ember/owner';

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
    assert.dom('[data-test="interop"]').matchesText('123more');
    assert.strictEqual(currentURL(), '/interop?interop=123more');

    // checking the actual None location used in tests, because we want to
    // reflect what the underlying location is seeing, not what the router is
    // seeing.
    const value = getOwner(this)?.lookup('location:none').getURL();
    assert.ok(
      value?.includes('interop=123more'),
      `looking for updated interop=123more value, saw: ${value}`,
    );
  });
});
