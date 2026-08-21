export class VaultError extends Error {}

export class VaultLockedError extends VaultError {
  constructor() {
    super("Wallet vault is locked");
  }
}

export class VaultNotFoundError extends VaultError {
  constructor() {
    super("Encrypted wallet vault was not found");
  }
}

export class VaultUnlockError extends VaultError {
  constructor() {
    super("Unable to unlock wallet vault");
  }
}

export class VaultAlreadyExistsError extends VaultError {
  constructor() {
    super("Encrypted wallet vault already exists");
  }
}
