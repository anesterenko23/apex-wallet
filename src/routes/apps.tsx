import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { networkMap } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { AppAvatar, ChainDot } from "@/components/wallet/glyphs";
import { PageHeader, Panel } from "@/components/wallet/ui";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Connected apps — Apex Wallet" },
      {
        name: "description",
        content:
          "Review and revoke the dapps connected to your accounts, per network, with last-used activity.",
      },
      { property: "og:title", content: "Connected apps — Apex Wallet" },
      {
        property: "og:description",
        content: "Review and revoke dapp connections across your accounts.",
      },
    ],
  }),
  component: AppsPage,
});

function AppsPage() {
  const { apps, disconnectApp, accounts } = useWallet();

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <PageHeader
        title="Connected apps"
        subtitle="Sessions granted to decentralized applications"
      />

      {apps.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-muted-foreground">
          No apps are connected right now.
        </Panel>
      ) : (
        <div className="space-y-2">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Panel className="flex items-center gap-4 p-4">
                <AppAvatar name={app.name} hue={app.hue} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {app.name}
                    <a
                      href={`https://${app.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={`Open ${app.name}`}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ChainDot chain={app.chain} size={12} />
                      {networkMap[app.chain].name}
                    </span>
                    <span>·</span>
                    <span>
                      {accounts.find((a) => a.id === app.account)?.name ?? app.account}
                    </span>
                    <span>·</span>
                    <span>{app.lastUsed}</span>
                  </div>
                </div>
                <button
                  onClick={() => disconnectApp(app.id)}
                  className="press rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-loss/40 hover:text-loss"
                >
                  Disconnect
                </button>
              </Panel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
