export default scenarios();

function scenarios() {
  return {
    scenarios: [
      {
        name: 'ember-latest',
        npm: {
          devDependencies: {
            'ember-source': 'npm:ember-source@latest',
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': 'npm:ember-source@beta',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': 'npm:ember-source@alpha',
          },
        },
      },
    ],
  };
}
