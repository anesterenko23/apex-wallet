import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Copy } from "lucide-react";
import { motion } from "motion/react";
import { fmtUsd, shortAddress, txLabel, fmtToken, fmtDate } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { AccountAvatar } from "@/components/wallet/glyphs";
import { AssetList } from "@/components/wallet/AssetList";
import { PortfolioChart } from "@/components/wallet/PortfolioChart";
import { PrimaryActions } from "@/components/wallet/PrimaryActions";
import { AnimatedBalance, Change, CopyButton, Panel, SectionTitle } from "@/components/wallet/ui";
import { TxIcon } from "@/components/wallet/TxIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Aperture Wallet" },
      {
        name: "description",
        content:
          "Aperture is a multi-chain self-custody wallet: track your portfolio, send, swap, and bridge assets across eight networks.",
      },
      { property: "og:title", content: "Portfolio — Aperture Wallet" },
      {
        property: "og:description",
        content: "Multi-chain self-custody wallet with portfolio tracking, swaps, and bridging.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { account, totalValue, changeAbs, changePct, privacy, openReceive, transactions } =
    useWallet();

  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <section className="ambient mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <AccountAvatar address={account.address} hue={account.hue} size={34} />
          <div>
            <div className="text-sm font-medium">{account.name}</div>
            <div className="flex items-center gap-1">
              <span className="num text-xs text-muted-foreground">
                {shortAddress(account.address)}
              </span>
              <CopyButton value={account.address} className="px-1 py-0.5">
                <span className="sr-only">Copy</span>
              </CopyButton>
              <button
                onClick={openReceive}
                className="press rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Show QR code"
              >
                <QrCode className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Total portfolio value
          </div>
          <AnimatedBalance
            value={totalValue}
            className="mt-1.5 block text-[46px] font-semibold leading-none tracking-tight md:text-[56px]"
          />
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className={changeAbs >= 0 ? "num text-gain" : "num text-loss"}>
              {changeAbs >= 0 ? "+" : "−"}
              {privacy ? "••••" : fmtUsd(Math.abs(changeAbs))}
            </span>
            <Change value={changePct} />
            <span className="text-muted-foreground">today</span>
          </div>
        </div>

        <div className="mt-6">
          <PrimaryActions />
        </div>
      </section>

      <Panel className="mb-10 p-5">
        <PortfolioChart endValue={totalValue} seed={account.hue} />
      </Panel>

      <section className="mb-10">
        <SectionTitle
          title="Assets"
          hint="Balances across all connected networks"
          action={
            <Link to="/assets" className="text-xs text-primary hover:underline">
              View all
            </Link>
          }
        />
        <AssetList limit={5} showControls={false} />
      </section>

      <section>
        <SectionTitle
          title="Recent activity"
          action={
            <Link to="/activity" className="text-xs text-primary hover:underline">
              Full history
            </Link>
          }
        />
        <div className="space-y-1">
          {transactions.slice(0, 5).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to="/activity"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
              >
                <TxIcon type={tx.type} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {txLabel[tx.type]}{" "}
                    <span className="text-muted-foreground">
                      {tx.type === "swap" ? `${tx.asset} → ${tx.toAsset}` : tx.asset}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{fmtDate(tx.date)}</div>
                </div>
                <div className="text-right">
                  <div className="num text-sm">
                    {tx.type === "contract" ? "—" : fmtToken(tx.amount, tx.asset)}
                  </div>
                  <div className="num text-xs text-muted-foreground">
                    {privacy ? "••••" : tx.fiat > 0 ? fmtUsd(tx.fiat) : "Fee only"}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { Copy };
