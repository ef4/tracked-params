import TrackedParamsService from '#src/service.ts';

export default class extends TrackedParamsService {
  ignored = ['interop'];
}
