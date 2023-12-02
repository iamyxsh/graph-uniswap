export const ALCHEMY_API_KEY = '__l3UiNvC8jfffRLdh7URN4vHLO1Ot9F';
export const UNISWAP_GRAPH_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
export const USDC_CONTRACT_ADDRESS =
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

export const USDC_QUERY = `
  {
    token(id:"${USDC_CONTRACT_ADDRESS}") {
      derivedETH
    }
}
`;

export enum NETWORK_TYPE {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  OPTIMISM = 'optimism',
}

// Net work - erth poly optimism
// fecth token ifo from uniswap + curev graph
// fecth usr balance from alchemy for all theb above nets
// fecth - 100 tokens from graph (total volume)
// order based ion combined (uni + curve) volume
