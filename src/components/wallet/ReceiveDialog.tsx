import { useState } from "react";
import { AlertTriangle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { networks, type ChainId } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { AccountAvatar, ChainDot } from "./glyphs";
import { CopyButton, QrMatrix } from "./ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ReceiveDialog() {
  const { receiveOpen, closeReceive, account } = useWallet();
  const [chain, setChain] = useState<ChainId>("ethereum");

  return (
    <Dialog open={receiveOpen} onOpenChange={(o) => !o && closeReceive()}>
      <DialogContent className="border-border bg-surface sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-sm">Receive</DialogTitle>
          <DialogDescription className="text-xs">
            Share this address to receive assets into {account.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background/40 px-3 py-2.5">
          <AccountAvatar address={account.address} hue={account.hue} size={30} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{account.name}</div>
            <div className="text-[11px] text-muted-foreground">Receiving account</div>
          </div>
          <Select value={chain} onValueChange={(v) => setChain(v as ChainId)}>
            <SelectTrigger className="h-8 w-[140px] border-border bg-surface text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {networks.map((n) => (
                <SelectItem key={n.id} value={n.id} className="text-xs">
                  <span className="flex items-center gap-2">
                    <ChainDot chain={n.id} size={14} /> {n.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <QrMatrix value={`${account.address}:${chain}`} />
          <p className="num break-all px-4 text-center text-xs text-muted-foreground">
            {account.address}
          </p>
        </div>

        <div className="flex gap-2">
          <CopyButton
            value={account.address}
            className="press h-10 flex-1 justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-medium text-primary hover:bg-primary/15 hover:text-primary"
          >
            Copy address
          </CopyButton>
          <Button
            variant="ghost"
            className="h-10 flex-1 border border-border"
            onClick={() => toast.success("Share sheet opened")}
          >
            <Share2 className="size-4" /> Share
          </Button>
        </div>

        <p className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/8 px-3 py-2 text-[11px] text-warning">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Only send supported assets on the selected network. Assets sent on other networks may be
          lost permanently.
        </p>
      </DialogContent>
    </Dialog>
  );
}
