import type Location from '@ember/routing/location';
import type { TrackedParam, TrackedParamOpts } from './tracked-param';
import { getOwner } from '@ember/owner';

// This is the additional API we add to Ember's Location interface.
export interface TrackedParamsLocation extends Location {
  activateParam<T>(
    paramName: string,
    initializer: (() => T) | undefined,
    opts: TrackedParamOpts<T>
  ): TrackedParam<T>;
}

const locations = new WeakMap<object, TrackedParamsLocation>();

export function getLocation(
  ownedObject: object
): TrackedParamsLocation | undefined {
  let owner = getOwner(ownedObject);
  if (!owner) {
    throw new Error(
      `trackedParams can only be used on objects that have an owner`
    );
  }
  return locations.get(owner);
}

export function setLocation(
  ownedObject: object,
  location: TrackedParamsLocation
): void {
  let owner = getOwner(ownedObject);
  if (!owner) {
    throw new Error(
      `trackedParams can only be used on objects that have an owner`
    );
  }
  locations.set(owner, location);
}
