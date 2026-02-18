import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, validateEmail } from "@/lib/utils";
import { getProfile, saveProfile, getAllProfiles } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, email } = await request.json();

    if (!walletAddress || !email) {
      return NextResponse.json(
        { error: "Wallet address and email required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedWallet = walletAddress.toLowerCase();

    // Check if email already exists
    for (const [, profile] of getAllProfiles()) {
      if (profile.email && normalizeEmail(profile.email) === normalizedEmail) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
    }

    // Get existing profile
    const profile = getProfile(normalizedWallet);
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Please reconnect wallet." },
        { status: 404 }
      );
    }

    // Update with email
    const updatedProfile = {
      ...profile,
      email: normalizedEmail,
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
    console.error("Error submitting email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
