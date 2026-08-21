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
  addressBook as seedContacts,
  assets,
  assetValue,
  connectedApps as seedApps,
  nfts as seedNfts,
  transactions as seedTx,
  type Account,
  type ChainId,
  type ConnectedApp,
  type Contact,
  type Nft,
  type Transaction,
} from "./wallet-data";

type NetworkFilter = ChainId | "all";

type Settings = {
  currency: string;
  language: string;
  theme: string;
  autoLock: string;
  confirmTx: boolean;
  hideBalancesOnLock: boolean;
  testnets: boolean;
  spamFilter: boolean;
};

type WalletState = {
  accounts: Account[];
  accountId: string;
  account: Account;
  setAccountId: (id: string) => void;
  addAccount: (name: string, type?: Account["type"]) => void;
  renameAccount: (id: string, name: string) => void;

  network: NetworkFilter;
  setNetwork: (n: NetworkFilter) => void;

  privacy: boolean;
  togglePrivacy: () => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  favorites: string[];
  toggleFavorite: (symbol: string) => void;
  hideSmall: boolean;
  toggleHideSmall: () => void;

  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;

  nftItems: Nft[];
  toggleNftHidden: (id: string) => void;

  apps: ConnectedApp[];
  disconnectApp: (id: string) => void;

  contacts: Contact[];
  addContact: (c: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  sendOpen: boolean;
  sendAsset: string | null;
  openSend: (symbol?: string) => void;
  closeSend: () => void;
  receiveOpen: boolean;
  openReceive: () => void;
  closeReceive: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;

  totalValue: number;
  changeAbs: number;
  changePct: number;
};

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [accountList, setAccountList] = useState<Account[]>(seedAccounts);
  const [accountId, setAccountId] = useState("main");
  const [network, setNetwork] = useState<NetworkFilter>("all");
  const [privacy, setPrivacy] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["ETH", "SOL"]);
  const [hideSmall, setHideSmall] = useState(false);
  const [txs, setTxs] = useState<Transaction[]>(seedTx);
  const [nftItems, setNftItems] = useState<Nft[]>(seedNfts);
  const [apps, setApps] = useState<ConnectedApp[]>(seedApps);
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);
  const [settings, setSettings] = useState<Settings>({
    currency: "USD",
    language: "English",
    theme: "Dark",
    autoLock: "15 minutes",
    confirmTx: true,
    hideBalancesOnLock: true,
    testnets: false,
    spamFilter: true,
  });
  const [sendOpen, setSendOpen] = useState(false);
  const [sendAsset, setSendAsset] = useState<string | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const account = accountList.find((a) => a.id === accountId) ?? (accountList[0] as Account);

  const totalValue = useMemo(() => {
    const base = assets.reduce((sum, a) => sum + assetValue(a), 0);
    const ratio = account.balance / 24892.41;
    return base * ratio;
  }, [account.balance]);

  const changePct = 5.28 * (account.id === "cold" ? 0.42 : account.id === "defi" ? -0.61 : 1);
  const changeAbs = (totalValue * changePct) / 100;

  const value: WalletState = {
    accounts: accountList,
    accountId,
    account,
    setAccountId,
    addAccount: useCallback((name, type = "hot") => {
      setAccountList((list) => {
        const id = `acct-${list.length + 1}`;
        const rand = Math.floor(Math.random() * 0xfffff).toString(16).padStart(5, "0");
        return [
          ...list,
          {
            id,
            name,
            address: `0x${rand}A4c7B1d0F27b5E8a4c66D3fA1b0e2C59${rand.slice(0, 2)}`.slice(0, 42),
            balance: 0,
            hue: Math.floor(Math.random() * 360),
            type,
          },
        ];
      });
    }, []),
    renameAccount: useCallback((id, name) => {
      setAccountList((list) => list.map((a) => (a.id === id ? { ...a, name } : a)));
    }, []),

    network,
    setNetwork,
    privacy,
    togglePrivacy: useCallback(() => setPrivacy((p) => !p), []),
    sidebarCollapsed,
    toggleSidebar: useCallback(() => setSidebarCollapsed((c) => !c), []),
    favorites,
    toggleFavorite: useCallback((symbol) => {
      setFavorites((f) => (f.includes(symbol) ? f.filter((s) => s !== symbol) : [...f, symbol]));
    }, []),
    hideSmall,
    toggleHideSmall: useCallback(() => setHideSmall((h) => !h), []),
    transactions: txs,
    addTransaction: useCallback((tx) => setTxs((list) => [tx, ...list]), []),
    nftItems,
    toggleNftHidden: useCallback((id) => {
      setNftItems((list) => list.map((n) => (n.id === id ? { ...n, hidden: !n.hidden } : n)));
    }, []),
    apps,
    disconnectApp: useCallback((id) => setApps((list) => list.filter((a) => a.id !== id)), []),
    contacts,
    addContact: useCallback((c) => {
      setContacts((list) => [...list, { ...c, id: `c-${Date.now()}` }]);
    }, []),
    removeContact: useCallback((id) => setContacts((list) => list.filter((c) => c.id !== id)), []),
    settings,
    updateSettings: useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []),

    sendOpen,
    sendAsset,
    openSend: useCallback((symbol) => {
      setSendAsset(symbol ?? null);
      setSendOpen(true);
    }, []),
    closeSend: useCallback(() => setSendOpen(false), []),
    receiveOpen,
    openReceive: useCallback(() => setReceiveOpen(true), []),
    closeReceive: useCallback(() => setReceiveOpen(false), []),
    paletteOpen,
    setPaletteOpen,

    totalValue,
    changeAbs,
    changePct,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

/** Assets scaled to the active account, filtered by the active network. */
export function useAccountAssets() {
  const { account, network, hideSmall } = useWallet();
  return useMemo(() => {
    const ratio = account.balance / 24892.41;
    let list = assets.map((a) => ({ ...a, balance: a.balance * ratio }));
    if (network !== "all") list = list.filter((a) => a.chain === network);
    if (hideSmall) list = list.filter((a) => assetValue(a) >= 50);
    return list.sort((a, b) => assetValue(b) - assetValue(a));
  }, [account.balance, network, hideSmall]);
}
