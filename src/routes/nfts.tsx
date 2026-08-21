import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtToken, networkMap, type Nft } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { ChainDot } from "@/components/wallet/glyphs";
import { PageHeader, Panel, Row } from "@/components/wallet/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/nfts")({
  head: () => ({
    meta: [
      { title: "NFTs — Aperture Wallet" },
      {
        name: "description",
        content:
          "Your generative art and collectibles across chains, with floor prices, traits and spam filtering.",
      },
      { property: "og:title", content: "NFTs — Aperture Wallet" },
      {
        property: "og:description",
        content: "Collectibles across chains with floor prices and traits.",
      },
    ],
  }),
  component: NftsPage,
});

function NftsPage() {
  const { nftItems, toggleNftHidden, network } = useWallet();
  const [showHidden, setShowHidden] = useState(false);
  const [selected, setSelected] = useState<Nft | null>(null);

  const list = useMemo(() => {
    let l = nftItems.filter((n) => (showHidden ? true : !n.hidden));
    if (network !== "all") l = l.filter((n) => n.chain === network);
    return l;
  }, [nftItems, showHidden, network]);

  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <PageHeader
        title="Collectibles"
        subtitle={`${list.length} items`}
        action={
          <button
            onClick={() => setShowHidden((v) => !v)}
            className={cn(
              "press inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
              showHidden && "border-primary/40 text-primary",
            )}
          >
            {showHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {showHidden ? "Showing hidden" : "Hidden items"}
          </button>
        }
      />

      {list.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-muted-foreground">
          Nothing to show on this network.
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((n, i) => (
            <motion.button
              key={n.id}
              type="button"
              onClick={() => setSelected(n)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              whileHover={{ y: -3 }}
              className="panel group overflow-hidden p-0 text-left"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={n.image}
                  alt={`${n.name} from the ${n.collection} collection`}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span className="absolute right-2 top-2">
                  <ChainDot chain={n.chain} size={16} />
                </span>
              </div>
              <div className="p-3">
                <div className="truncate text-[13px] font-medium">{n.name}</div>
                <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate">{n.collection}</span>
                  <span className="num">{fmtToken(n.floor, "Ξ")}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full gap-0 border-border bg-surface sm:max-w-[420px]">
          {selected && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle className="text-sm">{selected.name}</SheetTitle>
                <SheetDescription className="text-xs">{selected.collection}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 overflow-y-auto p-5">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full rounded-xl border border-border"
                />
                <div className="divide-y divide-border">
                  <Row label="Network" value={networkMap[selected.chain].name} />
                  <Row label="Floor price" value={fmtToken(selected.floor, "ETH")} />
                  {selected.traits.map((t) => (
                    <Row key={t.label} label={t.label} value={t.value} />
                  ))}
                </div>
                <button
                  onClick={() => toggleNftHidden(selected.id)}
                  className="press w-full rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {selected.hidden ? "Unhide item" : "Hide item"}
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
