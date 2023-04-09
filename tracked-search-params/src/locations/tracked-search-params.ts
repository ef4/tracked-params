import HistoryLocation from '@ember/routing/history-location';
import type { UpdateCallback } from '@ember/routing/location';
import { getOwner } from '@ember/owner';
import { TrackedParam } from '../tracked-param';

export default class TrackedSearchParamsLocation extends HistoryLocation {
  constructor(owner: object) {
    super(owner);

    // HistoryLocation is a classic ember-object based class, so it has init
    // instead of a meaninful constructor:
    this.init();
  }

  // as we initialize, we will read all the search params out of the URL. They
  // start out unclaimed, meaning they are not bound to any consumer.
  private unclaimedParams: Map<string, string> | undefined;

  private liveParams: Map<string, TrackedParam> = new Map();

  getURL() {
    let realURL = super.getURL();
    let u = new URL(realURL, window.location.href);
    if (!this.unclaimedParams) {
      // it's during the first getURL that we take initial values from the
      // actual URL bar. After that point, we are driving the state.
      this.unclaimedParams = new Map([...u.searchParams]);
    }
    return u.pathname;
  }

  setURL(url: string) {
    let u = new URL(url, window.location.href);
    this.addSearchParams(u);
    super.setURL(u.pathname + u.search);
  }

  private addSearchParams(url: URL): void {
    if (this.unclaimedParams) {
      for (let [k, v] of this.unclaimedParams) {
        url.searchParams.set(k, v);
      }
    }
    for (let [k, v] of this.liveParams) {
      url.searchParams.set(k, v.serializedValue);
    }
  }

  replaceURL(url: string) {
    // casting is due to https://github.com/emberjs/ember.js/pull/20434
    return super.replaceURL!(url);
  }

  formatURL(url: string) {
    let u = new URL(super.formatURL(url), window.location.href);
    this.addSearchParams(u);
    return u.pathname + u.search;
  }
  initState() {
    // https://github.com/emberjs/ember.js/pull/20434
    super.initState!();

    // initialize our internalSearchParams from the URL
    this.getURL();
  }

  onUpdateURL(callback: UpdateCallback) {
    super.onUpdateURL((innerURL) => {
      console.log('on update', innerURL);
      callback(innerURL);
    });
  }

  activateParam(key: string, initializer: (() => any) | undefined) {
    if (this.liveParams.has(key)) {
      throw new Error(
        `multiple trackedSearchParam decorators are trying to control the search param "${key}"`
      );
    }

    // guarantees that unclaimedParams is initialized
    let url = this.getURL();

    let value: any;

    // here is where a newly-booted-up trackedQueryParam gets its initial value
    // from the URL, rather than its own initializer
    if (this.unclaimedParams?.has(key)) {
      value = this.unclaimedParams.get(key)!;
      this.unclaimedParams.delete(key);
    } else {
      value = initializer?.();
    }

    let tp = new TrackedParam(
      value,
      () => this.writeSearchParams(),
      (self) => this.removeParam(self)
    );
    this.liveParams.set(key, tp);
    this.setURL(url);
    return tp;
  }

  private removeParam(tp: TrackedParam) {
    for (let [k, v] of this.liveParams) {
      if (v === tp) {
        this.liveParams.delete(k);
      }
    }
    this.writeSearchParams();
  }

  private writeSearchParams() {
    this.setURL(this.getURL());
  }
}

export function getLocation(obj: object): TrackedSearchParamsLocation {
  let owner = getOwner(obj);
  if (!owner) {
    throw new Error(
      `trackedSearchParams decorator can only be used on objects that have an owner`
    );
  }
  return (owner.lookup('service:router') as any)
    .location as TrackedSearchParamsLocation;
}
