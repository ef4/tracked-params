import type Location from '@ember/routing/location';
import { TrackedParam, type TrackedParamOpts } from './tracked-param.ts';
import { getOwner } from '@ember/owner';
import type { UpdateCallback } from '@ember/routing/location';
import { setOwner } from '@ember/owner';
import { service } from '@ember/service';
import type TrackedParamsService from './services/tracked-params.ts';

export interface Config {
  innerLocationType?: string;
}

export function trackedParamsLocation(config: Config = {}) {
  return {
    create(owning: object): Location {
      return new TrackedParamsLocation(owning, config);
    },
  };
}

class TrackedParamsLocation implements Location {
  #innerLocation: Location;
  // as we initialize, we will read all the search params out of the URL. They
  // start out unclaimed, meaning they are not bound to any consumer.
  #unclaimedParams: Map<string, string> | undefined;

  #liveParams: Map<string, TrackedParam> = new Map();

  constructor(owning: object, config: Config = {}) {
    let owner = getOwner(owning);
    if (!owner) {
      throw new Error(`bug: TrackedParamsLocation expected to find an owner`);
    }
    setOwner(this, owner);
    this.#innerLocation = owner.lookup(
      `location:${config.innerLocationType ?? 'history'}`,
    )!;
    locations.set(owner, this);
  }

  @service declare trackedParams: TrackedParamsService;

  getURL() {
    let realURL = this.#innerLocation.getURL();
    let u = new URL(realURL, window.location.href);
    if (!this.#unclaimedParams) {
      // it's during the first getURL that we take initial values from the
      // actual URL bar. After that point, we are driving the state.
      this.#unclaimedParams = new Map([...u.searchParams]);
    }

    let passthrough = new URL(u.pathname, window.location.href);
    for (let [k, v] of this.#unclaimedParams) {
      if (this.trackedParams.ignored.includes(k)) {
        passthrough.searchParams.set(k, v);
      }
    }
    return passthrough.pathname + passthrough.search;
  }

  setURL(url: string) {
    this.#innerLocation.setURL(this.routerToBrowser(url));
  }

  // convert from the format the ember router sees to the format the underlying
  // Location sees.
  private routerToBrowser(url: string): string {
    let u = new URL(url, window.location.href);
    for (let [k, v] of this.#liveParams) {
      let serial = v.serializedValue;
      if (serial === '' && !v.showWhenEmpty) {
        u.searchParams.delete(k);
      } else {
        u.searchParams.set(k, serial);
      }
    }
    return u.pathname + u.search;
  }

  replaceURL(url: string) {
    if (this.#innerLocation.replaceURL) {
      return this.#innerLocation.replaceURL(this.routerToBrowser(url));
    } else {
      return this.#innerLocation.setURL(this.routerToBrowser(url));
    }
  }

  onUpdateURL(callback: UpdateCallback): void {
    this.#innerLocation.onUpdateURL(callback);
  }

  formatURL(url: string) {
    return this.#innerLocation.formatURL(this.routerToBrowser(url));
  }

  activateParam<T>(
    key: string,
    initializer: (() => T) | undefined,
    opts: TrackedParamOpts<T>,
  ): TrackedParam<T> {
    if (this.#liveParams.has(key)) {
      throw new Error(
        `multiple trackedSearchParam decorators are trying to control the search param "${key}"`,
      );
    }

    // guarantees that unclaimedParams is initialized
    let url = this.getURL();

    let value: T;

    // here is where a newly-booted-up trackedQueryParam gets its initial value
    // from the URL, rather than its own initializer
    if (this.#unclaimedParams?.has(key)) {
      let stringValue = this.#unclaimedParams.get(key)!;
      if (opts.validate && !opts.validate(stringValue)) {
        // failed validation means we're ignoring the preexisting value in the
        // URL as if it wasn't there.
        value = initializer?.() as T;
      } else {
        if (opts.deserialize) {
          value = opts.deserialize(stringValue);
        } else {
          value = stringValue as T;
        }
      }
      this.#unclaimedParams.delete(key);
    } else {
      value = initializer?.() as T;
    }

    let tp = new TrackedParam(
      value,
      opts,
      () => this.writeSearchParams(),
      (self) => this.removeParam(self as TrackedParam),
    );
    this.#liveParams.set(key, tp as TrackedParam);
    this.replaceURL(url);
    return tp;
  }

  private removeParam(tp: TrackedParam) {
    for (let [k, v] of this.#liveParams) {
      if (v === tp) {
        this.#liveParams.delete(k);
      }
    }
    this.writeSearchParams();
  }

  private writeSearchParams() {
    this.replaceURL(this.getURL());
  }

  get cancelRouterSetup() {
    return this.#innerLocation.cancelRouterSetup;
  }

  initState() {
    if (this.#innerLocation.initState) {
      this.#innerLocation.initState();
    }
  }

  destroy() {
    this.#innerLocation.destroy();
  }
}

const locations = new WeakMap<object, TrackedParamsLocation>();

export function getLocation(
  ownedObject: object,
): TrackedParamsLocation | undefined {
  let owner = getOwner(ownedObject);
  if (!owner) {
    throw new Error(
      `trackedParams can only be used on objects that have an owner`,
    );
  }
  return locations.get(owner);
}
