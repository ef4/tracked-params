import TrackedParamsService from '#src/services/tracked-params.ts';

export default class extends TrackedParamsService {
  ignored = ['interop'];
}
