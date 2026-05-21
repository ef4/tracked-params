import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setTesting } from '@embroider/macros';
import { buildApp } from './app/app';

export function start() {
  setTesting(true);
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
