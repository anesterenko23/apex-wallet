import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  CreditCard,
  Eye,
  EyeOff,
  Images,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Repeat,
  Route as RouteIcon,
  Search,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-store";
import { AccountSwitcher } from "./AccountSwitcher";
import { NetworkSelector } from "./NetworkSelector";
import { CommandPalette } from "./CommandPalette";
import { SendDialog } from "./SendDialog";
import { ReceiveDialog } from "./ReceiveDialog";

type NavTo = "/" | "/assets" | "/activity" | "/swap" | "/bridge" | "/nfts" | "/apps" | "/settings" | "/buy";

const nav: { to: NavTo; label: string; icon: typeof Wallet }[] = [
  { to: "/", label: "Portfolio", icon: Wallet },
  { to: "/assets", label: "Assets", icon: LayoutGrid },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/swap", label: "Swap", icon: Repeat },
  { to: "/bridge", label: "Bridge", icon: RouteIcon },
  { to: "/nfts", label: "NFTs", icon: Images },
  { to: "/apps", label: "Apps", icon: Sparkles },
];

const mobileNav: { to: NavTo; label: string; icon: typeof Wallet }[] = [
  { to: "/", label: "Wallet", icon: Wallet },
  { to: "/swap", label: "Swap", icon: Repeat },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/nfts", label: "Explore", icon: Images },
  { to: "/settings", label: "More", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { sidebarCollapsed, toggleSidebar, privacy, togglePrivacy, setPaletteOpen } = useWallet();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-300 md:flex",
          sidebarCollapsed ? "w-[68px]" : "w-[236px]",
        )}
      >
        <div className={cn("flex items-center gap-2 px-4 py-4", sidebarCollapsed && "justify-center px-2")}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/12">
            <Wallet className="size-4 text-primary" />
          </span>
          {!sidebarCollapsed && (
            <span className="flex-1 text-sm font-semibold tracking-tight">Apex</span>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "press rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
              sidebarCollapsed && "hidden",
            )}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>

        <nav className={cn("flex-1 space-y-0.5 px-2", sidebarCollapsed && "px-2")}>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className={cn(
                  "press relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
                  active && "bg-accent/70 text-foreground",
                  sidebarCollapsed && "justify-center px-0",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-primary" />
                )}
                <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to="/buy"
              title="Buy crypto"
              className={cn(
                "press flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary",
                pathname.startsWith("/buy") && "border-primary/40 text-primary",
                sidebarCollapsed && "justify-center px-0",
              )}
            >
              <CreditCard className="size-4 shrink-0" />
              {!sidebarCollapsed && <span>Buy crypto</span>}
            </Link>
          </div>
        </nav>

        <div className={cn("space-y-2 border-t border-border p-2", sidebarCollapsed && "px-1.5")}>
          <Link
            to="/settings"
            title="Settings"
            className={cn(
              "press flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              pathname.startsWith("/settings") && "bg-accent/70 text-foreground",
              sidebarCollapsed && "justify-center px-0",
            )}
          >
            <Settings className="size-4 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <NetworkSelector compact={sidebarCollapsed} />
          <AccountSwitcher compact={sidebarCollapsed} />
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="press mx-auto flex w-full items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl md:px-8">
          <button
            onClick={() => setPaletteOpen(true)}
            className="press group flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 text-left text-sm text-muted-foreground hover:border-border-strong md:max-w-[380px]"
          >
            <Search className="size-3.5" />
            <span className="flex-1 truncate">Search assets, transactions…</span>
            <kbd className="hidden rounded border border-border bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={togglePrivacy}
              title={privacy ? "Show balances" : "Hide balances"}
              className="press flex size-9 items-center justify-center rounded-lg border border-border bg-surface/60 text-muted-foreground hover:text-foreground"
            >
              {privacy ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            <div className="md:hidden">
              <NetworkSelector compact />
            </div>
            <div className="hidden md:block">
              <NetworkSelector />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-12">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/92 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl md:hidden">
          {mobileNav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "press flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <CommandPalette />
      <SendDialog />
      <ReceiveDialog />
    </div>
  );
}
