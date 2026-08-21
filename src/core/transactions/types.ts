import type { ChainId, NetworkId } from "../chains/types";
import type { Address, Hex } from "../wallet/types";

export type TransactionStatus = "draft" | "prepared" | "signed" | "submitted" | "confirmed" | "failed";

export type TransactionRequest = {
  id: string;
  accountId: string;
  chainId: ChainId;
  networkId: NetworkId;
  from: Address;
  to: Address;
  value: bigint;
  data?: Hex;
};

export type TransactionReceipt = {
  transactionId: string;
  hash: Hex;
  blockNumber?: bigint;
  gasUsed?: bigint;
  success: boolean;
  confirmedAt?: string;
};

export type Transaction = {
  id: string;
  request: TransactionRequest;
  status: TransactionStatus;
  hash?: Hex;
  receipt?: TransactionReceipt;
  error?: string;
  createdAt: string;
  updatedAt: string;
};
