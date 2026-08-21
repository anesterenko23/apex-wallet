import type { Address } from "../../core/wallet/types";

export type VaultVersion = 1;

export type VaultKdf = {
  name: "PBKDF2";
  hash: "SHA-256";
  iterations: 600_000;
  salt: string;
};

export type VaultCipher = {
  name: "AES-GCM";
  iv: string;
};

export type EncryptedVault = {
  version: VaultVersion;
  kdf: VaultKdf;
  cipher: VaultCipher;
  ciphertext: string;
  createdAt: string;
  updatedAt: string;
};

export type VaultAccountDescriptor = {
  id: string;
  address: Address;
  derivationPath: `m/44'/60'/${string}`;
};

export type VaultPayload = {
  mnemonic: string;
  accounts: VaultAccountDescriptor[];
};

export type CreatedVaultWallet = {
  mnemonic: string;
  account: VaultAccountDescriptor;
};

export type VaultState = "locked" | "unlocked";
