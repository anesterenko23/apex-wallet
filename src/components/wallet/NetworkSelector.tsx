import { Check, ChevronDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { networkMap, networks, type ChainId } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { ChainDot } from "./glyphs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NetworkSelector({ compact = false }: { compact?: boolean }) {
  const { network, setNetwork } = useWallet();
  const active = network === "all" ? null : networkMap[network];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "press flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-2.5 py-1.5 text-xs font-medium hover:border-border-strong hover:bg-accent/60",
            compact && "justify-center px-1.5",
          )}
        >
          {active ? <ChainDot chain={active.id} size={15} /> : <Layers className="size-3.5 text-primary" />}
          {!compact && (
            <>
              <span className="truncate">{active ? active.name : "All Networks"}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[230px] p-1.5">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Network
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setNetwork("all")} className="gap-2.5 rounded-lg">
          <Layers className="size-4 text-primary" />
          <span className="flex-1 text-sm">All Networks</span>
          {network === "all" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {networks.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => setNetwork(n.id as ChainId)}
            className="gap-2.5 rounded-lg"
          >
            <ChainDot chain={n.id} size={16} />
            <span className="flex-1 text-sm">{n.name}</span>
            {network === n.id && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
