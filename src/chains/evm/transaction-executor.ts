import { createPublicClient, http, type PublicClient } from "viem";
import { transitionTransaction } from "../../core/transactions/lifecycle";
import type {
  Transaction,
  TransactionReceipt,
  TransactionRequest,
} from "../../core/transactions/types";
import type { Hex } from "../../core/wallet/types";
import type { TransactionExecutor } from "../../services/transactions/transaction-service";
import type { WalletVault } from "../../security/vault/vault";
import { evmNetworkById, viemChainByNetworkId } from "./networks";
import type { EvmNetworkId, EvmRpcUrls } from "./types";

export class EvmTransactionExecutor implements TransactionExecutor {
  private readonly clients = new Map<EvmNetworkId, PublicClient>();
  private readonly signedPayloads = new Map<string, Hex>();

  constructor(
    private readonly vault: WalletVault,
    private readonly rpcUrls: EvmRpcUrls = {},
  ) {}

  async prepare(request: TransactionRequest): Promise<Transaction> {
    const client = this.getClient(request.networkId as EvmNetworkId);
    const account = request.from as `0x${string}`;
    const to = request.to as `0x${string}`;
    const data = request.data as `0x${string}` | undefined;
    const now = new Date().toISOString();

    try {
      const [nonce, gasLimit, fees] = await Promise.all([
        client.getTransactionCount({ address: account, blockTag: "pending" }),
        client.estimateGas({ account, to, value: request.value, data }),
        client.estimateFeesPerGas(),
      ]);

      await client.call({ account, to, value: request.value, data });

      return {
        id: request.id,
        request,
        status: "awaiting_confirmation",
        prepared: {
          nonce: BigInt(nonce),
          gasLimit,
          maxFeePerGas: fees.maxFeePerGas,
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
        },
        simulation: { success: true },
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction simulation failed";
      return {
        id: request.id,
        request,
        status: "failed",
        simulation: { success: false, error: message },
        error: message,
        createdAt: now,
        updatedAt: now,
      };
    }
  }

  async sign(transaction: Transaction, password: string): Promise<Transaction> {
    if (!transaction.prepared) throw new Error("Transaction is not prepared");
    const chain = viemChainByNetworkId[transaction.request.networkId as EvmNetworkId];
    const raw = await this.vault.signEvmTransaction(transaction.request.accountId, password, {
      chainId: chain.id,
      nonce: Number(transaction.prepared.nonce),
      gas: transaction.prepared.gasLimit,
      maxFeePerGas: transaction.prepared.maxFeePerGas,
      maxPriorityFeePerGas: transaction.prepared.maxPriorityFeePerGas,
      to: transaction.request.to as `0x${string}`,
      value: transaction.request.value,
      ...(transaction.request.data ? { data: transaction.request.data as `0x${string}` } : {}),
    });

    this.signedPayloads.set(transaction.id, raw);
    return transitionTransaction(transaction, "signed");
  }

  async broadcast(transaction: Transaction): Promise<Transaction> {
    const raw = this.signedPayloads.get(transaction.id);
    if (!raw) throw new Error("Signed payload is unavailable; re-sign the transaction");
    const client = this.getClient(transaction.request.networkId as EvmNetworkId);
    const hash = await client.sendRawTransaction({ serializedTransaction: raw });
    this.signedPayloads.delete(transaction.id);
    return { ...transitionTransaction(transaction, "submitted"), hash };
  }

  async getReceipt(transaction: Transaction): Promise<TransactionReceipt | null> {
    if (!transaction.hash) return null;
    const client = this.getClient(transaction.request.networkId as EvmNetworkId);
    try {
      const receipt = await client.getTransactionReceipt({ hash: transaction.hash });
      return {
        transactionId: transaction.id,
        hash: transaction.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        success: receipt.status === "success",
        confirmedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof Error && /not found|could not be found/i.test(error.message)) return null;
      throw error;
    }
  }

  clearEphemeralSigningMaterial(): void {
    this.signedPayloads.clear();
  }

  private getClient(networkId: EvmNetworkId): PublicClient {
    const existing = this.clients.get(networkId);
    if (existing) return existing;
    const chain = viemChainByNetworkId[networkId];
    if (!chain) throw new Error(`Unsupported EVM network: ${networkId}`);
    const rpcUrl = this.rpcUrls[networkId] ?? evmNetworkById[networkId].rpcUrls[0];
    const client = createPublicClient({ chain, transport: http(rpcUrl) });
    this.clients.set(networkId, client);
    return client;
  }
}
