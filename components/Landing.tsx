"use client";

import { motion } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";

interface LandingProps {
  referralCode: string | null;
}

export function Landing({ referralCode }: LandingProps) {
  const { open } = useWeb3Modal();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center space-y-8"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="gradient-gold">STREAK</span>
          </h1>
          <div className="text-xl md:text-2xl text-orange-500 font-semibold tracking-wider">
            GENESIS
          </div>
        </motion.div>

        {/* Hook Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            You traded <span className="text-orange-500">millions</span> on
            Prediction Apps
            <br />
            and got <span className="text-red-500">nothing</span>.
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Claim your <span className="gradient-text font-bold">Streak XP</span>{" "}
            for your past volume.
          </p>
        </motion.div>

        {/* Referral Badge */}
        {referralCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-6 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <div className="text-sm text-orange-400">
              🤝 Invited by: <span className="font-mono font-bold">{referralCode}</span>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-8"
        >
          <button
            onClick={() => open()}
            className="group relative px-12 py-5 text-xl font-bold text-black bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
          >
            <span className="relative z-10">Connect Wallet & Calculate Volume</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </motion.div>

        {/* Info Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 max-w-xl mx-auto"
        >
                No Prediction Apps history? Perfect. You skipped the legacy platforms.
          <br />
          <span className="text-orange-400 font-semibold">
            Welcome to the revolution, Challenger.
          </span>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-orange-500 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
