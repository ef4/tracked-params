import type Location from '@ember/routing/location';
import { TrackedParam, type TrackedParamOpts } from './tracked-param.ts';
import type { UpdateCallback } from '@ember/routing/location';
import type TrackedParamsService from './services/tracked-params.ts';
export interface Config {
    innerLocationType?: string;
}
export declare function trackedParamsLocation(config?: Config): {
    create(owning: object): Location;
};
declare class TrackedParamsLocation implements Location {
    #private;
    constructor(owning: object, config?: Config);
    trackedParams: TrackedParamsService;
    getURL(): string;
    setURL(url: string): void;
    private routerToBrowser;
    replaceURL(url: string): void;
    onUpdateURL(callback: UpdateCallback): void;
    formatURL(url: string): string;
    activateParam<T>(key: string, initializer: (() => T) | undefined, opts: TrackedParamOpts<T>): TrackedParam<T>;
    private removeParam;
    private writeSearchParams;
    get cancelRouterSetup(): boolean | undefined;
    initState(): void;
    destroy(): void;
}
export declare function getLocation(ownedObject: object): TrackedParamsLocation | undefined;
export {};
//# sourceMappingURL=location.d.ts.map