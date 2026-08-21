import type { TransactionReceipt } from "../transactions/types";
import type { Account, Address, Balance, WalletAsset } from "../wallet/types";

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

export type TokenContractMetadata = {
  name: string;
  symbol: string;
  decimals: number;
};

export interface ChainAdapter<TAddress extends string = string> {
  readonly family: ChainFamily;
  supports(chainId: ChainId, networkId: NetworkId): boolean;
  isValidAddress(address: string): address is TAddress;
  normalizeAddress(address: string): TAddress;
  getBalance(account: Account, asset: WalletAsset): Promise<Balance>;
  getGasPrice(networkId: NetworkId): Promise<bigint>;
  resolveName(name: string): Promise<Address | null>;
  getTokenMetadata(networkId: NetworkId, contractAddress: Address): Promise<TokenContractMetadata>;
  getTransactionReceipt(
    networkId: NetworkId,
    transactionId: string,
    hash: `0x${string}`,
  ): Promise<TransactionReceipt | null>;
}
