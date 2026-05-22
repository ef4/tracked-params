import RouteTemplate from 'ember-route-template';
import type InteropController from '../controllers/interop';
import { on } from '@ember/modifier';

export default RouteTemplate<{ Args: { controller: InteropController } }>(
  <template>
    interop:
    <span data-test="interop">{{@controller.interop}}</span>
    <button
      data-test="update"
      {{on "click" @controller.update}}
      type="button"
    >update</button>
  </template>,
);
