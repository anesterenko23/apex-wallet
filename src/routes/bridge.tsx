import { useState } from "react";
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
      { title: "Bridge — Aperture Wallet" },
      {
        name: "description",
        content:
          "Move assets between Ethereum, Base, Arbitrum, Optimism and more with estimated arrival time and bridge fees.",
      },
      { property: "og:title", content: "Bridge — Aperture Wallet" },
      {
        property: "og:description",
        content: "Move assets across chains with fee and arrival estimates.",
      },
    ],
  }),
  component: BridgePage,
});

function ChainPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ChainId;
  onChange: (c: ChainId) => void;
}) {
  return (
    <div className="flex-1">
      <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="grid grid-cols-2 gap-1.5">
        {networks.slice(0, 6).map((n) => (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            className={cn(
              "press flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors",
              value === n.id
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <ChainDot chain={n.id} size={14} />
            <span className="truncate">{n.name}</span>
          </button>
        ))}
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

  const asset = assetMap[symbol]!;
  const value = (Number(amount) || 0) * asset.price;
  const received = (Number(amount) || 0) * 0.9985;

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <PageHeader title="Bridge" subtitle="Transfer value across networks" />

      <Panel className="p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>Amount</span>
          <span className="num">{fmtUsd(value)}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="0.00"
            className="num min-w-0 flex-1 bg-transparent text-[26px] font-semibold outline-none placeholder:text-muted-foreground/50"
          />
          <div className="relative">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="press appearance-none rounded-lg border border-border bg-accent/40 py-2 pl-10 pr-7 text-sm font-medium outline-none"
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
              <TokenIcon asset={asset} size={22} showChain={false} />
            </span>
          </div>
        </div>
      </Panel>

      <div className="mt-4 flex items-start gap-4">
        <ChainPicker label="From" value={fromChain} onChange={setFromChain} />
        <ArrowRight className="mt-11 size-4 shrink-0 text-muted-foreground" />
        <ChainPicker label="To" value={toChain} onChange={setToChain} />
      </div>

      <Panel className="mt-4 divide-y divide-border p-4">
        <Row label="You receive" value={`${received.toFixed(4)} ${symbol}`} />
        <Row label="Bridge fee" value={fmtUsd(value * 0.0015)} />
        <Row
          label="Estimated time"
          value={
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" /> ~2 min
            </span>
          }
        />
        <Row
          label="Security"
          value={
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-gain" /> Canonical route
            </span>
          }
        />
      </Panel>

      <button
        disabled={!Number(amount) || fromChain === toChain || pending}
        onClick={() => {
          setPending(true);
          setTimeout(() => {
            setPending(false);
            toast.success("Bridge initiated", {
              description: `${amount} ${symbol} is on the way`,
            });
          }, 1500);
        }}
        className="press mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {fromChain === toChain ? "Pick two different networks" : pending ? "Confirming…" : "Bridge"}
      </button>
    </div>
  );
}
