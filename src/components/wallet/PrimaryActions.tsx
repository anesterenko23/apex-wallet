import { Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Repeat, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-store";

export function PrimaryActions({ symbol }: { symbol?: string }) {
  const { openSend, openReceive } = useWallet();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Action label="Send" primary onClick={() => openSend(symbol)}>
        <ArrowUpRight className="size-4" />
      </Action>
      <Action label="Receive" onClick={openReceive}>
        <ArrowDownLeft className="size-4" />
      </Action>
      <Action label="Swap" to="/swap">
        <Repeat className="size-4" />
      </Action>
      <Action label="Buy" to="/buy">
        <CreditCard className="size-4" />
      </Action>
      <Action label="Bridge" to="/bridge" subtle>
        <RouteIcon className="size-4" />
      </Action>
    </div>
  );
}

function Action({
  children,
  label,
  onClick,
  to,
  primary,
  subtle,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  to?: "/swap" | "/buy" | "/bridge";
  primary?: boolean;
  subtle?: boolean;
}) {
  const cls = cn(
    "press flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-medium",
    primary
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : subtle
        ? "border border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
        : "border border-border bg-surface/70 text-foreground hover:border-primary/40 hover:text-primary",
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
        {label}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
      {label}
    </button>
  );
}
