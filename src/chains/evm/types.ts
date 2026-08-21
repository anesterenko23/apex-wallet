import type { Network } from "../../core/chains/types";
import type { Address, Hex } from "../../core/wallet/types";
import type { TransactionRequest } from "../../core/transactions/types";

export type EvmAddress = Address & { readonly __evmAddress: unique symbol };

export type EvmNetwork = Network & {
  chainId: number;
};

export type EvmPreparedTransaction = TransactionRequest & {
  nonce: bigint;
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type EvmSignedTransaction = {
  transactionId: string;
  rawTransaction: Hex;
};
