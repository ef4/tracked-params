export declare class TrackedParam<T = unknown> {
    private opts;
    private onChange?;
    private onDestroy?;
    internalValue: T;
    constructor(value: T, opts: TrackedParamOpts<T>, onChange?: (() => void) | undefined, onDestroy?: ((tp: TrackedParam<T>) => void) | undefined);
    destroy(): void;
    get value(): T;
    update(value: T): void;
    get serializedValue(): string;
    get showWhenEmpty(): boolean;
}
export interface TrackedParamOpts<T> {
    serialize?(value: T): string;
    deserialize?(value: string): T;
    validate?(value: string): boolean;
    showWhenEmpty?: boolean;
}
//# sourceMappingURL=tracked-param.d.ts.map