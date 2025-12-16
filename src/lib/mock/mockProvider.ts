import { DataProvider } from '../dataProvider';
import {
  Portfolio,
  PortfolioProfile,
  AnalyticsOutput,
  NewsItem,
  NewsImpactPack,
  ChatMessage,
  ChatContext,
} from '@/types';
import {
  demoPortfolios,
  demoAnalytics,
  demoNews,
  generateNewsImpact,
} from './data';

// Simulated delay to mimic API calls
const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Chat Response Generator
 * 
 * Generates deterministic, contextual responses based on:
 * - User message content
 * - Portfolio data
 * - Analytics data
 * - Selected news (optional)
 */
function mockChatRespond(
  messages: ChatMessage[],
  context: ChatContext
): ChatMessage {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUserMessage?.content.toLowerCase() || '';
  const portfolio = context.portfolio;
  const analytics = context.analytics;

  // Determine question type
  let responseType: 'exposure' | 'risk' | 'scenario' | 'general' = 'general';
  if (userText.includes('exposé') || userText.includes('exposure') || userText.includes('allocation')) {
    responseType = 'exposure';
  } else if (userText.includes('risque') || userText.includes('risk') || userText.includes('flag')) {
    responseType = 'risk';
  } else if (userText.includes('taux') || userText.includes('rate') || userText.includes('scénario') || userText.includes('scenario') || userText.includes('impact')) {
    responseType = 'scenario';
  }

  // Generate response based on type
  let response: ChatMessage;
  const timestamp = new Date().toISOString();
  const id = `msg-${Date.now()}`;

  switch (responseType) {
    case 'exposure':
      const topAllocation = analytics?.allocations_by_asset_class[0];
      const topPosition = analytics?.concentration.top_positions[0];
      const fxExposure = analytics?.fx_exposure.find((f) => f.currency !== 'EUR');
      
      response = {
        id,
        role: 'assistant',
        content: `Voici une analyse de vos principales expositions.`,
        timestamp,
        legacyStructured: {
          tldr: `Votre portefeuille est principalement exposé aux ${topAllocation?.category || 'actions'} (${topAllocation?.weight_percent.toFixed(1)}%) avec une concentration significative sur ${topPosition?.name || 'vos principales positions'}.`,
          bullets: [
            `Classe d'actif dominante: ${topAllocation?.category} à ${topAllocation?.weight_percent.toFixed(1)}%`,
            `Top position: ${topPosition?.name} (${topPosition?.ticker}) représente ${topPosition?.weight_percent.toFixed(1)}% du portefeuille`,
            `Exposition devise: ${fxExposure ? `${fxExposure.weight_percent.toFixed(1)}% en ${fxExposure.currency}` : '100% EUR - pas d\'exposition devise étrangère'}`,
            `Concentration top 5: ${analytics?.concentration.top5_weight.toFixed(1)}% du portefeuille total`,
          ],
          actions: [
            'Revoir la diversification si une position dépasse 20% du portefeuille',
            'Considérer un hedge de change si l\'exposition USD dépasse 30%',
          ],
          data_points: [
            { label: 'Valeur totale', value: `€${portfolio?.total_value_eur.toLocaleString()}` },
            { label: 'Positions', value: `${portfolio?.position_count}` },
          ],
        },
      };
      break;

    case 'risk':
      const flags = analytics?.flags || [];
      const highFlags = flags.filter((f) => f.severity === 'high');
      const mediumFlags = flags.filter((f) => f.severity === 'medium');
      
      response = {
        id,
        role: 'assistant',
        content: `Voici les principaux risques identifiés dans votre portefeuille.`,
        timestamp,
        legacyStructured: {
          tldr: `${highFlags.length} risque(s) élevé(s) et ${mediumFlags.length} risque(s) modéré(s) détecté(s). ${highFlags.length > 0 ? 'Action recommandée.' : 'Situation sous contrôle.'}`,
          bullets: flags.slice(0, 4).map((flag) => {
            const severity = flag.severity === 'high' ? '[ÉLEVÉ]' : flag.severity === 'medium' ? '[MODÉRÉ]' : '[FAIBLE]';
            return `${severity} ${flag.title}: ${flag.explanation}`;
          }),
          actions: flags
            .filter((f) => f.recommendation)
            .slice(0, 2)
            .map((f) => f.recommendation!),
          data_points: [
            { label: 'Risques élevés', value: `${highFlags.length}` },
            { label: 'Risques modérés', value: `${mediumFlags.length}` },
          ],
        },
      };
      break;

    case 'scenario':
      const rateCut = analytics?.scenarios.rate_cut;
      const equityCrash = analytics?.scenarios.equity_crash;
      const usdMove = analytics?.scenarios.usd_depreciation;
      
      response = {
        id,
        role: 'assistant',
        content: `Voici comment différents scénarios de marché impacteraient votre portefeuille.`,
        timestamp,
        legacyStructured: {
          tldr: `Une baisse des taux de 50bps aurait un impact de ${rateCut?.impact_percent.toFixed(1)}% (${rateCut?.impact_percent && rateCut.impact_percent > 0 ? '+' : ''}€${rateCut?.impact_eur.toLocaleString()}) sur votre portefeuille.`,
          bullets: [
            `Baisse des taux (-50bps): ${rateCut?.impact_percent.toFixed(1)}% | €${rateCut?.impact_eur.toLocaleString()}`,
            `Hausse des taux (+50bps): ${analytics?.scenarios.rate_hike.impact_percent.toFixed(1)}% | €${analytics?.scenarios.rate_hike.impact_eur.toLocaleString()}`,
            `Crash actions (-20%): ${equityCrash?.impact_percent.toFixed(1)}% | €${equityCrash?.impact_eur.toLocaleString()}`,
            `USD -10%: ${usdMove?.impact_percent.toFixed(1)}% | €${usdMove?.impact_eur.toLocaleString()}`,
          ],
          actions: [
            portfolio?.profile === 'aggressive' 
              ? 'Portefeuille agressif: sensibilité élevée aux marchés actions'
              : 'Allocation prudente: meilleure résistance aux chocs',
            'Les scénarios sont des estimations basées sur les corrélations historiques',
          ],
          data_points: [
            { label: 'Profil', value: portfolio?.profile || 'N/A' },
            { label: 'Impact max simulé', value: `€${Math.abs(equityCrash?.impact_eur || 0).toLocaleString()}` },
          ],
        },
      };
      break;

    default:
      response = {
        id,
        role: 'assistant',
        content: `Je suis votre copilot portfolio. Je peux vous aider à comprendre vos expositions, vos risques, et simuler l'impact de scénarios de marché sur votre portefeuille.`,
        timestamp,
        legacyStructured: {
          tldr: `Votre portefeuille "${portfolio?.name}" vaut €${portfolio?.total_value_eur.toLocaleString()} avec un P&L de ${portfolio?.total_pnl_percent.toFixed(1)}%.`,
          bullets: [
            `${portfolio?.position_count} positions dans votre portefeuille`,
            `Profil: ${portfolio?.profile}`,
            `Performance: ${portfolio?.total_pnl_percent.toFixed(1)}% (€${portfolio?.total_pnl_eur.toLocaleString()})`,
          ],
          actions: [
            'Posez-moi des questions sur vos expositions',
            'Demandez-moi d\'analyser l\'impact des news sur votre portefeuille',
          ],
        },
      };
  }

  return response;
}

/**
 * Mock Translation Function
 * 
 * Simulates translation by adding language prefix and slight modifications
 */
function mockTranslate(text: string, to: 'EN' | 'FR'): string {
  if (to === 'EN') {
    // Simple mock: prepend [EN] and return "translated" version
    return `[EN] ${text
      .replace(/taux/gi, 'rates')
      .replace(/portefeuille/gi, 'portfolio')
      .replace(/risque/gi, 'risk')
      .replace(/exposition/gi, 'exposure')
      .replace(/actions/gi, 'equities')
      .replace(/obligations/gi, 'bonds')}`;
  } else {
    // French "translation"
    return `[FR] ${text
      .replace(/rates/gi, 'taux')
      .replace(/portfolio/gi, 'portefeuille')
      .replace(/risk/gi, 'risque')
      .replace(/exposure/gi, 'exposition')
      .replace(/equities/gi, 'actions')
      .replace(/bonds/gi, 'obligations')}`;
  }
}

/**
 * MockProvider Implementation
 * 
 * Uses local mock data to simulate backend responses.
 * Replace with ApiProvider when backend is ready.
 */
export const mockProvider: DataProvider = {
  async getPortfolio(profile: PortfolioProfile = 'balanced'): Promise<Portfolio> {
    await simulateDelay();
    return demoPortfolios[profile];
  },

  async getAnalytics(profile: PortfolioProfile = 'balanced'): Promise<AnalyticsOutput> {
    await simulateDelay();
    return demoAnalytics[profile];
  },

  async getNews(): Promise<NewsItem[]> {
    await simulateDelay();
    return demoNews;
  },

  async getNewsById(id: string): Promise<NewsItem | null> {
    await simulateDelay(100);
    return demoNews.find((n) => n.id === id) || null;
  },

  async getNewsImpact(
    newsId: string,
    profile: PortfolioProfile = 'balanced'
  ): Promise<NewsImpactPack> {
    await simulateDelay();
    const portfolio = demoPortfolios[profile];
    const analytics = demoAnalytics[profile];
    return generateNewsImpact(newsId, portfolio, analytics);
  },

  async sendChat(
    messages: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage> {
    await simulateDelay(800); // Longer delay to simulate AI processing
    return mockChatRespond(messages, context);
  },

  async translate(text: string, to: 'EN' | 'FR'): Promise<string> {
    await simulateDelay(200);
    return mockTranslate(text, to);
  },
};

// Export as default provider
export default mockProvider;
