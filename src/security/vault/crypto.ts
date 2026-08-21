import type { EncryptedVault, VaultPayload } from "./types";

const KDF_ITERATIONS = 600_000 as const;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function deriveVaultKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordBytes = encoder.encode(password.normalize("NFKC"));
  try {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBytes,
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: KDF_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  } finally {
    passwordBytes.fill(0);
  }
}

export async function encryptVaultPayload(
  payload: VaultPayload,
  password: string,
  previousCreatedAt?: string,
): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveVaultKey(password, salt);
  const plaintext = encoder.encode(JSON.stringify(payload));

  try {
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    const now = new Date().toISOString();
    return {
      version: 1,
      kdf: {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: KDF_ITERATIONS,
        salt: bytesToBase64(salt),
      },
      cipher: {
        name: "AES-GCM",
        iv: bytesToBase64(iv),
      },
      ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
      createdAt: previousCreatedAt ?? now,
      updatedAt: now,
    };
  } finally {
    plaintext.fill(0);
    salt.fill(0);
    iv.fill(0);
  }
}

export async function decryptVaultPayload(vault: EncryptedVault, password: string): Promise<VaultPayload> {
  if (vault.version !== 1 || vault.kdf.name !== "PBKDF2" || vault.cipher.name !== "AES-GCM") {
    throw new Error("Unsupported vault format");
  }

  const salt = base64ToBytes(vault.kdf.salt);
  const iv = base64ToBytes(vault.cipher.iv);
  const ciphertext = base64ToBytes(vault.ciphertext);
  const key = await deriveVaultKey(password, salt);

  try {
    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    const plaintext = new Uint8Array(plaintextBuffer);
    try {
      return JSON.parse(decoder.decode(plaintext)) as VaultPayload;
    } finally {
      plaintext.fill(0);
    }
  } finally {
    salt.fill(0);
    iv.fill(0);
    ciphertext.fill(0);
  }
}
