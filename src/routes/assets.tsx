import { createFileRoute } from "@tanstack/react-router";
import { AssetList } from "@/components/wallet/AssetList";
import { PageHeader } from "@/components/wallet/ui";
import { PrimaryActions } from "@/components/wallet/PrimaryActions";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Aperture Wallet" },
      {
        name: "description",
        content:
          "Browse every token you hold across Ethereum, Solana, Base, Arbitrum and more, with live prices and 24h change.",
      },
      { property: "og:title", content: "Assets — Aperture Wallet" },
      {
        property: "og:description",
        content: "Every token you hold across eight networks, with prices and 24h change.",
      },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <PageHeader
        title="Assets"
        subtitle="Token balances across all connected networks"
        action={<PrimaryActions />}
      />
      <AssetList />
    </div>
  );
}
