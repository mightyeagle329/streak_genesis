"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserProfile } from "@/app/page";
import { validateEmail } from "@/lib/utils";

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
  
  // 🧪 TESTING: Always use test wallet
  const TEST_WALLET = "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
      const apiEndpoint = `${backendUrl}/v1/account/genesis/register`;
      
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
      const apiEndpoint = `${backendUrl}/v1/account/genesis/register/confirm`;
      
      const requestBody = {
        email: email.trim(),
        code: verificationCode,
        wallet_address: TEST_WALLET.toLowerCase(), // Use test wallet
      };

      console.log("📤 Confirming verification code to:", apiEndpoint);
      console.log("🧪 Using test wallet:", TEST_WALLET);
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

      // Update profile with verified email
      const updatedProfile = {
        ...profile,
        email: email.trim(),
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
      const apiEndpoint = `${backendUrl}/v1/account/genesis/register`;
      
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {step === "email" ? "🔐" : "📧"}
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-gold">
            {step === "email" ? "Secure Your Allocation" : "Verify Your Email"}
          </h2>
          
          <p className="text-xl text-gray-400">
            {step === "email"
              ? "Reserve your Genesis Aura and lock in your airdrop for Day-1."
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/80 border-2 border-orange-500/30 rounded-2xl p-8"
        >
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-400 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-4 bg-black border-2 border-gray-700 rounded-xl text-white text-lg focus:border-orange-500 focus:outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xl font-bold rounded-xl hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-orange-500/50"
              >
                {isSubmitting ? "Sending Code..." : "Send Verification Code →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              {/* Verification Code Input */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-gray-400 mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="w-full px-4 py-4 bg-black border-2 border-gray-700 rounded-xl text-white text-2xl font-mono text-center tracking-widest focus:border-orange-500 focus:outline-none transition-colors"
                  disabled={isSubmitting}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Check your email inbox for the 6-digit code
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xl font-bold rounded-xl hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-orange-500/50"
              >
                {isSubmitting ? "Verifying..." : "Verify & Continue →"}
              </button>

              {/* Resend Code */}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                className="w-full text-orange-400 text-sm hover:underline disabled:opacity-50"
              >
                Didn&apos;t receive code? Resend
              </button>

              {/* Change Email */}
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setVerificationCode("");
                  setError("");
                }}
                className="w-full text-gray-400 text-sm hover:underline"
              >
                ← Change email address
              </button>
            </form>
          )}

          {/* Info Text */}
          {step === "email" && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-400 leading-relaxed">
                <span className="text-blue-400 font-semibold">Why email?</span>{" "}
                We&apos;ll notify you the moment Phase 1 launches so you can make your
                first trade and unlock your reserved XP and Aura. No spam, ever.
              </p>
            </div>
          )}
        </motion.div>

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-600 mt-4"
        >
          Your email is stored securely and will never be shared.
        </motion.p>
      </motion.div>
    </div>
  );
}
