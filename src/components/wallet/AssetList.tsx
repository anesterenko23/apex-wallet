import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownLeft, Repeat, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { assetValue, fmtToken, fmtUsd, type Asset } from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { TokenIcon } from "./glyphs";
import { Change } from "./ui";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { NetworkSelector } from "./NetworkSelector";

export function AssetList({ showControls = true, limit }: { showControls?: boolean; limit?: number }) {
  const [query, setQuery] = useState("");
  const { privacy, hideSmall, toggleHideSmall, favorites, toggleFavorite, openSend, openReceive } =
    useWallet();
  const list = useAccountAssets();

  const filtered = list
    .filter(
      (a) =>
        a.symbol.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, limit ?? list.length);

  return (
    <div>
      {showControls && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[190px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets"
              className="h-9 border-border bg-surface/60 pl-9 text-sm"
            />
          </div>
          <NetworkSelector />
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface/60 px-2.5 py-1.5 text-xs text-muted-foreground">
            <Switch checked={hideSmall} onCheckedChange={toggleHideSmall} className="h-4 w-7" />
            Hide small balances
          </label>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[minmax(0,2.2fr)_1fr_0.8fr_minmax(0,1.4fr)] items-center gap-3 border-b border-border bg-surface/40 px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground max-md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <span>Asset</span>
          <span className="text-right max-md:hidden">Price</span>
          <span className="text-right max-md:hidden">24h</span>
          <span className="text-right">Balance</span>
        </div>

        {filtered.map((asset, i) => (
          <AssetRow
            key={asset.symbol + asset.chain}
            asset={asset}
            index={i}
            privacy={privacy}
            favorite={favorites.includes(asset.symbol)}
            onFavorite={() => toggleFavorite(asset.symbol)}
            onSend={() => openSend(asset.symbol)}
            onReceive={openReceive}
          />
        ))}

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No assets match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function AssetRow({
  asset,
  index,
  privacy,
  favorite,
  onFavorite,
  onSend,
  onReceive,
}: {
  asset: Asset;
  index: number;
  privacy: boolean;
  favorite: boolean;
  onFavorite: () => void;
  onSend: () => void;
  onReceive: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.35 }}
      className="group relative border-b border-border last:border-0"
    >
      <Link
        to="/asset/$symbol"
        params={{ symbol: asset.symbol }}
        className="grid grid-cols-[minmax(0,2.2fr)_1fr_0.8fr_minmax(0,1.4fr)] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50 max-md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <TokenIcon asset={asset} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{asset.name}</span>
              {favorite && <Star className="size-3 fill-primary text-primary" />}
            </div>
            <span className="text-xs text-muted-foreground">{asset.symbol}</span>
          </div>
        </div>

        <div className="num text-right text-sm max-md:hidden">{fmtUsd(asset.price)}</div>
        <div className="text-right text-sm max-md:hidden">
          <Change value={asset.change24h} />
        </div>

        <div className="text-right">
          <div className="num text-sm font-medium">
            {privacy ? "••••" : fmtUsd(assetValue(asset))}
          </div>
          <div className="num text-xs text-muted-foreground">
            {privacy ? "••••" : fmtToken(asset.balance, asset.symbol)}
          </div>
        </div>
      </Link>

      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 max-lg:hidden">
        <QuickAction label="Send" onClick={onSend}>
          <ArrowUpRight className="size-3.5" />
        </QuickAction>
        <QuickAction label="Receive" onClick={onReceive}>
          <ArrowDownLeft className="size-3.5" />
        </QuickAction>
        <QuickAction label="Swap" to="/swap">
          <Repeat className="size-3.5" />
        </QuickAction>
        <QuickAction label={favorite ? "Unfavorite" : "Favorite"} onClick={onFavorite}>
          <Star className={cn("size-3.5", favorite && "fill-primary text-primary")} />
        </QuickAction>
      </div>
    </motion.div>
  );
}

function QuickAction({
  children,
  label,
  onClick,
  to,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  to?: "/swap";
}) {
  const cls =
    "press flex size-7 items-center justify-center rounded-md border border-border bg-elevated/90 text-muted-foreground backdrop-blur hover:border-primary/40 hover:text-primary";
  if (to)
    return (
      <Link to={to} className={cls} aria-label={label} title={label}>
        {children}
      </Link>
    );
  return (
    <button
      type="button"
      className={cls}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
