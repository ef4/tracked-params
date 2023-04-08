import HistoryLocation from '@ember/routing/history-location';
import type { UpdateCallback } from '@ember/routing/location';

export default class extends HistoryLocation {
  constructor() {
    super();
    this.init();
  }

  private internalSearchParams: [string, string][] = [];

  getURL() {
    let realURL = super.getURL();
    let u = new URL(realURL, window.location.href);
    this.internalSearchParams = [...u.searchParams];
    return u.pathname;
  }

  setURL(url: string) {
    let u = new URL(url, window.location.href);
    for (let [k, v] of this.internalSearchParams) {
      u.searchParams.set(k, v);
    }
    super.setURL(u.pathname + u.search);
  }

  replaceURL(url: string) {
    // casting is due to https://github.com/emberjs/ember.js/pull/20434
    return super.replaceURL!(url);
  }

  formatURL(url: string) {
    let u = new URL(super.formatURL(url), window.location.href);
    for (let [k, v] of this.internalSearchParams) {
      u.searchParams.set(k, v);
    }
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
}
