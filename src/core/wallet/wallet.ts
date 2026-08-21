import { ChainAdapterRegistry } from "../chains/adapter-registry";
import { ChainRegistry } from "../chains/registry";
import type { TransactionReceipt } from "../transactions/types";
import { AccountNotFoundError, InvalidWalletStateError } from "./errors";
import type { Account, Balance, Wallet, WalletAsset } from "./types";

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
  if (!wallet.accountIds.includes(accountId)) {
    throw new AccountNotFoundError(`Account is not attached to wallet: ${accountId}`);
  }
  return { ...wallet, selectedAccountId: accountId };
}

export class WalletCore {
  constructor(
    private readonly chains: ChainRegistry,
    private readonly adapters: ChainAdapterRegistry,
  ) {}

  async getBalance(account: Account, asset: WalletAsset): Promise<Balance> {
    if (account.chainId !== asset.chainId) {
      throw new InvalidWalletStateError(
        `Account ${account.id} cannot read asset ${asset.id} from another chain`,
      );
    }

    const chain = this.chains.get(asset.chainId);
    const adapter = this.adapters.resolve(chain.family, asset.chainId, asset.networkId);
    return adapter.getBalance(account, asset);
  }

  async getTransactionReceipt(
    chainId: string,
    networkId: string,
    transactionId: string,
    hash: `0x${string}`,
  ): Promise<TransactionReceipt | null> {
    const chain = this.chains.get(chainId);
    const adapter = this.adapters.resolve(chain.family, chainId, networkId);
    return adapter.getTransactionReceipt(networkId, transactionId, hash);
  }
}
