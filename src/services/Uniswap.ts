import { NETWORK_TYPE } from '../constants';
import axios from 'axios';
import { UniswapToken } from '../models/Token';

export class Uniswap {
  private network: NETWORK_TYPE;
  private USDC_ADDRESS: string;
  private GRAPHQL_ENDPOINT: string;

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

  async getTokensInfo(first: number, skip: number): Promise<UniswapToken[]> {
    const query = this.getTokensQuery(first, skip);
    return axios
      .post(this.GRAPHQL_ENDPOINT, { query: query })
      .then((res) => res.data.data.tokens);
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

  private getTokensQuery(first: number, skip: number): string {
    return `
       {
          tokens(first: ${first}, skip: ${skip}) {
            id
            symbol
            name
            decimals
            derivedETH
          }
       }
    `;
  }
}
