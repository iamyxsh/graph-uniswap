import { Args, Query, Resolver } from '@nestjs/graphql';
import { Token, UniswapToken } from '../models/Token';
import axios from 'axios';
import { Alchemy, Network, TokenBalance } from 'alchemy-sdk';
import * as bigInt from 'big-integer';
import * as web3 from 'web3';

const BN = require('bn.js');

const config = {
  apiKey: '__l3UiNvC8jfffRLdh7URN4vHLO1Ot9F',
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const graphqlEndpoint =
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const usdcQuery = `
  {
    token(id:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
      derivedETH
    }
}
`;

@Resolver('Query')
export class AppResolver {
  @Query(() => [Token])
  async tokens(
    @Args('wallet') wallet: string,
    @Args('first') first: number,
    @Args('skip') skip: number,
  ): Promise<[Token]> {
    const query = `
        {
            tokens(first: ${first}, skip: ${skip}, where:{
    id_in: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0xdac17f958d2ee523a2206206994597c13d831ec7", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", "0x514910771af9ca656af840dff83e8264ecf986ca", "0x4d224452801aced8b2f0aebe155379bb5d594381", "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"]
  }) {
                id
                symbol
                name
                decimals
                derivedETH
            }
        }
    `;

    const balances = await alchemy.core.getTokenBalances(wallet);
    const tokenAddressesPrice = balances.tokenBalances.map(
      (item) => item.contractAddress,
    );

    const usdcPerEth = await axios
      .post(graphqlEndpoint, { query: usdcQuery })
      .then((res) => res.data.data.token.derivedETH)
      .then((res) => 1 / res);

    const uniTokens = await axios
      .post(graphqlEndpoint, { query })
      .then((res) => res.data.data.tokens as [UniswapToken]);

    const tokens = uniTokens.map((item) => {
      const token = new Token(
        item.id,
        (usdcPerEth * parseFloat(item.derivedETH)).toString(),
        bigInt(0).toString(),
        item.decimals,
        item.symbol,
        item.name,
        bigInt(0).toString(),
      );

      if (tokenAddressesPrice.includes(token.address)) {
        const tokenBalance = balances.tokenBalances.filter(
          (item) => item.contractAddress === token.address,
        )[0] as TokenBalance;

        const weiPerUsdc = web3.utils.toWei(
          (1 / usdcPerEth).toString(),
          'ether',
        );

        const tokenPrice =
          BigInt(weiPerUsdc) *
          BigInt(web3.utils.toWei(item.derivedETH, 'ether'));

        token.balancePrice = calculateValueInUSDC(
          BigInt(tokenBalance.tokenBalance).toString(),
          (usdcPerEth * parseFloat(item.derivedETH)).toString(),
          parseInt(item.decimals),
        ).toString();

        token.balance = BigInt(tokenBalance.tokenBalance).toString();
      }

      return token;
    });

    return tokens as [Token];
  }
}

function calculateValueInUSDC(
  balance: string,
  pricePerToken: string,
  decimalPlaces: number,
) {
  const bal = parseInt(balance) / 10 ** decimalPlaces;
  return parseFloat(pricePerToken) * bal;
}
