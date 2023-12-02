import { NETWORK_TYPE } from '../constants';

export class Curve {
  private network: NETWORK_TYPE;

  constructor(network: NETWORK_TYPE) {
    this.network = network;
  }
}
