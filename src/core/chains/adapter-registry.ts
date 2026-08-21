import type { ChainAdapter, ChainFamily, ChainId, NetworkId } from "./types";

export class ChainAdapterRegistry {
  private readonly adapters = new Map<ChainFamily, ChainAdapter>();

  constructor(adapters: readonly ChainAdapter[] = []) {
    for (const adapter of adapters) this.register(adapter);
  }

  register(adapter: ChainAdapter): void {
    if (this.adapters.has(adapter.family)) {
      throw new Error(`Adapter already registered for family: ${adapter.family}`);
    }
    this.adapters.set(adapter.family, adapter);
  }

  get(family: ChainFamily): ChainAdapter {
    const adapter = this.adapters.get(family);
    if (!adapter) throw new Error(`No adapter registered for family: ${family}`);
    return adapter;
  }

  resolve(family: ChainFamily, chainId: ChainId, networkId: NetworkId): ChainAdapter {
    const adapter = this.get(family);
    if (!adapter.supports(chainId, networkId)) {
      throw new Error(`Adapter ${family} does not support ${chainId}/${networkId}`);
    }
    return adapter;
  }
}
