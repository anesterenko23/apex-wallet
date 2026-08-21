import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WalletUiState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  sendOpen: boolean;
  sendAsset: string | null;
  openSend: (symbol?: string) => void;
  closeSend: () => void;
  receiveOpen: boolean;
  openReceive: () => void;
  closeReceive: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (value: boolean) => void;
};

const WalletUiContext = createContext<WalletUiState | null>(null);

export function WalletUiProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendAsset, setSendAsset] = useState<string | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((value) => !value), []);
  const openSend = useCallback((symbol?: string) => {
    setSendAsset(symbol ?? null);
    setSendOpen(true);
  }, []);
  const closeSend = useCallback(() => setSendOpen(false), []);
  const openReceive = useCallback(() => setReceiveOpen(true), []);
  const closeReceive = useCallback(() => setReceiveOpen(false), []);

  const value = useMemo<WalletUiState>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      sendOpen,
      sendAsset,
      openSend,
      closeSend,
      receiveOpen,
      openReceive,
      closeReceive,
      paletteOpen,
      setPaletteOpen,
    }),
    [
      sidebarCollapsed,
      toggleSidebar,
      sendOpen,
      sendAsset,
      openSend,
      closeSend,
      receiveOpen,
      openReceive,
      closeReceive,
      paletteOpen,
    ],
  );

  return <WalletUiContext.Provider value={value}>{children}</WalletUiContext.Provider>;
}

export function useWalletUi() {
  const context = useContext(WalletUiContext);
  if (!context) throw new Error("useWalletUi must be used inside WalletUiProvider");
  return context;
}
