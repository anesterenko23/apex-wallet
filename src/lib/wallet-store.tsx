import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  accounts as seedAccounts,
  assets,
  assetValue,
  type Account,
  type ChainId,
} from "./wallet-data";
import { WalletDataProvider, useWalletData, type WalletDataState } from "./wallet-data-store";
import {
  WalletSettingsProvider,
  useWalletSettings,
  type WalletSettingsState,
} from "./wallet-settings-store";
import { WalletUiProvider, useWalletUi, type WalletUiState } from "./wallet-ui-store";

type NetworkFilter = ChainId | "all";

type WalletCoreState = {
  accounts: Account[];
  accountId: string;
  account: Account;
  setAccountId: (id: string) => void;
  addAccount: (name: string, type?: Account["type"]) => void;
  renameAccount: (id: string, name: string) => void;
  network: NetworkFilter;
  setNetwork: (network: NetworkFilter) => void;
  privacy: boolean;
  togglePrivacy: () => void;
  favorites: string[];
  toggleFavorite: (symbol: string) => void;
  hideSmall: boolean;
  toggleHideSmall: () => void;
  totalValue: number;
  changeAbs: number;
  changePct: number;
};

export type WalletState = WalletCoreState & WalletDataState & WalletSettingsState & WalletUiState;

const WalletCoreContext = createContext<WalletCoreState | null>(null);

function WalletCoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [accountId, setAccountId] = useState("main");
  const [network, setNetwork] = useState<NetworkFilter>("all");
  const [privacy, setPrivacy] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["ETH", "SOL"]);
  const [hideSmall, setHideSmall] = useState(false);

  const account = accounts.find((item) => item.id === accountId) ?? accounts[0];

  if (!account) {
    throw new Error("Apex Wallet requires at least one account");
  }

  const totalValue = useMemo(() => {
    const base = assets.reduce((sum, asset) => sum + assetValue(asset), 0);
    const ratio = account.balance / 24892.41;
    return base * ratio;
  }, [account.balance]);

  const changePct = 5.28 * (account.id === "cold" ? 0.42 : account.id === "defi" ? -0.61 : 1);
  const changeAbs = (totalValue * changePct) / 100;

  const addAccount = useCallback((name: string, type: Account["type"] = "hot") => {
    setAccounts((current) => {
      const id = `acct-${current.length + 1}`;
      const random = Math.floor(Math.random() * 0xfffff)
        .toString(16)
        .padStart(5, "0");

      return [
        ...current,
        {
          id,
          name,
          address: `0x${random}A4c7B1d0F27b5E8a4c66D3fA1b0e2C59${random.slice(0, 2)}`.slice(
            0,
            42,
          ),
          balance: 0,
          hue: Math.floor(Math.random() * 360),
          type,
        },
      ];
    });
  }, []);

  const renameAccount = useCallback((id: string, name: string) => {
    setAccounts((current) =>
      current.map((item) => (item.id === id ? { ...item, name } : item)),
    );
  }, []);

  const togglePrivacy = useCallback(() => setPrivacy((current) => !current), []);
  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites((current) =>
      current.includes(symbol)
        ? current.filter((favorite) => favorite !== symbol)
        : [...current, symbol],
    );
  }, []);
  const toggleHideSmall = useCallback(() => setHideSmall((current) => !current), []);

  const value = useMemo<WalletCoreState>(
    () => ({
      accounts,
      accountId,
      account,
      setAccountId,
      addAccount,
      renameAccount,
      network,
      setNetwork,
      privacy,
      togglePrivacy,
      favorites,
      toggleFavorite,
      hideSmall,
      toggleHideSmall,
      totalValue,
      changeAbs,
      changePct,
    }),
    [
      accounts,
      accountId,
      account,
      addAccount,
      renameAccount,
      network,
      privacy,
      togglePrivacy,
      favorites,
      toggleFavorite,
      hideSmall,
      toggleHideSmall,
      totalValue,
      changeAbs,
      changePct,
    ],
  );

  return <WalletCoreContext.Provider value={value}>{children}</WalletCoreContext.Provider>;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletCoreProvider>
      <WalletDataProvider>
        <WalletSettingsProvider>
          <WalletUiProvider>{children}</WalletUiProvider>
        </WalletSettingsProvider>
      </WalletDataProvider>
    </WalletCoreProvider>
  );
}

export function useWallet(): WalletState {
  const core = useContext(WalletCoreContext);
  const data = useWalletData();
  const settings = useWalletSettings();
  const ui = useWalletUi();

  if (!core) throw new Error("useWallet must be used inside WalletProvider");

  return { ...core, ...data, ...settings, ...ui };
}

/** Assets scaled to the active mock account, filtered by the active network. */
export function useAccountAssets() {
  const { account, network, hideSmall } = useWallet();

  return useMemo(() => {
    const ratio = account.balance / 24892.41;
    let list = assets.map((asset) => ({ ...asset, balance: asset.balance * ratio }));

    if (network !== "all") list = list.filter((asset) => asset.chain === network);
    if (hideSmall) list = list.filter((asset) => assetValue(asset) >= 50);

    return list.sort((a, b) => assetValue(b) - assetValue(a));
  }, [account.balance, network, hideSmall]);
}
