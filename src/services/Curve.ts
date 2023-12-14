import { EXCHANGE_TYPE, NETWORK_TYPE } from '../constants';
import axios from 'axios';
import { CurveToken, Token } from '../models/Token';
import { TokenBalance } from '../types';
import { calculateValueInUSDC } from '../utils';

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
      .then((res) => res.data.data.token.lastPriceUSD);
  }

  async getTokensInfo(first: number, skip: number): Promise<CurveToken[]> {
    const query = this.getTokensQuery(first, skip);
    return axios
      .post(this.GRAPHQL_ENDPOINT, { query: query })
      .then((res) => res.data.data.tokens);
  }

  getTokens(
    tokens: CurveToken[],
    tokenAddressesPrice: string[],
    tokenBalances: TokenBalance[],
  ): [Token] {
    return tokens.map((curveToken) => {
      const token = new Token(
        curveToken.id,
        parseFloat(curveToken.lastPriceUSD).toString(),
        BigInt(0).toString(),
        curveToken.decimals,
        curveToken.symbol,
        curveToken.name,
        BigInt(0).toString(),
        EXCHANGE_TYPE.CURVE,
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
            	token(id: "${address}") {
                lastPriceUSD
              }
        }
    `;
  }

  private getTokensQuery(first: number, skip: number): string {
    return `
       {
          tokens(first: ${first}, skip: ${skip}) {
            id
            name
            symbol
            decimals
            lastPriceUSD
          }
        }
    `;
  }
}
