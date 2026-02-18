import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile, getAllProfiles } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, verificationCode } = await request.json();

    if (!walletAddress || !verificationCode) {
      return NextResponse.json(
        { error: "Wallet address and verification code required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();

    // Get existing profile
    const profile = getProfile(normalizedWallet);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Check if code exists
    if (!profile.verification_code || !profile.pending_email) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if code expired
    if (Date.now() > profile.verification_code_expires) {
      return NextResponse.json(
        { error: "Verification code expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify code
    if (profile.verification_code !== verificationCode) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Code is valid - update profile
    const updatedProfile = {
      ...profile,
      email: profile.pending_email,
      email_verified: true,
      verification_code: null,
      verification_code_expires: null,
      pending_email: null,
    };

    // Handle referral commission if applicable
    if (profile.invited_by && profile.genesis_xp > 1000) {
      // Find inviter
      for (const [wallet, inviterProfile] of getAllProfiles()) {
        if (inviterProfile.ref_code === profile.invited_by) {
          // Calculate 10% commission on VOLUME XP ONLY (exclude welcome bonus)
          const volumeXP = profile.genesis_xp - 1000;
          const commission = Math.floor(volumeXP * 0.1);

          inviterProfile.alliance_xp += commission;
          inviterProfile.total_xp =
            inviterProfile.genesis_xp +
            inviterProfile.alliance_xp +
            inviterProfile.social_xp;

          saveProfile(wallet, inviterProfile);
          break;
        }
      }
    }

    saveProfile(normalizedWallet, updatedProfile);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
