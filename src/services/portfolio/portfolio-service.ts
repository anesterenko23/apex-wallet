import type { Account, Balance, WalletAsset } from "../../core/wallet/types";

export type PortfolioEntry = {
  account: Account;
  asset: WalletAsset;
  balance: Balance;
};

export class PortfolioService {
  buildEntries(accounts: readonly Account[], assets: readonly WalletAsset[], balances: readonly Balance[]): readonly PortfolioEntry[] {
    const accountMap = new Map(accounts.map((account) => [account.id, account]));
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]));

    return balances.flatMap((balance) => {
      const account = accountMap.get(balance.accountId);
      const asset = assetMap.get(balance.assetId);
      return account && asset ? [{ account, asset, balance }] : [];
    });
  }
}
