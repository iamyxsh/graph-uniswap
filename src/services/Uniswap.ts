import { EXCHANGE_TYPE, NETWORK_TYPE } from '../constants';
import axios from 'axios';
import { Token, UniswapToken } from '../models/Token';
import { TokenBalance } from '../types';
import { calculateValueInUSDC } from '../utils';

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

  getTokens(
    uniswapTokens: UniswapToken[],
    usdcPerEth: number,
    tokenAddressesPrice: string[],
    tokenBalances: TokenBalance[],
  ): [Token] {
    return uniswapTokens.map((uniToken) => {
      const token = new Token(
        uniToken.id,
        (usdcPerEth! * parseFloat(uniToken.derivedETH)).toString(),
        BigInt(0).toString(),
        uniToken.decimals,
        uniToken.symbol,
        uniToken.name,
        BigInt(0).toString(),
        EXCHANGE_TYPE.UNISWAP,
      );

      if (tokenAddressesPrice.includes(token.address)) {
        const tokenBalance = tokenBalances.filter(
          (tokenBalance) => tokenBalance.contractAddress === token.address,
        )[0] as TokenBalance;

        token.balancePrice = calculateValueInUSDC(
          BigInt(tokenBalance.tokenBalance).toString(),
          token.pricePerToken,
          token.decimals,
        ).toString();

        token.balance = BigInt(tokenBalance.tokenBalance).toString();
      }

      return token;
    }) as [Token];
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
