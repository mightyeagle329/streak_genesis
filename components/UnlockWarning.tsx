"use client";

import { motion } from "framer-motion";

export function UnlockWarning() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl"
        >
          ⚠️
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            MANDATORY DAY-1 UNLOCK REQUIREMENT
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Your Genesis XP and Launch Aura are <span className="text-yellow-400 font-bold">RESERVED</span>.
            To officially unlock your Airdrop allocation and activate your Aura, you{" "}
            <span className="text-red-400 font-bold">MUST</span> make your first
            trade (min. $10) on STREAK when we launch (Day-1).
          </p>
          <p className="text-gray-400 text-sm mt-3">
            ⏰ Unclaimed allocations will be permanently burned after the grace period.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
