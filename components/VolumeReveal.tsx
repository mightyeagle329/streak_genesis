"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserProfile } from "@/app/page";
import { formatVolume, formatXP, getAuraDisplay } from "@/lib/utils";

interface VolumeRevealProps {
  profile: UserProfile;
  onContinue: () => void;
}

const XP_CAP_VOLUME = 1_000_000;
const IBM = "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif";

export function VolumeReveal({ profile, onContinue }: VolumeRevealProps) {
  const [showDetails, setShowDetails] = useState(false);
  const auraInfo = getAuraDisplay(profile.assigned_aura);
  const isMaxCapped = profile.polymarket_volume_usd > XP_CAP_VOLUME;

  useEffect(() => {
    setTimeout(() => setShowDetails(true), 400);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col">

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

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        {/* STREAK logo */}
        <div style={{ paddingTop: 28, paddingLeft: 36, display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 26, flexShrink: 0 }} />
          <span style={{ marginLeft: 9, fontFamily: IBM, fontWeight: 400, fontSize: 23, lineHeight: "26px", color: "#FFFFFF", whiteSpace: "nowrap" }}>
            STREAK
          </span>
        </div>

        {/* Wallet button is handled globally by Web3Modal */}
      </div>

      {/* Main content — all centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {/* "Your Total Prediction Apps Volume" — 15px / 112% / white */}
          <p style={{
            fontFamily: IBM,
            fontWeight: 400,
            fontSize: 15,
            lineHeight: "112%",
            letterSpacing: 0,
            color: "#FFFFFF",
            margin: 0,
          }}>
            {profile.user_type === "VETERAN" ? "Your Total Prediction Apps Volume" : "Prediction Apps Volume Detected"}
          </p>

          {/* Volume — Nekst-Bold 44px / 84% / #FBAC35 */}
          <motion.p
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
            style={{
              fontFamily: "'Nekst', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 44,
              lineHeight: "84%",
              letterSpacing: 0,
              color: "#FBAC35",
              margin: "10px 0 0 0",
            }}
          >
            {formatVolume(profile.polymarket_volume_usd)}
          </motion.p>

          {/* MAX CAP badge — only when volume > $1M */}
          {isMaxCapped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", borderRadius: 99, border: "2px solid #facc15", background: "rgba(250,204,21,0.1)", marginTop: 12 }}
            >
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🏆</motion.span>
              <span style={{ color: "#facc15", fontWeight: 900, fontSize: 12, letterSpacing: "0.1em" }}>MAX CAP REACHED</span>
              <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🏆</motion.span>
            </motion.div>
          )}

          {/* Welcome box — 294 × 88, border-radius 11, border 1px solid #FFFFFF47 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 10 }}
            transition={{ duration: 0.4 }}
            style={{
              width: 294,
              height: 88,
              borderRadius: 11,
              border: "1px solid #FFFFFF47",
              background: "rgba(10,11,20,0.60)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              marginTop: 27,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              boxSizing: "border-box",
              gap: 7,
            }}
          >
            {profile.user_type === "CHALLENGER" ? (
              <>
                <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
                  🌟 Welcome, Challenger!
                </p>
                <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
                  No Prediction Apps history? Perfect. You skipped the legacy platforms.
                </p>
              </>
            ) : (
              <>
                {/* "🔥 Welcome Back, Veteran!" — 700 / 15px / white */}
                <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
                  🔥 Welcome Back, Veteran!
                </p>
                {/* description — 400 / 15px / white */}
                <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
                  Your trading history has been validated. Time to claim what you deserve.
                </p>
              </>
            )}
          </motion.div>

          {/* XP row — IBM 700 23px / white + lock icon 18px */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 24 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontFamily: IBM,
                fontWeight: 700,
                fontSize: 23,
                lineHeight: "112%",
                color: "#FFFFFF",
              }}>
                {formatXP(profile.genesis_xp)} XP
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lock.svg" alt="locked" width={17} height={25} style={{ display: "inline-block", flexShrink: 0 }} />
            </div>

            {/* "God Mode Unlocked | PRO" — 400 / 15px / white */}
            <p style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "112%",
              color: "#FFFFFF",
              margin: "4px 0 0 0",
            }}>
              {auraInfo.label} | {profile.assigned_rank}
            </p>

            {/* "Status: PENDING" — 400 / 15px, PENDING in #FBAC35 */}
            <p style={{
              fontFamily: IBM,
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "112%",
              color: "#FFFFFF",
              margin: "4px 0 0 0",
            }}>
              Status:{" "}
              <span style={{ color: "#FBAC35" }}>PENDING</span>
            </p>
          </motion.div>

          {/* Continue to Unlock button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{ marginTop: 28 }}
          >
            <button onClick={onContinue} className="genesis-btn">
              Continue to Unlock
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
