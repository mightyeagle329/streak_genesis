"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useConnect } from "wagmi";

interface LandingProps {
  referralCode: string | null;
}

const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.102.12 18.144.149 18.17a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
];

const COOKIE_FONT: React.CSSProperties = {
  fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: "100%",
  letterSpacing: "0%",
};

export function Landing({ referralCode }: LandingProps) {
  const { connect, connectors } = useConnect();
  // null = not yet decided, "accepted" | "rejected" = already chosen
  const [cookieChoice, setCookieChoice] = useState<string | null>(null);
  const [showWalletPicker, setShowWalletPicker] = useState(false);

  const isMobileBrowser = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const appStoreLinks = {
    metamask: {
      ios: "https://apps.apple.com/app/metamask-blockchain-wallet/id1438144202",
      android: "https://play.google.com/store/apps/details?id=io.metamask",
    },
    phantom: {
      ios: "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977",
      android: "https://play.google.com/store/apps/details?id=app.phantom",
    },
  };

  const isIOS = () => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  };

  const isAndroid = () => {
    if (typeof navigator === "undefined") return false;
    return /Android/i.test(navigator.userAgent);
  };

  // Deep links to open the current site *inside* the wallet app's in-app browser.
  // This is necessary for Safari / Telegram / in-app browsers where injected providers
  // don't exist, but the user can still connect by opening the dapp inside the wallet.
  const getWalletDeepLinks = () => {
    if (typeof window === "undefined") {
      return { metamask: "", phantom: "" };
    }

    // MetaMask expects URL without protocol after /dapp/
    const noProto = window.location.href.replace(/^https?:\/\//, "");
    const metamask = `https://metamask.app.link/dapp/${noProto}`;

    // Phantom expects URL-encoded
    const phantom = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`;

    return { metamask, phantom };
  };

  type WalletOption = {
    id: string;
    name: string;
    connector?: (typeof connectors)[number];
    /** Wallet seems installed/present in browser */
    detected: boolean;
    /** Wallet has an EIP-1193 provider we can actually connect to */
    connectable: boolean;
    notConnectableReason?: string;
  };

  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  // We only support installed injected wallets, and we want *exactly one button per wallet*.
  // Build a stable candidate list (MetaMask, Phantom) by connector id.
  const connectorById = new Map(connectors.map((c) => [c.id, c] as const));
  const candidateConnectors = [connectorById.get("metaMask"), connectorById.get("phantom")].filter(
    Boolean
  ) as typeof connectors;

  // Only show wallets that are actually detected in the browser.
  // Note: Phantom can be installed without exposing an EVM provider. In that case we still show
  // Phantom but disable it and explain what needs to be enabled.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const phantomInstalled = typeof window !== "undefined" && !!(window as any).phantom;
      const phantomEvmEnabled = typeof window !== "undefined" && !!(window as any).phantom?.ethereum;

      const options: WalletOption[] = [];

      for (const c of candidateConnectors) {
        let provider: unknown | undefined;
        try {
          provider = await c.getProvider();
        } catch {
          provider = undefined;
        }

        const connectable = !!provider;

        // For Phantom, allow "detected" even if EVM is not enabled (so user sees it).
        const detected =
          connectable ||
          (c.id === "phantom" ? phantomInstalled : false);

        const notConnectableReason =
          !connectable && c.id === "phantom" && phantomInstalled && !phantomEvmEnabled
            ? "Phantom is installed, but its Ethereum/EVM provider is not enabled. Enable Ethereum in Phantom settings (or use Phantom's EVM mode) and refresh."
            : !connectable
              ? "Wallet provider not detected in this browser."
              : undefined;

        options.push({
          id: c.id,
          name: c.name,
          connector: c,
          detected,
          connectable,
          notConnectableReason
        });
      }

      if (cancelled) return;
      setWalletOptions(options.filter(o => o.detected));
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectors.length]);

  const handleConnect = async () => {
    // UX requirement: always show the installed-wallet list first.
    // Only connect *after* the user explicitly picks a wallet.
    setShowWalletPicker(true);
  };

  const handlePickWallet = (id: string) => {
    const option = walletOptions.find(o => o.id === id);
    if (!option?.connector) return;
    if (!option.connectable) {
      console.warn(option.notConnectableReason ?? "Wallet not connectable");
      return;
    }

    setShowWalletPicker(false);
    connect({ connector: option.connector });
  };

  // Read persisted choice on mount (localStorage is browser-only)
  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (saved) setCookieChoice(saved);
  }, []);

  function handleCookieChoice(choice: "accepted" | "rejected") {
    localStorage.setItem("cookie_consent", choice);
    setCookieChoice(choice);
  }

  return (
    <div className="min-h-screen relative flex flex-col" style={{ background: "#0A0B10", overflowX: "clip" }}>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/bg.png" alt="" aria-hidden="true" className="bg-lightning" />

      {/* Radial blur circle — strong center, fades to nothing at edge */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380,
        height: 380,
        borderRadius: "50%",
        background: "#0A0B1042",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        maskImage: "radial-gradient(circle, black 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.3) 65%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.3) 65%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />


      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-start justify-center md:justify-between px-6 md:px-8"
        style={{ paddingTop: 0 }}
      >
        {/* Logo — flex row so circles + text sit on the same baseline */}
        <Link
          href="/"
          aria-label="Go to home"
          className="flex items-center gap-0 flex-shrink-0"
          style={{ paddingTop: 28, textDecoration: "none" }}
        >
          {/* Logo image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            style={{ width: 28, height: 26, flexShrink: 0 }}
          />
          {/* STREAK text — gap to left edge of text: 71 - (45+17) = 9px */}
          <span
            style={{
              marginLeft: 9,
              width: 66,
              height: 26,
              fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
              fontWeight: 400,
              fontSize: 23,
              lineHeight: "26px",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
            }}
          >
            STREAK
          </span>
        </Link>

        {/* Desktop social links */}
        <div className="hidden md:flex items-center gap-3" style={{ paddingTop: 28 }}>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            style={{
              width: 23,
              height: 15,
              opacity: 1,
              fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            FAQ
          </Link>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl w-full space-y-7"
        >
          {/* GENESIS pill — w:75 h:23 border-radius:17px */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 75,
                height: 23,
                borderRadius: 17,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: "112%",
                letterSpacing: "0em",
                color: "#FFFFFF",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Genesis
            </span>
          </motion.div>

          {/* Headline — w:447 top:245px, Nekst-Bold 44px/84% */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-[40px] md:text-[52px]"
            style={{
              fontFamily: "'Nekst', 'Inter', sans-serif",
              fontWeight: 700,
              lineHeight: "84%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#FFFFFF",
              width: 500,
              maxWidth: "90vw",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            You traded millions<br />
            on Prediction Apps<br />
            and got nothing.
          </motion.h1>


          {/* Referral badge */}
          {referralCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className="inline-block px-5 py-2 bg-orange-500/10 border border-orange-500/25 rounded-lg"
            >
              <span className="text-sm text-orange-400">
                🤝 Invited by:{" "}
                <span className="font-mono font-bold">{referralCode}</span>
              </span>
            </motion.div>
          )}

          {/* Subtitle — "Claim your Streak XP for your past volume." */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "112%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#FFFFFF",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Claim your{" "}
            <span style={{ color: "#FFA600" }}>Streak XP</span>
            {" "}for your past volume.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <button onClick={handleConnect} className="genesis-btn">
              Connect Wallet &amp; Calculate Volume
            </button>

            {/* Installed-wallet chooser (always opens first; user must pick explicitly) */}
            <AnimatePresence>
              {showWalletPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-3 mx-auto max-w-xs p-3 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="text-sm text-white/80 mb-2">Choose wallet</div>

                  {walletOptions.length === 0 ? (
                    <div className="text-sm text-white/60">
                      No supported wallets detected in this browser.
                      <br />
                      {isMobileBrowser() ? (
                        <>
                          On mobile, wallets typically work via their in-app browser.
                          <br />
                          Open this site in a wallet app:
                          <div className="mt-3 flex flex-col gap-2">
                            <a
                              href={getWalletDeepLinks().metamask}
                              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 hover:bg-black/40 text-white/85"
                              style={{ fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif" }}
                            >
                              Open in MetaMask
                            </a>
                            <a
                              href={getWalletDeepLinks().phantom}
                              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 hover:bg-black/40 text-white/85"
                              style={{ fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif" }}
                            >
                              Open in Phantom
                            </a>

                            {(isIOS() || isAndroid()) && (
                              <div className="mt-2 text-xs text-white/50">
                                Don&apos;t have a wallet yet?
                                <div className="mt-1 flex flex-col gap-1">
                                  <a
                                    href={isIOS() ? appStoreLinks.metamask.ios : appStoreLinks.metamask.android}
                                    className="underline"
                                  >
                                    Download MetaMask
                                  </a>
                                  <a
                                    href={isIOS() ? appStoreLinks.phantom.ios : appStoreLinks.phantom.android}
                                    className="underline"
                                  >
                                    Download Phantom
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          Install/enable <span className="text-white/80">MetaMask</span> or{" "}
                          <span className="text-white/80">Phantom (EVM)</span> and refresh.
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {walletOptions.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => handlePickWallet(o.id)}
                          disabled={!o.connectable}
                          className={
                            "w-full text-left px-3 py-2 rounded-lg border border-white/10 " +
                            (o.connectable
                              ? "bg-black/30 hover:bg-black/40"
                              : "bg-black/10 text-white/40 cursor-not-allowed")
                          }
                          style={{
                            fontFamily:
                              "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{o.id === "metaMask" ? "MetaMask" : o.id === "phantom" ? "Phantom" : o.name}</span>
                            {!o.connectable && o.notConnectableReason && (
                              <span className="text-xs mt-1 text-white/40">{o.notConnectableReason}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setShowWalletPicker(false)}
                    className="mt-2 text-xs text-white/60 hover:text-white/80"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info text — 2 lines */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{
              fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#FFFFFF",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            No Prediction Apps history? Perfect. You skipped the legacy platforms.
            <br />
            Welcome to the revolution, Challenger.
          </motion.p>
        </motion.div>
      </main>

      {/* Footer — mobile */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 md:hidden"
        style={{ paddingBottom: 24 }}
      >
        <div className="px-6 flex items-center justify-center gap-3" style={{ paddingTop: 10 }}>
          <Link
            href="/faq"
            className="text-[12px] text-white/60 hover:text-white/80"
            style={{
              fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
              lineHeight: "100%",
            }}
          >
            FAQ
          </Link>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="px-6" style={{ marginTop: 14, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            © 2026 Streak. All rights reserved.
          </span>
        </div>
      </motion.footer>

      {/* Footer — desktop only */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 hidden md:block"
        style={{
          paddingLeft: 36,
          paddingBottom: 24,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 182,
            height: 17,
            fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#B2B2B2",
            whiteSpace: "nowrap",
          }}
        >
          © 2026 Streak. All rights reserved.
        </span>
      </motion.footer>

      {/* Cookie consent banner — shown until user makes a choice (persisted in localStorage) */}
      <AnimatePresence>
        {cookieChoice === null && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, delay: 1.2 }}
            className="
              fixed z-[100] flex flex-col gap-3.5 bg-[#1E1E22] p-4
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              bottom-24 left-3 right-3 rounded-[14px]
              md:bottom-6 md:right-6 md:left-auto md:w-[312px]
            "
          >
            {/* Text */}
            <p style={{ ...COOKIE_FONT, color: "#D4D4D4", margin: 0 }}>
              We use cookies to make our website work, improve your experience
              and show you relevant ads.{" "}
              <a href="#" className="underline" style={{ ...COOKIE_FONT, color: "#FFFFFF" }}>
                Learn more and manage.
              </a>
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Accept All */}
              <button
                onClick={() => handleCookieChoice("accepted")}
                className="bg-white/[.13] text-white rounded-[10px] cursor-pointer text-center flex-1"
                style={{
                  height: 47,
                  fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 19,
                  lineHeight: "100%",
                }}
              >
                Accept All
              </button>

              {/* Reject */}
              <button
                onClick={() => handleCookieChoice("rejected")}
                className="bg-[#5A5A5A] text-white rounded-[10px] cursor-pointer text-center flex-1"
                style={{
                  height: 47,
                  fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: "16px",
                }}
              >
                Reject non-essential cookies
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
