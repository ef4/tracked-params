import { TrackedParamsLocation } from '..';

export default {
  create(owning: object): TrackedParamsLocation {
    return new TrackedParamsLocation(owning, 'hash');
  },
};
