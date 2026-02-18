"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
  const hasFetched = useRef(false); // Prevent duplicate API calls
  
  // 🧪 TESTING: Always use test wallet for backend
  const TEST_WALLET = "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee";

  useEffect(() => {
    // Skip if already fetched
    if (hasFetched.current) {
      console.log("🚫 Skipping duplicate request - already fetched");
      return;
    }
    hasFetched.current = true;
    
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % scanningMessages.length);
    }, 1500);

    // Fetch data from backend API
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
        const apiEndpoint = `${backendUrl}/v1/account/genesis`;
        
        console.log("\n" + "=".repeat(80));
        console.log("🔍 INDEXING STARTED");
        console.log("=".repeat(80));
        console.log("🧪 TEST MODE: Using test wallet for all requests");
        console.log("📍 Connected Wallet (display only):", walletAddress);
        console.log("🎯 Test Wallet (sent to backend):", TEST_WALLET);
        console.log("🌐 Backend API Endpoint:", apiEndpoint);
        console.log("=".repeat(80) + "\n");
        
        const requestBody = {
          wallet_address: TEST_WALLET.toLowerCase(),
        };
        
        console.log("📤 REQUEST #1 - INDEXING VOLUME");
        console.log("Method: POST");
        console.log("Endpoint:", apiEndpoint);
        console.log("Headers:", {
          "Content-Type": "application/json",
          "Accept": "application/json",
        });
        console.log("Body (stringified):", JSON.stringify(requestBody, null, 2));
        console.log("Body (raw object):", requestBody);
        console.log("\n⏳ Sending request to backend...\n");
        
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        
        console.log("📥 RESPONSE RECEIVED");
        console.log("Status Code:", response.status);
        console.log("Status Text:", response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ ERROR RESPONSE");
          console.error("Status:", response.status);
          console.error("Error Body:", errorText);
          throw new Error(`Backend returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("\n📊 SUCCESS - Backend Response Data:");
        console.log(JSON.stringify(data, null, 2));
        console.log("\n" + "=".repeat(80) + "\n");

        // Wait for dramatic effect
        setTimeout(() => {
          // Use test wallet data
          const profile: UserProfile = {
            wallet_address: TEST_WALLET.toLowerCase(), // Use test wallet everywhere
            user_type: data.user_type || "CHALLENGER",
            polymarket_volume_usd: data.polymarket_volume_usd || 0,
            genesis_xp: data.genesis_xp || 1000,
            alliance_xp: data.alliance_xp || 0,
            social_xp: data.social_xp || 0,
            total_xp: data.total_xp || data.genesis_xp || 1000,
            is_xp_locked: data.is_xp_locked ?? true,
            assigned_aura: data.assigned_aura || "GREY_BORDER",
            assigned_rank: data.assigned_rank || "NOVICE",
            ref_code: data.ref_code || "",
            twitter_shared: data.twitter_shared || false,
            invited_by: referralCode || undefined,
            email: data.email,
          };
          
          console.log("✅ Profile Created (using test wallet):", profile);
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
  }, [walletAddress, referralCode, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Spinning Circle with SYNC */}
        <div className="relative">
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 blur-2xl opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Spinning ring */}
          <motion.div
            className="relative w-32 h-32 rounded-full border-4 border-transparent bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 p-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundClip: "padding-box",
              boxShadow: "0 0 40px rgba(251, 146, 60, 0.6)",
            }}
          >
            {/* Inner circle */}
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <motion.div
                className="text-2xl font-bold gradient-gold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                SYNC
              </motion.div>
            </div>
          </motion.div>
          
          {/* Particle effects */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: "-4px",
                marginTop: "-4px",
              }}
              animate={{
                x: [0, Math.cos((i * 30 * Math.PI) / 180) * 80],
                y: [0, Math.sin((i * 30 * Math.PI) / 180) * 80],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Calculating Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Calculating{dots}
          </h2>
          <p className="text-gray-400 text-sm">
            Analyzing your Polymarket history
          </p>
        </motion.div>

        {/* Epic Progress Bar */}
        <motion.div
          className="w-full max-w-md mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            {/* Glow background */}
            <div className="absolute inset-0 blur-xl opacity-50">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </div>
            
            {/* Main progress bar */}
            <div className="relative h-4 bg-black border-2 border-orange-500/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 via-yellow-400 to-orange-600 relative"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4)",
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              {/* Particle effects */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-400 rounded-full"
                    style={{ left: `${i * 12}%`, top: "50%" }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
