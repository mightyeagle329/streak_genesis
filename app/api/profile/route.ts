import { NextRequest, NextResponse } from "next/server";
import { getProfile, mockDatabase, saveProfile, updateProfile } from "@/lib/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const wallet = searchParams.get("wallet")?.toLowerCase();

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  // Check if profile exists
  const profile = mockDatabase.get(wallet);
  
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, ...data } = body;

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const normalizedWallet = wallet_address.toLowerCase();

    // Store in shared database
    const profile = {
      wallet_address: normalizedWallet,
      ...data,
    };
    saveProfile(normalizedWallet, profile);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, ...updates } = body;

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const normalizedWallet = wallet_address.toLowerCase();
    
    const updated = updateProfile(normalizedWallet, updates);

    if (!updated) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
