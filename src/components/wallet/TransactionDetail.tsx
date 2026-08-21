import { ExternalLink } from "lucide-react";
import {
  fmtToken,
  fmtUsd,
  networkMap,
  shortAddress,
  txLabel,
  type Transaction,
} from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { CopyButton, Row, StatusPill } from "./ui";
import { TxIcon } from "./TxIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function TransactionDetail({
  tx,
  onClose,
}: {
  tx: Transaction | null;
  onClose: () => void;
}) {
  const { account } = useWallet();
  const net = tx ? networkMap[tx.chain] : null;

  return (
    <Sheet open={!!tx} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full gap-0 border-border bg-surface sm:max-w-[420px]">
        {tx && net && (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="text-sm">Transaction</SheetTitle>
              <SheetDescription className="text-xs">
                {txLabel[tx.type]} on {net.name}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col items-center gap-2 px-5 py-6">
              <TxIcon type={tx.type} size={46} />
              <div className="num mt-1 text-2xl font-semibold">
                {tx.type === "contract" ? "Contract call" : fmtToken(tx.amount, tx.asset)}
              </div>
              {tx.toAsset && tx.toAmount != null && (
                <div className="num text-sm text-muted-foreground">
                  → {fmtToken(tx.toAmount, tx.toAsset)}
                </div>
              )}
              {tx.fiat > 0 && <div className="num text-sm text-muted-foreground">{fmtUsd(tx.fiat)}</div>}
              <StatusPill status={tx.status} />
            </div>

            <div className="mx-5 divide-y divide-border rounded-xl border border-border px-3">
              <Row label="Type" value={txLabel[tx.type]} />
              <Row label="Network" value={tx.toChain ? `${net.name} → ${networkMap[tx.toChain].name}` : net.name} />
              <Row
                label="From"
                value={tx.type === "receive" ? tx.counterpartyLabel ?? tx.counterparty : shortAddress(account.address, 8, 6)}
              />
              <Row
                label="To"
                value={tx.type === "receive" ? shortAddress(account.address, 8, 6) : tx.counterpartyLabel ?? tx.counterparty}
              />
              <Row label="Network fee" value={fmtUsd(tx.fee, 4)} />
              <Row
                label="Hash"
                value={
                  <span className="inline-flex items-center gap-1">
                    {shortAddress(tx.hash, 10, 8)}
                    <CopyButton value={tx.hash} label="Transaction hash copied" className="px-1" />
                  </span>
                }
              />
              <Row
                label="Timestamp"
                value={new Date(tx.date).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            </div>

            <a
              href={`https://${net.explorer}/tx/${tx.hash}`}
              target="_blank"
              rel="noreferrer"
              className="press mx-5 mt-4 flex h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium hover:border-primary/40 hover:text-primary"
            >
              View on explorer <ExternalLink className="size-3.5" />
            </a>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
