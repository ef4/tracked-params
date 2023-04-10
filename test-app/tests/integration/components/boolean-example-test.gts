import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import BooleanExample from 'test-app/components/boolean-example';

module('Integration | Component | boolean-example', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><BooleanExample /></template>);
    assert.dom('[data-test="enabled-message"]').hasText('');
  });
});
