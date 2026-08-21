import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  fmtDate,
  fmtToken,
  fmtUsd,
  networkMap,
  txLabel,
  type Transaction,
  type TxType,
} from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { PageHeader, Panel, StatusPill } from "@/components/wallet/ui";
import { TxIcon } from "@/components/wallet/TxIcon";
import { TransactionDetail } from "@/components/wallet/TransactionDetail";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Aperture Wallet" },
      {
        name: "description",
        content:
          "Full multi-chain transaction history: sends, receives, swaps, bridges and contract interactions with fees and status.",
      },
      { property: "og:title", content: "Activity — Aperture Wallet" },
      {
        property: "og:description",
        content: "Multi-chain transaction history with fees, status and explorer links.",
      },
    ],
  }),
  component: ActivityPage,
});

const filters: { key: TxType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "receive", label: "Received" },
  { key: "send", label: "Sent" },
  { key: "swap", label: "Swaps" },
  { key: "bridge", label: "Bridges" },
  { key: "contract", label: "Contracts" },
];

function ActivityPage() {
  const { transactions, network, privacy } = useWallet();
  const [filter, setFilter] = useState<TxType | "all">("all");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const list = useMemo(() => {
    let l = transactions;
    if (network !== "all") l = l.filter((t) => t.chain === network);
    if (filter !== "all") l = l.filter((t) => t.type === filter);
    return l;
  }, [transactions, network, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of list) {
      const key = new Date(tx.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      map.set(key, [...(map.get(key) ?? []), tx]);
    }
    return [...map.entries()];
  }, [list]);

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <PageHeader title="Activity" subtitle={`${list.length} transactions`} />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "press rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === f.key
                ? "border-primary/40 bg-primary/12 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <Panel className="p-10 text-center text-sm text-muted-foreground">
          No transactions match these filters.
        </Panel>
      )}

      <div className="space-y-7">
        {groups.map(([day, txs]) => (
          <div key={day}>
            <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
            <div className="space-y-1">
              {txs.map((tx, i) => (
                <motion.button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelected(tx)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  className="press flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                >
                  <TxIcon type={tx.type} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {txLabel[tx.type]}{" "}
                      <span className="text-muted-foreground">
                        {tx.type === "swap" ? `${tx.asset} → ${tx.toAsset}` : tx.asset}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{fmtDate(tx.date)}</span>
                      <span>·</span>
                      <span>{networkMap[tx.chain].name}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <StatusPill status={tx.status} />
                  </div>
                  <div className="w-[110px] text-right">
                    <div className="num text-sm">
                      {tx.type === "contract" ? "—" : fmtToken(tx.amount, tx.asset)}
                    </div>
                    <div className="num text-xs text-muted-foreground">
                      {privacy ? "••••" : tx.fiat > 0 ? fmtUsd(tx.fiat) : "Fee only"}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TransactionDetail tx={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
