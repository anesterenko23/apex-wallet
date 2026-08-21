import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Eye,
  Images,
  Layers,
  Repeat,
  Route as RouteIcon,
  Settings,
  Wallet,
} from "lucide-react";
import {
  fmtToken,
  fmtUsd,
  networkMap,
  shortAddress,
  txLabel,
} from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { AccountAvatar, TokenIcon } from "./glyphs";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const navigate = useNavigate();
  const {
    paletteOpen,
    setPaletteOpen,
    accounts,
    setAccountId,
    transactions,
    openSend,
    openReceive,
    togglePrivacy,
  } = useWallet();
  const assets = useAccountAssets();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const run = (fn: () => void) => {
    setPaletteOpen(false);
    setTimeout(fn, 40);
  };

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Search assets, transactions, accounts, actions…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => openSend())}>
            <ArrowUpRight className="size-4" /> Send crypto
          </CommandItem>
          <CommandItem onSelect={() => run(openReceive)}>
            <ArrowDownLeft className="size-4" /> Receive crypto
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/swap" }))}>
            <Repeat className="size-4" /> Swap tokens
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/bridge" }))}>
            <RouteIcon className="size-4" /> Bridge assets
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/buy" }))}>
            <CreditCard className="size-4" /> Buy crypto
          </CommandItem>
          <CommandItem onSelect={() => run(togglePrivacy)}>
            <Eye className="size-4" /> Toggle privacy mode
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Assets">
          {assets.slice(0, 6).map((a) => (
            <CommandItem
              key={a.symbol}
              value={`${a.symbol} ${a.name}`}
              onSelect={() => run(() => navigate({ to: "/asset/$symbol", params: { symbol: a.symbol } }))}
            >
              <TokenIcon asset={a} size={20} showChain={false} />
              <span>{a.name}</span>
              <span className="num ml-auto text-xs text-muted-foreground">
                {fmtToken(a.balance, a.symbol)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Accounts">
          {accounts.map((a) => (
            <CommandItem
              key={a.id}
              value={`${a.name} ${a.address}`}
              onSelect={() => run(() => setAccountId(a.id))}
            >
              <AccountAvatar address={a.address} hue={a.hue} size={20} />
              <span>{a.name}</span>
              <span className="num ml-auto text-xs text-muted-foreground">
                {shortAddress(a.address)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent transactions">
          {transactions.slice(0, 5).map((t) => (
            <CommandItem
              key={t.id}
              value={`${txLabel[t.type]} ${t.asset} ${t.counterparty}`}
              onSelect={() => run(() => navigate({ to: "/activity" }))}
            >
              <Layers className="size-4 text-muted-foreground" />
              <span>
                {txLabel[t.type]} {t.asset}
              </span>
              <span className="num ml-auto text-xs text-muted-foreground">
                {fmtUsd(t.fiat)} · {networkMap[t.chain].short}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => navigate({ to: "/" }))}>
            <Wallet className="size-4" /> Portfolio
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/nfts" }))}>
            <Images className="size-4" /> NFTs
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/settings" }))}>
            <Settings className="size-4" /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
