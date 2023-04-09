import type Router from '@ember/routing/router';
import Service, { service } from '@ember/service';

export default class TrackedSearchParams extends Service {
  @service declare router: Router;
}
