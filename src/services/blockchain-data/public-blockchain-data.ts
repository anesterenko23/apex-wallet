import type { TokenContractMetadata } from "../../core/chains/types";
import type { TransactionReceipt } from "../../core/transactions/types";
import type { Account, Address, Balance, WalletAsset } from "../../core/wallet/types";
import type { WalletCore } from "../../core/wallet/wallet";
import type { GasPrice, TransactionHistoryItem, TransactionHistoryProvider } from "./types";

export class PublicBlockchainDataService {
  constructor(
    private readonly wallet: WalletCore,
    private readonly history: TransactionHistoryProvider,
  ) {}

  getBalance(account: Account, asset: WalletAsset): Promise<Balance> {
    return this.wallet.getBalance(account, asset);
  }

  async getGasPrice(chainId: string, networkId: string): Promise<GasPrice> {
    const wei = await this.wallet.getGasPrice(chainId, networkId);
    return { networkId, wei, updatedAt: new Date().toISOString() };
  }

  resolveEns(name: string): Promise<Address | null> {
    return this.wallet.resolveName(name);
  }

  getTokenMetadata(
    chainId: string,
    networkId: string,
    contractAddress: Address,
  ): Promise<TokenContractMetadata> {
    return this.wallet.getTokenMetadata(chainId, networkId, contractAddress);
  }

  getTransactionStatus(
    chainId: string,
    networkId: string,
    transactionId: string,
    hash: `0x${string}`,
  ): Promise<TransactionReceipt | null> {
    return this.wallet.getTransactionReceipt(chainId, networkId, transactionId, hash);
  }

  getTransactionHistory(
    networkId: string,
    address: Address,
  ): Promise<readonly TransactionHistoryItem[]> {
    return this.history.getAddressTransactions(networkId, address);
  }
}
