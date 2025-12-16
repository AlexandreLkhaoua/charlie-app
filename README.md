# Portfolio Copilot - Charlie AI

A modern, AI-powered portfolio analysis dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Features

### Dashboard
- Portfolio overview with key metrics
- Asset allocation breakdown (by class, currency, region)
- Position table with top holdings
- Risk flags and alerts
- Scenario analysis (rate cuts, equity crash, FX movements)

### Market News
- Real-time news feed
- AI-powered impact analysis on your portfolio
- Translation support (EN/FR)
- Affected positions highlighting

### Copilot Chat
- Natural language questions about your portfolio
- Contextual answers based on your exposures and risks
- Quick prompts for common questions
- Structured responses with data points

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   └── demo/              # Demo app pages
│       ├── layout.tsx     # Demo layout with sidebar
│       ├── dashboard/     # Portfolio dashboard
│       ├── news/          # Market news & impact
│       ├── chat/          # Copilot chat
│       └── tools/         # Future tools (placeholder)
├── components/
│   ├── chat/              # Chat-related components
│   ├── layout/            # AppShell, Sidebar, Topbar
│   ├── news/              # News list, detail, impact
│   ├── providers/         # React context providers
│   └── ui/                # Reusable UI components
├── lib/
│   ├── dataProvider.ts    # Data provider interface
│   ├── index.ts           # Provider exports
│   └── mock/
│       ├── data.ts        # Demo data (portfolios, news)
│       └── mockProvider.ts # Mock implementation
└── types/
    ├── analytics.ts       # Analytics types
    ├── chat.ts            # Chat types
    ├── news.ts            # News types
    ├── portfolio.ts       # Portfolio types
    └── index.ts           # Type exports
```

## 🔧 Architecture

### Data Provider Pattern

All data access goes through a `DataProvider` interface:

```typescript
interface DataProvider {
  getPortfolio(profile?: PortfolioProfile): Promise<Portfolio>;
  getAnalytics(profile?: PortfolioProfile): Promise<AnalyticsOutput>;
  getNews(): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem | null>;
  getNewsImpact(newsId: string, profile?: PortfolioProfile): Promise<NewsImpactPack>;
  sendChat(messages: ChatMessage[], context: ChatContext): Promise<ChatMessage>;
  translate(text: string, to: 'EN' | 'FR'): Promise<string>;
}
```

Currently uses `mockProvider` with fake data. To integrate a real backend:

1. Create `lib/apiProvider.ts` implementing `DataProvider`
2. Update `lib/index.ts` to export `apiProvider` instead of `mockProvider`
3. No changes needed to UI components

### Demo Portfolios

Three demo portfolios available:
- **Prudent**: Conservative, bond-heavy, EUR-only
- **Balanced**: Mixed allocation, some USD exposure
- **Aggressive**: Equity-heavy, tech-focused, crypto exposure

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom color palette (primary blue, accent purple)
- Responsive design for desktop and tablet
- Dark sidebar with light content area

## 📝 Notes

- **Demo Mode**: All data is simulated. No real backend calls.
- **AI Simulation**: Chat and translation use deterministic mock functions.
- **Educational Only**: Not investment advice.

## 🔜 Roadmap

- [ ] Real backend integration
- [ ] User authentication
- [ ] Portfolio import (CSV, broker API)
- [ ] Real-time news API
- [ ] LLM integration (OpenAI, Anthropic)
- [ ] Advanced analytics
- [ ] Mobile responsive improvements

## 📄 License

Private - All rights reserved.
