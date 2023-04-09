import Component from '@glimmer/component';
import { Input } from '@ember/component';
import { trackedSearchParam } from 'tracked-search-params';

export default class Example extends Component {
  @trackedSearchParam q = '';

  <template>
    <Input @value={{this.q}} />
  </template>
}