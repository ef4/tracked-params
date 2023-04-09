import { babelToTSDecorator } from './decorator-types';
import { TrackedParam } from './tracked-param';
import { getLocation } from './locations/tracked-search-params';

function _trackedSearchParam(
  target: object,
  fieldName: string,
  originalDesc: PropertyDescriptor & { initializer?: () => any }
) {
  let trackedParam: TrackedParam | undefined;

  function getTrackedParam(obj: object): TrackedParam {
    if (!trackedParam) {
      trackedParam = getLocation(obj).activateParam(
        fieldName,
        originalDesc.initializer
      );
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

export const trackedSearchParam = babelToTSDecorator(_trackedSearchParam);
