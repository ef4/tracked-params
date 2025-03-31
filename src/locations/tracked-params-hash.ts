import { TrackedParamsLocation } from '../index.ts';

export default {
  create(owning: object): TrackedParamsLocation {
    return new TrackedParamsLocation(owning, 'hash');
  },
};
