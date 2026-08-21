import type { NetworkId } from "../../core/chains/types";
import type { Address, Token } from "../../core/wallet/types";

export type GasPrice = {
  networkId: NetworkId;
  wei: bigint;
  updatedAt: string;
};

export type TokenMetadata = Pick<Token, "contractAddress" | "symbol" | "name" | "decimals"> & {
  networkId: NetworkId;
};

export type TransactionHistoryItem = {
  hash: `0x${string}`;
  networkId: NetworkId;
  from: Address;
  to?: Address;
  value: bigint;
  blockNumber?: bigint;
  status: "confirmed" | "failed" | "pending";
  timestamp?: string;
};

export interface TransactionHistoryProvider {
  getAddressTransactions(networkId: NetworkId, address: Address): Promise<readonly TransactionHistoryItem[]>;
}
