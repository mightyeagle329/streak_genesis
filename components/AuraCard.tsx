"use client";

import { motion } from "framer-motion";
import { UserProfile } from "@/app/page";
import { formatXP } from "@/lib/utils";

interface AuraCardProps {
  profile: UserProfile;
  auraInfo: { label: string; color: string; emoji: string };
}

export function AuraCard({ profile, auraInfo }: AuraCardProps) {
  return (
    <div className={`relative p-8 rounded-2xl border-2 ${auraInfo.color} bg-black/50 backdrop-blur-sm overflow-hidden`}>
      {/* Animated background effect */}
      {profile.assigned_aura === "GOLDEN_FIRE" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {profile.assigned_aura === "ORANGE_FIRE" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Emoji Badge */}
        <motion.div
          className="text-7xl mb-4 inline-block"
          animate={
            profile.assigned_aura !== "GREY_BORDER"
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {auraInfo.emoji}
        </motion.div>

        {/* Aura Label */}
        <h3 className="text-2xl font-bold text-white mb-2">
          {auraInfo.label}
        </h3>

        {/* XP Display */}
        <div className="mb-4">
          <div className="text-5xl font-bold gradient-gold">
            {formatXP(profile.total_xp)}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total XP</div>
        </div>

        {/* Lock Status */}
        <div className="flex items-center gap-2 p-3 bg-black/50 rounded-lg border border-yellow-500/30">
          <span className="text-2xl">🔒</span>
          <div className="text-left flex-1">
            <div className="text-xs text-yellow-400 font-semibold uppercase">
              Status: Pending
            </div>
            <div className="text-xs text-gray-400">
              Unlocks with first Day-1 trade
            </div>
          </div>
        </div>

        {/* User Type Badge */}
        <div className="mt-4 inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
          <span className="text-sm font-semibold text-purple-300">
            {profile.user_type === "VETERAN" ? "🎖️ VETERAN" : "⚔️ CHALLENGER"}
          </span>
        </div>
      </div>
    </div>
  );
}
