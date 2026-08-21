import type { ChainAdapter } from "../../core/chains/types";
import { InvalidAddressError } from "../../core/wallet/errors";
import type { EvmAddress } from "./types";

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export class EvmAdapter implements ChainAdapter<EvmAddress> {
  readonly family = "evm" as const;

  isValidAddress(address: string): address is EvmAddress {
    return EVM_ADDRESS_PATTERN.test(address);
  }

  normalizeAddress(address: string): EvmAddress {
    if (!this.isValidAddress(address)) {
      throw new InvalidAddressError(`Invalid EVM address: ${address}`);
    }
    return address.toLowerCase() as EvmAddress;
  }
}

export const evmAdapter = new EvmAdapter();
