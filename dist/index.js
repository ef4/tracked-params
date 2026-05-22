import { babelToTSDecorator } from './decorator-types.js';
import { getLocation } from './location.js';
export { trackedParamsLocation } from './location.js';
import { TrackedParam } from './tracked-param.js';
import { registerDestructor } from '@ember/destroyable';
export { default as TrackedParamsService } from './services/tracked-params.js';

const trackedParams = new WeakMap();
function setupDecorator(opts, fieldName, originalDesc) {
  function getTrackedParam(obj) {
    let map = trackedParams.get(obj);
    if (!map) {
      map = new Map();
      trackedParams.set(obj, map);
    }
    let trackedParam = map.get(fieldName);
    if (!trackedParam) {
      let location = getLocation(obj);
      if (location) {
        trackedParam = location.activateParam(fieldName, originalDesc.initializer, opts);
      } else {
        // tracked params intentional degrade gracefully to normal tracked
        // properties when there is no Location support install for them.
        trackedParam = new TrackedParam(originalDesc.initializer?.(), opts);
      }
      registerDestructor(obj, () => {
        trackedParam?.destroy();
      });
      map.set(fieldName, trackedParam);
    }
    return trackedParam;
  }
  return {
    enumerable: true,
    configurable: true,
    get() {
      return getTrackedParam(this).value;
    },
    set(value) {
      return getTrackedParam(this).update(value);
    }
  };
}
const trackedParam = babelToTSDecorator(function (target, fieldName, desc) {
  return setupDecorator({}, fieldName, desc);
});
function createTrackedParam(opts) {
  return babelToTSDecorator(function (target, fieldName, desc) {
    return setupDecorator(opts, fieldName, desc);
  });
}
const trackedBoolParam = createTrackedParam({
  serialize(value) {
    return value ? '1' : '0';
  },
  deserialize(value) {
    return value === '1';
  },
  validate(value) {
    return value === '1' || value === '0';
  }
});
const trackedNumberParam = createTrackedParam({
  serialize(value) {
    return String(value);
  },
  deserialize(value) {
    return Number(value);
  },
  validate(value) {
    return !isNaN(Number(value));
  }
});

export { createTrackedParam, trackedBoolParam, trackedNumberParam, trackedParam };
//# sourceMappingURL=index.js.map
