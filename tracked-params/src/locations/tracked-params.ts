import { TrackedParamsLocation } from '../location';
import { getOwner } from '@ember/owner';

export default {
  create(owning: object): TrackedParamsLocation {
    return new TrackedParamsLocation(getOwner(owning)!, 'history');
  },
};
