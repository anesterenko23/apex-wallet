import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import type { Hex } from "../../core/wallet/types";
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
const MIN_PASSWORD_LENGTH = 12;

export type VaultEvmTransaction = {
  chainId: number;
  nonce: number;
  gas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  to: `0x${string}`;
  value: bigint;
  data?: `0x${string}`;
};

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
    this.assertPassword(password);
    if (await this.exists()) throw new VaultAlreadyExistsError();
    const mnemonic = generateMnemonic(english, 256);
    return this.initializeFromMnemonic(mnemonic, password);
  }

  async importMnemonic(mnemonic: string, password: string): Promise<CreatedVaultWallet> {
    this.assertPassword(password);
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
    this.payload = null;
  }

  listAccounts(): readonly VaultAccountDescriptor[] {
    return this.requirePayload().accounts.map((account) => ({ ...account }));
  }

  async signEvmTransaction(
    accountId: string,
    password: string,
    transaction: VaultEvmTransaction,
  ): Promise<Hex> {
    const payload = this.requirePayload();
    const existing = await this.storage.load();
    if (!existing) throw new VaultNotFoundError();
    await this.verifyPassword(existing, password);

    const descriptor = payload.accounts.find((account) => account.id === accountId);
    if (!descriptor) throw new Error(`Unknown vault account: ${accountId}`);
    const account = mnemonicToAccount(payload.mnemonic, { path: descriptor.derivationPath });
    return account.signTransaction(transaction) as Promise<Hex>;
  }

  async addAccount(password: string): Promise<VaultAccountDescriptor> {
    const payload = this.requirePayload();
    const existing = await this.storage.load();
    if (!existing) throw new VaultNotFoundError();
    await this.verifyPassword(existing, password);

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

    const encrypted = await encryptVaultPayload(nextPayload, password, existing.createdAt);
    await this.storage.save(encrypted);
    this.payload = nextPayload;
    return { ...descriptor };
  }

  async changePassword(currentPassword: string, nextPassword: string): Promise<void> {
    this.assertPassword(nextPassword);
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

  private async verifyPassword(vault: EncryptedVault, password: string): Promise<void> {
    try {
      await decryptVaultPayload(vault, password);
    } catch {
      throw new VaultUnlockError();
    }
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

  private assertPassword(password: string): void {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Vault password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
  }
}

export type { EncryptedVault };
