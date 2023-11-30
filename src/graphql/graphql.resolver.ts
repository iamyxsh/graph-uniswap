import { Args, Query, Resolver } from '@nestjs/graphql';
import { Token } from '../models/Token';
import { TokenBalance } from 'alchemy-sdk';
import {
  getAlchemyClient,
  getQuery,
  getUniswapTokens,
  getUSDCperETH,
} from '../utils';

const alchemy = getAlchemyClient();

@Resolver('Query')
export class AppResolver {
  @Query(() => [Token])
  async tokens(
    @Args('wallet') wallet: string,
    @Args('first') first: number,
    @Args('skip') skip: number,
  ): Promise<[Token]> {
    try {
      const balances = await alchemy.core.getTokenBalances(wallet);
      const tokenAddressesPrice = balances.tokenBalances.map(
        (item) => item.contractAddress,
      );

      const usdcPerEth = await getUSDCperETH()!;
      const uniTokens = await getUniswapTokens(getQuery(first, skip));

      const tokens = uniTokens.map((item) => {
        const token = new Token(
          item.id,
          (usdcPerEth! * parseFloat(item.derivedETH)).toString(),
          BigInt(0).toString(),
          item.decimals,
          item.symbol,
          item.name,
          BigInt(0).toString(),
        );

        if (tokenAddressesPrice.includes(token.address)) {
          const tokenBalance = balances.tokenBalances.filter(
            (item) => item.contractAddress === token.address,
          )[0] as TokenBalance;

          token.balancePrice = calculateValueInUSDC(
            BigInt(tokenBalance.tokenBalance).toString(),
            token.pricePerToken,
            token.decimals,
          ).toString();

          token.balance = BigInt(tokenBalance.tokenBalance).toString();
        }

        return token;
      });

      return tokens as [Token];
    } catch (err) {
      console.log(err);
    }
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
