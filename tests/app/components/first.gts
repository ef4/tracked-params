import Component from '@glimmer/component';
import { Input } from '@ember/component';
import { on } from '@ember/modifier';
import { trackedParam, trackedNumberParam } from 'tracked-params';

export default class Example extends Component {
  @trackedParam q = '';
  @trackedNumberParam count = 42;

  updateCount = (event: any) => {
    this.count = Number(event.target.value);
  }

  <template>
    <label>Q: <Input data-test="q" @value={{this.q}} /></label>
    <label>Count: <input type="number" value={{this.count}} {{on "change" this.updateCount}} /></label>
  </template>
}