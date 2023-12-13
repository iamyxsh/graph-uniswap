import { Token, UniswapToken } from '../models/Token';
import { TokenBalance } from '../types';
import { ETHConstants, NETWORK_TYPE } from '../constants';

export const getTokens = (
  uniswapTokens: UniswapToken[],
  usdcPerEth: number,
  tokenAddressesPrice: string[],
  tokenBalances: TokenBalance[],
): [Token] => {
  return uniswapTokens.map((uniToken) => {
    const token = new Token(
      uniToken.id,
      (usdcPerEth! * parseFloat(uniToken.derivedETH)).toString(),
      BigInt(0).toString(),
      uniToken.decimals,
      uniToken.symbol,
      uniToken.name,
      BigInt(0).toString(),
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
};

export const calculateValueInUSDC = (
  balance: string,
  pricePerToken: string,
  decimalPlaces: number,
) => {
  const bal = parseInt(balance) / 10 ** decimalPlaces;
  return parseFloat(pricePerToken) * bal;
};

export const getNetworkInfo = (
  network: NETWORK_TYPE,
): {
  USDC_CONTRACT_ADDRESS: string;
  UNISWAP_GRAPH_ENDPOINT: string;
} => {
  switch (network) {
    case NETWORK_TYPE.POLYGON:
      break;
    case NETWORK_TYPE.OPTIMISM:
      break;
    case NETWORK_TYPE.ETHEREUM:
      return ETHConstants;
  }
};
