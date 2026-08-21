import { arbitrum, base, mainnet, optimism, type Chain as ViemChain } from "viem/chains";
import type { Chain } from "../../core/chains/types";
import type { EvmNetwork, EvmNetworkId } from "./types";

function fromViem(id: EvmNetworkId, chain: ViemChain): EvmNetwork {
  return {
    id,
    chainId: chain.id,
    name: chain.name,
    testnet: chain.testnet ?? false,
    rpcUrls: chain.rpcUrls.default.http,
    explorerUrl: chain.blockExplorers?.default.url ?? "",
    nativeCurrency: chain.nativeCurrency,
  };
}

export const ethereumMainnet = fromViem("ethereum-mainnet", mainnet);
export const baseMainnet = fromViem("base-mainnet", base);
export const arbitrumMainnet = fromViem("arbitrum-mainnet", arbitrum);
export const optimismMainnet = fromViem("optimism-mainnet", optimism);

export const viemChainByNetworkId: Record<EvmNetworkId, ViemChain> = {
  "ethereum-mainnet": mainnet,
  "base-mainnet": base,
  "arbitrum-mainnet": arbitrum,
  "optimism-mainnet": optimism,
};

export const evmNetworkById: Record<EvmNetworkId, EvmNetwork> = {
  "ethereum-mainnet": ethereumMainnet,
  "base-mainnet": baseMainnet,
  "arbitrum-mainnet": arbitrumMainnet,
  "optimism-mainnet": optimismMainnet,
};

export const evmChains: readonly Chain[] = [
  {
    id: "ethereum",
    family: "evm",
    name: "Ethereum",
    defaultNetworkId: ethereumMainnet.id,
    networks: [ethereumMainnet],
  },
  {
    id: "base",
    family: "evm",
    name: "Base",
    defaultNetworkId: baseMainnet.id,
    networks: [baseMainnet],
  },
  {
    id: "arbitrum",
    family: "evm",
    name: "Arbitrum",
    defaultNetworkId: arbitrumMainnet.id,
    networks: [arbitrumMainnet],
  },
  {
    id: "optimism",
    family: "evm",
    name: "Optimism",
    defaultNetworkId: optimismMainnet.id,
    networks: [optimismMainnet],
  },
];
