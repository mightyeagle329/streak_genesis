"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserProfile } from "@/app/page";
import { formatVolume, formatXP, getAuraDisplay } from "@/lib/utils";

interface VolumeRevealProps {
  profile: UserProfile;
  onContinue: () => void;
}

export function VolumeReveal({ profile, onContinue }: VolumeRevealProps) {
  const [showDetails, setShowDetails] = useState(false);
  const auraInfo = getAuraDisplay(profile.assigned_aura);

  useEffect(() => {
    // Show details immediately
    setTimeout(() => setShowDetails(true), 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        {/* Volume Display */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl text-gray-400 mb-4"
          >
            {profile.user_type === "VETERAN"
              ? "Your Total Polymarket Volume"
              : "Polymarket Volume Detected"}
          </motion.h2>

          <motion.div
            className="text-6xl md:text-8xl font-bold gradient-gold mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.span>
              {formatVolume(profile.polymarket_volume_usd)}
            </motion.span>
          </motion.div>
        </div>

        {/* Profile Type Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showDetails ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile.user_type === "CHALLENGER" ? (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-3">
                🌟 Welcome, Challenger!
              </h3>
              <p className="text-gray-300 text-lg">
                No Polymarket history? Perfect. You skipped the legacy platforms.
                <br />
                <span className="text-orange-400 font-semibold">
                  Welcome to the revolution.
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-3">
                🔥 Welcome Back, Veteran!
              </h3>
              <p className="text-gray-300 text-lg">
                Your trading history has been validated.
                <br />
                Time to claim what you deserve.
              </p>
            </div>
          )}
        </motion.div>

        {/* XP Display - LOCKED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showDetails ? 1 : 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className={`p-8 rounded-2xl border-2 ${auraInfo.color} bg-black/50 backdrop-blur-sm`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">{auraInfo.emoji}</div>
              <h3 className="text-3xl font-bold text-white">
                {formatXP(profile.genesis_xp)} XP
              </h3>
              <div className="text-4xl">🔒</div>
            </div>
            
            <div className="text-yellow-400 font-semibold mb-2">
              {auraInfo.label} | {profile.assigned_rank}
            </div>
            
            <div className="text-sm text-gray-400">
              Status: <span className="text-orange-400 font-bold">PENDING</span>
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-6xl opacity-50"
            >
              🔒
            </motion.div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showDetails ? 1 : 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onContinue}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xl font-bold rounded-xl hover:scale-105 transition-transform duration-200 hover:shadow-2xl hover:shadow-orange-500/50"
          >
            Continue to Unlock →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
