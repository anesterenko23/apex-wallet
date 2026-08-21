import { isSupportedEvmChainId } from "./chains";
import type { EvmAddress, TransactionRequest } from "./types";

const EVM_ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;
const HEX_PATTERN = /^0x(?:[0-9a-fA-F]{2})*$/;

export function isEvmAddress(value: string): value is EvmAddress {
  return EVM_ADDRESS_PATTERN.test(value);
}

export function assertTransactionRequest(request: TransactionRequest): void {
  if (!isSupportedEvmChainId(request.chainId)) {
    throw new Error(`unsupported chain: ${request.chainId}`);
  }
  if (!request.accountId.trim()) throw new Error("accountId is required");
  if (!isEvmAddress(request.from)) throw new Error("invalid from address");
  if (!isEvmAddress(request.to)) throw new Error("invalid to address");
  if (request.value < 0n) throw new Error("transaction value cannot be negative");
  if (request.data !== undefined && !HEX_PATTERN.test(request.data)) {
    throw new Error("transaction data must be even-length hex");
  }
  if (request.nonce !== undefined && request.nonce < 0n) throw new Error("nonce cannot be negative");
  if (request.gasLimit !== undefined && request.gasLimit <= 0n) {
    throw new Error("gasLimit must be greater than zero");
  }
  if (request.maxFeePerGas !== undefined && request.maxFeePerGas < 0n) {
    throw new Error("maxFeePerGas cannot be negative");
  }
  if (request.maxPriorityFeePerGas !== undefined && request.maxPriorityFeePerGas < 0n) {
    throw new Error("maxPriorityFeePerGas cannot be negative");
  }
  if (
    request.maxFeePerGas !== undefined &&
    request.maxPriorityFeePerGas !== undefined &&
    request.maxPriorityFeePerGas > request.maxFeePerGas
  ) {
    throw new Error("priority fee cannot exceed max fee");
  }
}
