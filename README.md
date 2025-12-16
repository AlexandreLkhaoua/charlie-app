# Charlie AI - Wealth Management Copilot

**Charlie** est un copilote IA de gestion de patrimoine qui transforme la façon dont les investisseurs comprennent et gèrent leur portefeuille. Conçu pour les particuliers et les conseillers en gestion de patrimoine, Charlie offre des analyses personnalisées, une évaluation des risques et des simulations de scénarios basées sur l'intelligence artificielle.

---

## 🎯 Vision Produit

Charlie répond à un problème simple : **les investisseurs particuliers n'ont pas accès aux outils d'analyse sophistiqués des professionnels**. Notre solution combine :

- **Données consolidées** : Toutes les positions dans une vue unique
- **Intelligence contextuelle** : Analyses personnalisées selon VOS positions
- **Langage naturel** : Posez des questions comme à un conseiller humain
- **Proactivité** : Alertes sur les risques avant qu'ils ne deviennent des problèmes

---

## 🛠️ Stack Technique (2025)

| Catégorie | Technologies |
|-----------|--------------|
| **Frontend** | React 19, TypeScript 5.7, Next.js 15 |
| **UI** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **State** | TanStack Query v5, Zustand |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Animations** | Framer Motion |

### Caractéristiques techniques
- ⚡ **Turbopack** pour un dev server ultra-rapide
- 🎨 **CSS-first** Tailwind v4 (configuration dans CSS)
- 🔒 **Type-safe** avec TypeScript strict
- 📦 **Tree-shaking optimisé** pour des bundles légers
- 🌙 **Dark mode** natif (préférence système)
- 📱 **Mobile-first** responsive design

---

## 📱 Fonctionnalités

### 1. Dashboard (Vue d'ensemble)
> **Page** : `/demo/dashboard`

Le tableau de bord central qui donne une vue instantanée de la santé du portefeuille :

- **Valeur totale** et performance (P&L en € et %)
- **Nombre de positions** et top holding
- **Concentration** (poids du top 1, 5, 10)
- **Alertes risques** avec niveau de sévérité
- **Actualités récentes** impactant le portefeuille
- **Navigation rapide** vers les 4 piliers

---

### 2. Portfolio (Analyse détaillée)
> **Page** : `/demo/portfolio`

Analyse approfondie de la composition du portefeuille :

- **Liste des positions** triées par poids
  - Ticker, nom, valeur de marché
  - P&L par position (€ et %)
  - Poids dans le portefeuille
  
- **Allocations par catégorie** (barres visuelles)
  - Par classe d'actifs (Actions, Obligations, ETF, Crypto, Cash)
  - Par devise (EUR, USD, GBP, CHF)
  - Par région géographique (Europe, Amérique du Nord, Asie, Émergents)

- **Analyse de concentration**
  - Top 1 / 5 / 10 positions en %
  - Identification des sur-pondérations

- **CTA vers le Copilot** pour des questions personnalisées

---

### 3. Risk Analysis (Gestion des risques)
> **Page** : `/demo/risks`

Identification proactive des vulnérabilités :

- **Flags de risque** avec 3 niveaux de sévérité
  - 🔴 High : Action recommandée immédiate
  - 🟡 Medium : À surveiller
  - 🟢 Low : Information

- **Types de risques détectés** :
  - Concentration excessive (>15% sur une position)
  - Exposition devise non couverte
  - Surpondération sectorielle (ex: >40% tech)
  - Absence de diversification géographique
  - Positions illiquides

- **Recommandations** pour chaque risque identifié

---

### 4. Scenarios (Simulations de sensibilité)
> **Page** : `/demo/scenarios`

Stress-tests pour anticiper l'impact d'événements de marché :

- **Scénarios prédéfinis** :
  - 📉 Crash équité (-20% sur les actions)
  - 📈 Hausse des taux (+100bps)
  - 💶 EUR/USD -10%
  - 🏦 Crise bancaire
  - 🛢️ Choc pétrolier

- **Pour chaque scénario** :
  - Impact estimé en €
  - Impact en % du portefeuille
  - Positions les plus affectées
  - Explication de la méthodologie

- **Vue comparative** de tous les scénarios

---

### 5. Market News (Actualités & Impact)
> **Page** : `/demo/news`

Flux d'actualités financières avec analyse d'impact personnalisée :

- **Liste des news** avec métadonnées
  - Source, date de publication
  - Tags/catégories
  - Résumé

- **Analyse d'impact** (unique à Charlie) :
  - Score d'impact global (-5 à +5)
  - Positions affectées identifiées
  - Explication du mécanisme d'impact
  - Impact estimé en € sur le portefeuille

- **Traduction** EN ↔ FR intégrée

- **CTA** : "Demander à Charlie" pour approfondir

---

### 6. Charlie Copilot (Chat IA)
> **Page** : `/demo/chat`

Interface conversationnelle pour interagir avec le portefeuille :

- **Questions en langage naturel** :
  - "Quelle est mon exposition au secteur tech ?"
  - "Comment réagit mon portefeuille à une hausse des taux ?"
  - "Dois-je m'inquiéter de cette news sur Apple ?"

- **Réponses structurées** (pas de texte brut) :
  - **Summary** : Résumé en 2 phrases
  - **Key Numbers** : 3 métriques clés avec preuves
  - **Interpretation** : Explication détaillée
  - **Actions possibles** : 2 pistes de réflexion (pas de conseil d'achat/vente)
  - **Données manquantes** : Ce qui améliorerait l'analyse
  - **Niveau de confiance** : Low / Medium / High
  - **Disclaimers** : Avertissements réglementaires

- **Quick Prompts** : Suggestions de questions fréquentes

- **Contexte automatique** : Le copilot connaît vos positions, allocations, risques

---

### 7. Profile (Personnalisation)
> **Page** : `/demo/profile`

Configuration du profil investisseur pour personnaliser les réponses :

- **Informations personnelles** : Nom d'affichage
- **Expérience investissement** : Débutant / Intermédiaire / Avancé
- **Horizon d'investissement** : <1an / 1-5ans / 5-10ans / >10ans
- **Tolérance au risque** : Conservateur / Modéré / Dynamique / Agressif
- **Objectifs** : Retraite, Achat immobilier, Éducation enfants, etc.
- **Préférences** : Secteurs exclus (tabac, armes, fossiles)

Ces informations sont utilisées par le Copilot pour adapter le ton et les recommandations.

---

## 🏗️ Architecture

### Pattern Data Provider

Toutes les données passent par une interface `DataProvider` :

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

**Implémentations** :
- `mockProvider` : Données simulées (actuel)
- `hybridProvider` : Mock data + OpenAI pour le chat
- `apiProvider` : Backend réel (à venir)

### Portefeuilles démo

Trois profils disponibles pour tester :
| Profil | Style | Caractéristiques |
|--------|-------|------------------|
| **Prudent** | Conservateur | 60% obligations, EUR only, faible volatilité |
| **Balanced** | Équilibré | 50/50 actions/obligations, diversifié devises |
| **Aggressive** | Dynamique | 80% actions, tech heavy, crypto, USD exposure |

---

## 📁 Structure du projet

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Landing page + waitlist
│   ├── layout.tsx             # Root layout (fonts, providers)
│   ├── globals.css            # Tailwind v4 CSS config
│   ├── api/
│   │   └── copilot/route.ts   # API OpenAI Structured Outputs
│   └── demo/
│       ├── layout.tsx         # App shell (sidebar + topbar)
│       ├── dashboard/         # Vue d'ensemble
│       ├── portfolio/         # Détail positions
│       ├── risks/             # Analyse risques
│       ├── scenarios/         # Stress tests
│       ├── news/              # Actualités + impact
│       ├── chat/              # Copilot IA
│       └── profile/           # Paramètres utilisateur
│
├── components/
│   ├── ui/                    # shadcn/ui (Button, Card, Input...)
│   ├── layout/                # AppShell, Sidebar, Topbar, BottomTabBar
│   ├── chat/                  # ChatWindow, ChatInput, QuickPrompts
│   ├── news/                  # NewsList, NewsDetail, ImpactPanel
│   ├── copilot/               # CopilotAnswerCard (réponses structurées)
│   ├── motion/                # Composants animés (Framer Motion)
│   ├── icons/                 # Export Lucide React
│   └── providers/             # QueryProvider, PortfolioProvider, ProfileProvider
│
├── lib/
│   ├── utils.ts               # cn(), formatCurrency(), formatPercent()
│   ├── animations.ts          # Variants Framer Motion
│   ├── dataProvider.ts        # Interface DataProvider
│   ├── stores/                # Zustand stores (app, chat, notifications)
│   ├── hooks/                 # useQueries (TanStack Query hooks)
│   ├── validation/            # Schémas Zod
│   ├── copilot/               # System prompt, schema OpenAI
│   ├── mock/                  # mockProvider, hybridProvider, data.ts
│   └── profile/               # profileStore (localStorage)
│
└── types/
    ├── portfolio.ts           # Portfolio, Position
    ├── analytics.ts           # AnalyticsOutput, Allocation, Flag
    ├── news.ts                # NewsItem, NewsImpactPack
    └── chat.ts                # ChatMessage, ChatContext
```

---

## 🚀 Quick Start

```bash
# Installation
npm install

# Développement (Turbopack)
npm run dev

# Type check
npm run type-check

# Build production
npm run build

# Démarrer en prod
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🔜 Roadmap

### Phase 1 - MVP (Actuel)
- [x] Dashboard avec 4 piliers
- [x] Analyse de portefeuille
- [x] Gestion des risques
- [x] Scénarios de sensibilité
- [x] News avec impact
- [x] Chat Copilot structuré
- [x] Profil utilisateur

### Phase 2 - Intégration
- [ ] Connexion backend réel (API REST/GraphQL)
- [ ] Authentification (NextAuth / Clerk)
- [ ] Import portefeuille (CSV, broker APIs)
- [ ] News API temps réel

### Phase 3 - Intelligence
- [ ] RAG sur documentation financière
- [ ] Alertes push personnalisées
- [ ] Comparaison avec benchmarks
- [ ] Backtesting des scénarios

### Phase 4 - Scale
- [ ] Multi-utilisateurs
- [ ] Multi-portefeuilles
- [ ] Export PDF des analyses
- [ ] API publique pour conseillers

---

## ⚠️ Disclaimers

- **Mode Démo** : Toutes les données sont simulées
- **Pas de conseil** : Charlie ne fournit pas de conseils d'investissement
- **Usage éducatif** : Application à but démonstratif uniquement

---

## 📄 License

Private - All rights reserved.
