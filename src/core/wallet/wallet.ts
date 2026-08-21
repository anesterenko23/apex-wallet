import { AccountNotFoundError, InvalidWalletStateError } from "./errors";
import type { Account, Wallet } from "./types";

export function attachAccount(wallet: Wallet, account: Account): Wallet {
  if (account.walletId !== wallet.id) throw new InvalidWalletStateError("Account belongs to another wallet");
  if (wallet.accountIds.includes(account.id)) return wallet;
  return {
    ...wallet,
    accountIds: [...wallet.accountIds, account.id],
    selectedAccountId: wallet.selectedAccountId ?? account.id,
  };
}

export function selectAccount(wallet: Wallet, accountId: string): Wallet {
  if (!wallet.accountIds.includes(accountId)) throw new AccountNotFoundError(`Account is not attached to wallet: ${accountId}`);
  return { ...wallet, selectedAccountId: accountId };
}
