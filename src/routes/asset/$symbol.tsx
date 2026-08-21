import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import {
  assetMap,
  assetValue,
  fmtDate,
  fmtToken,
  fmtUsd,
  networkMap,
  txLabel,
} from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { TokenIcon } from "@/components/wallet/glyphs";
import { PortfolioChart } from "@/components/wallet/PortfolioChart";
import { PrimaryActions } from "@/components/wallet/PrimaryActions";
import { TxIcon } from "@/components/wallet/TxIcon";
import { Change, Fiat, Panel, Row, SectionTitle } from "@/components/wallet/ui";

export const Route = createFileRoute("/asset/$symbol")({
  loader: ({ params }) => {
    const asset = assetMap[params.symbol.toUpperCase()];
    if (!asset) throw notFound();
    return { symbol: asset.symbol, name: asset.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Asset";
    const symbol = loaderData?.symbol ?? "";
    return {
      meta: [
        { title: `${name} (${symbol}) — Aperture Wallet` },
        {
          name: "description",
          content: `Track your ${name} balance, price performance and ${symbol} transaction history, then send or swap in one tap.`,
        },
        { property: "og:title", content: `${name} (${symbol}) — Aperture Wallet` },
        {
          property: "og:description",
          content: `${name} balance, performance and transaction history.`,
        },
      ],
    };
  },
  component: AssetPage,
});

function AssetPage() {
  const { symbol } = Route.useParams();
  const upper = symbol.toUpperCase();
  const base = assetMap[upper]!;
  const accountAssets = useAccountAssets();
  const held = accountAssets.find((a) => a.symbol === upper) ?? { ...base, balance: 0 };
  const { transactions, account } = useWallet();
  const net = networkMap[base.chain];
  const txs = transactions.filter((t) => t.asset === upper || t.toAsset === upper);

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <Link
        to="/assets"
        className="press mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All assets
      </Link>

      <section className="ambient mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <TokenIcon asset={base} size={48} />
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">{base.name}</h1>
            <div className="text-xs text-muted-foreground">
              {base.symbol} · {net.name}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="num text-sm">{fmtUsd(base.price)}</div>
            <Change value={base.change24h} className="text-xs" showIcon />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Panel className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Your balance
            </div>
            <div className="num mt-1.5 text-2xl font-semibold">
              {fmtToken(held.balance, base.symbol)}
            </div>
            <Fiat value={assetValue(held)} className="mt-1 block text-sm text-muted-foreground" />
          </Panel>
          <Panel className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Allocation
            </div>
            <div className="num mt-1.5 text-2xl font-semibold">
              {(
                (assetValue(held) /
                  Math.max(
                    1,
                    accountAssets.reduce((s, a) => s + assetValue(a), 0),
                  )) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="mt-1 text-sm text-muted-foreground">of {account.name}</div>
          </Panel>
        </div>

        <div className="mt-6">
          <PrimaryActions symbol={base.symbol} />
        </div>
      </section>

      <Panel className="mb-9 p-5">
        <PortfolioChart endValue={Math.max(assetValue(held), 100)} seed={base.symbol.length * 37} />
      </Panel>

      <section className="mb-9">
        <SectionTitle title="Market" />
        <Panel className="divide-y divide-border px-4 py-1">
          <Row label="Price" value={fmtUsd(base.price)} />
          <Row label="24h change" value={<Change value={base.change24h} />} />
          <Row label="Network" value={net.name} />
          <Row label="Explorer" value={net.explorer} />
        </Panel>
      </section>

      <section>
        <SectionTitle title={`${base.symbol} activity`} hint={`${txs.length} transactions`} />
        {txs.length === 0 ? (
          <Panel className="p-8 text-center text-sm text-muted-foreground">
            No transactions for this asset yet.
          </Panel>
        ) : (
          <div className="space-y-1">
            {txs.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.24) }}
              >
                <Link
                  to="/activity"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                >
                  <TxIcon type={tx.type} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{txLabel[tx.type]}</div>
                    <div className="text-xs text-muted-foreground">{fmtDate(tx.date)}</div>
                  </div>
                  <div className="num text-sm">
                    {tx.type === "contract" ? "—" : fmtToken(tx.amount, tx.asset)}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
