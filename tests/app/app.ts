import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import NoneLocation from '#src/locations/tracked-params-none.ts';
import HistoryLocation from '#src/locations/tracked-params-history.ts';

export function buildApp({
  location,
  rootURL,
}: {
  location: string;
  rootURL: string;
}) {
  class Router extends EmberRouter {
    location = location;
    rootURL = rootURL;
  }

  class TestApp extends EmberApp {
    modules = {
      './router': { default: Router },
      './locations/tracked-none': NoneLocation,
      './locations/tracked-history': HistoryLocation,
      ...import.meta.glob('./templates/*.gts', { eager: true }),
    };
  }

  Router.map(function () {
    this.route('first');
    this.route('second');
  });

  return TestApp;
}
