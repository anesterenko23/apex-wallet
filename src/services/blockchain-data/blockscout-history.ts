import type { NetworkId } from "../../core/chains/types";
import type { Address } from "../../core/wallet/types";
import type { TransactionHistoryItem, TransactionHistoryProvider } from "./types";

const blockscoutBaseUrl: Record<string, string> = {
  "ethereum-mainnet": "https://eth.blockscout.com",
  "base-mainnet": "https://base.blockscout.com",
  "arbitrum-mainnet": "https://arbitrum.blockscout.com",
  "optimism-mainnet": "https://optimism.blockscout.com",
};

type BlockscoutAddress = { hash: string } | null;
type BlockscoutTransaction = {
  hash: string;
  from: BlockscoutAddress;
  to: BlockscoutAddress;
  value: string;
  block_number?: number;
  status?: "ok" | "error";
  timestamp?: string;
};

type BlockscoutResponse = {
  items: BlockscoutTransaction[];
};

export class BlockscoutHistoryProvider implements TransactionHistoryProvider {
  async getAddressTransactions(
    networkId: NetworkId,
    address: Address,
  ): Promise<readonly TransactionHistoryItem[]> {
    const baseUrl = blockscoutBaseUrl[networkId];
    if (!baseUrl) throw new Error(`No Blockscout instance configured for ${networkId}`);

    const response = await fetch(`${baseUrl}/api/v2/addresses/${address}/transactions`);
    if (!response.ok) {
      throw new Error(`Blockscout history request failed: ${response.status}`);
    }

    const payload = (await response.json()) as BlockscoutResponse;
    return payload.items.map((item) => ({
      hash: item.hash as `0x${string}`,
      networkId,
      from: (item.from?.hash ?? "") as Address,
      ...(item.to?.hash ? { to: item.to.hash as Address } : {}),
      value: BigInt(item.value || "0"),
      ...(item.block_number !== undefined ? { blockNumber: BigInt(item.block_number) } : {}),
      status: item.status === "error" ? "failed" : item.block_number ? "confirmed" : "pending",
      ...(item.timestamp ? { timestamp: item.timestamp } : {}),
    }));
  }
}
