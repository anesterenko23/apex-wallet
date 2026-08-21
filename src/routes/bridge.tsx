import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assetMap, assets, fmtUsd, networks, type ChainId } from "@/lib/wallet-data";
import { TokenIcon, ChainDot } from "@/components/wallet/glyphs";
import { PageHeader, Panel, Row } from "@/components/wallet/ui";

export const Route = createFileRoute("/bridge")({
  head: () => ({
    meta: [
      { title: "Bridge — Apex Wallet" },
      {
        name: "description",
        content:
          "Move supported assets between networks with route validation, estimated arrival time and bridge fees.",
      },
      { property: "og:title", content: "Bridge — Apex Wallet" },
      {
        property: "og:description",
        content: "Move supported assets across chains with validated routes and fee estimates.",
      },
    ],
  }),
  component: BridgePage,
});

function ChainPicker({
  label,
  value,
  onChange,
  disabledChain,
}: {
  label: string;
  value: ChainId;
  onChange: (chain: ChainId) => void;
  disabledChain?: ChainId;
}) {
  return (
    <div className="flex-1">
      <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="grid grid-cols-2 gap-1.5">
        {networks.slice(0, 6).map((network) => {
          const disabled = network.id === disabledChain;
          return (
            <button
              key={network.id}
              disabled={disabled}
              onClick={() => onChange(network.id)}
              className={cn(
                "press flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors",
                value === network.id
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <ChainDot chain={network.id} size={14} />
              <span className="truncate">{network.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BridgePage() {
  const [fromChain, setFromChain] = useState<ChainId>("ethereum");
  const [toChain, setToChain] = useState<ChainId>("arbitrum");
  const [symbol, setSymbol] = useState("ETH");
  const [amount, setAmount] = useState("0.5");
  const [pending, setPending] = useState(false);

  const sourceAssets = useMemo(
    () => assets.filter((asset) => asset.chain === fromChain),
    [fromChain],
  );

  useEffect(() => {
    if (sourceAssets.some((asset) => asset.symbol === symbol)) return;
    setSymbol(sourceAssets[0]?.symbol ?? "");
  }, [sourceAssets, symbol]);

  const asset = symbol ? assetMap[symbol] : undefined;
  const numericAmount = Number(amount) || 0;
  const routeValid = Boolean(asset && asset.chain === fromChain && fromChain !== toChain);
  const value = asset ? numericAmount * asset.price : 0;
  const received = routeValid ? numericAmount * 0.9985 : 0;

  const changeFromChain = (chain: ChainId) => {
    setFromChain(chain);
    if (chain === toChain) {
      const fallback = networks.find((network) => network.id !== chain);
      if (fallback) setToChain(fallback.id);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <PageHeader title="Bridge" subtitle="Transfer supported assets across networks" />

      <Panel className="p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>Amount</span>
          <span className="num">{fmtUsd(value)}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="0.00"
            className="num min-w-0 flex-1 bg-transparent text-[26px] font-semibold outline-none placeholder:text-muted-foreground/50"
          />
          <div className="relative">
            <select
              value={symbol}
              disabled={!sourceAssets.length}
              onChange={(event) => setSymbol(event.target.value)}
              className="press appearance-none rounded-lg border border-border bg-accent/40 py-2 pl-10 pr-7 text-sm font-medium outline-none disabled:opacity-40"
            >
              {sourceAssets.map((sourceAsset) => (
                <option key={`${sourceAsset.chain}:${sourceAsset.symbol}`} value={sourceAsset.symbol}>
                  {sourceAsset.symbol}
                </option>
              ))}
            </select>
            {asset && (
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                <TokenIcon asset={asset} size={22} showChain={false} />
              </span>
            )}
          </div>
        </div>
        {!sourceAssets.length && (
          <p className="mt-2 text-xs text-loss">No bridgeable mock assets exist on this source network.</p>
        )}
      </Panel>

      <div className="mt-4 flex items-start gap-4">
        <ChainPicker label="From" value={fromChain} onChange={changeFromChain} />
        <ArrowRight className="mt-11 size-4 shrink-0 text-muted-foreground" />
        <ChainPicker label="To" value={toChain} onChange={setToChain} disabledChain={fromChain} />
      </div>

      <Panel className="mt-4 divide-y divide-border p-4">
        <Row label="You receive" value={routeValid ? `${received.toFixed(4)} ${symbol}` : "—"} />
        <Row label="Bridge fee" value={routeValid ? fmtUsd(value * 0.0015) : "—"} />
        <Row
          label="Estimated time"
          value={
            routeValid ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> ~2 min
              </span>
            ) : (
              "Unavailable"
            )
          }
        />
        <Row
          label="Security"
          value={
            routeValid ? (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-gain" /> Mock validated route
              </span>
            ) : (
              "No route"
            )
          }
        />
      </Panel>

      <button
        disabled={!numericAmount || !routeValid || pending}
        onClick={() => {
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            toast.success("Bridge initiated", {
              description: `${amount} ${symbol} is on the way to ${toChain}`,
            });
          }, 1500);
        }}
        className="press mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {!routeValid ? "Choose a valid route" : pending ? "Confirming…" : "Bridge"}
      </button>
    </div>
  );
}
