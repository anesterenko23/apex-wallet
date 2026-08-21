import { useState } from "react";
import { Check, ChevronsUpDown, Copy, Download, Pencil, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fmtUsd, shortAddress } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { AccountAvatar } from "./glyphs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AccountSwitcher({ compact = false }: { compact?: boolean }) {
  const { accounts, account, setAccountId, addAccount, renameAccount, privacy } = useWallet();
  const [dialog, setDialog] = useState<null | "create" | "import" | "rename">(null);
  const [name, setName] = useState("");

  const submit = () => {
    if (dialog === "rename") {
      if (name.trim()) renameAccount(account.id, name.trim());
      toast.success("Account renamed");
    } else if (dialog === "create") {
      addAccount(name.trim() || `Account ${accounts.length + 1}`);
      toast.success("Account created", { description: "New keypair derived locally." });
    } else if (dialog === "import") {
      addAccount(name.trim() || "Imported Wallet", "watch");
      toast.success("Wallet imported");
    }
    setName("");
    setDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "press group flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left hover:border-border hover:bg-accent/60",
              compact && "justify-center px-1",
            )}
          >
            <AccountAvatar address={account.address} hue={account.hue} size={compact ? 26 : 30} />
            {!compact && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{account.name}</span>
                  <span className="num block text-[11px] text-muted-foreground">
                    {shortAddress(account.address)}
                  </span>
                </span>
                <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[290px] p-1.5" sideOffset={8}>
          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Accounts
          </DropdownMenuLabel>
          {accounts.map((a) => (
            <DropdownMenuItem
              key={a.id}
              onClick={() => setAccountId(a.id)}
              className="gap-2.5 rounded-lg px-2 py-2"
            >
              <AccountAvatar address={a.address} hue={a.hue} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{a.name}</span>
                  {a.type === "hardware" && <ShieldCheck className="size-3 text-primary" />}
                </div>
                <span className="num text-[11px] text-muted-foreground">{shortAddress(a.address)}</span>
              </div>
              <div className="text-right">
                <div className="num text-xs font-medium">
                  {privacy ? "••••" : fmtUsd(a.balance, 0)}
                </div>
                {a.id === account.id && <Check className="ml-auto mt-0.5 size-3 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialog("create")} className="gap-2 text-sm">
            <Plus className="size-4" /> Create account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog("import")} className="gap-2 text-sm">
            <Download className="size-4" /> Import wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog("rename")} className="gap-2 text-sm">
            <Pencil className="size-4" /> Rename current
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard?.writeText(account.address);
              toast.success("Address copied");
            }}
            className="gap-2 text-sm"
          >
            <Copy className="size-4" /> Copy address
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {dialog === "rename" ? "Rename account" : dialog === "import" ? "Import wallet" : "Create account"}
            </DialogTitle>
            <DialogDescription>
              {dialog === "import"
                ? "Watch-only import for this demo — no keys are ever stored."
                : "Accounts are derived locally on this device."}
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dialog === "rename" ? account.name : "Account name"}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={submit}>
              {dialog === "rename" ? "Save" : dialog === "import" ? "Import" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
