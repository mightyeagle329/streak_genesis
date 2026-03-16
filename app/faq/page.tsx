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
    question: "What is Streak?",
    answer:
      "Streak is a platform for trading bundled predictions on real-world outcomes. Combine markets, trade your conviction, or create your own thesis and earn when others trade it.",
  },
  {
    question: "What makes Streak different?",
    answer:
      "Streak is designed around transparent reward mechanics and long-term alignment. Your activity builds compounding benefits over time through streak-based multipliers.",
  },
  {
    question: "When will Streak launch?",
    answer:
      "Genesis is the pre-launch phase. Phase 1 launch timing will be announced publicly. If you submit email verification, we’ll notify you when it’s live.",
  },
  {
    question: "How do I earn points?",
    answer:
      "You earn XP based on your verified prediction market volume and on-chain activity. You can also earn additional XP via referrals and social quests.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);
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
      <header className="relative z-10 flex items-start justify-between" style={{ paddingRight: 32 }}>
        <div
          style={{
            paddingTop: 28,
            paddingLeft: 36,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
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
        </div>

        <div className="hidden md:flex items-center" style={{ paddingTop: 28 }}>
          <Link
            href="/"
            className="px-3 h-8 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200 text-sm"
            style={{ fontFamily: IBM }}
          >
            Back
          </Link>
        </div>
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
        className="relative z-10 hidden md:block"
        style={{
          paddingLeft: 36,
          paddingBottom: 24,
          marginTop: "auto",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 182,
            height: 17,
            fontFamily: IBM,
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
    </div>
  );
}
