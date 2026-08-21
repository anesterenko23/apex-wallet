export type ChainFamily = "evm" | "solana";

export type ChainId = string;
export type NetworkId = string;

export type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export type Network = {
  id: NetworkId;
  chainId: number | string;
  name: string;
  testnet: boolean;
  rpcUrls: readonly string[];
  explorerUrl: string;
  nativeCurrency: NativeCurrency;
};

export type Chain = {
  id: ChainId;
  family: ChainFamily;
  name: string;
  defaultNetworkId: NetworkId;
  networks: readonly Network[];
};

export interface ChainAdapter<TAddress extends string = string> {
  readonly family: ChainFamily;
  isValidAddress(address: string): address is TAddress;
  normalizeAddress(address: string): TAddress;
}
