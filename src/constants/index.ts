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
