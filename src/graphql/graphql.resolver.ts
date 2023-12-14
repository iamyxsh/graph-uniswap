import { Args, Query, Resolver } from '@nestjs/graphql';
import { Token } from '../models/Token';
import { getNetworkInfo } from '../utils';
import { NETWORK_TYPE } from '../constants';
import { AlchemyService, Curve, Uniswap } from '../services';
import { TokenBalance } from '../types';

@Resolver('Query')
export class AppResolver {
  @Query(() => [Token])
  async tokens(
    @Args('wallet') wallet: string,
    @Args('network') network: NETWORK_TYPE,
    @Args('first') first: number,
    @Args('skip') skip: number,
  ): Promise<[Token]> {
    try {
      const alchemy = new AlchemyService(network);
      const {
        USDC_CONTRACT_ADDRESS,
        UNISWAP_GRAPH_ENDPOINT,
        CURVE_GRAPH_ENDPOINT,
      } = getNetworkInfo(network);
      const uniswap = new Uniswap(
        network,
        USDC_CONTRACT_ADDRESS,
        UNISWAP_GRAPH_ENDPOINT,
      );

      const curve = new Curve(
        network,
        USDC_CONTRACT_ADDRESS,
        CURVE_GRAPH_ENDPOINT,
      );

      const tokenBalances: TokenBalance[] =
        await alchemy.getTokenBalances(wallet);
      const tokenAddressesPrice = alchemy.getTokenAddresses(tokenBalances);

      const result: Token[] = [];

      const usdcPerEthUni = (await uniswap.getUSDPerETH()!) as number;
      const uniTokens = await uniswap.getTokensInfo(first / 2, skip / 2);
      const res1 = uniswap.getTokens(
        uniTokens,
        usdcPerEthUni,
        tokenAddressesPrice,
        tokenBalances,
      );
      result.push(...res1);

      const curveTokens = await curve.getTokensInfo(first / 2, skip / 2);
      const res2 = curve.getTokens(
        curveTokens,
        tokenAddressesPrice,
        tokenBalances,
      );
      result.push(...res2);

      return result as [Token];
    } catch (err) {
      console.log(err);
    }
  }
}
