import { ALCHEMY_API_KEY, NETWORK_TYPE } from '../constants';
import { Alchemy, Network } from 'alchemy-sdk';
import { TokenBalance } from '../types';

export class AlchemyService {
  private network: NETWORK_TYPE;
  private client: Alchemy;

  constructor(network: NETWORK_TYPE) {
    this.network = network;
    this.client = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: this.getAlchemyNetwork(network),
    });
  }

  async getTokenBalances(wallet: string): Promise<TokenBalance[]> {
    return await this.client.core.getTokenBalances(wallet).then((res) =>
      res.tokenBalances.map((item) => ({
        contractAddress: item.contractAddress,
        tokenBalance: BigInt(item.tokenBalance).toString(),
      })),
    );
  }

  private getAlchemyNetwork(network: NETWORK_TYPE): Network {
    switch (network) {
      case NETWORK_TYPE.ETHEREUM:
        return Network.ETH_MAINNET;
      case NETWORK_TYPE.OPTIMISM:
        return Network.OPT_MAINNET;
      case NETWORK_TYPE.POLYGON:
        return Network.MATIC_MAINNET;
    }
  }
}
