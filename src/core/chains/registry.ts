import type { Chain, ChainId, Network, NetworkId } from "./types";

export class ChainRegistry {
  private readonly chains = new Map<ChainId, Chain>();

  constructor(chains: readonly Chain[] = []) {
    for (const chain of chains) this.register(chain);
  }

  register(chain: Chain): void {
    if (this.chains.has(chain.id)) {
      throw new Error(`Chain already registered: ${chain.id}`);
    }

    const networkIds = new Set<NetworkId>();
    for (const network of chain.networks) {
      if (networkIds.has(network.id)) {
        throw new Error(`Duplicate network ${network.id} in chain ${chain.id}`);
      }
      networkIds.add(network.id);
    }

    if (!networkIds.has(chain.defaultNetworkId)) {
      throw new Error(`Default network ${chain.defaultNetworkId} is not part of chain ${chain.id}`);
    }

    this.chains.set(chain.id, chain);
  }

  get(chainId: ChainId): Chain {
    const chain = this.chains.get(chainId);
    if (!chain) throw new Error(`Unknown chain: ${chainId}`);
    return chain;
  }

  getNetwork(chainId: ChainId, networkId?: NetworkId): Network {
    const chain = this.get(chainId);
    const targetId = networkId ?? chain.defaultNetworkId;
    const network = chain.networks.find((item) => item.id === targetId);
    if (!network) throw new Error(`Unknown network ${targetId} for chain ${chainId}`);
    return network;
  }

  list(): readonly Chain[] {
    return [...this.chains.values()];
  }
}
