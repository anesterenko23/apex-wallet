import { transitionTransaction } from "../../core/transactions/lifecycle";
import type {
  Transaction,
  TransactionReceipt,
  TransactionRequest,
} from "../../core/transactions/types";

export interface TransactionExecutor {
  prepare(request: TransactionRequest): Promise<Transaction>;
  sign(transaction: Transaction, password: string): Promise<Transaction>;
  broadcast(transaction: Transaction): Promise<Transaction>;
  getReceipt(transaction: Transaction): Promise<TransactionReceipt | null>;
}

export class TransactionService {
  constructor(private readonly executor: TransactionExecutor) {}

  prepare(request: TransactionRequest): Promise<Transaction> {
    return this.executor.prepare(request);
  }

  confirm(transaction: Transaction): Transaction {
    if (!transaction.simulation?.success) {
      throw new Error("Transaction must pass simulation before confirmation");
    }
    return transitionTransaction(transaction, "authorized");
  }

  sign(transaction: Transaction, password: string): Promise<Transaction> {
    if (transaction.status !== "authorized") {
      throw new Error("Transaction must be explicitly authorized before signing");
    }
    return this.executor.sign(transaction, password);
  }

  broadcast(transaction: Transaction): Promise<Transaction> {
    if (transaction.status !== "signed") {
      throw new Error("Only signed transactions can be broadcast");
    }
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
