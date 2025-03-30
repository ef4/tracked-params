import type { TemplateOnlyComponent } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
import BooleanExample from '../components/boolean-example.gts';

<template>
  <nav>
    <LinkTo @route="index">Home</LinkTo>
    <LinkTo @route="first">First</LinkTo>
    <LinkTo @route="second">Second</LinkTo>
    <BooleanExample />
  </nav>
  {{outlet}}
</template> satisfies TemplateOnlyComponent;
