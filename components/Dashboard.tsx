"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserProfile } from "@/app/page";
import { formatXP, formatVolume, getAuraDisplay } from "@/lib/utils";
import { AuraCard } from "./AuraCard";
import { ReferralSection } from "./ReferralSection";
import { SocialQuest } from "./SocialQuest";
import { UnlockWarning } from "./UnlockWarning";

interface DashboardProps {
  profile: UserProfile;
}

const XP_CAP_VOLUME = 1_000_000;

export function Dashboard({ profile }: DashboardProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const auraInfo = getAuraDisplay(currentProfile.assigned_aura);
  const isMaxCapped = currentProfile.polymarket_volume_usd > XP_CAP_VOLUME;

  const handleSocialComplete = (updatedProfile: UserProfile) => {
    setCurrentProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-gold mb-4">
            Your Genesis Profile
          </h1>
          <p className="text-gray-400 text-lg">
            Wallet: {currentProfile.wallet_address.slice(0, 6)}...
            {currentProfile.wallet_address.slice(-4)}
          </p>
        </motion.div>

        {/* Unlock Warning - Prominent */}
        <UnlockWarning />

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Aura & XP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AuraCard profile={currentProfile} auraInfo={auraInfo} />
          </motion.div>

          {/* Right: Stats Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Volume */}
            <div className="bg-black/80 border-2 border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Prediction Apps Volume</div>
                {isMaxCapped && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative px-3 py-1 rounded-full border border-yellow-400 bg-yellow-400/10"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative text-yellow-400 font-black text-xs tracking-widest uppercase">
                      🏆 MAX CAP
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="text-3xl font-bold text-orange-400">
                {formatVolume(currentProfile.polymarket_volume_usd)}
              </div>
              {isMaxCapped && (
                <p className="text-xs text-gray-500 mt-2">
                  XP capped at{" "}
                  <span className="text-yellow-400 font-semibold">$1,000,000</span>
                  {" "}· Volume shown for prestige only
                </p>
              )}
            </div>

            {/* XP Breakdown */}
            <div className="bg-black/80 border-2 border-gray-800 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Genesis XP</span>
                <span className="text-white font-bold">
                  {formatXP(currentProfile.genesis_xp)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Alliance XP</span>
                <span className="text-orange-400 font-bold">
                  +{formatXP(currentProfile.alliance_xp)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Social XP</span>
                <span className="text-blue-400 font-bold">
                  +{formatXP(currentProfile.social_xp)}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
                <span className="text-white font-semibold">Total XP</span>
                <span className="text-2xl font-bold gradient-gold">
                  {formatXP(currentProfile.total_xp)}
                </span>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">Rank</div>
              <div className="text-3xl font-bold text-white">
                {currentProfile.assigned_rank}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ReferralSection refCode={currentProfile.ref_code} />
        </motion.div>

        {/* Social Quest */}
        {!currentProfile.twitter_shared && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SocialQuest
              profile={currentProfile}
              onComplete={handleSocialComplete}
            />
          </motion.div>
        )}

        {/* Day-1 Multiplier Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            🚀 Your Day-1 Privileges
          </h3>
          
          {currentProfile.assigned_aura === "GOLDEN_FIRE" && (
            <div className="space-y-3">
              <p className="text-white text-lg">
                <span className="font-bold text-yellow-400">GOD MODE UNLOCKED:</span>{" "}
                You will start Day-1 with the permanent <span className="text-orange-400 font-bold">2.0x Streak Multiplier</span> already active!
              </p>
              <p className="text-gray-400">
                Normal users must grind 7 consecutive days to reach God Mode.
                You skip the entire queue.
              </p>
            </div>
          )}
          
          {currentProfile.assigned_aura === "ORANGE_FIRE" && (
            <div className="space-y-3">
              <p className="text-white text-lg">
                <span className="font-bold text-orange-400">TIME-SKIP BONUS:</span>{" "}
                You will start Day-1 at a <span className="text-orange-400 font-bold">1.5x Streak Multiplier</span> (skips 4 days of grinding).
              </p>
              <p className="text-gray-400">
                Continue your streak to unlock the 2.0x God Mode faster than normal users.
              </p>
            </div>
          )}
          
          {currentProfile.assigned_aura === "GREY_BORDER" && (
            <div className="space-y-3">
              <p className="text-white text-lg">
                You will start Day-1 at the standard <span className="font-bold">1.0x Multiplier</span>.
              </p>
              <p className="text-gray-400">
                Build your streak from the ground up. Trade daily to unlock higher multipliers.
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-gray-500"
        >
          <p>
            This is your pre-launch Genesis profile. All XP is reserved and pending.
          </p>
          <p className="mt-2">
            Phase 1 Launch: <span className="text-orange-400 font-semibold">Coming Soon</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
