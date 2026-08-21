import type { PublicClient } from "viem";
import type { Network } from "../../core/chains/types";
import type { Address } from "../../core/wallet/types";

export type EvmAddress = Address & { readonly __evmAddress: unique symbol };

export type EvmNetworkId =
  | "ethereum-mainnet"
  | "base-mainnet"
  | "arbitrum-mainnet"
  | "optimism-mainnet";

export type EvmChainId = "ethereum" | "base" | "arbitrum" | "optimism";

export type EvmNetwork = Network & {
  id: EvmNetworkId;
  chainId: number;
};

export type EvmRpcUrls = Partial<Record<EvmNetworkId, string>>;

export type EvmClientFactory = (networkId: EvmNetworkId, rpcUrl?: string) => PublicClient;
