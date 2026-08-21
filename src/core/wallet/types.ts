import type { ChainId, NetworkId } from "../chains/types";

export type Hex = `0x${string}`;
export type Address = string;

export type AccountKind = "software" | "hardware" | "watch";

export type Account = {
  id: string;
  walletId: string;
  name: string;
  address: Address;
  chainId: ChainId;
  kind: AccountKind;
  derivationPath?: string;
};

export type Wallet = {
  id: string;
  name: string;
  accountIds: readonly string[];
  selectedAccountId?: string;
  createdAt: string;
};

export type Asset = {
  id: string;
  chainId: ChainId;
  networkId: NetworkId;
  symbol: string;
  name: string;
  decimals: number;
};

export type Token = Asset & {
  kind: "token";
  contractAddress: Address;
};

export type NativeAsset = Asset & {
  kind: "native";
};

export type WalletAsset = NativeAsset | Token;

export type Balance = {
  accountId: string;
  assetId: string;
  value: bigint;
  updatedAt: string;
};

export type WalletSnapshot = {
  wallet: Wallet;
  accounts: readonly Account[];
  balances: readonly Balance[];
};
