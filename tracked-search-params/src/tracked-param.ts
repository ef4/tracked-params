import { tracked } from '@glimmer/tracking';

export class TrackedParam<T = unknown> {
  @tracked internalValue: T;

  constructor(
    value: T,
    private opts: TrackedParamOpts<T>,
    private onChange?: () => void,
    private onDestroy?: (tp: TrackedParam<T>) => void
  ) {
    this.internalValue = value;
  }

  destroy() {
    this.onDestroy?.(this);
  }

  get value(): T {
    return this.internalValue;
  }

  update(value: T): void {
    this.internalValue = value;
    this.onChange?.();
  }

  get serializedValue(): string {
    if (this.opts?.serialize) {
      return this.opts.serialize(this.internalValue);
    } else {
      return String(this.internalValue);
    }
  }

  get showWhenEmpty(): boolean {
    return this.opts.showWhenEmpty ?? false;
  }
}

export interface TrackedParamOpts<T> {
  serialize?(value: T): string;
  deserialize?(value: string): T;
  validate?(value: string): boolean;
  showWhenEmpty?: boolean;
}
