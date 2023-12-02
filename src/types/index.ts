import { Token } from '../models/Token';

export interface SwapService {
  getTokens(): Promise<[Token]>;
}

export type TokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};
