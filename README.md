# Streak Genesis - Vampire Attack Campaign

A pre-launch campaign designed to attract Polymarket users by converting their historical trading volume into Streak XP and exclusive Day-1 launch privileges.

## Features

- **Web3 Authentication**: Secure wallet connection using Wagmi v2 + Web3Modal + SIWE
- **Volume Indexing**: Real-time Polymarket volume scanning via The Graph
- **XP Calculation**: Tiered conversion system with hard caps
- **Aura System**: Three tiers (Novice, Grinder, Pro) with visual effects
- **Referral Program**: Alliance system with 10% commission on Volume XP
- **Social Quests**: Twitter/X sharing for bonus XP
- **Gamified UI**: Heavy animations using Framer Motion

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS with custom animations
- **Animation**: Framer Motion
- **Web3**: Wagmi v2, Viem, Web3Modal, SIWE
- **Data**: The Graph (Polymarket Subgraph on Polygon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- WalletConnect Project ID (optional, uses fallback in dev)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and add your WalletConnect Project ID (optional)
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/
│   ├── api/              # API routes (mock database)
│   │   ├── profile/      # User profile CRUD
│   │   ├── index-volume/ # Polymarket volume indexing
│   │   ├── submit-email/ # Email submission & referral logic
│   │   └── submit-tweet/ # Social quest verification
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout with Web3Provider
│   └── page.tsx          # Main app flow orchestration
├── components/           # React components
│   ├── Landing.tsx       # Initial landing page
│   ├── IndexingAnimation.tsx  # Blockchain scanning UI
│   ├── VolumeReveal.tsx  # Volume & XP reveal
│   ├── EmailGate.tsx     # Email capture form
│   ├── Dashboard.tsx     # Main dashboard
│   ├── AuraCard.tsx      # XP & Aura display
│   ├── ReferralSection.tsx    # Alliance referral links
│   ├── SocialQuest.tsx   # Twitter/X quest
│   ├── UnlockWarning.tsx # Day-1 unlock notice
│   └── BackgroundEffects.tsx  # Animated background
└── lib/
    ├── web3-provider.tsx # Wagmi & Web3Modal config
    └── utils.ts          # Utility functions
```

## User Flow

1. **Landing Page**: Captures referral code from URL → localStorage
2. **Wallet Connection**: Web3Modal prompt with SIWE
3. **Routing Logic**: 
   - Existing user with email → Dashboard
   - Existing user without email → Email Gate
   - New user → Indexing
4. **Indexing**: Fetches Polymarket volume from The Graph
5. **Reveal**: Shows volume and calculated XP (locked)
6. **Email Gate**: Captures email, triggers referral commission
7. **Dashboard**: Full profile with XP breakdown, referral link, social quest

## Key Features

### XP Calculation

- Welcome Bonus: 1,000 XP (all users)
- Tier 1 ($0-$10k): 10:1 ratio (10% conversion)
- Tier 2 ($10k-$50k): 20:1 ratio (5% conversion)
- Tier 3 ($50k+): 50:1 ratio (2% conversion)
- Hard Cap: $1M volume (max 23,000 XP)

### Aura Tiers

- **Novice** (< $1k): Grey border, 1.0x multiplier Day-1
- **Grinder** ($1k-$25k): Orange fire, 1.5x multiplier Day-1 (skips 4 days)
- **Pro** ($25k+): Golden fire, 2.0x God Mode Day-1 (instant unlock)

### Referral System

- Each user gets unique ref code
- 10% commission on invited user's Volume XP only
- Commission minted after email submission
- Welcome bonus excluded from commission

### Security

- SIWE for cryptographic wallet proof
- Email normalization (Gmail alias stripping)
- Unique constraints on wallet & email
- Rate limiting on indexer endpoints
- Sybil filter for Challengers ($0 volume)

## API Routes

### POST /api/index-volume
Queries The Graph for Polymarket volume and calculates Genesis profile.

**Request:**
```json
{
  "walletAddress": "0x...",
  "referralCode": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "wallet_address": "0x...",
    "user_type": "VETERAN",
    "polymarket_volume_usd": 50000,
    "genesis_xp": 3500,
    "assigned_aura": "ORANGE_FIRE",
    "assigned_rank": "GRINDER",
    "ref_code": "XYZ789",
    ...
  }
}
```

### POST /api/submit-email
Validates and stores email, triggers referral commission.

### POST /api/submit-tweet
Verifies Twitter/X URL and grants +500 social XP.

## Backend Integration

**Current**: Mock in-memory database for development.

**Production**: Replace mock database with PostgreSQL:
- Use pg or Prisma for database connection
- Implement proper error handling
- Add rate limiting middleware
- Use real email validation service (ZeroBounce, Hunter.io)
- Implement tweet verification via Twitter API

## Environment Variables

```env
# Required for production
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Backend (hardcoded in POC)
THE_GRAPH_API_KEY=06fa2f6386af468ecdd4be9ec45650f1
```

## Production Checklist

- [ ] Replace mock database with PostgreSQL
- [ ] Add proper error logging (Sentry, LogRocket)
- [ ] Implement rate limiting (Redis + Express Rate Limit)
- [ ] Add email validation service integration
- [ ] Implement Twitter API verification
- [ ] Set up analytics (PostHog, Mixpanel)
- [ ] Add SIWE backend verification
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain (genesis.streak.app)
- [ ] Add OG image generation for social sharing
- [ ] Set up monitoring & alerts

## License

Proprietary - Streak Genesis Campaign

## Support

For technical issues, contact the Streak engineering team.
