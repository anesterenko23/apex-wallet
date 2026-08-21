import type { Chain } from "../../core/chains/types";
import type { EvmNetwork } from "./types";

const native = (name: string, symbol: string) => ({ name, symbol, decimals: 18 as const });

export const ethereumMainnet: EvmNetwork = {
  id: "ethereum-mainnet",
  chainId: 1,
  name: "Ethereum Mainnet",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://etherscan.io",
  nativeCurrency: native("Ether", "ETH"),
};

export const baseMainnet: EvmNetwork = {
  id: "base-mainnet",
  chainId: 8453,
  name: "Base",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://basescan.org",
  nativeCurrency: native("Ether", "ETH"),
};

export const arbitrumMainnet: EvmNetwork = {
  id: "arbitrum-mainnet",
  chainId: 42161,
  name: "Arbitrum One",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://arbiscan.io",
  nativeCurrency: native("Ether", "ETH"),
};

export const optimismMainnet: EvmNetwork = {
  id: "optimism-mainnet",
  chainId: 10,
  name: "OP Mainnet",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://optimistic.etherscan.io",
  nativeCurrency: native("Ether", "ETH"),
};

export const polygonMainnet: EvmNetwork = {
  id: "polygon-mainnet",
  chainId: 137,
  name: "Polygon PoS",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://polygonscan.com",
  nativeCurrency: native("POL", "POL"),
};

export const bnbMainnet: EvmNetwork = {
  id: "bnb-mainnet",
  chainId: 56,
  name: "BNB Smart Chain",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://bscscan.com",
  nativeCurrency: native("BNB", "BNB"),
};

export const avalancheMainnet: EvmNetwork = {
  id: "avalanche-mainnet",
  chainId: 43114,
  name: "Avalanche C-Chain",
  testnet: false,
  rpcUrls: [],
  explorerUrl: "https://snowtrace.io",
  nativeCurrency: native("Avalanche", "AVAX"),
};

export const evmChains: readonly Chain[] = [
  { id: "ethereum", family: "evm", name: "Ethereum", defaultNetworkId: ethereumMainnet.id, networks: [ethereumMainnet] },
  { id: "base", family: "evm", name: "Base", defaultNetworkId: baseMainnet.id, networks: [baseMainnet] },
  { id: "arbitrum", family: "evm", name: "Arbitrum", defaultNetworkId: arbitrumMainnet.id, networks: [arbitrumMainnet] },
  { id: "optimism", family: "evm", name: "Optimism", defaultNetworkId: optimismMainnet.id, networks: [optimismMainnet] },
  { id: "polygon", family: "evm", name: "Polygon", defaultNetworkId: polygonMainnet.id, networks: [polygonMainnet] },
  { id: "bnb", family: "evm", name: "BNB Chain", defaultNetworkId: bnbMainnet.id, networks: [bnbMainnet] },
  { id: "avalanche", family: "evm", name: "Avalanche", defaultNetworkId: avalancheMainnet.id, networks: [avalancheMainnet] },
];
