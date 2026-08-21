import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Settings2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assetMap, assets, fmtUsd } from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { TokenIcon } from "@/components/wallet/glyphs";
import { PageHeader, Panel, Row } from "@/components/wallet/ui";

export const Route = createFileRoute("/swap")({
  head: () => ({
    meta: [
      { title: "Swap — Aperture Wallet" },
      {
        name: "description",
        content:
          "Swap tokens at the best available route with live quotes, slippage control, price impact and network fee preview.",
      },
      { property: "og:title", content: "Swap — Aperture Wallet" },
      {
        property: "og:description",
        content: "Token swaps with live quotes, slippage control and route preview.",
      },
    ],
  }),
  component: SwapPage,
});

function TokenField({
  label,
  symbol,
  onSymbol,
  amount,
  onAmount,
  readOnly,
  balance,
}: {
  label: string;
  symbol: string;
  onSymbol: (s: string) => void;
  amount: string;
  onAmount?: (v: string) => void;
  readOnly?: boolean;
  balance?: number;
}) {
  const asset = assetMap[symbol];
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {balance !== undefined && (
          <span className="num">
            Balance {balance.toLocaleString("en-US", { maximumFractionDigits: 4 })}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmount?.(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          inputMode="decimal"
          className="num min-w-0 flex-1 bg-transparent text-[26px] font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        <div className="relative">
          <select
            value={symbol}
            onChange={(e) => onSymbol(e.target.value)}
            className="press appearance-none rounded-lg border border-border bg-accent/40 py-2 pl-10 pr-7 text-sm font-medium outline-none"
          >
            {assets.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
            <TokenIcon symbol={asset.symbol} glyph={asset.glyph} color={asset.color} size={22} />
          </span>
        </div>
      </div>
      <div className="num mt-1 text-xs text-muted-foreground">
        {fmtUsd((Number(amount) || 0) * asset.price)}
      </div>
    </Panel>
  );
}

const slippages = ["0.1", "0.5", "1.0"];

function SwapPage() {
  const accountAssets = useAccountAssets();
  const { openSend } = useWallet();
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("USDC");
  const [amount, setAmount] = useState("1");
  const [slippage, setSlippage] = useState("0.5");
  const [pending, setPending] = useState(false);

  const rate = assetMap[from].price / assetMap[to].price;
  const out = useMemo(() => (Number(amount) || 0) * rate * 0.997, [amount, rate]);
  const balance = accountAssets.find((a) => a.symbol === from)?.balance ?? 0;

  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <PageHeader title="Swap" subtitle="Best route across aggregated liquidity" />

      <div className="relative space-y-2">
        <TokenField
          label="You pay"
          symbol={from}
          onSymbol={(s) => (s === to ? flip() : setFrom(s))}
          amount={amount}
          onAmount={setAmount}
          balance={balance}
        />
        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={flip}
            className="press -my-4 z-10 rounded-xl border border-border bg-surface p-2 text-muted-foreground hover:text-primary"
            aria-label="Flip tokens"
          >
            <ArrowDown className="size-4" />
          </motion.button>
        </div>
        <TokenField
          label="You receive"
          symbol={to}
          onSymbol={(s) => (s === from ? flip() : setTo(s))}
          amount={out ? out.toFixed(out < 1 ? 6 : 4) : ""}
          readOnly
        />
      </div>

      <Panel className="mt-4 p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Settings2 className="size-3.5" /> Max slippage
          </span>
          <div className="flex gap-1">
            {slippages.map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={cn(
                  "press rounded-md px-2 py-1 text-[11px]",
                  slippage === s
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          <Row
            label="Rate"
            value={`1 ${from} ≈ ${rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${to}`}
          />
          <Row label="Price impact" value="0.08%" />
          <Row label="Network fee" value={fmtUsd(1.42)} />
          <Row
            label="Route"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Zap className="size-3.5 text-primary" /> Aperture Router
              </span>
            }
          />
        </div>
      </Panel>

      <button
        disabled={!Number(amount) || pending}
        onClick={() => {
          setPending(true);
          setTimeout(() => {
            setPending(false);
            toast.success("Swap submitted", {
              description: `${amount} ${from} → ${out.toFixed(4)} ${to}`,
            });
          }, 1400);
        }}
        className="press mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {pending ? "Confirming…" : "Review swap"}
      </button>

      <button
        onClick={() => openSend(from)}
        className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Send {from} instead
      </button>
    </div>
  );
}
