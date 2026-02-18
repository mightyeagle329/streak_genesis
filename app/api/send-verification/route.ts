import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, validateEmail } from "@/lib/utils";
import { getProfile, saveProfile, getAllProfiles } from "@/lib/database";

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock email sending (replace with real service like SendGrid, Resend, etc.)
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  console.log("=".repeat(60));
  console.log("📧 EMAIL VERIFICATION CODE");
  console.log("=".repeat(60));
  console.log(`To: ${email}`);
  console.log(`Code: ${code}`);
  console.log("=".repeat(60));
  console.log("\n⚠️  DEVELOPMENT MODE: Check console for code");
  console.log("In production, this will send a real email\n");
  
  // In production, use a service like:
  // - SendGrid: https://sendgrid.com/
  // - Resend: https://resend.com/
  // - AWS SES: https://aws.amazon.com/ses/
  // - Mailgun: https://www.mailgun.com/
  
  return true; // Simulate success
}

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

    // Check if email already exists (for another wallet)
    for (const [wallet, profile] of getAllProfiles()) {
      if (
        wallet !== normalizedWallet &&
        profile.email &&
        normalizeEmail(profile.email) === normalizedEmail
      ) {
        return NextResponse.json(
          { error: "Email already registered to another wallet" },
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

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store temporarily (expires in 10 minutes)
    const updatedProfile = {
      ...profile,
      pending_email: normalizedEmail,
      verification_code: verificationCode,
      verification_code_expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    saveProfile(normalizedWallet, updatedProfile);

    // Send email (mock for now)
    const emailSent = await sendVerificationEmail(normalizedEmail, verificationCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
