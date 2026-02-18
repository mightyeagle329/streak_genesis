// Shared mock database - all API routes import from here
// In production, replace this with actual PostgreSQL connection

export const mockDatabase = new Map<string, any>();

// Helper functions
export function getProfile(walletAddress: string) {
  return mockDatabase.get(walletAddress.toLowerCase());
}

export function saveProfile(walletAddress: string, profile: any) {
  mockDatabase.set(walletAddress.toLowerCase(), profile);
}

export function updateProfile(walletAddress: string, updates: any) {
  const existing = getProfile(walletAddress);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  saveProfile(walletAddress, updated);
  return updated;
}

export function getAllProfiles() {
  return Array.from(mockDatabase.entries());
}
