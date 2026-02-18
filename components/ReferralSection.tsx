"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ReferralSectionProps {
  refCode: string;
}

export function ReferralSection({ refCode }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://genesis.streak.app'}?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/80 border-2 border-orange-500/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🤝</span>
        <h2 className="text-2xl font-bold text-white">Alliance Program</h2>
      </div>

      <p className="text-gray-400 mb-6">
        Invite traders to earn <span className="text-orange-400 font-bold">10% commission</span> on
        their Volume XP. Build your alliance and maximize your airdrop.
      </p>

      {/* Referral Link */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-400">
          Your Alliance Link
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-black border-2 border-gray-700 rounded-xl text-white font-mono text-sm"
          />
          
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
      >
        <h4 className="text-sm font-semibold text-orange-400 mb-2">
          How It Works:
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Share your link with traders</li>
          <li>• They connect wallet & submit email</li>
          <li>• You earn 10% of their <strong>Volume XP</strong> (not Welcome Bonus)</li>
          <li>• Commission is minted instantly, not deducted from them</li>
          <li>• Max commission per invite: 2,200 XP (from $1M whale)</li>
        </ul>
      </motion.div>
    </div>
  );
}
