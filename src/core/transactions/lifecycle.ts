import type { Transaction, TransactionStatus } from "./types";

const allowedTransitions: Record<TransactionStatus, readonly TransactionStatus[]> = {
  draft: ["prepared", "failed"],
  prepared: ["signed", "failed"],
  signed: ["submitted", "failed"],
  submitted: ["confirmed", "failed"],
  confirmed: [],
  failed: [],
};

export function canTransitionTransaction(from: TransactionStatus, to: TransactionStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function transitionTransaction(transaction: Transaction, status: TransactionStatus, now = new Date().toISOString()): Transaction {
  if (!canTransitionTransaction(transaction.status, status)) {
    throw new Error(`Invalid transaction transition: ${transaction.status} -> ${status}`);
  }
  return { ...transaction, status, updatedAt: now };
}
