"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [showMenu, setShowMenu] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm text-white rounded-lg border border-gray-600 transition-colors"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="font-mono text-sm">{shortAddress}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
            >
              {/* Wallet Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
                <div className="font-mono text-sm text-white break-all">
                  {address}
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Address
                </button>

                <button
                  onClick={() => {
                    disconnect();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 rounded transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
