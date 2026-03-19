"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserProfile } from "@/app/page";
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

interface EmailGateProps {
  profile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

export function EmailGate({ profile, onComplete }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Use the real connected wallet address from the profile.
  // (Previous test-wallet wiring caused verification to apply to the wrong account.)
  const walletAddress = profile.wallet_address;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiEndpoint = `/api/backend/v1/account/genesis/register`;
      
      console.log("📤 Sending verification request to:", apiEndpoint);
      console.log("📤 Request body:", { email: email.trim() });

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to send verification code" }));
        throw new Error(errorData.error || "Failed to send verification code");
      }

      const data = await response.json();
      console.log("✅ Verification code sent successfully:", data);

      setStep("verify");
    } catch (err: any) {
      console.error("❌ Error sending verification:", err);
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiEndpoint = `/api/backend/v1/account/genesis/register/confirm`;
      
      const requestBody = {
        email: email.trim(),
        code: verificationCode,
        wallet_address: walletAddress.toLowerCase(),
      };

      console.log("📤 Confirming verification code to:", apiEndpoint);
      console.log("✅ Using wallet:", walletAddress);
      console.log("📤 Request body:", requestBody);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Invalid verification code" }));
        throw new Error(errorData.error || "Invalid verification code");
      }

      const data = await response.json();
      console.log("✅ Email verified successfully:", data);

      // Backend returns the updated profile (including ref_code) under `profile`.
      const backendProfile: any = data?.profile ?? {};

      // Update profile with verified email
      const updatedProfile = {
        ...profile,
        // Prefer backend canonical values when provided
        ...backendProfile,
        email: backendProfile.email ?? email.trim(),
      };

      onComplete(updatedProfile);
    } catch (err: any) {
      console.error("❌ Error verifying code:", err);
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const apiEndpoint = `/api/backend/v1/account/genesis/register`;

      console.log("📤 Resending verification code to:", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to resend code" }));
        throw new Error(errorData.error || "Failed to resend code");
      }

      console.log("✅ Verification code resent successfully");
      setError("");
    } catch (err: any) {
      console.error("❌ Error resending code:", err);
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const IBM = "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif";

  return (
    <div className="min-h-screen relative flex flex-col">

      {/* Blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg.png" alt="" aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", maxWidth: "none",
          width: 1243.62, height: 829.08,
          transform: "translate(-50%, -50%) rotate(-40deg)",
          opacity: 0.8, mixBlendMode: "lighten", filter: "blur(72px)",
        }} />
        <div className="absolute inset-0" style={{ background: "rgba(10,11,16,0.55)" }} />
      </div>

      {/* STREAK logo */}
      <div className="relative z-10" style={{ paddingTop: 28, paddingLeft: 36, display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 26, flexShrink: 0 }} />
        <span style={{ marginLeft: 9, fontFamily: IBM, fontWeight: 400, fontSize: 23, lineHeight: "26px", color: "#FFFFFF", whiteSpace: "nowrap" }}>STREAK</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          {step === "email" ? (
            <>
              {/* "Reserve your Genesis Aura..." */}
              <p className="w-full max-w-[90vw] md:max-w-[206px]"
                style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "#FFFFFF", margin: 0 }}>
                Reserve your Genesis Aura and lock in your airdrop for Day-1.
              </p>

              {/* "Secure 🔒 Your Allocation" */}
              <h1 className="text-[36px] md:text-[44px] w-full max-w-[90vw] md:max-w-[313px]"
                style={{
                  fontFamily: "'Nekst', 'Inter', sans-serif",
                  fontWeight: 700, lineHeight: "84%",
                  color: "#FBAC35", margin: "10px 0 0 0",
                }}>
                Secure{" "}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lock_yellow.svg" alt="" aria-hidden="true"
                  className="w-[28px] h-[32px] md:w-[34.75px] md:h-[39.91px]"
                  style={{ display: "inline", verticalAlign: "middle", marginBottom: 4 }}
                />{" "}
                Your<br />Allocation
              </h1>

              {/* Error */}
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-4 w-full max-w-[90vw] md:max-w-[357px]"
                  style={{ color: "#f87171", fontSize: 13, fontFamily: IBM }}>
                  {error}
                </motion.p>
              )}

              {/* Input + Button — row on desktop, column on mobile */}
              <form onSubmit={handleEmailSubmit}
                className="flex flex-col md:flex-row gap-3 mt-7 items-center w-full max-w-[90vw] md:max-w-none">

                {/* Email input */}
                <div className="genesis-input-wrapper w-full md:w-[233px]">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" required disabled={isSubmitting}
                    style={{ fontFamily: IBM, opacity: isSubmitting ? 0.6 : 1 }}
                  />
                </div>

                {/* Send button */}
                <button type="submit" disabled={isSubmitting}
                  className="genesis-btn w-full md:w-auto"
                  style={{ minWidth: 0, fontFamily: IBM, opacity: isSubmitting ? 0.6 : 1 }}>
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </button>
              </form>

              {/* "Why email?" */}
              <p className="mt-6 w-full max-w-[90vw] md:max-w-[357px]"
                style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)" }}>
                Why email? We&apos;ll notify you the moment Phase 1 launches so you can
                make your first trade and unlock your reserved XP and Aura. No spam, ever.
              </p>

              {/* "Your email is stored..." */}
              <p className="mt-4 w-full max-w-[90vw] md:max-w-[357px]"
                style={{ fontFamily: IBM, fontWeight: 400, fontSize: 13, lineHeight: "112%", color: "rgba(255,255,255,0.5)" }}>
                Your email is stored securely and will never be shared.
              </p>
            </>
          ) : (
            <>
              {/* ── "Verify Your Email" title ── */}
              <h1 className="text-[36px] md:text-[44px] w-full max-w-[90vw] md:max-w-[227px]"
                style={{
                  fontFamily: "'Nekst', 'Inter', sans-serif",
                  fontWeight: 700,
                  lineHeight: "84%",
                  color: "#FBAC35",
                  margin: 0,
                  textAlign: "center",
                }}>
                Verify<br />Your Email
              </h1>

              {/* ── "We sent a 6-digit code to …" subtitle ── */}
              <p className="mt-5 w-full max-w-[90vw] md:max-w-[344px]"
                style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)", margin: "20px 0 0 0" }}>
                We sent a 6-digit code to{" "}
                <span style={{ color: "#FFFFFF", fontWeight: 400 }}>{email}</span>
              </p>

              {/* ── Error ── */}
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-4 w-full max-w-[90vw] md:max-w-[400px]"
                  style={{ color: "#f87171", fontSize: 13, fontFamily: IBM }}>
                  {error}
                </motion.p>
              )}

              {/* ── Code input + Verify button (same row) ── */}
              <form onSubmit={handleVerificationSubmit}
                className="flex flex-col md:flex-row gap-3 mt-7 items-center w-full max-w-[90vw] md:max-w-none">

                {/* Verification code input */}
                <div className="genesis-input-wrapper w-full md:w-[233px]">
                  <input
                    type="text" value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Verification Code" required maxLength={6} disabled={isSubmitting} autoFocus
                    style={{ fontFamily: IBM, fontSize: 15, textAlign: "left", letterSpacing: 0, opacity: isSubmitting ? 0.6 : 1 }}
                  />
                </div>

                {/* Verify button */}
                <button type="submit" disabled={isSubmitting}
                  className="genesis-btn w-full md:w-[162px]"
                  style={{ minWidth: 0, fontFamily: IBM, fontSize: 15, opacity: isSubmitting ? 0.6 : 1 }}>
                  {isSubmitting ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>

              {/* ── "Check your email inbox…" ── */}
              <p className="mt-5 w-full max-w-[90vw] md:max-w-[357px]"
                style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                Check your email inbox for the 6-digit code
              </p>

              {/* ── "Didn't receive code? Resend" ── */}
              <button type="button" onClick={handleResendCode} disabled={isSubmitting}
                className="mt-3"
                style={{
                  background: "none",
                  border: "none",
                  cursor: isSubmitting ? "default" : "pointer",
                  fontFamily: IBM,
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: "112%",
                  color: "#FBAC35",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                  opacity: isSubmitting ? 0.5 : 1,
                  padding: 0,
                }}>
                Didn&apos;t receive code? Resend
              </button>

              {/* ── "← Change email address" pill ── */}
              <button type="button"
                onClick={() => { setStep("email"); setVerificationCode(""); setError(""); }}
                className="mt-4 flex items-center gap-2"
                style={{
                  width: 185,
                  height: 32,
                  borderRadius: 17,
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(52.6px)",
                  WebkitBackdropFilter: "blur(52.6px)",
                  border: "none",
                  cursor: "pointer",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                {/* Left arrow icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/direction.svg" alt="" aria-hidden="true"
                  style={{ width: 13.6, height: 11.1, opacity: 0.7, flexShrink: 0 }} />
                <span style={{ fontFamily: IBM, fontWeight: 400, fontSize: 15, lineHeight: "112%", color: "rgba(255,255,255,0.7)" }}>
                  Change email address
                </span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
