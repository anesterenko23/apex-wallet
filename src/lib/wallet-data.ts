import nft1 from "@/assets/nft-1.jpg";
import nft2 from "@/assets/nft-2.jpg";
import nft3 from "@/assets/nft-3.jpg";
import nft4 from "@/assets/nft-4.jpg";

export type ChainId =
  | "ethereum"
  | "solana"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "bnb"
  | "avalanche";

export type Network = {
  id: ChainId;
  name: string;
  short: string;
  color: string; // oklch literal used for chain glyphs only
  explorer: string;
  nativeSymbol: string;
};

export const networks: Network[] = [
  { id: "ethereum", name: "Ethereum", short: "ETH", color: "oklch(0.62 0.14 275)", explorer: "etherscan.io", nativeSymbol: "ETH" },
  { id: "solana", name: "Solana", short: "SOL", color: "oklch(0.78 0.16 165)", explorer: "solscan.io", nativeSymbol: "SOL" },
  { id: "base", name: "Base", short: "BASE", color: "oklch(0.62 0.18 258)", explorer: "basescan.org", nativeSymbol: "ETH" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB", color: "oklch(0.68 0.13 235)", explorer: "arbiscan.io", nativeSymbol: "ETH" },
  { id: "optimism", name: "Optimism", short: "OP", color: "oklch(0.65 0.2 22)", explorer: "optimistic.etherscan.io", nativeSymbol: "ETH" },
  { id: "polygon", name: "Polygon", short: "POL", color: "oklch(0.6 0.19 300)", explorer: "polygonscan.com", nativeSymbol: "POL" },
  { id: "bnb", name: "BNB Chain", short: "BNB", color: "oklch(0.84 0.15 92)", explorer: "bscscan.com", nativeSymbol: "BNB" },
  { id: "avalanche", name: "Avalanche", short: "AVAX", color: "oklch(0.66 0.2 25)", explorer: "snowtrace.io", nativeSymbol: "AVAX" },
];

export const networkMap = Object.fromEntries(networks.map((n) => [n.id, n])) as Record<ChainId, Network>;

export type Asset = {
  symbol: string;
  name: string;
  chain: ChainId;
  price: number;
  change24h: number;
  balance: number;
  color: string;
  glyph: "eth" | "sol" | "btc" | "usdc" | "generic";
};

export const assets: Asset[] = [
  { symbol: "ETH", name: "Ethereum", chain: "ethereum", price: 4231.18, change24h: 2.41, balance: 2.842, color: "oklch(0.66 0.13 278)", glyph: "eth" },
  { symbol: "SOL", name: "Solana", chain: "solana", price: 187.42, change24h: 5.18, balance: 38.21, color: "oklch(0.78 0.16 165)", glyph: "sol" },
  { symbol: "USDC", name: "USD Coin", chain: "base", price: 1.0, change24h: 0.01, balance: 3920.24, color: "oklch(0.65 0.16 250)", glyph: "usdc" },
  { symbol: "BTC", name: "Bitcoin", chain: "ethereum", price: 118420, change24h: -0.82, balance: 0.0151, color: "oklch(0.75 0.16 62)", glyph: "btc" },
  { symbol: "ARB", name: "Arbitrum", chain: "arbitrum", price: 0.812, change24h: 3.94, balance: 1420.5, color: "oklch(0.68 0.13 235)", glyph: "generic" },
  { symbol: "OP", name: "Optimism", chain: "optimism", price: 1.94, change24h: -1.62, balance: 210.4, color: "oklch(0.65 0.2 22)", glyph: "generic" },
  { symbol: "AVAX", name: "Avalanche", chain: "avalanche", price: 41.28, change24h: 1.12, balance: 6.4, color: "oklch(0.66 0.2 25)", glyph: "generic" },
  { symbol: "POL", name: "Polygon", chain: "polygon", price: 0.482, change24h: -2.18, balance: 340.0, color: "oklch(0.6 0.19 300)", glyph: "generic" },
  { symbol: "JUP", name: "Jupiter", chain: "solana", price: 1.18, change24h: 7.42, balance: 88.0, color: "oklch(0.8 0.14 60)", glyph: "generic" },
  { symbol: "BNB", name: "BNB", chain: "bnb", price: 902.4, change24h: 0.42, balance: 0.08, color: "oklch(0.84 0.15 92)", glyph: "generic" },
];

export const assetMap = Object.fromEntries(assets.map((a) => [a.symbol, a])) as Record<string, Asset>;

export const assetValue = (a: Asset) => a.balance * a.price;

export type Account = {
  id: string;
  name: string;
  address: string;
  balance: number;
  hue: number;
  type: "hot" | "hardware" | "watch";
};

export const accounts: Account[] = [
  { id: "main", name: "Main Wallet", address: "0x71F4A9c3B1d0F27b5E8a4c66D3fA1b0e2C5992A8", balance: 24892.41, hue: 195, type: "hot" },
  { id: "trading", name: "Trading", address: "0x8C21b7Ee4A9d5F30c1B6a2E84dF7c093A1b4E7D2", balance: 8412.09, hue: 155, type: "hot" },
  { id: "cold", name: "Cold Storage", address: "0xD40aF1B2c8E7594aB3c1d6E20f8A7b45C93e1F60", balance: 142380.55, hue: 60, type: "hardware" },
  { id: "defi", name: "DeFi", address: "0x2Ae9C4d81F5b0A76e3D2c98B14fE750aD6c8B331", balance: 3190.76, hue: 275, type: "hot" },
];

export type TxType = "receive" | "send" | "swap" | "bridge" | "contract";

export type Transaction = {
  id: string;
  type: TxType;
  asset: string;
  amount: number;
  toAsset?: string;
  toAmount?: number;
  fiat: number;
  counterparty: string;
  counterpartyLabel?: string;
  chain: ChainId;
  toChain?: ChainId;
  date: string; // ISO
  status: "confirmed" | "pending" | "failed";
  fee: number;
  hash: string;
  account: string;
};

const hash = (s: string) => `0x${s.repeat(2).slice(0, 8)}${"a3f9c1d70b428e5f6a9c2d81b3e4f0a7"}${s}`.slice(0, 66);

export const transactions: Transaction[] = [
  { id: "t1", type: "receive", asset: "ETH", amount: 0.85, fiat: 3596.5, counterparty: "0x9aC2...41Be", counterpartyLabel: "Coinbase", chain: "ethereum", date: "2026-08-21T18:42:00Z", status: "confirmed", fee: 1.82, hash: hash("9a"), account: "main" },
  { id: "t2", type: "swap", asset: "USDC", amount: 1200, toAsset: "SOL", toAmount: 6.38, fiat: 1200, counterparty: "Jupiter", chain: "solana", date: "2026-08-21T14:10:00Z", status: "confirmed", fee: 0.04, hash: hash("b2"), account: "main" },
  { id: "t3", type: "send", asset: "USDC", amount: 450, fiat: 450, counterparty: "0x4dE1...9C07", counterpartyLabel: "Alice", chain: "base", date: "2026-08-20T21:05:00Z", status: "confirmed", fee: 0.02, hash: hash("c3"), account: "main" },
  { id: "t4", type: "bridge", asset: "ETH", amount: 0.4, toAsset: "ETH", toAmount: 0.3988, fiat: 1692.47, counterparty: "Across", chain: "ethereum", toChain: "arbitrum", date: "2026-08-20T09:31:00Z", status: "confirmed", fee: 2.14, hash: hash("d4"), account: "main" },
  { id: "t5", type: "contract", asset: "ETH", amount: 0, fiat: 0, counterparty: "Aave v3", chain: "ethereum", date: "2026-08-19T16:58:00Z", status: "confirmed", fee: 3.42, hash: hash("e5"), account: "main" },
  { id: "t6", type: "receive", asset: "SOL", amount: 12.5, fiat: 2342.75, counterparty: "8xZq...T4mP", counterpartyLabel: "Treasury", chain: "solana", date: "2026-08-18T11:22:00Z", status: "confirmed", fee: 0.001, hash: hash("f6"), account: "main" },
  { id: "t7", type: "send", asset: "ETH", amount: 0.12, fiat: 507.74, counterparty: "0x77aB...02Fd", chain: "ethereum", date: "2026-08-17T19:48:00Z", status: "failed", fee: 1.98, hash: hash("07"), account: "main" },
  { id: "t8", type: "swap", asset: "ARB", amount: 800, toAsset: "USDC", toAmount: 648.2, fiat: 649.6, counterparty: "Uniswap", chain: "arbitrum", date: "2026-08-16T08:14:00Z", status: "confirmed", fee: 0.31, hash: hash("18"), account: "main" },
  { id: "t9", type: "receive", asset: "USDC", amount: 2500, fiat: 2500, counterparty: "0x1F0c...88Aa", counterpartyLabel: "Exchange", chain: "base", date: "2026-08-15T13:03:00Z", status: "confirmed", fee: 0.02, hash: hash("29"), account: "main" },
  { id: "t10", type: "contract", asset: "SOL", amount: 0, fiat: 0, counterparty: "Marinade", chain: "solana", date: "2026-08-14T07:41:00Z", status: "confirmed", fee: 0.002, hash: hash("3a"), account: "main" },
  { id: "t11", type: "send", asset: "BTC", amount: 0.004, fiat: 473.68, counterparty: "0xBb42...7Cd1", counterpartyLabel: "Treasury", chain: "ethereum", date: "2026-08-12T22:19:00Z", status: "confirmed", fee: 2.61, hash: hash("4b"), account: "main" },
  { id: "t12", type: "bridge", asset: "USDC", amount: 1500, toAsset: "USDC", toAmount: 1498.5, fiat: 1500, counterparty: "Stargate", chain: "polygon", toChain: "base", date: "2026-08-11T10:07:00Z", status: "pending", fee: 0.42, hash: hash("5c"), account: "main" },
  { id: "t13", type: "receive", asset: "JUP", amount: 88, fiat: 103.84, counterparty: "5nQr...9WkZ", chain: "solana", date: "2026-08-09T15:52:00Z", status: "confirmed", fee: 0.001, hash: hash("6d"), account: "main" },
  { id: "t14", type: "swap", asset: "ETH", amount: 0.25, toAsset: "OP", toAmount: 542.1, fiat: 1057.79, counterparty: "Velodrome", chain: "optimism", date: "2026-08-07T12:30:00Z", status: "confirmed", fee: 0.18, hash: hash("7e"), account: "main" },
];

export type Nft = {
  id: string;
  name: string;
  collection: string;
  image: string;
  floor: number;
  chain: ChainId;
  hidden?: boolean;
  traits: { label: string; value: string }[];
};

export const nfts: Nft[] = [
  { id: "n1", name: "Vector Field #418", collection: "Vector Fields", image: nft1, floor: 2.4, chain: "ethereum", traits: [{ label: "Palette", value: "Cyan Drift" }, { label: "Density", value: "High" }] },
  { id: "n2", name: "Ribbon Study #07", collection: "Ribbon Studies", image: nft2, floor: 0.82, chain: "base", traits: [{ label: "Palette", value: "Mint" }, { label: "Flow", value: "Double" }] },
  { id: "n3", name: "Topography #212", collection: "Terrain", image: nft3, floor: 1.15, chain: "ethereum", traits: [{ label: "Relief", value: "Soft" }, { label: "Grid", value: "Fine" }] },
  { id: "n4", name: "Prism Plane #33", collection: "Prisms", image: nft4, floor: 0.44, chain: "solana", traits: [{ label: "Layers", value: "4" }, { label: "Heat", value: "Warm" }] },
  { id: "n5", name: "Vector Field #902", collection: "Vector Fields", image: nft1, floor: 2.4, chain: "ethereum", traits: [{ label: "Palette", value: "Deep Blue" }, { label: "Density", value: "Low" }] },
  { id: "n6", name: "Topography #018", collection: "Terrain", image: nft3, floor: 1.15, chain: "arbitrum", traits: [{ label: "Relief", value: "Sharp" }, { label: "Grid", value: "Coarse" }] },
  { id: "n7", name: "Ribbon Study #91", collection: "Ribbon Studies", image: nft2, floor: 0.82, chain: "base", hidden: true, traits: [{ label: "Palette", value: "Teal" }] },
  { id: "n8", name: "Prism Plane #04", collection: "Prisms", image: nft4, floor: 0.44, chain: "solana", hidden: true, traits: [{ label: "Layers", value: "2" }] },
];

export type ConnectedApp = {
  id: string;
  name: string;
  url: string;
  account: string;
  chain: ChainId;
  lastUsed: string;
  hue: number;
};

export const connectedApps: ConnectedApp[] = [
  { id: "uniswap", name: "Uniswap", url: "app.uniswap.org", account: "main", chain: "ethereum", lastUsed: "2 hours ago", hue: 330 },
  { id: "aave", name: "Aave", url: "app.aave.com", account: "defi", chain: "arbitrum", lastUsed: "Yesterday", hue: 300 },
  { id: "jupiter", name: "Jupiter", url: "jup.ag", account: "main", chain: "solana", lastUsed: "3 days ago", hue: 60 },
  { id: "opensea", name: "OpenSea", url: "opensea.io", account: "main", chain: "base", lastUsed: "1 week ago", hue: 240 },
  { id: "velodrome", name: "Velodrome", url: "velodrome.finance", account: "trading", chain: "optimism", lastUsed: "2 weeks ago", hue: 20 },
];

export type Contact = { id: string; name: string; address: string; chain: ChainId };

export const addressBook: Contact[] = [
  { id: "c1", name: "Treasury", address: "0xBb4212f7C0d9E13a8F5b6C24dA9e70185cF37Cd1", chain: "ethereum" },
  { id: "c2", name: "Alice", address: "0x4dE1b93F7c02A5e6B18d4C93a70F5b2c81eE9C07", chain: "base" },
  { id: "c3", name: "Exchange", address: "0x1F0c47Ba6d29E5138cB70a4F5d2e91C8b3a688Aa", chain: "ethereum" },
  { id: "c4", name: "Cold Storage", address: "0xD40aF1B2c8E7594aB3c1d6E20f8A7b45C93e1F60", chain: "arbitrum" },
];

/* ---------- deterministic mock series ---------- */

export type Range = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
export const ranges: Range[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

const rangeConfig: Record<Range, { points: number; stepMs: number; drift: number; vol: number }> = {
  "1D": { points: 48, stepMs: 30 * 60 * 1000, drift: 0.052, vol: 0.006 },
  "1W": { points: 56, stepMs: 3 * 60 * 60 * 1000, drift: 0.11, vol: 0.012 },
  "1M": { points: 60, stepMs: 12 * 60 * 60 * 1000, drift: 0.22, vol: 0.02 },
  "3M": { points: 66, stepMs: 33 * 60 * 60 * 1000, drift: 0.36, vol: 0.03 },
  "1Y": { points: 72, stepMs: 5 * 24 * 60 * 60 * 1000, drift: 0.94, vol: 0.045 },
  ALL: { points: 80, stepMs: 16 * 24 * 60 * 60 * 1000, drift: 2.6, vol: 0.06 },
};

const seeded = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
};

export type SeriesPoint = { t: number; v: number };

/** Deterministic series ending exactly at `end`. */
export function buildSeries(end: number, range: Range, seed = 7): SeriesPoint[] {
  const cfg = rangeConfig[range];
  const rand = seeded(seed * 131 + range.length * 977);
  const start = end / (1 + cfg.drift);
  const now = Date.parse("2026-08-21T21:00:00Z");
  const raw: number[] = [];
  let v = start;
  for (let i = 0; i < cfg.points; i++) {
    const trend = (end - start) / cfg.points;
    v += trend + (rand() - 0.48) * start * cfg.vol;
    raw.push(v);
  }
  const scale = end / raw[raw.length - 1];
  return raw.map((value, i) => ({
    t: now - (cfg.points - 1 - i) * cfg.stepMs,
    v: value * scale,
  }));
}

export const shortAddress = (a: string, lead = 6, tail = 4) =>
  `${a.slice(0, lead)}...${a.slice(-tail)}`;

export const fmtUsd = (n: number, max = 2) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: max });

export const fmtUsdCompact = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : fmtUsd(n);

export const fmtToken = (n: number, symbol?: string) => {
  const digits = n === 0 ? 2 : n < 0.01 ? 6 : n < 1 ? 4 : n < 1000 ? 3 : 2;
  return `${n.toLocaleString("en-US", { maximumFractionDigits: digits })}${symbol ? ` ${symbol}` : ""}`;
};

export const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const txLabel: Record<TxType, string> = {
  receive: "Received",
  send: "Sent",
  swap: "Swapped",
  bridge: "Bridged",
  contract: "Contract interaction",
};
