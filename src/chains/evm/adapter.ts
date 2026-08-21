import {
  createPublicClient,
  erc20Abi,
  getAddress,
  http,
  isAddress,
  type PublicClient,
} from "viem";
import type { ChainAdapter, ChainId, NetworkId } from "../../core/chains/types";
import type { TransactionReceipt } from "../../core/transactions/types";
import { InvalidAddressError } from "../../core/wallet/errors";
import type { Account, Balance, WalletAsset } from "../../core/wallet/types";
import { evmNetworkById, viemChainByNetworkId } from "./networks";
import type { EvmAddress, EvmChainId, EvmNetworkId, EvmRpcUrls } from "./types";

const networkByChain: Record<EvmChainId, EvmNetworkId> = {
  ethereum: "ethereum-mainnet",
  base: "base-mainnet",
  arbitrum: "arbitrum-mainnet",
  optimism: "optimism-mainnet",
};

const supportedNetworks = new Set<EvmNetworkId>(Object.values(networkByChain));

export class EvmChainAdapter implements ChainAdapter<EvmAddress> {
  readonly family = "evm" as const;
  private readonly clients = new Map<EvmNetworkId, PublicClient>();

  constructor(private readonly rpcUrls: EvmRpcUrls = {}) {}

  supports(chainId: ChainId, networkId: NetworkId): boolean {
    return networkByChain[chainId as EvmChainId] === networkId;
  }

  isValidAddress(address: string): address is EvmAddress {
    return isAddress(address, { strict: false });
  }

  normalizeAddress(address: string): EvmAddress {
    if (!this.isValidAddress(address)) {
      throw new InvalidAddressError(`Invalid EVM address: ${address}`);
    }
    return getAddress(address) as EvmAddress;
  }

  async getBalance(account: Account, asset: WalletAsset): Promise<Balance> {
    this.assertCompatible(account, asset);

    const client = this.getClient(asset.networkId as EvmNetworkId);
    const address = this.normalizeAddress(account.address);

    const value =
      asset.kind === "native"
        ? await client.getBalance({ address })
        : await client.readContract({
            address: this.normalizeAddress(asset.contractAddress),
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          });

    return {
      accountId: account.id,
      assetId: asset.id,
      value,
      updatedAt: new Date().toISOString(),
    };
  }

  async getTransactionReceipt(
    networkId: NetworkId,
    transactionId: string,
    hash: `0x${string}`,
  ): Promise<TransactionReceipt | null> {
    if (!supportedNetworks.has(networkId as EvmNetworkId)) return null;

    const client = this.getClient(networkId as EvmNetworkId);
    try {
      const receipt = await client.getTransactionReceipt({ hash });
      return {
        transactionId,
        hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        success: receipt.status === "success",
        confirmedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (this.isReceiptNotFound(error)) return null;
      throw error;
    }
  }

  private getClient(networkId: EvmNetworkId): PublicClient {
    const existing = this.clients.get(networkId);
    if (existing) return existing;

    const chain = viemChainByNetworkId[networkId];
    const rpcUrl = this.rpcUrls[networkId] ?? evmNetworkById[networkId].rpcUrls[0];
    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    this.clients.set(networkId, client);
    return client;
  }

  private assertCompatible(account: Account, asset: WalletAsset): void {
    if (!this.supports(asset.chainId, asset.networkId)) {
      throw new Error(`Unsupported EVM asset network: ${asset.chainId}/${asset.networkId}`);
    }
    if (account.chainId !== asset.chainId) {
      throw new Error(`Account ${account.id} is on ${account.chainId}, asset ${asset.id} is on ${asset.chainId}`);
    }
  }

  private isReceiptNotFound(error: unknown): boolean {
    return error instanceof Error && /not found|could not be found/i.test(error.message);
  }
}

export const evmAdapter = new EvmChainAdapter();
