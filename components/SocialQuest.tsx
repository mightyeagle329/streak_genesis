"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserProfile } from "@/app/page";
import { formatVolume } from "@/lib/utils";

interface SocialQuestProps {
  profile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

export function SocialQuest({ profile, onComplete }: SocialQuestProps) {
  const [tweetUrl, setTweetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${profile.wallet_address}` +
        `?xp=${encodeURIComponent(String(profile.total_xp))}` +
        `&vol=${encodeURIComponent(String(profile.polymarket_volume_usd))}` +
        `&name=${encodeURIComponent(profile.user_name || (profile.user_type === "VETERAN" ? "Veteran" : "Challenger"))}`
      : `http://localhost:3000/share/${profile.wallet_address}`;

  const tweetText = profile.user_type === "VETERAN"
    ? `I traded ${formatVolume(profile.polymarket_volume_usd)} on Prediction Apps. Now I'm farming STREAK. ${
        profile.assigned_aura === "GOLDEN_FIRE" ? "GOD MODE Active. " : ""
      }#Streak ${shareUrl}`
    : `I'm skipping the legacy platforms. I just claimed my Early Pioneer Bonus on STREAK. #Streak ${shareUrl}`;

  const handleTweet = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
    setShowInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tweetUrl.trim()) {
      setError("Please paste your tweet URL");
      return;
    }

    // Basic URL validation
    const normalizedUrl = tweetUrl.split("?")[0].trim();
    if (!normalizedUrl.includes("twitter.com") && !normalizedUrl.includes("x.com")) {
      setError("Please enter a valid Twitter/X URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/backend/v1/account/genesis/social/tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          wallet_address: profile.wallet_address,
          tweet_url: normalizedUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedProfile = {
          ...profile,
          social_xp: 500,
          total_xp: profile.genesis_xp + profile.alliance_xp + 500,
          twitter_shared: true,
        };
        onComplete(updatedProfile);
      } else {
        setError(data.error || "Failed to verify tweet");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/80 border-2 border-blue-500/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🐦</span>
        <h2 className="text-2xl font-bold text-white">Social Quest</h2>
        <span className="ml-auto px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 text-sm font-bold">
          +500 XP
        </span>
      </div>

      <p className="text-gray-400 mb-6">
        Share your Genesis profile on Twitter/X to earn bonus XP and spread the word.
      </p>

      {!showInput ? (
        <button
          onClick={handleTweet}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:scale-[1.02] transition-transform duration-200 hover:shadow-2xl hover:shadow-blue-500/50"
        >
          Share on X & Earn +500 XP →
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Paste Your Tweet URL
            </label>
            <input
              type="url"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://twitter.com/your_username/status/..."
              required
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-blue-500/50"
          >
            {isSubmitting ? "Verifying..." : "Claim +500 XP"}
          </button>

          <button
            type="button"
            onClick={handleTweet}
            className="w-full text-blue-400 text-sm hover:underline"
          >
            Tweet again
          </button>
        </form>
      )}

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
      >
        <h4 className="text-sm font-semibold text-blue-400 mb-2">
          Requirements:
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Tweet must contain #Streak hashtag</li>
          <li>• Tweet must contain your referral code</li>
          <li>• One-time bonus (500 XP)</li>
          <li>• Tweet URL must be unique</li>
        </ul>
      </motion.div>
    </div>
  );
}
