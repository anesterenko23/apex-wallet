export type EvmChainId =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "bnb"
  | "avalanche";

export type ChainNamespace = "eip155";

export type Hex = `0x${string}`;
export type EvmAddress = `0x${string}`;
export type TransactionHash = Hex;

export type WalletChain = {
  id: EvmChainId;
  namespace: ChainNamespace;
  chainId: number;
  name: string;
  nativeSymbol: string;
  decimals: 18;
  explorerUrl: string;
};

export type AccountKind = "software" | "hardware" | "watch";

export type WalletAccount = {
  id: string;
  name: string;
  address: EvmAddress;
  kind: AccountKind;
};

export type NativeAssetRef = {
  kind: "native";
  chainId: EvmChainId;
  symbol: string;
  decimals: number;
};

export type Erc20AssetRef = {
  kind: "erc20";
  chainId: EvmChainId;
  address: EvmAddress;
  symbol: string;
  decimals: number;
};

export type AssetRef = NativeAssetRef | Erc20AssetRef;

export type AssetAmount = {
  asset: AssetRef;
  value: bigint;
};

export type TransactionRequest = {
  chainId: EvmChainId;
  accountId: string;
  from: EvmAddress;
  to: EvmAddress;
  value: bigint;
  data?: Hex;
  nonce?: bigint;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
};

export type PreparedTransaction = TransactionRequest & {
  nonce: bigint;
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type SignedTransaction = {
  chainId: EvmChainId;
  accountId: string;
  rawTransaction: Hex;
};

export type BroadcastReceipt = {
  chainId: EvmChainId;
  hash: TransactionHash;
  submittedAt: string;
};

export type TransactionState = "submitted" | "confirmed" | "failed";

export type TransactionRecord = BroadcastReceipt & {
  accountId: string;
  state: TransactionState;
  blockNumber?: bigint;
  failureReason?: string;
};
