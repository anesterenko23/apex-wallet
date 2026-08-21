import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, CheckCircle2, Settings2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assetMap, assets, fmtUsd, type Asset } from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { TokenIcon } from "@/components/wallet/glyphs";
import { PageHeader, Panel, Row } from "@/components/wallet/ui";

export const Route = createFileRoute("/swap")({
  head: () => ({
    meta: [
      { title: "Swap — Apex Wallet" },
      {
        name: "description",
        content:
          "Swap tokens with route review, slippage control, price impact and network fee preview.",
      },
      { property: "og:title", content: "Swap — Apex Wallet" },
      {
        property: "og:description",
        content: "Token swaps with explicit review, balance validation and route preview.",
      },
    ],
  }),
  component: SwapPage,
});

function TokenField({
  label,
  symbol,
  options,
  onSymbol,
  amount,
  onAmount,
  readOnly,
  balance,
}: {
  label: string;
  symbol: string;
  options: Asset[];
  onSymbol: (symbol: string) => void;
  amount: string;
  onAmount?: (value: string) => void;
  readOnly?: boolean;
  balance?: number;
}) {
  const asset = assetMap[symbol];

  if (!asset) return null;

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
          onChange={(event) => onAmount?.(event.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          inputMode="decimal"
          className="num min-w-0 flex-1 bg-transparent text-[26px] font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        <div className="relative">
          <select
            value={symbol}
            onChange={(event) => onSymbol(event.target.value)}
            className="press appearance-none rounded-lg border border-border bg-accent/40 py-2 pl-10 pr-7 text-sm font-medium outline-none"
          >
            {options.map((option) => (
              <option key={`${option.chain}:${option.symbol}`} value={option.symbol}>
                {option.symbol}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
            <TokenIcon asset={asset} size={22} showChain={false} />
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
  const { account, addTransaction, openSend } = useWallet();
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("BTC");
  const [amount, setAmount] = useState("1");
  const [slippage, setSlippage] = useState("0.5");
  const [reviewing, setReviewing] = useState(false);
  const [pending, setPending] = useState(false);

  const fromAsset = assetMap[from];
  const compatibleAssets = useMemo(
    () => (fromAsset ? assets.filter((asset) => asset.chain === fromAsset.chain) : []),
    [fromAsset],
  );
  const destinationAssets = compatibleAssets.filter((asset) => asset.symbol !== from);

  useEffect(() => {
    if (destinationAssets.some((asset) => asset.symbol === to)) return;
    setTo(destinationAssets[0]?.symbol ?? from);
    setReviewing(false);
  }, [destinationAssets, from, to]);

  const toAsset = assetMap[to];
  const hasRoute = Boolean(fromAsset && toAsset && from !== to && fromAsset.chain === toAsset.chain);
  const rate = hasRoute ? fromAsset.price / toAsset.price : 0;
  const out = useMemo(() => (Number(amount) || 0) * rate * 0.997, [amount, rate]);
  const balance = accountAssets.find((asset) => asset.symbol === from)?.balance ?? 0;
  const numericAmount = Number(amount) || 0;
  const enoughBalance = numericAmount > 0 && numericAmount <= balance;
  const canReview = hasRoute && enoughBalance && !pending;
  const networkFee = fromAsset?.chain === "ethereum" ? 1.42 : 0.08;

  const updateAmount = (value: string) => {
    setAmount(value);
    setReviewing(false);
  };

  const selectFrom = (symbol: string) => {
    setFrom(symbol);
    setReviewing(false);
  };

  const selectTo = (symbol: string) => {
    setTo(symbol);
    setReviewing(false);
  };

  const flip = () => {
    if (!hasRoute) return;
    setFrom(to);
    setTo(from);
    setReviewing(false);
  };

  const confirmSwap = () => {
    if (!canReview || !fromAsset || !toAsset) return;

    setPending(true);
    window.setTimeout(() => {
      const hash = `0x${Array.from(
        { length: 64 },
        () => "0123456789abcdef"[Math.floor(Math.random() * 16)],
      ).join("")}`;

      addTransaction({
        id: hash.slice(0, 10),
        type: "swap",
        asset: fromAsset.symbol,
        amount: numericAmount,
        toAsset: toAsset.symbol,
        toAmount: out,
        fiat: numericAmount * fromAsset.price,
        counterparty: "Apex Router",
        chain: fromAsset.chain,
        date: new Date().toISOString(),
        status: "confirmed",
        fee: networkFee,
        hash,
        account: account.id,
      });

      setPending(false);
      setReviewing(false);
      toast.success("Swap submitted", {
        description: `${amount} ${from} → ${out.toFixed(4)} ${to}`,
      });
    }, 1400);
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <PageHeader title="Swap" subtitle="Same-network swaps with explicit review" />

      <div className="relative space-y-2">
        <TokenField
          label="You pay"
          symbol={from}
          options={assets}
          onSymbol={selectFrom}
          amount={amount}
          onAmount={updateAmount}
          balance={balance}
        />
        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.9, rotate: hasRoute ? 180 : 0 }}
            onClick={flip}
            disabled={!hasRoute}
            className="press -my-4 z-10 rounded-xl border border-border bg-surface p-2 text-muted-foreground hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Flip tokens"
          >
            <ArrowDown className="size-4" />
          </motion.button>
        </div>
        <TokenField
          label="You receive"
          symbol={to}
          options={destinationAssets.length ? destinationAssets : [fromAsset].filter(Boolean) as Asset[]}
          onSymbol={selectTo}
          amount={hasRoute && out ? out.toFixed(out < 1 ? 6 : 4) : ""}
          readOnly
        />
      </div>

      {!hasRoute && (
        <p className="mt-3 text-xs text-loss">
          No same-network swap route is available for {from}. Choose another source asset.
        </p>
      )}
      {hasRoute && numericAmount > balance && (
        <p className="mt-3 text-xs text-loss">Insufficient {from} balance.</p>
      )}

      <Panel className="mt-4 p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Settings2 className="size-3.5" /> Max slippage
          </span>
          <div className="flex gap-1">
            {slippages.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setSlippage(value);
                  setReviewing(false);
                }}
                className={cn(
                  "press rounded-md px-2 py-1 text-[11px]",
                  slippage === value
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          <Row
            label="Rate"
            value={hasRoute ? `1 ${from} ≈ ${rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${to}` : "—"}
          />
          <Row label="Price impact" value={hasRoute ? "0.08%" : "—"} />
          <Row label="Network fee" value={hasRoute ? fmtUsd(networkFee) : "—"} />
          <Row
            label="Route"
            value={
              hasRoute ? (
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" /> Apex Router
                </span>
              ) : (
                "Unavailable"
              )
            }
          />
        </div>
      </Panel>

      {reviewing && hasRoute && fromAsset && toAsset && (
        <Panel className="mt-4 border-primary/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-primary" /> Review swap
          </div>
          <div className="divide-y divide-border">
            <Row label="Pay" value={`${amount} ${from}`} />
            <Row label="Receive" value={`≈ ${out.toFixed(out < 1 ? 6 : 4)} ${to}`} />
            <Row label="Network" value={fromAsset.chain} />
            <Row label="Maximum slippage" value={`${slippage}%`} />
            <Row label="Estimated fee" value={fmtUsd(networkFee)} />
          </div>
        </Panel>
      )}

      <button
        disabled={!canReview}
        onClick={() => (reviewing ? confirmSwap() : setReviewing(true))}
        className="press mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {pending ? "Confirming…" : reviewing ? "Confirm swap" : "Review swap"}
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
