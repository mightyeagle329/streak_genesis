import { NextRequest, NextResponse } from "next/server";
import { saveProfile } from "@/lib/database";

const THE_GRAPH_API_KEY = "06fa2f6386af468ecdd4be9ec45650f1";
const SUBGRAPH_URL = `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/81Dm16JjuFSrqz813HysXoUPvzE7fsfPk2RTf66nyC`;

function generateRefCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function calculateXP(volumeUSD: number): number {
  let xp = 1000; // Welcome bonus
  let remaining = volumeUSD;

  // Tier 1 ($0 - $10,000): 10:1 ratio
  const tier1 = Math.min(remaining, 10000);
  xp += tier1 / 10;
  remaining -= tier1;

  // Tier 2 ($10,001 - $50,000): 20:1 ratio
  if (remaining > 0) {
    const tier2 = Math.min(remaining, 40000);
    xp += tier2 / 20;
    remaining -= tier2;
  }

  // Tier 3 ($50,001+): 50:1 ratio (capped at $1M)
  if (remaining > 0) {
    const tier3 = Math.min(remaining, 950000);
    xp += tier3 / 50;
  }

  return Math.floor(xp);
}

function getAuraAndRank(volumeUSD: number): { aura: string; rank: string } {
  if (volumeUSD >= 25000) {
    return { aura: "GOLDEN_FIRE", rank: "PRO" };
  } else if (volumeUSD >= 1000) {
    return { aura: "ORANGE_FIRE", rank: "GRINDER" };
  } else {
    return { aura: "GREY_BORDER", rank: "NOVICE" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const cleanAddress = walletAddress.toLowerCase();
    
    console.log("\n======================================================");
    console.log("🔍 API: Indexing wallet:", cleanAddress);
    console.log("======================================================");

    // Query The Graph for Polymarket volume
    const query = `
      query {
        account(id: "${cleanAddress}") {
          collateralVolume
        }
      }
    `;

    const response = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const jsonResponse = await response.json();

    let volumeUSD = 0;

    if (
      jsonResponse.data &&
      jsonResponse.data.account &&
      jsonResponse.data.account.collateralVolume
    ) {
      // Polymarket uses 6 decimals for USDC
      volumeUSD = parseFloat(jsonResponse.data.account.collateralVolume) / 1000000;
      console.log("✅ Volume fetched:", volumeUSD.toLocaleString("en-US", { style: "currency", currency: "USD" }));
    } else {
      console.log("⚠️  No Polymarket history found");
    }

    const userType = volumeUSD === 0 ? "CHALLENGER" : "VETERAN";
    const genesisXP = calculateXP(volumeUSD);
    const { aura, rank } = getAuraAndRank(volumeUSD);
    
    console.log("🎯 Calculated XP:", genesisXP.toLocaleString());
    console.log("🔮 Aura:", aura, "| Rank:", rank);
    console.log("======================================================\n");

    const profile = {
      wallet_address: cleanAddress,
      user_type: userType,
      polymarket_volume_usd: volumeUSD,
      genesis_xp: genesisXP,
      alliance_xp: 0,
      social_xp: 0,
      total_xp: genesisXP,
      is_xp_locked: true,
      assigned_aura: aura,
      assigned_rank: rank,
      ref_code: generateRefCode(),
      twitter_shared: false,
      invited_by: referralCode || null,
      email: null,
      email_verified: false,
      verification_code: null,
    };

    // CRITICAL: Save profile to shared database so it can be found later
    saveProfile(cleanAddress, profile);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error indexing volume:", error);
    return NextResponse.json(
      { error: "Failed to index volume" },
      { status: 500 }
    );
  }
}
