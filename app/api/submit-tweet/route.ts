import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile, getAllProfiles } from "@/lib/database";

function normalizeTweetUrl(url: string): string {
  // Remove query parameters
  const [baseUrl] = url.split("?");
  return baseUrl.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, tweetUrl } = await request.json();

    if (!walletAddress || !tweetUrl) {
      return NextResponse.json(
        { error: "Wallet address and tweet URL required" },
        { status: 400 }
      );
    }

    const normalizedWallet = walletAddress.toLowerCase();
    const normalizedUrl = normalizeTweetUrl(tweetUrl);

    // Validate tweet URL format
    if (
      !normalizedUrl.includes("twitter.com") &&
      !normalizedUrl.includes("x.com")
    ) {
      return NextResponse.json(
        { error: "Invalid Twitter/X URL" },
        { status: 400 }
      );
    }

    // Get existing profile
    const profile = getProfile(normalizedWallet);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if already shared
    if (profile.twitter_shared) {
      return NextResponse.json(
        { error: "Twitter bonus already claimed" },
        { status: 400 }
      );
    }

    // Check if URL already used
    for (const [, existingProfile] of getAllProfiles()) {
      if (existingProfile.submitted_tweet_url === normalizedUrl) {
        return NextResponse.json(
          { error: "This tweet URL has already been used" },
          { status: 400 }
        );
      }
    }

    // Update profile with social XP
    const updatedProfile = {
      ...profile,
      social_xp: 500,
      total_xp: profile.genesis_xp + profile.alliance_xp + 500,
      twitter_shared: true,
      submitted_tweet_url: normalizedUrl,
    };

    saveProfile(normalizedWallet, updatedProfile);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error submitting tweet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
