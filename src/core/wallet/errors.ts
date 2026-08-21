export class WalletDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class AccountNotFoundError extends WalletDomainError {}
export class DuplicateAccountError extends WalletDomainError {}
export class InvalidWalletStateError extends WalletDomainError {}
export class InvalidAddressError extends WalletDomainError {}
