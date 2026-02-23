"use client";

import { motion } from "framer-motion";
import { useDisconnect } from "wagmi";

interface SybilRejectionProps {
  reason?: string;
}

const REQUIREMENTS = [
  { icon: "📅", label: "Wallet age", detail: "At least 30 days old" },
  { icon: "⛽", label: "On-chain activity", detail: "Sufficient gas transaction history" },
  { icon: "📊", label: "Transaction count", detail: "Minimum baseline interactions" },
];

export function SybilRejection({ reason }: SybilRejectionProps) {
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center space-y-8"
      >
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="relative inline-flex"
        >
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full border-2 border-red-500/60 bg-red-500/10">
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span className="relative text-5xl">🛡️</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-black text-white mb-3">
            Wallet Not Eligible
          </h1>
          <p className="text-gray-400 text-lg">
            This wallet did not pass our Sybil protection checks.
          </p>
        </motion.div>

        {/* Reason box (if backend provides one) */}
        {reason && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-sm text-red-300"
          >
            {reason}
          </motion.div>
        )}

        {/* Requirements list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-black/60 border border-gray-800 rounded-2xl p-6 text-left space-y-4"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">
            Eligibility Requirements
          </p>
          {REQUIREMENTS.map((req, i) => (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="text-2xl">{req.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{req.label}</p>
                <p className="text-gray-500 text-xs">{req.detail}</p>
              </div>
              <span className="ml-auto text-red-400 text-lg">✗</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => disconnect()}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-orange-500/20 text-lg"
          >
            Try a Different Wallet
          </button>
          <p className="text-xs text-gray-600">
            Connect an older wallet with on-chain history to proceed.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
