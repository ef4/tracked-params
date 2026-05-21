import { LinkTo } from '@ember/routing';
import BooleanExample from '../components/boolean-example.gts';
import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    <nav>
      <LinkTo @route="index">Home</LinkTo>
      <LinkTo @route="first">First</LinkTo>
      <LinkTo @route="second">Second</LinkTo>
      <BooleanExample />
    </nav>
    {{outlet}}
  </template>,
);
