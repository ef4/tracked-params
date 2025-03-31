import EmberApp from '@ember/application';
import Resolver from 'ember-resolver';
import EmberRouter from '@ember/routing/router';
import NoneLocation from '../src/locations/tracked-params-none.ts';
import HistoryLocation from '../src/locations/tracked-params-history.ts';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

function buildApp({
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
    modulePrefix = 'test-app';
    Resolver = Resolver.withModules({
      'test-app/router': { default: Router },
      'test-app/locations/tracked-none': NoneLocation,
      'test-app/locations/tracked-history': HistoryLocation,
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

  return TestApp;
}

export function start() {
  const TestApp = buildApp({
    location: 'tracked-none',
    rootURL: '/',
  });
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

export function interactiveDemo() {
  const TestApp = buildApp({ location: 'tracked-history', rootURL: '/' });

  TestApp.create({
    autoboot: true,
  });
}
