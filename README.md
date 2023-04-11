# tracked-params

This is an Ember addon that gives you a way to reflect state into the search params (also known as "query params") of the URL.

While Ember's built-in router also offers query params support, that support was built for an earlier era of API and isn't as convenient as it could be. This addon is a candidate for how the built-in query params support should work in the upcoming Ember Polaris edition.

## Compatibility

- Ember.js v3.28 or above
- Embroider or ember-auto-import v2

## Installation

1. Install the package:

   ```
   ember install tracked-params
   ```

2. Delegate control over the URL to `tracked-params` by editing `config/environment.js` like this:

   ```diff
   const ENV = {
   -  locationType: 'history',
   +  locationType: 'tracked-params-history',
   +  historySupportMiddleware: true,
   }
   ```

   We support all the same location types as stock Ember, so you can also say `"tracked-params-hash"` or `"tracked-params-none"`.

## Usage

This addon provides a drop-in replacement for `@tracked` called `@trackedParam`:

```diff
import Component from '@glimmer/component';
import { Input } from '@ember/component';
-import { tracked } from '@glimmer/tracking';
+import { trackedParam } from 'tracked-params';

export default class Example extends Component {
-  @tracked q = '';
+  @trackedParam q = '';

  <template>
    <label>Search Terms: <Input @value={{this.q}} /></label>
  </template>
}
```

It works exactly like `tracked` except it also reflects the value as a search param in the URL. In the above example, if the user types "glimmer" in the input field, the URL bar will update to show `?q=glimmer`. If they then refresh the page, the value of `q` will be restored from the URL.

## Guide

### How State is Managed

1. When a `trackedParam` is first instantiated:

- if it finds a valid value already in the URL, it initializes itself from that value.
- otherwise it initializes itself with the initial value you've set in your code. In the above example, `@trackedParam q = ''` means we will default to an empty string if there is not already a value in the URL when we're starting up.

2. Once it's initialized, the trackedParam is the authoritative state. If you want to change it, you mutate the field as usual (like `this.q = "New value"`), and the change will automatically reflect to the URL.

3. When a `trackedParam` is destroyed (typically because the component its on is being torn down), it removes itself from the URL.

   This means that you control the **lifetime** of your state by placing it in the appropriate place in your hierarchy of components (or models, etc).

### Naming and Conflicts

If two parts of the app try to control the same search param simultaneously, we throw an exception. Params in the URL are fundamentally global.

### Data Types Beyond Strings

A `trackedParam` is always a string because that's what goes in a URL. But you can create other types using `createTrackedParam()`, and we provide pre-made `trackedBoolParam` and `trackedNumberParam` as conveniences.

Here's a complete example of a custom param for [luxon](https://moment.github.io/luxon/#/) DateTime's:

```js
import Component from '@glimmer/component';
import { createTrackedParam } from 'tracked-params';
import { DateTime } from 'luxon';
import { on } from '@ember/modifier';

const trackedDateParam = createTrackedParam({
  validate(s: string): boolean {
    return DateTime.fromISO(s).isValid;
  },
  serialize(date: DateTime): string {
    return date.toISODate();
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
```

### What's this Location stuff?

Our installation instructions tell you to change your application's `locationType`. This is Ember's abstraction over the URL. While most people only need to use Ember's built in location types (`'history'`, `'hash'`, and `'none'`), using a custom implementation instead of those is a longstanding public API.

Because the Location mediates all reading and writing of the URL, it's possible for an addon like `tracked-params` to implement its own policy outside the defaults provided by Ember.

If you _don't_ use one of our provided locationTypes, `trackedParam` doesn't error. It gracefully degrades to a normal tracked property. This is a deliberate choice because it makes it easier to render and test components in isolation, when no routing is available or appropriate.

If you already have a custom Location for unrelated reasons, our implementation composes around any existing Location, not just the three Ember built-in ones. For example, if you already have `app/locations/custom.js`, you can create `app/locations/tracked-params-custom.js` like this:

```js
import { TrackedParamsLocation } from 'tracked-params';
export default {
  create(owning) {
    return new TrackedParamsLocation(owning, 'custom');
  },
};
```

And then change your `locationType` from `custom` to `tracked-params-custom`.

### What's historySupportMiddleware?

Our installation instructions tell you to set `historySupportMiddleware`. This is needed when you're using `locationType: 'tracked-params-history'` because we want ember-cli's development web server to serve the app at all deeply nested URLs (just like it would if we kept using the `'history'` locationType), and by default it will only do that if it sees `locationType === 'history'`.

### Testing

In integration tests, components are rendered in isolation and there is not necessarily a router instantiated around them. In that case, `trackedParam` gracefully degrades to a normal tracked property. That is, your code continues to work the same but no actual URL is read or written.

Acceptance tests typically use Ember's `none` locationType. If you want to be able to `visit('/some?tracked_param=123')` in acceptance tests, change your testing `locationType` from `"none"` to `"tracked-params-none"`.

_Possible upcoming additions_: test-support utilities so you can

- optionally provide initial values to params in component integration tests
- assert about the current values in the (notional) URL in component integration tests

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
