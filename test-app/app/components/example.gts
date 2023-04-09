import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { trackedBoolSearchParam } from 'tracked-search-params';

export default class Example extends Component {
  @trackedBoolSearchParam enabled = false;

  toggleEnabled = () => { this.enabled = !this.enabled }

  <template>
    <input type="checkbox" checked={{this.enabled}} {{on "click" this.toggleEnabled}} />
    {{#if this.enabled}}Enabled!{{/if}}
  </template>
}