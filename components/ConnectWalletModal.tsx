"use client";

import { useConnect } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectors, connect } = useConnect();

  const handleConnect = (connector: typeof connectors[0]) => {
    connect({ connector });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all hover:scale-[1.02] group"
                >
                  <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center group-hover:bg-zinc-600 transition-colors">
                    {connector.name === "Coinbase Wallet" ? (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 16.5h-11v-9h11v9z" fill="#1652f0"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white font-medium text-lg">{connector.name}</span>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              Connect your wallet to continue
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
