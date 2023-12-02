import { NETWORK_TYPE } from '../constants';

export class Uniswap {
  private network: NETWORK_TYPE;

  constructor(network: NETWORK_TYPE) {
    this.network = network;
  }
}
