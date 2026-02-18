"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserProfile } from "@/app/page";
import { generateRefCode } from "@/lib/utils";

interface IndexingAnimationProps {
  walletAddress: string;
  referralCode: string | null;
  onComplete: (profile: UserProfile) => void;
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
}: IndexingAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState("");
  
  // 🧪 TESTING MODE: Use test wallet instead of real wallet
  const TEST_MODE = true; // ✅ Set to TRUE to use test wallet
  const TEST_WALLET = "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee"; // Polymarket whale
  
  // Select which address to send to backend
  const addressToSend = TEST_MODE ? TEST_WALLET : walletAddress;

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % scanningMessages.length);
    }, 1500);

    // Fetch actual data from backend API
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
        const apiEndpoint = `${backendUrl}/v1/account/genesis`;
        
        console.log("=" .repeat(60));
        console.log("🔍 INDEXING STARTED");
        console.log("🧪 TEST MODE:", TEST_MODE ? "ENABLED ✅" : "DISABLED");
        console.log("📍 YOUR Real Wallet (for email):", walletAddress);
        console.log("🎯 Test Wallet (for volume only):", TEST_WALLET);
        console.log("🌐 Backend API:", apiEndpoint);
        console.log("=" .repeat(60));
        
        // Step 1: Fetch volume data using test wallet
        const volumeRequestBody = {
          wallet_address: addressToSend, // Test wallet
        };
        
        console.log("📤 [Step 1] Fetching volume from test wallet:", volumeRequestBody);
        
        const volumeResponse = await fetch(apiEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(volumeRequestBody),
        });
        
        console.log("📥 Volume Response Status:", volumeResponse.status);

        if (!volumeResponse.ok) {
          throw new Error(`Backend returned ${volumeResponse.status}`);
        }

        const volumeData = await volumeResponse.json();
        console.log("📊 Volume Data (from test wallet):", volumeData);

        // Step 2: Register YOUR real wallet to backend
        const realWalletRequestBody = {
          wallet_address: walletAddress.toLowerCase(), // YOUR wallet
        };
        
        console.log("📤 [Step 2] Registering YOUR wallet to backend:", realWalletRequestBody);
        
        const realWalletResponse = await fetch(apiEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(realWalletRequestBody),
        });
        
        console.log("📥 Real Wallet Registration Status:", realWalletResponse.status);

        // Wait for dramatic effect
        setTimeout(() => {
          // Create profile: YOUR wallet + test wallet's volume
          const profile: UserProfile = {
            wallet_address: walletAddress.toLowerCase(), // YOUR real wallet
            user_type: volumeData.user_type || "CHALLENGER",
            polymarket_volume_usd: volumeData.polymarket_volume_usd || 0, // Test wallet's volume
            genesis_xp: volumeData.genesis_xp || 1000,
            alliance_xp: volumeData.alliance_xp || 0,
            social_xp: volumeData.social_xp || 0,
            total_xp: volumeData.total_xp || volumeData.genesis_xp || 1000,
            is_xp_locked: volumeData.is_xp_locked ?? true,
            assigned_aura: volumeData.assigned_aura || "GREY_BORDER",
            assigned_rank: volumeData.assigned_rank || "NOVICE",
            ref_code: volumeData.ref_code || "",
            twitter_shared: volumeData.twitter_shared || false,
            invited_by: referralCode || undefined,
            email: volumeData.email,
          };
          
          console.log("✅ Profile created (YOUR wallet + test volume):", profile);
          onComplete(profile);
        }, 3000);
      } catch (error) {
        console.error("❌ Error fetching from backend:", error);
        alert("Failed to fetch profile from backend. Please try again.");
      }
    };

    fetchData();

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToSend, referralCode, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Terminal-style container */}
        <div className="bg-black/80 border-2 border-green-500/30 rounded-lg p-8 font-mono">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-500/30">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-green-400 text-sm">
              STREAK GENESIS INDEXER v1.0
            </span>
          </div>

          {/* Scanning animation */}
          <div className="space-y-4">
            <motion.div
              className="text-green-400 terminal-glow"
              key={currentMessage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {">"} {scanningMessages[currentMessage]}
              {dots}
            </motion.div>

            {/* Wallet display */}
            <div className="text-gray-400 text-sm">
              Target: {addressToSend.slice(0, 6)}...{addressToSend.slice(-4)}
              {TEST_MODE && (
                <div className="text-yellow-400 text-xs mt-1">
                  🧪 TEST MODE: Using demo wallet
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* Scan effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-20 pointer-events-none"
            animate={{ y: [-100, 300] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 mt-6"
        >
          This may take a few seconds as we scan the blockchain...
        </motion.p>
      </motion.div>
    </div>
  );
}
