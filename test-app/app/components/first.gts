import Component from '@glimmer/component';
import { Input } from '@ember/component';
import { on } from '@ember/modifier';
import { trackedSearchParam, trackedNumberSearchParam } from 'tracked-search-params';

export default class Example extends Component {
  @trackedSearchParam q = '';
  @trackedNumberSearchParam count = 42;

  updateCount = (event: any) => {
    this.count = Number(event.target.value);
  }

  <template>
    <Input @value={{this.q}} />
    <input type="number" value={{this.count}} {{on "change" this.updateCount}} />
  </template>
}