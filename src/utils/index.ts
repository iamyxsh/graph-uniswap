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
    tokens(first: ${first}, skip: ${skip}) {
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
