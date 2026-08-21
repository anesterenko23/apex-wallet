import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookUser,
  Check,
  ClipboardPaste,
  ExternalLink,
  Loader2,
  QrCode,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  assetValue,
  fmtToken,
  fmtUsd,
  networkMap,
  shortAddress,
  type Asset,
} from "@/lib/wallet-data";
import { useAccountAssets, useWallet } from "@/lib/wallet-store";
import { TokenIcon } from "./glyphs";
import { CopyButton, Row } from "./ui";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Step = "asset" | "recipient" | "amount" | "review" | "sending" | "success" | "failed";

const steps: Step[] = ["asset", "recipient", "amount", "review"];

export function SendDialog() {
  const { sendOpen, closeSend, sendAsset, contacts, account, addTransaction } = useWallet();
  const list = useAccountAssets();
  const all = useAccountAssets();

  const [step, setStep] = useState<Step>("asset");
  const [symbol, setSymbol] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [query, setQuery] = useState("");
  const [showBook, setShowBook] = useState(false);

  const asset = useMemo(
    () => all.find((a) => a.symbol === symbol) ?? null,
    [all, symbol],
  );

  useEffect(() => {
    if (!sendOpen) return;
    setStep(sendAsset ? "recipient" : "asset");
    setSymbol(sendAsset ?? null);
    setRecipient("");
    setAmount("");
    setQuery("");
    setShowBook(false);
  }, [sendOpen, sendAsset]);

  const validAddress =
    /^0x[a-fA-F0-9]{40}$/.test(recipient.trim()) ||
    /^[a-zA-Z0-9-]{3,}\.(eth|sol|base)$/.test(recipient.trim()) ||
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(recipient.trim());

  const numAmount = Number(amount) || 0;
  const fiat = asset ? numAmount * asset.price : 0;
  const fee = asset ? (asset.chain === "ethereum" ? 1.84 : asset.chain === "solana" ? 0.002 : 0.06) : 0;
  const enough = asset ? numAmount > 0 && numAmount <= asset.balance : false;

  const submit = async () => {
    if (!asset) return;
    setStep("sending");
    await new Promise((r) => setTimeout(r, 2200));
    const fails = numAmount > 0 && Math.abs(numAmount - asset.balance) < 1e-12 && asset.chain === "ethereum";
    if (fails) {
      setStep("failed");
      return;
    }
    const hash = `0x${Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`;
    addTransaction({
      id: hash.slice(0, 10),
      type: "send",
      asset: asset.symbol,
      amount: numAmount,
      fiat,
      counterparty: recipient.startsWith("0x") ? shortAddress(recipient) : recipient,
      chain: asset.chain,
      date: new Date().toISOString(),
      status: "confirmed",
      fee,
      hash,
      account: account.id,
    });
    setStep("success");
  };

  const stepIndex = steps.indexOf(step);

  return (
    <Dialog open={sendOpen} onOpenChange={(o) => !o && closeSend()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] gap-0 overflow-hidden border-border bg-surface p-0 sm:max-w-[440px] max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          {stepIndex > 0 && step !== "sending" && (
            <button
              className="press -ml-1 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setStep(steps[stepIndex - 1] ?? "asset")}
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <DialogTitle className="flex-1 text-sm font-semibold">
            {step === "success" ? "Transaction sent" : step === "failed" ? "Transaction failed" : "Send"}
          </DialogTitle>
          {stepIndex >= 0 && (
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    i <= stepIndex ? "w-5 bg-primary" : "w-2.5 bg-border-strong",
                  )}
                />
              ))}
            </div>
          )}
          <button
            className="press rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={closeSend}
          >
            <X className="size-4" />
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="p-4"
          >
            {step === "asset" && (
              <div>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your assets"
                    className="h-9 pl-9 text-sm"
                  />
                </div>
                <ScrollArea className="h-[360px] -mx-1 px-1">
                  {list
                    .filter((a) => (a.symbol + a.name).toLowerCase().includes(query.toLowerCase()))
                    .map((a) => (
                      <button
                        key={a.symbol}
                        onClick={() => {
                          setSymbol(a.symbol);
                          setStep("recipient");
                        }}
                        className="press flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-accent/60"
                      >
                        <TokenIcon asset={a} size={34} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {networkMap[a.chain].name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="num text-sm">{fmtToken(a.balance, a.symbol)}</div>
                          <div className="num text-xs text-muted-foreground">
                            {fmtUsd(assetValue(a))}
                          </div>
                        </div>
                      </button>
                    ))}
                </ScrollArea>
              </div>
            )}

            {step === "recipient" && asset && (
              <div className="space-y-3">
                <AssetBanner asset={asset} />
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">
                    Recipient address or domain
                  </label>
                  <div className="relative">
                    <Input
                      autoFocus
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x… or name.eth"
                      className={cn(
                        "num h-11 pr-24 text-sm",
                        recipient && (validAddress ? "border-gain/50" : "border-loss/50"),
                      )}
                    />
                    <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                      <IconBtn
                        title="Paste"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setRecipient(text.trim());
                          } catch {
                            toast.error("Clipboard unavailable");
                          }
                        }}
                      >
                        <ClipboardPaste className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Scan QR" onClick={() => toast.info("Camera scanning is unavailable in this demo")}>
                        <QrCode className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Address book" onClick={() => setShowBook((v) => !v)}>
                        <BookUser className="size-3.5" />
                      </IconBtn>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "mt-1.5 flex items-center gap-1.5 text-xs",
                      !recipient
                        ? "text-muted-foreground"
                        : validAddress
                          ? "text-gain"
                          : "text-loss",
                    )}
                  >
                    {recipient ? (
                      validAddress ? (
                        <>
                          <Check className="size-3" /> Valid {networkMap[asset.chain].name} destination
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="size-3" /> This doesn&apos;t look like a valid address
                        </>
                      )
                    ) : (
                      "Double-check the address — transfers are irreversible."
                    )}
                  </p>
                </div>

                <AnimatePresence>
                  {showBook && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      {contacts.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setRecipient(c.address);
                            setShowBook(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 border-b border-border px-3 py-2 text-left last:border-0 hover:bg-accent/60"
                        >
                          <span className="text-sm">{c.name}</span>
                          <span className="num text-xs text-muted-foreground">
                            {shortAddress(c.address)}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  className="h-11 w-full"
                  disabled={!validAddress}
                  onClick={() => setStep("amount")}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === "amount" && asset && (
              <div className="space-y-3">
                <AssetBanner asset={asset} />
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      autoFocus
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="0.00"
                      inputMode="decimal"
                      className="num min-w-0 flex-1 bg-transparent text-3xl font-semibold outline-none placeholder:text-muted-foreground/50"
                    />
                    <span className="text-lg font-medium text-muted-foreground">{asset.symbol}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="num text-muted-foreground">≈ {fmtUsd(fiat)}</span>
                    <div className="flex items-center gap-2">
                      <span className="num text-muted-foreground">
                        Available {fmtToken(asset.balance, asset.symbol)}
                      </span>
                      <button
                        className="press rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-medium text-primary"
                        onClick={() => setAmount(String(Number(asset.balance.toFixed(6))))}
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
                {numAmount > asset.balance && (
                  <p className="flex items-center gap-1.5 text-xs text-loss">
                    <AlertTriangle className="size-3" /> Amount exceeds your balance
                  </p>
                )}
                <Button className="h-11 w-full" disabled={!enough} onClick={() => setStep("review")}>
                  Review transaction
                </Button>
              </div>
            )}

            {step === "review" && asset && (
              <div>
                <div className="mb-4 flex flex-col items-center gap-2 pt-2">
                  <TokenIcon asset={asset} size={44} />
                  <div className="num text-2xl font-semibold">{fmtToken(numAmount, asset.symbol)}</div>
                  <div className="num text-sm text-muted-foreground">{fmtUsd(fiat)}</div>
                </div>
                <div className="divide-y divide-border rounded-xl border border-border px-3">
                  <Row label="Asset" value={`${asset.name} (${asset.symbol})`} />
                  <Row
                    label="Recipient"
                    value={recipient.startsWith("0x") ? shortAddress(recipient, 10, 8) : recipient}
                  />
                  <Row label="Network" value={networkMap[asset.chain].name} />
                  <Row label="Network fee" value={fmtUsd(fee)} />
                  <Row label="Estimated arrival" value={asset.chain === "solana" ? "~2 seconds" : "~18 seconds"} />
                  <Row label="Total" value={fmtUsd(fiat + fee)} />
                </div>
                <Button className="mt-4 h-11 w-full" onClick={submit}>
                  Confirm Send
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Signed locally on this device. Nothing leaves your wallet unencrypted.
                </p>
              </div>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center gap-3 py-16">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Broadcasting transaction</p>
                <p className="text-xs text-muted-foreground">Waiting for network confirmation…</p>
              </div>
            )}

            {step === "success" && asset && (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="relative flex size-16 items-center justify-center rounded-full border border-gain/30 bg-gain/10"
                >
                  <Check className="size-7 text-gain" />
                  <motion.span
                    className="absolute inset-0 rounded-full border border-gain/40"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: 1 }}
                  />
                </motion.div>
                <p className="mt-4 text-sm font-medium">Transaction sent</p>
                <p className="num mt-1 text-xs text-muted-foreground">
                  {fmtToken(numAmount, asset.symbol)} · {fmtUsd(fiat)}
                </p>
                <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="num truncate text-xs text-muted-foreground">
                    {shortAddress(`0x${Math.random().toString(16).slice(2)}${"a".repeat(40)}`, 12, 8)}
                  </span>
                  <div className="flex items-center gap-1">
                    <CopyButton value={recipient} label="Transaction hash copied" />
                    <a
                      href={`https://${networkMap[asset.chain].explorer}`}
                      target="_blank"
                      rel="noreferrer"
                      className="press rounded-md px-2 py-1 text-xs text-primary hover:bg-primary/10"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
                <Button className="mt-4 h-11 w-full" onClick={closeSend}>
                  Done
                </Button>
              </div>
            )}

            {step === "failed" && (
              <div className="flex flex-col items-center py-10">
                <div className="flex size-16 items-center justify-center rounded-full border border-loss/30 bg-loss/10">
                  <X className="size-7 text-loss" />
                </div>
                <p className="mt-4 text-sm font-medium">Transaction failed</p>
                <p className="mt-1 max-w-[280px] text-center text-xs text-muted-foreground">
                  Insufficient balance to cover the network fee after sending the full amount.
                </p>
                <div className="mt-4 flex w-full gap-2">
                  <Button variant="ghost" className="h-11 flex-1" onClick={closeSend}>
                    Close
                  </Button>
                  <Button className="h-11 flex-1" onClick={() => setStep("amount")}>
                    Adjust amount
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function AssetBanner({ asset }: { asset: Asset }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
      <TokenIcon asset={asset} size={30} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{asset.name}</div>
        <div className="text-[11px] text-muted-foreground">{networkMap[asset.chain].name}</div>
      </div>
      <div className="num text-xs text-muted-foreground">{fmtToken(asset.balance, asset.symbol)}</div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}
