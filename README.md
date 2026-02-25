# Streak Genesis — Pre-Launch Campaign

A pre-launch web application that authenticates Web3 wallets, queries on-chain Polygon data via an external backend, calculates XP from historical Prediction Apps trading volume, and securely stores leads.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 18, TailwindCSS, Framer Motion |
| Web3 | Wagmi v2, Viem, Web3Modal (AppKit) |
| Auth | SIWE (Sign-In with Ethereum) — per-request message signing |
| Backend | External Rust API (`NEXT_PUBLIC_BACKEND_API_URL`) |
| Fonts | Nekst Bold (local woff2), IBM Plex Sans Condensed (Google Fonts) |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- WalletConnect Project ID — get one free at [cloud.walletconnect.com](https://cloud.walletconnect.com)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required — WalletConnect / AppKit project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Backend API base URL (no trailing slash)
NEXT_PUBLIC_BACKEND_API_URL=http://62.171.153.189:8080
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles, custom animations, font declarations
│   ├── layout.tsx           # Root layout — loads fonts, wraps with Web3Provider
│   └── page.tsx             # Main flow orchestrator (state machine)
├── components/
│   ├── Landing.tsx          # Landing page with wallet connect CTA
│   ├── IndexingAnimation.tsx # SIWE signing + backend indexing UI
│   ├── VolumeReveal.tsx     # Volume & XP reveal (new users only)
│   ├── EmailGate.tsx        # Email capture + OTP verification
│   ├── Dashboard.tsx        # Full Genesis profile dashboard
│   ├── SybilRejection.tsx   # Rejection screen for ineligible wallets
│   ├── WalletButton.tsx     # Connected wallet indicator (top-right)
│   └── BackgroundEffects.tsx # Ambient background layer
├── lib/
│   ├── web3-provider.tsx    # Wagmi + Web3Modal (AppKit) configuration
│   └── utils.ts             # formatXP, formatVolume, generateRefCode, etc.
└── public/
    ├── bg.png               # Background lightning image
    ├── fonts/
    │   └── Nekst Bold.woff2 # Custom display font
    ├── lock.svg
    ├── lock_yellow.svg
    ├── copy.svg
    ├── x.svg
    └── direction.svg
```

---

## User Flow

```
Landing Page
    │  (referral code captured from ?ref= URL param → localStorage)
    ▼
Wallet Connect  (Web3Modal)
    │
    ▼
Indexing Animation
    ├── SIWE message constructed & signed by wallet
    ├── POST /v1/account/genesis  → backend validates, returns profile
    │
    ├── if backend returns email already on record
    │       └──► Dashboard  (skip reveal + email gate)
    │
    ├── if backend returns Sybil/403
    │       └──► Sybil Rejection screen
    │
    └── new user (no email)
            ▼
        Volume Reveal
            ▼
        Email Gate  (send OTP → verify OTP)
            ▼
        Dashboard
```

---

## Authentication (SIWE)

Every backend request is authenticated with a per-request signed message:

```
Streak Genesis wants you to sign in with your Ethereum account:
0x<wallet_address>

By signing this message, you prove ownership of your wallet address.

URI: <origin>
Version: 1
Chain ID: 137
Nonce: <random>
Issued At: <ISO timestamp>
```

**Request body sent to** `POST /v1/account/genesis`:

```json
{
  "wallet_address": "0x...",
  "message": "<full SIWE message string>",
  "signature": "0x...",
  "timestamp": 1700000000000,
  "nonce": "abc123xyz"
}
```

> **Note (testing):** A fixed test wallet address (`0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee`) is currently used for all backend requests regardless of the connected wallet, to enable consistent backend testing.

---

## Backend API Endpoints

All endpoints are relative to `NEXT_PUBLIC_BACKEND_API_URL`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/v1/account/genesis` | Authenticate wallet, index volume, return profile |
| `POST` | `/v1/account/genesis/register` | Send OTP to email address |
| `POST` | `/v1/account/genesis/register/confirm` | Verify OTP and link email to wallet |
| `POST` | `/v1/account/genesis/social/tweet` | Submit tweet URL for +500 Social XP |

### Profile Response Shape (`/v1/account/genesis`)

```json
{
  "wallet_address": "0x...",
  "user_type": "VETERAN",
  "polymarket_volume_usd": 50000,
  "genesis_xp": 3500,
  "alliance_xp": 0,
  "social_xp": 0,
  "total_xp": 3500,
  "is_xp_locked": true,
  "assigned_aura": "ORANGE_FIRE",
  "assigned_rank": "PRO",
  "ref_code": "XYZ789",
  "twitter_shared": false,
  "email": null
}
```

If `email` is non-null in the response, the frontend skips Volume Reveal and Email Gate and goes directly to the Dashboard.

---

## XP Calculation (handled by backend)

| Tier | Volume Range | Rate |
|---|---|---|
| Welcome Bonus | All users | +1,000 XP flat |
| Tier 1 | $0 – $10k | 10:1 (10% of volume) |
| Tier 2 | $10k – $50k | 20:1 (5% of volume) |
| Tier 3 | $50k+ | 50:1 (2% of volume) |
| Hard Cap | $1M+ | Max ~23,000 XP from volume |

---

## Aura Tiers

| Aura | Volume | Day-1 Multiplier |
|---|---|---|
| `GREY_BORDER` | < $1k | 1.0x (standard) |
| `ORANGE_FIRE` | $1k – $25k | 1.5x (skips 4 grind days) |
| `GOLDEN_FIRE` | $25k+ | 2.0x God Mode (instant unlock) |

---

## Referral (Alliance) System

- Every registered user receives a unique `ref_code`.
- Share link format: `<origin>?ref=<code>`
- Referrer earns **10% commission** on the invited user's **Volume XP only** (Welcome Bonus excluded).
- Commission is minted instantly on the referrer's account after the invite completes email verification.
- Max commission per invite: ~2,200 XP (from a $1M whale).

---

## Sybil Protection

The backend returns HTTP `403` or a response body containing sybil-related keywords (`sybil`, `wallet_too_new`, `insufficient gas`, `not_eligible`) for wallets that fail eligibility checks. The frontend detects this and routes to the `SybilRejection` screen instead of showing a generic error.

---

## Cookie Consent

A GDPR-style cookie banner is shown on first visit (bottom-right on desktop, full-width at bottom on mobile). The user's choice (`accepted` / `rejected`) is persisted in `localStorage` under the key `cookie_consent` and the banner is never shown again once dismissed.

---

## Key Design Decisions

- **Fonts**: Nekst Bold (display headings in #FBAC35) and IBM Plex Sans Condensed (all body/UI text). IBM Plex loaded via `next/font/google` as CSS variable `--font-ibm-condensed`.
- **Background**: Single `bg.png` image rotated ~40°, blurred at 72px on interior pages, unblurred on Landing.
- **Animated borders**: CSS `@property` + `::before` pseudo-element for the rotating gradient border on buttons and inputs (`.genesis-btn`, `.genesis-input-wrapper`).
- **Double-invoke guard**: `hasFetched` ref in `IndexingAnimation` prevents React Strict Mode from triggering two simultaneous wallet signature requests.
- **WalletConnect error suppression**: Global `unhandledrejection` handler in `page.tsx` suppresses "Proposal expired" and MetaMask disconnection errors from crashing the Next.js error overlay.

---

## Production Checklist

- [ ] Remove test wallet override in `IndexingAnimation.tsx` (use real `walletAddress`)
- [ ] Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in production environment
- [ ] Set `NEXT_PUBLIC_BACKEND_API_URL` to production backend URL
- [ ] Configure CORS on backend to allow production domain
- [ ] Deploy to Vercel / Netlify
- [ ] Configure custom domain (`genesis.streak.app`)
- [ ] Add OG image (`/public/og.png`) for social sharing previews
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (PostHog / Mixpanel)

---

## License

Proprietary — Streak Genesis Campaign

## Support

For technical issues, contact the Streak engineering team.
