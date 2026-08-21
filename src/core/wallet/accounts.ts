import { DuplicateAccountError } from "./errors";
import type { Account } from "./types";

export function addAccount(accounts: readonly Account[], account: Account): readonly Account[] {
  if (accounts.some((item) => item.id === account.id || (item.chainId === account.chainId && item.address.toLowerCase() === account.address.toLowerCase()))) {
    throw new DuplicateAccountError(`Account already exists: ${account.id}`);
  }
  return [...accounts, account];
}

export function findAccount(accounts: readonly Account[], accountId: string): Account | undefined {
  return accounts.find((item) => item.id === accountId);
}
