import type { ChainId, NetworkId } from "../chains/types";
import type { Address, Hex } from "../wallet/types";

export type TransactionStatus =
  | "draft"
  | "awaiting_confirmation"
  | "authorized"
  | "signed"
  | "submitted"
  | "confirmed"
  | "failed";

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

export type PreparedTransaction = {
  nonce: bigint;
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type TransactionSimulation = {
  success: boolean;
  error?: string;
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
  prepared?: PreparedTransaction;
  simulation?: TransactionSimulation;
  hash?: Hex;
  receipt?: TransactionReceipt;
  error?: string;
  createdAt: string;
  updatedAt: string;
};
