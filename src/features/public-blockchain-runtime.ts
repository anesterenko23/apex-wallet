import { BlockscoutHistoryProvider } from "../services/blockchain-data/blockscout-history";
import { PublicBlockchainDataService } from "../services/blockchain-data/public-blockchain-data";
import type { EvmRpcUrls } from "../chains/evm/types";
import { createWalletRuntime } from "./wallet-runtime";

export function createPublicBlockchainRuntime(rpcUrls: EvmRpcUrls = {}): PublicBlockchainDataService {
  const wallet = createWalletRuntime(rpcUrls);
  return new PublicBlockchainDataService(wallet, new BlockscoutHistoryProvider());
}
