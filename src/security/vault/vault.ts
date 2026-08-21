import { english, generateMnemonic, mnemonicToAccount, type LocalAccount } from "viem/accounts";
import { decryptVaultPayload, encryptVaultPayload } from "./crypto";
import {
  VaultAlreadyExistsError,
  VaultLockedError,
  VaultNotFoundError,
  VaultUnlockError,
} from "./errors";
import type { VaultStorage } from "./storage";
import type {
  CreatedVaultWallet,
  EncryptedVault,
  VaultAccountDescriptor,
  VaultPayload,
  VaultState,
} from "./types";

const DEFAULT_PATH = "m/44'/60'/0'/0/0" as const;

export class WalletVault {
  private payload: VaultPayload | null = null;

  constructor(private readonly storage: VaultStorage) {}

  get state(): VaultState {
    return this.payload ? "unlocked" : "locked";
  }

  async exists(): Promise<boolean> {
    return (await this.storage.load()) !== null;
  }

  async create(password: string): Promise<CreatedVaultWallet> {
    if (await this.exists()) throw new VaultAlreadyExistsError();
    const mnemonic = generateMnemonic(english, 256);
    return this.initializeFromMnemonic(mnemonic, password);
  }

  async importMnemonic(mnemonic: string, password: string): Promise<CreatedVaultWallet> {
    if (await this.exists()) throw new VaultAlreadyExistsError();
    return this.initializeFromMnemonic(mnemonic.trim().replace(/\s+/g, " "), password);
  }

  async unlock(password: string): Promise<void> {
    const encrypted = await this.storage.load();
    if (!encrypted) throw new VaultNotFoundError();

    try {
      const payload = await decryptVaultPayload(encrypted, password);
      this.assertPayload(payload);
      this.payload = payload;
    } catch {
      this.payload = null;
      throw new VaultUnlockError();
    }
  }

  lock(): void {
    // JS runtimes do not guarantee string zeroization. Dropping every live reference is the
    // strongest portable action available here; see the threat model for this limitation.
    this.payload = null;
  }

  listAccounts(): readonly VaultAccountDescriptor[] {
    return this.requirePayload().accounts.map((account) => ({ ...account }));
  }

  getLocalAccount(accountId: string): LocalAccount {
    const payload = this.requirePayload();
    const descriptor = payload.accounts.find((account) => account.id === accountId);
    if (!descriptor) throw new Error(`Unknown vault account: ${accountId}`);

    return mnemonicToAccount(payload.mnemonic, { path: descriptor.derivationPath });
  }

  async addAccount(): Promise<VaultAccountDescriptor> {
    const payload = this.requirePayload();
    const accountIndex = payload.accounts.length;
    const derivationPath = `m/44'/60'/0'/0/${accountIndex}` as const;
    const localAccount = mnemonicToAccount(payload.mnemonic, { path: derivationPath });
    const descriptor: VaultAccountDescriptor = {
      id: crypto.randomUUID(),
      address: localAccount.address,
      derivationPath,
    };

    payload.accounts.push(descriptor);
    await this.persistUnlockedPayload();
    return { ...descriptor };
  }

  async changePassword(currentPassword: string, nextPassword: string): Promise<void> {
    const encrypted = await this.storage.load();
    if (!encrypted) throw new VaultNotFoundError();

    let payload: VaultPayload;
    try {
      payload = await decryptVaultPayload(encrypted, currentPassword);
      this.assertPayload(payload);
    } catch {
      throw new VaultUnlockError();
    }

    const nextVault = await encryptVaultPayload(payload, nextPassword, encrypted.createdAt);
    await this.storage.save(nextVault);
    if (this.payload) this.payload = payload;
  }

  private async initializeFromMnemonic(
    mnemonic: string,
    password: string,
  ): Promise<CreatedVaultWallet> {
    const localAccount = mnemonicToAccount(mnemonic, { path: DEFAULT_PATH });
    const descriptor: VaultAccountDescriptor = {
      id: crypto.randomUUID(),
      address: localAccount.address,
      derivationPath: DEFAULT_PATH,
    };
    const payload: VaultPayload = { mnemonic, accounts: [descriptor] };
    const encrypted = await encryptVaultPayload(payload, password);
    await this.storage.save(encrypted);
    this.payload = payload;
    return { mnemonic, account: { ...descriptor } };
  }

  private async persistUnlockedPayload(): Promise<void> {
    const payload = this.requirePayload();
    const existing = await this.storage.load();
    if (!existing) throw new VaultNotFoundError();
    throw new Error(
      "Persisting account changes requires password re-authentication; use addAccountWithPassword instead",
    );
  }

  async addAccountWithPassword(password: string): Promise<VaultAccountDescriptor> {
    const payload = this.requirePayload();
    const accountIndex = payload.accounts.length;
    const derivationPath = `m/44'/60'/0'/0/${accountIndex}` as const;
    const localAccount = mnemonicToAccount(payload.mnemonic, { path: derivationPath });
    const descriptor: VaultAccountDescriptor = {
      id: crypto.randomUUID(),
      address: localAccount.address,
      derivationPath,
    };

    const nextPayload: VaultPayload = {
      mnemonic: payload.mnemonic,
      accounts: [...payload.accounts, descriptor],
    };
    const existing = await this.storage.load();
    if (!existing) throw new VaultNotFoundError();

    try {
      await decryptVaultPayload(existing, password);
    } catch {
      throw new VaultUnlockError();
    }

    const encrypted = await encryptVaultPayload(nextPayload, password, existing.createdAt);
    await this.storage.save(encrypted);
    this.payload = nextPayload;
    return { ...descriptor };
  }

  private requirePayload(): VaultPayload {
    if (!this.payload) throw new VaultLockedError();
    return this.payload;
  }

  private assertPayload(payload: VaultPayload): void {
    if (!payload.mnemonic || !Array.isArray(payload.accounts) || payload.accounts.length === 0) {
      throw new Error("Invalid vault payload");
    }
  }
}

export type { EncryptedVault };
