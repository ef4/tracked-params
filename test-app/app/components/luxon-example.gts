import Component from '@glimmer/component';
import { createTrackedParam } from 'tracked-params';
import { DateTime } from 'luxon';
import { on } from '@ember/modifier';

const trackedDateParam = createTrackedParam({
  validate(s: string): boolean {
    return DateTime.fromISO(s).isValid;
  },
  serialize(date: DateTime): string {
    return date.toISODate()!;
  },
  deserialize(s: string): DateTime {
    return DateTime.fromISO(s);
  },
});

export default class Example extends Component {
  @trackedDateParam start = DateTime.now().startOf('day');

  get displayDate() {
    return this.start.toLocaleString(DateTime.DATETIME_MED);
  }

  tomorrow = () => { this.start = this.start.plus({ days: 1 }) }

  <template>
    <div>{{this.displayDate}}</div>
    <button {{on "click" this.tomorrow}}>Tomorrow</button>
  </template>
}