import type { KeyringPort, RpcPort } from "./ports";
import type { PreparedTransaction, TransactionRequest } from "./types";
import { assertTransactionRequest } from "./validation";

export type WalletCoreDependencies = {
  keyring: KeyringPort;
  rpc: RpcPort;
};

export class WalletCoreService {
  constructor(private readonly dependencies: WalletCoreDependencies) {}

  async prepareTransaction(request: TransactionRequest): Promise<PreparedTransaction> {
    assertTransactionRequest(request);

    const [nonce, fees] = await Promise.all([
      request.nonce ??
        this.dependencies.rpc.getTransactionCount(request.chainId, request.from),
      this.dependencies.rpc.estimateFees(request),
    ]);

    return {
      ...request,
      nonce,
      gasLimit: request.gasLimit ?? fees.gasLimit,
      maxFeePerGas: request.maxFeePerGas ?? fees.maxFeePerGas,
      maxPriorityFeePerGas:
        request.maxPriorityFeePerGas ?? fees.maxPriorityFeePerGas,
    };
  }

  async signAndBroadcast(request: TransactionRequest) {
    const prepared = await this.prepareTransaction(request);
    const signed = await this.dependencies.keyring.signTransaction(
      request.accountId,
      prepared,
    );
    return this.dependencies.rpc.broadcast(signed);
  }
}
