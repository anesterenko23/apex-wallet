import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WalletSettings = {
  currency: string;
  language: string;
  theme: string;
  autoLock: string;
  confirmTx: boolean;
  hideBalancesOnLock: boolean;
  testnets: boolean;
  spamFilter: boolean;
};

export type WalletSettingsState = {
  settings: WalletSettings;
  updateSettings: (patch: Partial<WalletSettings>) => void;
};

const initialSettings: WalletSettings = {
  currency: "USD",
  language: "English",
  theme: "Dark",
  autoLock: "15 minutes",
  confirmTx: true,
  hideBalancesOnLock: true,
  testnets: false,
  spamFilter: true,
};

const WalletSettingsContext = createContext<WalletSettingsState | null>(null);

export function WalletSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WalletSettings>(initialSettings);
  const updateSettings = useCallback(
    (patch: Partial<WalletSettings>) => setSettings((current) => ({ ...current, ...patch })),
    [],
  );

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return (
    <WalletSettingsContext.Provider value={value}>{children}</WalletSettingsContext.Provider>
  );
}

export function useWalletSettings() {
  const context = useContext(WalletSettingsContext);
  if (!context) {
    throw new Error("useWalletSettings must be used inside WalletSettingsProvider");
  }
  return context;
}
