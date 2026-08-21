import type { EncryptedVault } from "./types";

export interface VaultStorage {
  load(): Promise<EncryptedVault | null>;
  save(vault: EncryptedVault): Promise<void>;
  clear(): Promise<void>;
}

export class LocalStorageVaultStorage implements VaultStorage {
  constructor(private readonly key = "apex.wallet.vault.v1") {}

  async load(): Promise<EncryptedVault | null> {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as EncryptedVault) : null;
  }

  async save(vault: EncryptedVault): Promise<void> {
    if (typeof localStorage === "undefined") {
      throw new Error("Persistent browser storage is unavailable");
    }
    localStorage.setItem(this.key, JSON.stringify(vault));
  }

  async clear(): Promise<void> {
    if (typeof localStorage !== "undefined") localStorage.removeItem(this.key);
  }
}
