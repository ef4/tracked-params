import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { trackedParam, trackedNumberParam } from '../../../src/index.ts';

export default class Example extends Component {
  @trackedParam q = '';
  @trackedNumberParam count = 42;

  updateQ = (event: Event) => {
    this.q = (event.target as HTMLInputElement).value;
  };

  updateCount = (event: Event) => {
    this.count = Number((event.target as HTMLInputElement).value);
  };

  <template>
    <label>Q:
      <input
        data-test="q"
        value={{this.q}}
        {{on "keyup" this.updateQ}}
      /></label>
    <label>Count:
      <input
        type="number"
        value={{this.count}}
        {{on "change" this.updateCount}}
      /></label>
  </template>
}
