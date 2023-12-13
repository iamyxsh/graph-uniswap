import { NETWORK_TYPE } from '../constants';
import axios from 'axios';

export class Curve {
  private readonly network: NETWORK_TYPE;
  private readonly USDC_ADDRESS: string;
  private readonly GRAPHQL_ENDPOINT: string;

  constructor(
    network: NETWORK_TYPE,
    usdcAddress: string,
    graphqlEndpoint: string,
  ) {
    this.network = network;
    this.USDC_ADDRESS = usdcAddress;
    this.GRAPHQL_ENDPOINT = graphqlEndpoint;
  }

  async getUSDPerETH(): Promise<number | bigint> {
    const query = this.getTokenPerEthQuery(this.USDC_ADDRESS);
    return axios
      .post(this.GRAPHQL_ENDPOINT, { query: query })
      .then((res) => res.data.data.token.derivedETH)
      .then((res) => 1 / res);
  }

  private getTokenPerEthQuery(address: string): string {
    return `
        {
            token(id:"${address}") {
                derivedETH
            }
        }
    `;
  }
}
