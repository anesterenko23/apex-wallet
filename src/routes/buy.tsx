import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Apple, Building2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assetMap, fmtUsd } from "@/lib/wallet-data";
import { TokenIcon } from "@/components/wallet/glyphs";
import { PageHeader, Panel, Row } from "@/components/wallet/ui";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy crypto — Apex Wallet" },
      {
        name: "description",
        content:
          "Fund your wallet with card, bank transfer or Apple Pay and receive tokens directly to your self-custody account.",
      },
      { property: "og:title", content: "Buy crypto — Apex Wallet" },
      {
        property: "og:description",
        content: "Fund your self-custody wallet with card, bank transfer or Apple Pay.",
      },
    ],
  }),
  component: BuyPage,
});

const presets = [100, 250, 500, 1000];
const methods = [
  { id: "card", label: "Debit card", detail: "Instant · 1.5% fee", icon: CreditCard },
  { id: "bank", label: "Bank transfer", detail: "1–2 days · 0.5% fee", icon: Building2 },
  { id: "apple", label: "Apple Pay", detail: "Instant · 1.9% fee", icon: Apple },
];
const buyable = ["ETH", "SOL", "USDC", "BTC"];

function BuyPage() {
  const [fiat, setFiat] = useState(250);
  const [symbol, setSymbol] = useState("ETH");
  const [method, setMethod] = useState("card");
  const asset = assetMap[symbol]!;
  const feeRate = method === "bank" ? 0.005 : method === "apple" ? 0.019 : 0.015;
  const fee = fiat * feeRate;
  const tokens = (fiat - fee) / asset.price;

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <PageHeader title="Buy crypto" subtitle="Funds settle straight into your wallet" />

      <Panel className="p-5 text-center">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">You spend</div>
        <div className="num mt-2 text-[42px] font-semibold leading-none">{fmtUsd(fiat, 0)}</div>
        <div className="mt-4 flex justify-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setFiat(p)}
              className={cn(
                "press rounded-full border px-3 py-1.5 text-xs",
                fiat === p
                  ? "border-primary/40 bg-primary/12 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              ${p}
            </button>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {buyable.map((s) => {
          const a = assetMap[s]!;
          return (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={cn(
                "press flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs",
                symbol === s
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <TokenIcon asset={a} size={26} showChain={false} />
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "press flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left",
              method === m.id ? "border-primary/40 bg-primary/8" : "border-border",
            )}
          >
            <m.icon className={cn("size-4", method === m.id ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1">
              <div className="text-sm font-medium">{m.label}</div>
              <div className="text-xs text-muted-foreground">{m.detail}</div>
            </div>
            <span
              className={cn(
                "size-3.5 rounded-full border",
                method === m.id ? "border-primary bg-primary/60" : "border-border",
              )}
            />
          </button>
        ))}
      </div>

      <Panel className="mt-4 divide-y divide-border p-4">
        <Row label="You receive" value={`${tokens.toFixed(tokens < 1 ? 6 : 4)} ${symbol}`} />
        <Row label="Processing fee" value={fmtUsd(fee)} />
        <Row label="Price" value={`${fmtUsd(asset.price)} / ${symbol}`} />
      </Panel>

      <button
        onClick={() =>
          toast.success("Order placed", {
            description: `${fmtUsd(fiat, 0)} of ${symbol} on the way`,
          })
        }
        className="press mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
      >
        Buy {symbol}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Demo experience — no payment is processed.
      </p>
    </div>
  );
}
