"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Landing } from "@/components/Landing";
import { IndexingAnimation } from "@/components/IndexingAnimation";
import { VolumeReveal } from "@/components/VolumeReveal";
import { EmailGate } from "@/components/EmailGate";
import { Dashboard } from "@/components/Dashboard";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { WalletButton } from "@/components/WalletButton";

export type UserProfile = {
  wallet_address: string;
  user_type: "VETERAN" | "CHALLENGER";
  polymarket_volume_usd: number;
  genesis_xp: number;
  alliance_xp: number;
  social_xp: number;
  total_xp: number;
  is_xp_locked: boolean;
  assigned_aura: string;
  assigned_rank: string;
  ref_code: string;
  twitter_shared: boolean;
  invited_by?: string;
  email?: string;
};

export type FlowStep = "landing" | "indexing" | "reveal" | "email" | "dashboard";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<FlowStep>("landing");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // CRITICAL: Capture referral code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    
    if (ref) {
      // Save to localStorage to survive Web3 wallet redirects
      localStorage.setItem("streak_referral", ref);
      setReferralCode(ref);
    } else {
      // Check if already stored
      const stored = localStorage.getItem("streak_referral");
      if (stored) {
        setReferralCode(stored);
      }
    }
  }, []);

  // Handle wallet connection state changes
  useEffect(() => {
    if (isConnected && address && currentStep === "landing") {
      handleWalletConnected(address);
    }
    
    // CRITICAL: Reset to landing if wallet disconnected
    if (!isConnected && currentStep !== "landing") {
      setCurrentStep("landing");
      setUserProfile(null);
    }
  }, [isConnected, address, currentStep]);

  const handleWalletConnected = async (walletAddress: string) => {
    try {
      setError(null); // Clear any previous errors
      
      // Check if user already exists in database
      const checkResponse = await fetch(`/api/profile?wallet=${walletAddress.toLowerCase()}`);
      
      if (checkResponse.ok) {
        const existingProfile = await checkResponse.json();
        
        // Route based on existing state
        if (existingProfile.email) {
          // User is complete, go straight to dashboard
          setUserProfile(existingProfile);
          setCurrentStep("dashboard");
        } else {
          // User exists but no email, go to email gate
          setUserProfile(existingProfile);
          setCurrentStep("email");
        }
      } else {
        // New user - start indexing flow
        setCurrentStep("indexing");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setError("Failed to connect. Please try again.");
      // On error, stay on landing to allow retry
      setCurrentStep("landing");
    }
  };

  const handleIndexingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep("reveal");
  };

  const handleRevealComplete = () => {
    setCurrentStep("email");
  };

  const handleEmailSubmitted = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setCurrentStep("dashboard");
  };

  // Manual reset function
  const handleReset = () => {
    setCurrentStep("landing");
    setUserProfile(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundEffects />
      
      {/* Error notification */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md px-6 py-4 bg-red-500/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-red-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Connection Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-white/70 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Wallet button - shows when connected */}
      <div className="fixed top-4 right-4 z-50">
        <WalletButton />
      </div>
      
      {currentStep === "landing" && (
        <Landing referralCode={referralCode} />
      )}
      
      {currentStep === "indexing" && address && (
        <IndexingAnimation 
          walletAddress={address} 
          referralCode={referralCode}
          onComplete={handleIndexingComplete} 
        />
      )}
      
      {currentStep === "reveal" && userProfile && (
        <VolumeReveal 
          profile={userProfile} 
          onContinue={handleRevealComplete} 
        />
      )}
      
      {currentStep === "email" && userProfile && (
        <EmailGate 
          profile={userProfile} 
          onComplete={handleEmailSubmitted} 
        />
      )}
      
      {currentStep === "dashboard" && userProfile && (
        <Dashboard profile={userProfile} />
      )}
    </main>
  );
}
