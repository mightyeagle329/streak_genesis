"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "What is streak?",
    answer:
      "streak is a high-frequency, gamified prediction market built on solana. instead of slow, months-long political polls, we focus on ultra-fast 15-minute ai-curated markets, multi-leg parlays, and rewarding users for daily activity via an addictive \"swipe-to-farm\" interface.",
  },
  {
    question: "What makes streak different?",
    answer:
      "speed, liquidity, and gamification. legacy markets (like polymarket) use slow human oracles that lock your funds for days during disputes. our autonomous AI Judge integrates directly with premium APIs to resolve markets and pay out in seconds. plus, you aren't limited to single trades; you can bundle outcomes (parlays). above all, you don't just trade here—you farm XP, build streaks, and unlock visual auras.",
  },
  {
    question: "How is my genesis XP calculated?",
    answer:
      "it's a vampire attack. connect your web3 wallet, and we securely index your historical trading volume from polygon CTF contracts. to protect the future airdrop pool for our native day-1 traders, legacy volume is bridged at a mathematically fair 10:1 Genesis Discount (max capped at $1,000,000 volume per wallet). Whales instantly unlock God Mode, skipping the 7-day grind.",
  },
  {
    question: "What if i have $0 polymarket volume?",
    answer:
      "no history? perfect. you skipped the legacy platforms. you enter as a \"Challenger\" and get a flat 1,000 XP Welcome Bonus—as long as your wallet passes our strict Layer-1 EVM Sybil filter (min. $2 native balance or 1 mainnet tx). empty botnets are blocked at the door.",
  },
  {
    question: "How do i earn points?",
    answer:
      "right now: connect your wallet for the genesis snapshot, submit your email, and share your alliance link.\n\nat launch: earn flat XP for every swipe, scale it with trading volume, get \"Rekt Relief\" XP even if you lose a bet, and multiply your entire stack by keeping your daily streak alive.",
  },
  {
    question: "When will streak launch and is my airdrop guaranteed?",
    answer:
      "soon. but the game has already started. your genesis XP and auras are currently 🔒 PENDING. to officially unlock your airdrop allocation, you MUST make your first native trade (min. $10) on STREAK when we launch (Day-1). unclaimed allocations will be permanently burned. use it or lose it.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const IBM = "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
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

      {/* Header */}
      <header className="relative z-10 flex items-start justify-between px-6 md:px-8">
        {/* Logo (acts as Home link) */}
        <Link
          href="/"
          aria-label="Go to home"
          className="inline-flex"
          style={{
            paddingTop: 28,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 26, flexShrink: 0 }} />
          <span
            style={{
              marginLeft: 9,
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: 23,
              lineHeight: "26px",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            STREAK
          </span>
        </Link>

        {/* Right side intentionally empty (logo is the back/home affordance) */}
        <div style={{ width: 1, height: 1 }} />
      </header>

      {/* Content */}
      <section
        className="relative z-10 flex flex-col items-center justify-center px-6"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        {/* Small pill */}
        <div
          className="px-6 h-8 rounded-full border border-white/10 bg-white/5"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: IBM,
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 24,
          }}
        >
          FAQ
        </div>

        <h1
          className="text-center"
          style={{
            fontFamily: "'Nekst', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 52,
            lineHeight: "84%",
            maxWidth: 720,
            margin: 0,
          }}
        >
          Frequently asked
          <br />
          questions
        </h1>

        <p
          className="text-center"
          style={{
            marginTop: 14,
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: 15,
            lineHeight: "140%",
            color: "rgba(255,255,255,0.55)",
            maxWidth: 520,
          }}
        >
          Quick answers to help you understand Streak, launch timeline,
          <br />
          our rewards system, and find the support you need.
        </p>

        <div
          className="w-full"
          style={{
            maxWidth: 620,
            marginTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {FAQS.map((item, idx) => {
            const isOpen = idx === openIndex;
            return (
              <div
                key={item.question}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  padding: "17px 0",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
                  className="w-full flex items-center justify-between text-left"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: IBM,
                    fontSize: 15,
                    fontWeight: 400,
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", width: 18, textAlign: "right" }}>
                    {isOpen ? "–" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          marginTop: 10,
                          fontFamily: IBM,
                          fontSize: 15,
                          lineHeight: "160%",
                          color: "rgba(255,255,255,0.55)",
                          maxWidth: 560,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer — same style/behavior as Landing */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10"
        style={{
          paddingLeft: 0,
          paddingBottom: 24,
          marginTop: "auto",
        }}
      >
        <div className="px-6" style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: IBM,
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
    </div>
  );
}
