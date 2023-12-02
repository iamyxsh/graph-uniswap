import { Alchemy, Network } from 'alchemy-sdk';
import {
  ALCHEMY_API_KEY,
  UNISWAP_GRAPH_ENDPOINT,
  USDC_QUERY,
} from '../constants';
import axios from 'axios';
import { UniswapToken } from '../models/Token';

export const getAlchemyClient = (): Alchemy => {
  const config = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  return new Alchemy(config);
};

export const getQuery = (first: number, skip: number) => {
  return `{
    tokens(first: ${first}, skip: ${skip}, where: {
    id_in: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009"]}) {
      id
      symbol
      name
      decimals
      derivedETH
    }
  }`;
};

export const getUSDCperETH = async (): Promise<number> => {
  return axios
    .post(UNISWAP_GRAPH_ENDPOINT, { query: USDC_QUERY })
    .then((res) => res.data.data.token.derivedETH)
    .then((res) => 1 / res);
};

export const getUniswapTokens = async (
  query: string,
): Promise<[UniswapToken]> => {
  return axios
    .post(UNISWAP_GRAPH_ENDPOINT, { query })
    .then((res) => res.data.data.tokens as [UniswapToken]);
};
