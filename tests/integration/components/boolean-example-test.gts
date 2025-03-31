import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import BooleanExample from '../../app/components/boolean-example';

module('Integration | Component | boolean-example', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><BooleanExample /></template>);
    assert.dom('[data-test="enabled-message"]').hasText('');
  });
});
