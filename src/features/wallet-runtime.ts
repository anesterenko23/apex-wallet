import { EvmChainAdapter } from "../chains/evm/adapter";
import { evmChains } from "../chains/evm/networks";
import type { EvmRpcUrls } from "../chains/evm/types";
import { ChainAdapterRegistry } from "../core/chains/adapter-registry";
import { ChainRegistry } from "../core/chains/registry";
import { WalletCore } from "../core/wallet/wallet";

export function createWalletRuntime(rpcUrls: EvmRpcUrls = {}): WalletCore {
  const chains = new ChainRegistry(evmChains);
  const adapters = new ChainAdapterRegistry([new EvmChainAdapter(rpcUrls)]);
  return new WalletCore(chains, adapters);
}
