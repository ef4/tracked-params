import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { trackedBoolSearchParam } from 'tracked-search-params';

export default class Example extends Component {
  @trackedBoolSearchParam enabled = false;

  toggleEnabled = () => { this.enabled = !this.enabled }

  <template>
    <input data-test="enabled-input" type="checkbox" checked={{this.enabled}} {{on "click" this.toggleEnabled}} />
    <span data-test="enabled-message">{{#if this.enabled}}Enabled!{{/if}}</span>
  </template>
}