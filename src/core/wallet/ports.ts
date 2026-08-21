import type {
  BroadcastReceipt,
  EvmAddress,
  EvmChainId,
  Hex,
  PreparedTransaction,
  SignedTransaction,
  TransactionHash,
  TransactionRecord,
  TransactionRequest,
  WalletAccount,
} from "./types";

export type FeeEstimate = {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export interface KeyringPort {
  listAccounts(): Promise<WalletAccount[]>;
  signTransaction(accountId: string, transaction: PreparedTransaction): Promise<SignedTransaction>;
}

export interface RpcPort {
  getBalance(chainId: EvmChainId, address: EvmAddress): Promise<bigint>;
  getTransactionCount(chainId: EvmChainId, address: EvmAddress): Promise<bigint>;
  estimateFees(request: TransactionRequest): Promise<FeeEstimate>;
  broadcast(signedTransaction: SignedTransaction): Promise<BroadcastReceipt>;
  getTransactionReceipt(chainId: EvmChainId, hash: TransactionHash): Promise<TransactionRecord | null>;
}

export interface WalletStoragePort {
  getSelectedAccountId(): Promise<string | null>;
  setSelectedAccountId(accountId: string): Promise<void>;
  getSelectedChainId(): Promise<EvmChainId | null>;
  setSelectedChainId(chainId: EvmChainId): Promise<void>;
  listTransactions(): Promise<TransactionRecord[]>;
  saveTransaction(transaction: TransactionRecord): Promise<void>;
}

export interface MessageSignerPort {
  signMessage(accountId: string, message: string | Hex): Promise<Hex>;
}
