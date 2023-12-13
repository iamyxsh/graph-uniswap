import { Args, Query, Resolver } from '@nestjs/graphql';
import { Token } from '../models/Token';
import { getNetworkInfo, getTokens } from '../utils';
import { NETWORK_TYPE } from '../constants';
import { AlchemyService, Uniswap } from '../services';
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
      const { USDC_CONTRACT_ADDRESS, UNISWAP_GRAPH_ENDPOINT } =
        getNetworkInfo(network);
      const uniswap = new Uniswap(
        network,
        USDC_CONTRACT_ADDRESS,
        UNISWAP_GRAPH_ENDPOINT,
      );

      const tokenBalances: TokenBalance[] =
        await alchemy.getTokenBalances(wallet);
      const tokenAddressesPrice = alchemy.getTokenAddresses(tokenBalances);

      const usdcPerEth = (await uniswap.getUSDPerETH()!) as number;
      const uniTokens = await uniswap.getTokensInfo(first / 2, skip / 2);

      return getTokens(
        uniTokens,
        usdcPerEth,
        tokenAddressesPrice,
        tokenBalances,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
