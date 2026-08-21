import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addressBook as seedContacts,
  connectedApps as seedApps,
  nfts as seedNfts,
  transactions as seedTransactions,
  type ConnectedApp,
  type Contact,
  type Nft,
  type Transaction,
} from "./wallet-data";

export type WalletDataState = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  nftItems: Nft[];
  toggleNftHidden: (id: string) => void;
  apps: ConnectedApp[];
  disconnectApp: (id: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
};

const WalletDataContext = createContext<WalletDataState | null>(null);

export function WalletDataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [nftItems, setNftItems] = useState<Nft[]>(seedNfts);
  const [apps, setApps] = useState<ConnectedApp[]>(seedApps);
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);

  const addTransaction = useCallback(
    (transaction: Transaction) => setTransactions((current) => [transaction, ...current]),
    [],
  );
  const toggleNftHidden = useCallback((id: string) => {
    setNftItems((current) =>
      current.map((item) => (item.id === id ? { ...item, hidden: !item.hidden } : item)),
    );
  }, []);
  const disconnectApp = useCallback(
    (id: string) => setApps((current) => current.filter((app) => app.id !== id)),
    [],
  );
  const addContact = useCallback((contact: Omit<Contact, "id">) => {
    setContacts((current) => [...current, { ...contact, id: `c-${Date.now()}` }]);
  }, []);
  const removeContact = useCallback(
    (id: string) => setContacts((current) => current.filter((contact) => contact.id !== id)),
    [],
  );

  const value = useMemo<WalletDataState>(
    () => ({
      transactions,
      addTransaction,
      nftItems,
      toggleNftHidden,
      apps,
      disconnectApp,
      contacts,
      addContact,
      removeContact,
    }),
    [
      transactions,
      addTransaction,
      nftItems,
      toggleNftHidden,
      apps,
      disconnectApp,
      contacts,
      addContact,
      removeContact,
    ],
  );

  return <WalletDataContext.Provider value={value}>{children}</WalletDataContext.Provider>;
}

export function useWalletData() {
  const context = useContext(WalletDataContext);
  if (!context) throw new Error("useWalletData must be used inside WalletDataProvider");
  return context;
}
