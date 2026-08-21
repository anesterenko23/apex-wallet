import { transitionTransaction } from "../../core/transactions/lifecycle";
import type { Transaction, TransactionReceipt, TransactionRequest } from "../../core/transactions/types";

export interface TransactionExecutor {
  prepare(request: TransactionRequest): Promise<Transaction>;
  sign(transaction: Transaction): Promise<Transaction>;
  broadcast(transaction: Transaction): Promise<Transaction>;
  getReceipt(transaction: Transaction): Promise<TransactionReceipt | null>;
}

export class TransactionService {
  constructor(private readonly executor: TransactionExecutor) {}

  prepare(request: TransactionRequest): Promise<Transaction> {
    return this.executor.prepare(request);
  }

  sign(transaction: Transaction): Promise<Transaction> {
    return this.executor.sign(transaction);
  }

  broadcast(transaction: Transaction): Promise<Transaction> {
    return this.executor.broadcast(transaction);
  }

  async refresh(transaction: Transaction): Promise<Transaction> {
    if (transaction.status !== "submitted") return transaction;
    const receipt = await this.executor.getReceipt(transaction);
    if (!receipt) return transaction;
    return {
      ...transitionTransaction(transaction, receipt.success ? "confirmed" : "failed"),
      receipt,
      hash: receipt.hash,
    };
  }
}
