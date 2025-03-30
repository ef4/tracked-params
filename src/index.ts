import { babelToTSDecorator } from './decorator-types';
import { getLocation } from './location';
import { TrackedParam, TrackedParamOpts } from './tracked-param';
import { registerDestructor } from '@ember/destroyable';

const trackedParams = new WeakMap<object, Map<string, TrackedParam<unknown>>>();

function setupDecorator<T>(
  opts: TrackedParamOpts<T>,
  fieldName: string,
  originalDesc: PropertyDescriptor & { initializer?: () => T }
) {
  function getTrackedParam(obj: object): TrackedParam<T> {
    let map = trackedParams.get(obj);
    if (!map) {
      map = new Map();
      trackedParams.set(obj, map);
    }
    let trackedParam = map.get(fieldName) as TrackedParam<T> | undefined;
    if (!trackedParam) {
      let location = getLocation(obj);
      if (location) {
        trackedParam = location.activateParam(
          fieldName,
          originalDesc.initializer,
          opts
        );
      } else {
        // tracked params intentional degrade gracefully to normal tracked
        // properties when there is no Location support install for them.
        trackedParam = new TrackedParam(
          originalDesc.initializer?.() as T,
          opts
        );
      }
      registerDestructor(obj, () => {
        trackedParam?.destroy();
      });
      map.set(fieldName, trackedParam as TrackedParam<unknown>);
    }
    return trackedParam;
  }

  return {
    enumerable: true,
    configurable: true,
    get() {
      return getTrackedParam(this).value;
    },
    set(value: any) {
      return getTrackedParam(this).update(value);
    },
  };
}

export const trackedParam = babelToTSDecorator(function (
  target: object,
  fieldName: string,
  desc: PropertyDescriptor
) {
  return setupDecorator({}, fieldName, desc);
});

export function createTrackedParam<T>(
  opts: TrackedParamOpts<T>
): PropertyDecorator {
  return babelToTSDecorator(function (
    target: object,
    fieldName: string,
    desc: PropertyDescriptor
  ) {
    return setupDecorator(opts, fieldName, desc);
  });
}

export const trackedBoolParam = createTrackedParam({
  serialize(value: boolean) {
    return value ? '1' : '0';
  },
  deserialize(value: string) {
    return value === '1';
  },
  validate(value: string): boolean {
    return value === '1' || value === '0';
  },
});

export const trackedNumberParam = createTrackedParam({
  serialize(value: number) {
    return String(value);
  },
  deserialize(value: string): number {
    return Number(value);
  },
  validate(value: string): boolean {
    return !isNaN(Number(value));
  },
});

export { TrackedParamsLocation } from './location';
