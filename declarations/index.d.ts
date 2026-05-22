import { type TrackedParamOpts } from './tracked-param.ts';
export declare const trackedParam: PropertyDecorator;
export declare function createTrackedParam<T>(opts: TrackedParamOpts<T>): PropertyDecorator;
export declare const trackedBoolParam: PropertyDecorator;
export declare const trackedNumberParam: PropertyDecorator;
export { trackedParamsLocation, type Config } from './location.ts';
export { default as TrackedParamsService } from './services/tracked-params.ts';
//# sourceMappingURL=index.d.ts.map