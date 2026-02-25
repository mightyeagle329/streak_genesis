"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserProfile } from "@/app/page";
import { formatXP, formatVolume } from "@/lib/utils";

interface DashboardProps {
  profile: UserProfile;
}

export function Dashboard({ profile }: DashboardProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [copied, setCopied] = useState(false);
  const [showTweetInput, setShowTweetInput] = useState(false);
  const [tweetUrl, setTweetUrl] = useState("");
  const [isSubmittingTweet, setIsSubmittingTweet] = useState(false);
  const [tweetError, setTweetError] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);

  const IBM = "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif";
  const isGodMode = currentProfile.assigned_aura === "GOLDEN_FIRE";
  const isOrangeFire = currentProfile.assigned_aura === "ORANGE_FIRE";
  const isVeteran = currentProfile.user_type === "VETERAN";

  const referralUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=${currentProfile.ref_code}`
      : `https://genesis.streak.app?ref=${currentProfile.ref_code}`;
  const displayUrl = `streak.trade/genesis?ref=${currentProfile.ref_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = isVeteran
    ? `I traded ${formatVolume(currentProfile.polymarket_volume_usd)} on Prediction Apps. Now I'm farming STREAK. ${
        isGodMode ? "GOD MODE Active. " : ""
      }#Streak ${referralUrl}`
    : `I'm skipping the legacy platforms. I just claimed my Early Pioneer Bonus on STREAK. #Streak ${referralUrl}`;

  const handleTweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank",
      "width=550,height=420"
    );
    setShowTweetInput(true);
  };

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTweetError("");
    if (!tweetUrl.trim()) { setTweetError("Please paste your tweet URL"); return; }
    const normalizedUrl = tweetUrl.split("?")[0].trim();
    if (!normalizedUrl.includes("twitter.com") && !normalizedUrl.includes("x.com")) {
      setTweetError("Please enter a valid Twitter/X URL");
      return;
    }
    setIsSubmittingTweet(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
      const response = await fetch(`${backendUrl}/v1/account/genesis/social/tweet`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ wallet_address: currentProfile.wallet_address, tweet_url: normalizedUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentProfile({
          ...currentProfile,
          social_xp: 500,
          total_xp: currentProfile.genesis_xp + currentProfile.alliance_xp + 500,
          twitter_shared: true,
        });
      } else {
        setTweetError(data.error || "Failed to verify tweet");
      }
    } catch {
      setTweetError("Network error. Please try again.");
    } finally {
      setIsSubmittingTweet(false);
    }
  };

  // Aura-based dynamic values
  const modeEmoji = isGodMode ? "🔥" : isOrangeFire ? "⚡" : "🌟";
  const modeTitle = isGodMode
    ? "God Mode Unlocked"
    : isOrangeFire
    ? "Time-Skip Unlocked"
    : isVeteran
    ? "Veteran Profile"
    : "Challenger Profile";

  const totalXP =
    currentProfile.total_xp ||
    currentProfile.genesis_xp + currentProfile.alliance_xp + currentProfile.social_xp;

  const xpRows = [
    { label: "Genesis XP", value: `+ ${formatXP(currentProfile.genesis_xp)} XP` },
    { label: "Alliance XP", value: `+ ${formatXP(currentProfile.alliance_xp)} XP` },
    { label: "Social XP", value: `+ ${formatXP(currentProfile.social_xp)} XP` },
  ];

  // Shared card style
  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 404,
    borderRadius: 11,
    border: "1px solid rgba(255,255,255,0.28)",
    background: "rgba(10,11,20,0.70)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxSizing: "border-box",
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{ background: "#0A0B10" }}>

      {/* ── Blurred background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg.png" alt="" aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", maxWidth: "none",
          width: 1243.62, height: 829.08,
          transform: "translate(-50%, -50%) rotate(-40deg)",
          opacity: 0.8, mixBlendMode: "lighten", filter: "blur(72px)",
        }} />
        <div className="absolute inset-0" style={{ background: "rgba(10,11,16,0.55)" }} />
      </div>

      {/* ── STREAK logo ────────────────────────────────────────────────── */}
      <div className="relative z-10" style={{ paddingTop: 28, paddingLeft: 36, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 17, height: 17, borderRadius: "50%", background: "#FFFFFF", border: "1px solid #0F0D3F", flexShrink: 0 }} />
        <div style={{ width: 17, height: 17, borderRadius: "50%", background: "#FFFFFF", border: "1px solid #0F0D3F", flexShrink: 0, marginLeft: -8 }} />
        <span style={{ marginLeft: 9, fontFamily: IBM, fontWeight: 400, fontSize: 23, lineHeight: "26px", color: "#FFFFFF", whiteSpace: "nowrap" }}>STREAK</span>
      </div>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-16" style={{ paddingTop: 32 }}>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "'Nekst', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 44,
            lineHeight: "84%",
            color: "#FBAC35",
            textAlign: "center",
            margin: 0,
            maxWidth: 285,
          }}>
          Your Genesis<br />Profile
        </motion.h1>

        {/* ── God Mode Box ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-[404px] mt-10">

          <div style={{ ...card, padding: "52px 24px 24px", position: "relative" }}>
            {/* Emoji straddling top border */}
            <span style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", fontSize: 55, lineHeight: 1, display: "block", userSelect: "none" }}>
              {modeEmoji}
            </span>
            {/* Mode title */}
            <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 0 8px" }}>
              {modeTitle}
            </p>

            {/* Total XP */}
            <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 33, lineHeight: "112%", color: "#FBAC35", textAlign: "center", margin: "0 0 14px" }}>
              {formatXP(totalXP)} XP
            </p>

            {/* Veteran + Rank pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {/* Veteran/Challenger pill — 88×32 */}
              <div style={{
                height: 32, borderRadius: 17,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(52.6px)", WebkitBackdropFilter: "blur(52.6px)",
                display: "flex", alignItems: "center", padding: "0 14px",
              }}>
                <span style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)" }}>
                  {isVeteran ? "🎖️ Veteran" : "🌱 Challenger"}
                </span>
              </div>
              {/* Rank pill — 55×32 */}
              <div style={{
                height: 32, minWidth: 55, borderRadius: 17,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(52.6px)", WebkitBackdropFilter: "blur(52.6px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "0 12px",
              }}>
                <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 7, lineHeight: "14px", color: "#FFFFFF", textAlign: "center" }}>Rank</span>
                <span style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "14px", color: "#FFFFFF", textAlign: "center" }}>
                  {currentProfile.assigned_rank}
                </span>
              </div>
            </div>

            {/* XP breakdown — 221px wide, centered */}
            <div style={{ width: 221, margin: "0 auto" }}>
              {xpRows.map((row, i) => (
                <div key={row.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                    <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF" }}>{row.label}</span>
                    <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF" }}>{row.value}</span>
                  </div>
                  {i < xpRows.length - 1 && (
                    <div style={{ width: 220, height: 0, borderBottom: "1px solid rgba(255,255,255,0.2)" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Status: PENDING + lock icon */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 18 }}>
              <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF" }}>Status:</span>
              <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FBAC35" }}>PENDING</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lock_yellow.svg" alt="" aria-hidden="true" style={{ width: 13, height: 19, flexShrink: 0 }} />
            </div>

            {/* Unlock note */}
            <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)", textAlign: "center", margin: "8px 0 0" }}>
              Unlocks with first Day-1 trade
            </p>
          </div>
        </motion.div>

        {/* ── Prediction Apps Volume Box ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[404px] mt-4"
          style={{ ...card, padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 0 6px" }}>
            Prediction Apps Volume
          </p>
          <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 22, lineHeight: "112%", color: "#FBAC35", textAlign: "center", margin: 0 }}>
            {formatVolume(currentProfile.polymarket_volume_usd)}
          </p>
        </motion.div>

        {/* ── Alliance Program Box ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-[404px] mt-10">

          <div style={{ ...card, padding: "52px 24px 24px", position: "relative" }}>
            {/* Emoji straddling top border */}
            <span style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", fontSize: 55, lineHeight: 1, display: "block", userSelect: "none" }}>🤝</span>
            <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 20, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 0 12px" }}>
              Alliance Program
            </p>
            <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 auto 18px", maxWidth: 255 }}>
              Invite traders to earn{" "}
              <span style={{ color: "#FBAC35" }}>10% commission</span>
              {" "}on their Volume XP. Build your alliance and maximize your airdrop.
            </p>

            {/* Referral link copy box — 323×49 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="genesis-input-wrapper" style={{ width: 323 }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  width: "100%", height: "100%",
                  padding: "0 16px 0 20px",
                  position: "relative", zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: IBM, fontWeight: 400, fontSize: 13, lineHeight: "112%",
                    color: "rgba(255,255,255,0.7)",
                    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {displayUrl}
                  </span>
                  <button type="button" onClick={handleCopy}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, display: "flex", alignItems: "center" }}>
                    {copied
                      ? <span style={{ fontFamily: IBM, fontSize: 12, color: "#FBAC35" }}>Copied!</span>
                      : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/copy.svg" alt="Copy" style={{ width: 13.98, height: 17.2 }} />
                      )}
                  </button>
                </div>
              </div>
            </div>

            {/* How It Works? */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
              <button type="button"
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: IBM, fontWeight: 400, fontSize: 13, lineHeight: "112%", color: "#FBAC35", textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}>
                How It Works?
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Social Quest Box ──────────────────────────────────────────── */}
        {!currentProfile.twitter_shared && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-[404px] mt-10">

            <div style={{ ...card, padding: "46px 24px 24px", position: "relative", width: "100%" }}>
              {/* X icon straddling top border */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/x.svg" alt="" aria-hidden="true" style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", width: 54, height: 54, userSelect: "none" }} />
              <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 20, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 0 12px" }}>
                Social Quest
              </p>
              <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.6)", textAlign: "center", margin: "0 auto 20px", maxWidth: 255 }}>
                Share your Genesis profile on Twitter/X to earn bonus XP and spread the word.
              </p>

              {!showTweetInput ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button type="button" onClick={handleTweet}
                    className="genesis-btn"
                    style={{ width: 324, fontFamily: IBM, fontWeight: 600, fontSize: 16, lineHeight: "100%" }}>
                    Share on X &amp; Earn +500 XP
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTweetSubmit}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div className="genesis-input-wrapper" style={{ width: 324 }}>
                    <input
                      type="url" value={tweetUrl} onChange={(e) => setTweetUrl(e.target.value)}
                      placeholder="https://x.com/username/status/..."
                      required disabled={isSubmittingTweet}
                      style={{ fontFamily: IBM, fontSize: 13, opacity: isSubmittingTweet ? 0.6 : 1 }}
                    />
                  </div>
                  {tweetError && (
                    <p style={{ color: "#f87171", fontSize: 13, fontFamily: IBM, margin: 0 }}>{tweetError}</p>
                  )}
                  <button type="submit" disabled={isSubmittingTweet}
                    className="genesis-btn"
                    style={{ width: 324, fontFamily: IBM, fontWeight: 600, fontSize: 16, lineHeight: "100%", opacity: isSubmittingTweet ? 0.6 : 1 }}>
                    {isSubmittingTweet ? "Verifying..." : "Claim +500 XP"}
                  </button>
                  <button type="button" onClick={handleTweet}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: IBM, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "underline", padding: 0 }}>
                    Tweet again
                  </button>
                </form>
              )}

              {/* Requirements */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
                <button type="button" onClick={() => setShowRequirements(!showRequirements)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: IBM, fontWeight: 400, fontSize: 13, lineHeight: "112%", color: "#74A3FF", textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}>
                  Requirements
                </button>
              </div>
              {showRequirements && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, background: "rgba(116,163,255,0.08)", border: "1px solid rgba(116,163,255,0.2)" }}>
                  <ul style={{ fontFamily: IBM, fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, padding: "0 0 0 14px", lineHeight: "180%" }}>
                    <li>Tweet must contain #Streak hashtag</li>
                    <li>Tweet must contain your referral code</li>
                    <li>One-time bonus (500 XP)</li>
                    <li>Tweet URL must be unique</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Privileges Box ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-[404px] mt-10">

          <div style={{ ...card, padding: "52px 24px 24px", position: "relative", background: "rgba(255,255,255,0.13)" }}>
            {/* Emoji straddling top border */}
            <span style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", fontSize: 55, lineHeight: 1, display: "block", userSelect: "none" }}>🚀</span>
            <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 20, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 0 16px" }}>
              Your Day-1 Privileges
            </p>

            {isGodMode && (
              <>
                <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 auto 12px", maxWidth: 255 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>GOD MODE UNLOCKED:</span>
                  {" "}You will start Day-1 with the permanent{" "}
                  <span style={{ color: "#FBAC35" }}>2.0x Streak Multiplier</span>
                  {" "}already active!
                </p>
                <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 auto", maxWidth: 313 }}>
                  Normal users must grind 7 consecutive days to reach God Mode. You skip the entire queue.
                </p>
              </>
            )}

            {isOrangeFire && (
              <>
                <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 auto 12px", maxWidth: 255 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>TIME-SKIP BONUS:</span>
                  {" "}You will start Day-1 at a{" "}
                  <span style={{ color: "#FBAC35" }}>1.5x Streak Multiplier</span>
                  {" "}(skips 4 days of grinding).
                </p>
                <p style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 auto", maxWidth: 313 }}>
                  Continue your streak to unlock the 2.0x God Mode faster than normal users.
                </p>
              </>
            )}

            {!isGodMode && !isOrangeFire && (
              <p style={{ fontFamily: IBM, fontWeight: 700, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", textAlign: "center", margin: "0 auto", maxWidth: 255 }}>
                You will start Day-1 at the standard{" "}
                <span style={{ color: "#FBAC35" }}>1.0x Multiplier</span>
                . Build your streak from the ground up. Trade daily to unlock higher multipliers.
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 335, marginTop: 32 }}>
          This is your pre-launch Genesis profile. All XP is reserved and pending. Phase 1 Launch: Coming Soon
        </motion.p>
      </div>
    </div>
  );
}
