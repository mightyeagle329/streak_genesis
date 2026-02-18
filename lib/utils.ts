import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRefCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if backend response is successful
export function isBackendSuccess(data: any): boolean {
  return data && (data.success === true || data.wallet_address || data.genesis_xp);
}

export function formatVolume(volume: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(volume);
}

export function formatXP(xp: number): string {
  return new Intl.NumberFormat("en-US").format(Math.floor(xp));
}

export function getAuraDisplay(aura: string): { label: string; color: string; emoji: string } {
  switch (aura) {
    case "GOLDEN_FIRE":
      return { label: "God Mode Unlocked", color: "gold-border", emoji: "🔥" };
    case "ORANGE_FIRE":
      return { label: "Grinder", color: "orange-border", emoji: "⚡" };
    default:
      return { label: "Novice", color: "grey-border", emoji: "🌑" };
  }
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function normalizeEmail(email: string): string {
  email = email.toLowerCase().trim();
  
  // Handle Gmail aliases (remove +alias and dots)
  if (email.includes("@gmail.com")) {
    const [local, domain] = email.split("@");
    const normalized = local.replace(/\+.*/, "").replace(/\./g, "");
    return `${normalized}@${domain}`;
  }
  
  return email;
}
