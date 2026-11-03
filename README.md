# UniVibe — Student Intelligence Engine

> **"Discover Your Potential. Find Your People. Build Your Future."**

UniVibe is an AI-powered campus engagement and intelligence platform designed **exclusively for university students**. Transforming the PartyRock prototype workflow into a production-grade full-stack web application, UniVibe analyzes a student's interests, skills, academic background, available time, and career goals to generate personalized opportunities, strategic roadmaps, outreach materials, event marketing, and contextual campus guidance.

---

## ⚡ Core Technical Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
- **Backend & APIs**: Next.js Server-side Route Handlers with modular service design.
- **Database**: **Neon Serverless PostgreSQL** via `@neondatabase/serverless` with table auto-initialization, full migrations (`supabase/migrations`), and Row Level Security (RLS). High-fidelity local persistence fallback for zero-friction Demo Mode.
- **AI Infrastructure**:
  - Configurable server-side **Amazon Bedrock** integration (`@aws-sdk/client-bedrock-runtime`).
  - Text generation: Configurable Bedrock model (Anthropic Claude 3.5 Sonnet / Amazon Titan).
  - Image generation: `bedrock-stability.stable-image-core-v1-1` (PartyRock specification) + generative 4:5 vector canvas preview.
  - Transparent **AI Provider Abstraction** (`BedrockProvider` vs `SimulatedAiProvider`).

---

## 🚀 The 8 PartyRock AI Modules

| Module | Name | Key Inputs | Outputs & Capabilities |
| :--- | :--- | :--- | :--- |
| **Module A** | **UniVibe Profile** | Name, Dept, Year, Interests, Skills, Time, Goal, Tone | Archetype, 6 Intelligence Scores (out of 100 with rationales), Ranked Interests, Hidden Strengths, Growth Opportunities, Level-Up Mission. |
| **Module B** | **Match AI** | Complete Profile + Campus Knowledge | 5 ranked campus recommendations, Best Match highlight, verified vs suggested status, 7-Day traction mission, Save & Interest actions. |
| **Module C** | **Gap Analyzer** | UniVibe Profile + Match AI | Student blind spots (what/why/action), missing industry skills, cross-field synergies, Campus FOMO risk index, One Bold Ambitious Move. |
| **Module D** | **Journey AI** | Profile + Match AI | 4-phase execution roadmap (Phase 1: 7d, Phase 2: 30d, Phase 3: 3m, Phase 4: Academic Year), Capstone challenge, interactive milestone checkboxes with persistent progress %. |
| **Module E** | **Outreach Copilot** | Profile + Selected Match + Tone | Validated match outreach: formal email, mobile WhatsApp, short LinkedIn/IG DM, follow-up ping, 3 AI tactics, 1-click copy. |
| **Module F** | **Event Marketing** | Event Name, Category, Audience, Description | Student-accessible promotion: tagline, headline, one-liner, 3 reasons to attend, IG caption, WhatsApp blast, 8–12 hashtags, formal email, campus bulletin notice. |
| **Module G** | **Event Poster** | Event Details + Visual Direction | 4:5 portrait format, futuristic university aesthetic, modern glassmorphism, dedicated metadata layout, download & regenerate. |
| **Module H** | **Campus Concierge** | Contextual Chat + Complete Profile History | Conversational campus advisor with 4-part structured response: Quick Answer, Personalized Insight, What To Do Next, UniVibe Tip. |

---

## 🔒 Security, Integrity & Non-Fabrication Principles

1. **Student-Only Application**: No Organizer role, no Organizer authentication, no Organizer dashboards.
2. **Honest Campus Grounding**: Clearly distinguishes between `VERIFIED` campus records and `SUGGESTED` opportunities. Never invents fake clubs, fake professors, or fake deadlines.
3. **AI Tendencies Notice**: All personality archetypes and scores are transparently labeled as heuristic inferences based on self-reported inputs.
4. **Data Isolation & Purge**: Students have complete control over their records, including 1-click data purging in the Settings panel.

---

## 🛠️ Setup & Environment Configuration

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```env
# Neon Serverless PostgreSQL
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"

# AI Provider ("bedrock" | "simulated")
AI_PROVIDER="simulated"

# AWS Bedrock (Required when AI_PROVIDER="bedrock")
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BEDROCK_TEXT_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
AWS_BEDROCK_IMAGE_MODEL_ID="bedrock-stability.stable-image-core-v1-1"
```

> **Note on Demo Mode**: If `DATABASE_URL` or AWS Bedrock credentials are not configured, UniVibe runs out-of-the-box in **Demo Mode** with persistent local storage and realistic AI responses.

### 3. Build & Run
```bash
# Development mode
npm run dev

# Production build & serve
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Directory Structure

```
├── supabase/
│   ├── migrations/20261103000000_univibe_schema.sql  # Complete PostgreSQL DDL & RLS Policies
│   └── seed.sql                                      # Verified Campus Knowledge Catalog
├── src/
│   ├── app/
│   │   ├── page.tsx                                  # High-impact Landing Page
│   │   ├── onboarding/page.tsx                       # 3-Step Student Profile Onboarding
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                            # Authenticated Sidebar Layout
│   │   │   ├── page.tsx                              # Main Student Intelligence Dashboard
│   │   │   ├── profile/page.tsx                      # Module A: UniVibe Profile & Radars
│   │   │   ├── matches/page.tsx                      # Module B: Opportunity Match AI
│   │   │   ├── gap-analyzer/page.tsx                 # Module C: Opportunity Gap Analyzer
│   │   │   ├── journey/page.tsx                      # Module D: Growth Journey & Milestones
│   │   │   ├── outreach/page.tsx                     # Module E: Outreach Copilot
│   │   │   ├── events/page.tsx                       # Module F & G: Event Marketing & Posters
│   │   │   ├── concierge/page.tsx                    # Module H: Campus Concierge Chat
│   │   │   └── settings/page.tsx                     # Neon DB Status, Profile Edit & Purge
│   │   ├── privacy/page.tsx                          # Student Data & Privacy Policy
│   │   └── api/                                      # Modular Server-side API Endpoints
│   ├── components/
│   │   ├── charts/ScoresChart.tsx                    # Recharts Radar Chart for 6 Scores
│   │   ├── navigation/Sidebar.tsx                    # Responsive Student Sidebar
│   │   ├── navigation/Navbar.tsx                     # Top Bar & Live DB Status
│   │   └── ui/                                       # Buttons, Badges, Cards
│   ├── lib/
│   │   ├── ai/                                       # Bedrock Client, Prompts & Simulated Engine
│   │   ├── db/neon.ts                                # Neon Serverless PostgreSQL Client & DAO
│   │   └── utils.ts
│   └── types/index.ts                                # Core TypeScript Interfaces
└── package.json
```

