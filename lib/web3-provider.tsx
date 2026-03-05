"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "@wagmi/core";
import { polygon, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const chains = [polygon, mainnet] as const;

// Installed-wallets-only wagmi config:
// - uses ONLY the injected connector (browser extension / mobile injected provider)
// - no WalletConnect QR
// - no email/social login
// - no “install wallet” suggestions
const config = createConfig({
  chains,
  // If multiple injected wallets are installed (e.g. MetaMask + Phantom),
  // we expose each as its own connector so the UI can let the user choose.
  connectors: [
    injected({ target: "metaMask", shimDisconnect: true }),
    injected({ target: "phantom", shimDisconnect: true }),
  ],
  transports: {
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
