"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useChainId, useSignMessage } from "wagmi";
import { UserProfile } from "@/app/page";

// Keywords used to detect a Sybil rejection from the backend error body.
// Adjust these once the backend developer confirms the exact error format.
const SYBIL_KEYWORDS = ["sybil", "wallet_too_new", "wallet too new", "insufficient gas", "not_eligible", "not eligible"];

function isSybilError(status: number, errorText: string): boolean {
  if (status === 403) return true;
  const lower = errorText.toLowerCase();
  return SYBIL_KEYWORDS.some((kw) => lower.includes(kw));
}

interface IndexingAnimationProps {
  walletAddress: string;
  referralCode: string | null;
  onComplete: (profile: UserProfile) => void;
  onSybilRejected?: (reason?: string) => void;
}

const scanningMessages = [
  "Connecting to Polygon Network...",
  "Scanning CTF Contracts...",
  "Indexing transaction history...",
  "Calculating lifetime volume...",
  "Validating data integrity...",
  "Generating profile...",
];

export function IndexingAnimation({
  walletAddress,
  referralCode,
  onComplete,
  onSybilRejected,
}: IndexingAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState("");
  const [authStep, setAuthStep] = useState<"signing" | "indexing">("signing");

  // Keep latest callbacks and referralCode in refs so the effect never re-runs
  // when they change — only walletAddress should restart the flow
  const onCompleteRef = useRef(onComplete);
  const onSybilRejectedRef = useRef(onSybilRejected);
  const referralCodeRef = useRef(referralCode);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onSybilRejectedRef.current = onSybilRejected; }, [onSybilRejected]);
  useEffect(() => { referralCodeRef.current = referralCode; }, [referralCode]);

  // Prevent React Strict Mode's double-invoke from sending two signature requests
  const hasFetched = useRef(false);

  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();

  useEffect(() => {
    // Guard: refs survive the Strict Mode unmount/remount cycle,
    // so the second mount sees true and returns immediately.
    if (hasFetched.current) return;
    hasFetched.current = true;

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % scanningMessages.length);
    }, 1500);

    const authenticateAndFetch = async () => {
      try {
        const timestamp = Date.now();
        const nonce = Math.random().toString(36).substring(2, 15);

        // Use a strict SIWE-style message format.
        // Some wallets (notably Phantom) try to parse SIWE messages for a nicer UI and will
        // error if the domain/format is invalid (e.g. contains spaces).
        const domain = window.location.host;
        const uri = window.location.origin;
        const effectiveChainId = chainId || 137;
        const issuedAt = new Date(timestamp).toISOString();
        const statement = "By signing this message, you prove ownership of your wallet address.";

        const messageToSign = `${domain} wants you to sign in with your Ethereum account:\n${walletAddress}\n\n${statement}\n\nURI: ${uri}\nVersion: 1\nChain ID: ${effectiveChainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`;

        setAuthStep("signing");
        const signature = await signMessageAsync({ message: messageToSign });
        setAuthStep("indexing");

        // Use same-origin proxy to avoid mixed-content when the site is served over HTTPS (ngrok).
        const backendUrl = "";
        const requestBody: Record<string, unknown> = {
          wallet_address: walletAddress.toLowerCase(),
          message: messageToSign,
          signature,
          timestamp,
          nonce,
        };
        // Include referrer only when a ref code was captured from the URL,
        // and only if it isn't the user's own ref code (self-referral guard —
        // we don't know our own code yet, but the backend rejects self-referrals
        // so we let it pass and rely on backend validation; for testing with the
        // fixed TEST_WALLET the referrer is simply omitted to avoid the self-ref error)
        if (referralCodeRef.current) {
          requestBody.referrer = referralCodeRef.current;
        }
        console.log("📤 REQUEST:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${backendUrl}/api/backend/v1/account/genesis`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (isSybilError(response.status, errorText)) {
            let reason: string | undefined;
            try { reason = JSON.parse(errorText).error || JSON.parse(errorText).message; } catch { reason = errorText; }
            onSybilRejectedRef.current?.(reason);
            return;
          }
          throw new Error(`Backend returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("📊 Response:", JSON.stringify(data, null, 2));

        // Backend may return either the profile directly OR nested under { profile: {...} }.
        // We normalize here so the app reliably reads ref_code, etc.
        const p: any = (data && (data.profile ?? data)) || {};

        setTimeout(() => {
          onCompleteRef.current({
            wallet_address: walletAddress.toLowerCase(),
            user_name: p.user_name,
            user_type: p.user_type || "CHALLENGER",
            polymarket_volume_usd: p.polymarket_volume_usd || 0,
            genesis_xp: p.genesis_xp || 1000,
            alliance_xp: p.alliance_xp || 0,
            social_xp: p.social_xp || 0,
            total_xp: p.total_xp || p.genesis_xp || 1000,
            is_xp_locked: p.is_xp_locked ?? true,
            assigned_aura: p.assigned_aura || "GREY_BORDER",
            assigned_rank: p.assigned_rank || "NOVICE",
            ref_code: p.ref_code || "",
            twitter_shared: p.twitter_shared || false,
            invited_by: referralCode || undefined,
            email: p.email,
          });
        }, 3000);
      } catch (error) {
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (
            msg.includes("proposal expired") ||
            msg.includes("session proposal") ||
            msg.includes("pairing expired") ||
            msg.includes("failed to connect to metamask")
          ) {
            alert("Wallet connection timed out or failed. Please disconnect and reconnect your wallet to try again.");
          } else if (msg.includes("user rejected") || msg.includes("user denied")) {
            alert("Signature request was rejected. Please approve the signature request in your wallet.");
          } else if (isSybilError(0, error.message)) {
            onSybilRejectedRef.current?.(error.message);
          } else {
            // Extract the actual backend error message if present
            const backendMatch = error.message.match(/Backend returned \d+: ([\s\S]*)/);
            if (backendMatch) {
              let detail = backendMatch[1];
              try { detail = JSON.parse(detail).error || JSON.parse(detail).message || detail; } catch { /* raw text */ }
              console.error("❌ Backend error:", detail);
              alert(`Error: ${detail}`);
            } else {
              alert(`Failed to authenticate or fetch profile.\n\nDetails: ${error.message}`);
            }
          }
        } else {
          alert("Failed to authenticate or fetch profile. Please try again.");
        }
      }
    };

    authenticateAndFetch();
    return () => { clearInterval(dotsInterval); clearInterval(messageInterval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const IBM = "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif";
  const shortTarget = `${walletAddress.slice(0, 8)}... ${walletAddress.slice(-4)}`;
  const statusText = authStep === "signing"
    ? `Waiting for wallet signature${dots}`
    : `${scanningMessages[currentMessage]}${dots}`;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4">

      {/* Blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            maxWidth: "none",
            width: 1243.62,
            height: 829.08,
            transform: "translate(-50%, -50%) rotate(-40deg)",
            opacity: 0.8,
            mixBlendMode: "lighten",
            filter: "blur(72px)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,11,16,0.55)" }} />
      </div>

      {/* Logo — top-left, same as Landing page */}
      <div className="absolute top-0 left-0 z-10" style={{ paddingTop: 28, paddingLeft: 36, display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 26, flexShrink: 0 }} />
        <span style={{
          marginLeft: 9,
          fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
          fontWeight: 400,
          fontSize: 23,
          lineHeight: "26px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}>
          STREAK
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* ── Terminal card: 347 × 183 ─────────────────────────────── */}
        <div style={{
          width: 347,
          height: 183,
          borderRadius: 11,
          border: "1px solid #FFFFFF47",
          background: "rgba(10,11,20,0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}>

          {/* Header row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "11px 14px",
            flexShrink: 0,
          }}>
            {/* 3 dots — #D9D9D9 */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#D9D9D9", flexShrink: 0 }} />
            ))}
            <span style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "112%",
              letterSpacing: 0,
              color: "#FFFFFF",
              marginLeft: 2,
            }}>
              STREAK GENESIS INDEXER v1.0
            </span>
          </div>

          {/* Divider: 346 × 0, border 1px solid #FFFFFF47 */}
          <div style={{ width: 346, height: 0, borderBottom: "1px solid #FFFFFF47", flexShrink: 0 }} />

          {/* Body */}
          <div style={{
            padding: "16px 14px 11px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 13,
            flex: 1,
          }}>
            {/* "> Connecting..." */}
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              style={{ fontFamily: IBM, fontWeight: 400, fontSize: 14, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}
            >
              &gt; {statusText}
            </motion.p>

            {/* Target */}
            <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 14, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
              Target: {shortTarget}
            </p>

            {/* TEST MODE */}
            <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 14, lineHeight: "112%", color: "#FBAC35", margin: 0 }}>
              Authenticating connected wallet
            </p>

            {/* Progress bar — 301 × 13, gradient border */}
            <div style={{ marginTop: 2 }}>
              {/* Outer wrapper provides the gradient border via 1px padding */}
              <div style={{
                width: 315,
                height: 13,
                padding: "1px",
                background: "linear-gradient(89.25deg, #FFE64E 12.16%, #F44E0C 66.85%)",
                boxSizing: "border-box",
                borderRadius: 99,
                flexShrink: 0,
              }}>
                {/* Inner dark track */}
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: "#0A0B10",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: 99,
                }}>
                  {/* Animated fill — clips the dots as it grows */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      paddingLeft: 2,
                    }}
                  >
                    {/* Each segment: 7 × 7, rectangle, #FFE64E, glow shadow */}
                    {[...Array(34)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 0,
                          background: "#FFE64E",
                          boxShadow: "0px 0px 7.9px 2px rgba(251,178,56,0.71)",
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle below card */}
        <p style={{
          fontFamily: IBM,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "100%",
          letterSpacing: 0,
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          marginTop: 16,
        }}>
          This may take a few seconds as we scan the blockchain...
        </p>
      </motion.div>
    </div>
  );
}
