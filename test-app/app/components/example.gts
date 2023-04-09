import Component from '@glimmer/component';
import { service } from '@ember/service';
// import type TrackedSearchParams from 'tracked-search-params/services/tracked-search-params';
import type TrackedSearchParamsLocation from 'tracked-search-params/locations/tracked-search-params';
import type Router from '@ember/routing/router';

export default class Example extends Component {
//  @service declare trackedSearchParams: TrackedSearchParams;
  @service declare router: Router;

  get message() {
    let tl = this.router.location as unknown as TrackedSearchParamsLocation;
    return tl.internalSearchParams.get('x');
  }

  <template>
    hello world {{this.message}}
  </template>
}