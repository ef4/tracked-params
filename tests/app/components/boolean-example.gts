import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { trackedBoolParam } from '../../../src/index.ts';

export default class Example extends Component {
  @trackedBoolParam enabled = false;

  toggleEnabled = () => {
    this.enabled = !this.enabled;
  };

  <template>
    <label>
      <input
        data-test="enabled-input"
        type="checkbox"
        checked={{this.enabled}}
        {{on "click" this.toggleEnabled}}
      />
      <span data-test="enabled-message">{{#if
          this.enabled
        }}Enabled!{{/if}}</span>
    </label>
  </template>
}
