import type { EvmChainId, WalletChain } from "./types";

export const EVM_CHAINS = {
  ethereum: {
    id: "ethereum",
    namespace: "eip155",
    chainId: 1,
    name: "Ethereum",
    nativeSymbol: "ETH",
    decimals: 18,
    explorerUrl: "https://etherscan.io",
  },
  base: {
    id: "base",
    namespace: "eip155",
    chainId: 8453,
    name: "Base",
    nativeSymbol: "ETH",
    decimals: 18,
    explorerUrl: "https://basescan.org",
  },
  arbitrum: {
    id: "arbitrum",
    namespace: "eip155",
    chainId: 42161,
    name: "Arbitrum One",
    nativeSymbol: "ETH",
    decimals: 18,
    explorerUrl: "https://arbiscan.io",
  },
  optimism: {
    id: "optimism",
    namespace: "eip155",
    chainId: 10,
    name: "OP Mainnet",
    nativeSymbol: "ETH",
    decimals: 18,
    explorerUrl: "https://optimistic.etherscan.io",
  },
  polygon: {
    id: "polygon",
    namespace: "eip155",
    chainId: 137,
    name: "Polygon",
    nativeSymbol: "POL",
    decimals: 18,
    explorerUrl: "https://polygonscan.com",
  },
  bnb: {
    id: "bnb",
    namespace: "eip155",
    chainId: 56,
    name: "BNB Smart Chain",
    nativeSymbol: "BNB",
    decimals: 18,
    explorerUrl: "https://bscscan.com",
  },
  avalanche: {
    id: "avalanche",
    namespace: "eip155",
    chainId: 43114,
    name: "Avalanche C-Chain",
    nativeSymbol: "AVAX",
    decimals: 18,
    explorerUrl: "https://snowtrace.io",
  },
} as const satisfies Record<EvmChainId, WalletChain>;

export function getEvmChain(id: EvmChainId): WalletChain {
  return EVM_CHAINS[id];
}

export function isSupportedEvmChainId(value: string): value is EvmChainId {
  return Object.prototype.hasOwnProperty.call(EVM_CHAINS, value);
}
