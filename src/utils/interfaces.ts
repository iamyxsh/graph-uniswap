import { Token } from '../models/Token';

export interface ITokenService {
  getTokensInfo(first: number, skip: number): Promise<[Token]>;

  getUSDPerETH(): Promise<number | bigint>;
}
