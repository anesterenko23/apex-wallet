# Wallet Vault Threat Model — Apex v0.1

## Security objective

Persistent storage must never contain the user's password, mnemonic, seed, or plaintext private-key material. The only persisted secret-bearing object is an authenticated encrypted vault.

## Current design

- BIP-39 mnemonic generation and BIP-32/BIP-44 EVM account derivation are provided through viem's local-account implementation.
- The encrypted payload contains the root mnemonic and account derivation metadata. Individual private keys are not persisted; they are derived only when needed by a future signing boundary.
- Passwords are used only as input to the KDF and are never written to application state or persistent storage.
- Vault encryption uses AES-256-GCM with a fresh 96-bit IV on every encryption.
- Password-based key derivation uses PBKDF2-HMAC-SHA256 with a fresh 128-bit salt and 600,000 iterations.
- KDF/cipher parameters are stored with the ciphertext so the format can be migrated later.
- Mutations that rewrite the encrypted payload require password re-authentication.

## Protected against

- Theft of browser storage without knowledge of the user's vault password.
- Accidental plaintext persistence through normal application stores.
- Ciphertext modification, through AES-GCM authentication.
- Reuse of the same encryption key stream across vault writes, through fresh salt/IV generation.

## Not protected against

- A compromised page or malicious JavaScript executing while the vault is unlocked. Such code executes in the same trust domain and can observe secrets before encryption or after decryption.
- A compromised browser/OS, debugger, memory dump, malicious extension with sufficient privileges, or hardware compromise.
- Offline password guessing after encrypted storage is stolen. The KDF only increases attacker cost; password strength still matters.
- Perfect in-memory erasure. JavaScript strings are immutable and garbage-collected, so Apex can drop references and wipe owned byte buffers but cannot guarantee physical zeroization of every copy made by the runtime.

## Lock semantics

`lock()` removes Apex's live reference to the decrypted vault payload. Owned temporary byte buffers used by Web Crypto are overwritten where possible. No password is retained. Because JavaScript cannot guarantee zeroization of immutable strings or copies made internally by the runtime, lock should be understood as logical key eviction, not a hardware-grade secure erase.

## Browser storage

The v0.1 browser runtime stores only the encrypted vault in `localStorage`. This is acceptable as a persistence adapter for ciphertext, but it does not create a security boundary against XSS. A production browser-extension build should move the vault into extension-scoped storage and enforce a strict Content Security Policy with no remote code execution path.

## Planned hardening

1. Move password KDF to Argon2id when a reviewed browser/WASM implementation is selected and benchmarked.
2. Add timed auto-lock and lock-on-background/session events.
3. Isolate signing/key derivation behind a dedicated key-management service so callers never receive raw private keys.
4. Add vault format migration and KDF work-factor upgrades.
5. Add security-focused tests for wrong passwords, ciphertext tampering, IV/salt uniqueness, lifecycle transitions, and storage invariants.
6. Review CSP, dependency supply chain, extension permissions, clipboard behavior, telemetry, logging, and crash reporting before enabling transaction signing.
