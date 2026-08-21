import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { networkMap, shortAddress } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { AccountAvatar } from "@/components/wallet/glyphs";
import { CopyButton, PageHeader, Panel, SectionTitle } from "@/components/wallet/ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aperture Wallet" },
      {
        name: "description",
        content:
          "Manage accounts, address book, currency, auto-lock, spam filtering and security preferences for your wallet.",
      },
      { property: "og:title", content: "Settings — Aperture Wallet" },
      {
        property: "og:description",
        content: "Accounts, address book, currency and security preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          "press relative h-6 w-10 shrink-0 rounded-full border transition-colors",
          value ? "border-primary/50 bg-primary/30" : "border-border bg-accent/40",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all",
            value ? "left-[22px] bg-primary" : "left-[3px] bg-muted-foreground",
          )}
        />
      </button>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="text-sm font-medium">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="press rounded-lg border border-border bg-accent/40 px-3 py-1.5 text-sm outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsPage() {
  const {
    accounts,
    accountId,
    setAccountId,
    addAccount,
    settings,
    updateSettings,
    contacts,
    removeContact,
    addContact,
  } = useWallet();
  const [newName, setNewName] = useState("");

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <PageHeader title="Settings" subtitle="Wallet preferences and security" />

      <section className="mb-9">
        <SectionTitle title="Accounts" hint="Derived from your recovery phrase" />
        <Panel className="divide-y divide-border p-2">
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccountId(a.id)}
              className="press flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-accent/50"
            >
              <AccountAvatar address={a.address} hue={a.hue} size={30} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="num text-xs text-muted-foreground">
                  {shortAddress(a.address)}
                </div>
              </div>
              {accountId === a.id && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                  Active
                </span>
              )}
            </button>
          ))}
        </Panel>
        <div className="mt-2 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New account name"
            className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/40"
          />
          <button
            onClick={() => {
              if (!newName.trim()) return;
              addAccount(newName.trim());
              toast.success("Account created", { description: newName.trim() });
              setNewName("");
            }}
            className="press inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      </section>

      <section className="mb-9">
        <SectionTitle title="General" />
        <Panel className="divide-y divide-border px-4 py-1">
          <Select
            label="Currency"
            value={settings.currency}
            options={["USD", "EUR", "GBP", "JPY"]}
            onChange={(v) => updateSettings({ currency: v })}
          />
          <Select
            label="Language"
            value={settings.language}
            options={["English", "Deutsch", "Français", "日本語"]}
            onChange={(v) => updateSettings({ language: v })}
          />
          <Select
            label="Auto-lock"
            value={settings.autoLock}
            options={["1 minute", "5 minutes", "15 minutes", "Never"]}
            onChange={(v) => updateSettings({ autoLock: v })}
          />
        </Panel>
      </section>

      <section className="mb-9">
        <SectionTitle title="Security & privacy" />
        <Panel className="divide-y divide-border px-4 py-1">
          <Toggle
            label="Confirm every transaction"
            hint="Require an explicit review step before signing"
            value={settings.confirmTx}
            onChange={(v) => updateSettings({ confirmTx: v })}
          />
          <Toggle
            label="Hide balances when locked"
            value={settings.hideBalancesOnLock}
            onChange={(v) => updateSettings({ hideBalancesOnLock: v })}
          />
          <Toggle
            label="Spam token filter"
            hint="Hide unverified airdrops and dust"
            value={settings.spamFilter}
            onChange={(v) => updateSettings({ spamFilter: v })}
          />
          <Toggle
            label="Show testnets"
            value={settings.testnets}
            onChange={(v) => updateSettings({ testnets: v })}
          />
        </Panel>
      </section>

      <section>
        <SectionTitle title="Address book" hint="Saved recipients across networks" />
        <Panel className="divide-y divide-border p-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-2 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="num text-xs text-muted-foreground">
                  {shortAddress(c.address)} · {networkMap[c.chain].name}
                </div>
              </div>
              <CopyButton value={c.address} />
              <button
                onClick={() => removeContact(c.id)}
                aria-label={`Remove ${c.name}`}
                className="press rounded-md p-1.5 text-muted-foreground hover:text-loss"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </Panel>
        <button
          onClick={() => {
            addContact({
              name: `Contact ${contacts.length + 1}`,
              address: "0x8Fc2b41Ae09d7C35b16aE4f80D2c9a7315bE44F1",
              chain: "ethereum",
            });
            toast.success("Contact added");
          }}
          className="press mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Plus className="size-4" /> Add contact
        </button>
      </section>
    </div>
  );
}
