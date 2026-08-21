import { ArrowDownLeft, ArrowUpRight, FileCode2, Repeat, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TxType } from "@/lib/wallet-data";

const config: Record<TxType, { icon: typeof ArrowUpRight; className: string }> = {
  receive: { icon: ArrowDownLeft, className: "text-gain border-gain/25 bg-gain/10" },
  send: { icon: ArrowUpRight, className: "text-foreground border-border-strong bg-elevated" },
  swap: { icon: Repeat, className: "text-primary border-primary/25 bg-primary/10" },
  bridge: { icon: Route, className: "text-primary border-primary/25 bg-primary/10" },
  contract: { icon: FileCode2, className: "text-muted-foreground border-border-strong bg-elevated" },
};

export function TxIcon({ type, size = 34 }: { type: TxType; size?: number }) {
  const { icon: Icon, className } = config[type];
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border", className)}
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size * 0.42, height: size * 0.42 }} />
    </span>
  );
}
