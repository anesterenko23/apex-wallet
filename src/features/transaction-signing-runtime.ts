import { EvmTransactionExecutor } from "../chains/evm/transaction-executor";
import type { EvmRpcUrls } from "../chains/evm/types";
import type { WalletVault } from "../security/vault";
import { TransactionService } from "../services/transactions/transaction-service";

export type TransactionSigningRuntime = {
  transactions: TransactionService;
  lock(): void;
};

export function createTransactionSigningRuntime(
  vault: WalletVault,
  rpcUrls: EvmRpcUrls = {},
): TransactionSigningRuntime {
  const executor = new EvmTransactionExecutor(vault, rpcUrls);
  return {
    transactions: new TransactionService(executor),
    lock() {
      executor.clearEphemeralSigningMaterial();
      vault.lock();
    },
  };
}
