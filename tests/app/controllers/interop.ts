import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class InteropController extends Controller {
  queryParams = ['interop'];

  @tracked interop: string | undefined;

  update = () => {
    this.interop += 'more';
  };
}
