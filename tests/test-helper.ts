import EmberApp from '@ember/application';
import Resolver from 'ember-resolver';
import EmberRouter from '@ember/routing/router';
import Location from '../src/locations/tracked-params-none.ts';

class Router extends EmberRouter {
  location = 'tracked-none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modulePrefix = 'test-app';
  Resolver = Resolver.withModules({
    'test-app/router': { default: Router },
    'test-app/locations/tracked-none': Location,
    ...Object.fromEntries(
      Object.entries(
        import.meta.glob('./app/templates/*.gts', { eager: true }),
      ).map(([k, v]) => [
        k.replace(/^\.\/app/, 'test-app').replace(/\.\w{2,3}$/, ''),
        v,
      ]),
    ),
  });
}

Router.map(function () {
  this.route('first');
  this.route('second');
});

import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
