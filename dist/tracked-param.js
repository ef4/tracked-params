import { tracked } from '@glimmer/tracking';
import { g, i } from 'decorator-transforms/runtime-esm';

class TrackedParam {
  static {
    g(this.prototype, "internalValue", [tracked]);
  }
  #internalValue = (i(this, "internalValue"), void 0);
  constructor(value, opts, onChange, onDestroy) {
    this.opts = opts;
    this.onChange = onChange;
    this.onDestroy = onDestroy;
    this.internalValue = value;
  }
  destroy() {
    this.onDestroy?.(this);
  }
  get value() {
    return this.internalValue;
  }
  update(value) {
    this.internalValue = value;
    this.onChange?.();
  }
  get serializedValue() {
    if (this.opts?.serialize) {
      return this.opts.serialize(this.internalValue);
    } else {
      return String(this.internalValue);
    }
  }
  get showWhenEmpty() {
    return this.opts.showWhenEmpty ?? false;
  }
}

export { TrackedParam };
//# sourceMappingURL=tracked-param.js.map
