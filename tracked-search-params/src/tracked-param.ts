import { tracked } from '@glimmer/tracking';

export class TrackedParam<T = unknown> {
  @tracked internalValue: T;

  constructor(
    value: T,
    private onChange: () => void,
    private onDestroy: (tp: TrackedParam<T>) => void
  ) {
    this.internalValue = value;
  }

  destroy() {
    this.onDestroy(this);
  }

  get value(): T {
    return this.internalValue;
  }

  update(value: T): void {
    this.internalValue = value;
    this.onChange();
  }

  get serializedValue(): string {
    return String(this.internalValue);
  }
}
