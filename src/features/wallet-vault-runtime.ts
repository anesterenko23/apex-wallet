import { LocalStorageVaultStorage, WalletVault } from "../security/vault";

export function createWalletVaultRuntime(): WalletVault {
  return new WalletVault(new LocalStorageVaultStorage());
}
