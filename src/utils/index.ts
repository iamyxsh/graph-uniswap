import { ETHConstants, NETWORK_TYPE } from '../constants';

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
  CURVE_GRAPH_ENDPOINT: string;
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
