/**
 * Charlie AI System Prompt - Expert Wealth Management
 * 
 * Generates hyper-personalized, actionable insights based on the user's actual portfolio
 * and profile preferences. No generic advice - every response must reference specific 
 * holdings, weights, and numbers, adapted to the user's experience level and preferences.
 */

import type { UserProfile } from '@/lib/profile/profileStore';

export const COPILOT_SYSTEM_PROMPT = `You are Charlie, an elite AI Wealth Management advisor with 20+ years of experience at a top-tier private bank. Your role is to provide sharp, personalized analysis based on the client's actual portfolio data.

## CORE PRINCIPLES

1. **BE SPECIFIC, NOT GENERIC**
   - Never say "consider diversifying" → Say "Your 18.5% AAPL position exceeds prudent single-stock limits of 10%"
   - Never say "rates may impact bonds" → Say "A 50bps rate hike would reduce your €45K bond allocation by approximately €1,800"
   - Always cite the exact ticker, weight, or euro amount from the portfolio

2. **LEAD WITH THE INSIGHT**
   - First sentence = the key takeaway they need to act on
   - No preamble, no "Great question", no filler
   - Get to the point immediately

3. **QUANTIFY EVERYTHING**
   - Every claim must have a number attached
   - Use € amounts when discussing impact (not just percentages)
   - Show the math: "32% US exposure × 10% USD drop = ~3.2% portfolio drag"

4. **PERSONALIZE TO THEIR HOLDINGS**
   - Reference their actual positions by name
   - Compare their allocation to prudent benchmarks
   - Identify concentration risks specific to their portfolio

5. **ACTIONABLE, NOT ACADEMIC**
   - Focus on what they can DO, not what might happen
   - Prioritize actions by impact (highest € impact first)
   - Be clear about trade-offs

## RESPONSE STYLE

- Direct, confident, professional tone
- No emojis, no exclamation marks
- Short sentences, active voice
- Technical terms are fine - your client is sophisticated
- Always ground advice in their specific numbers

## STRICT RULES

- ONLY use data provided in the portfolio context
- NEVER recommend specific buy/sell actions (regulatory compliance)
- ALWAYS include risk disclaimers
- If data is missing, say so explicitly
- Output ONLY valid JSON matching the schema - no markdown, no commentary
- Respond in ENGLISH only

## CONFIDENCE LEVELS

- HIGH: Direct calculation from portfolio data
- MEDIUM: Reasonable inference with stated assumptions  
- LOW: General market context, limited portfolio-specific insight`;

/**
 * Build personalized context from portfolio data and user profile
 * This creates a dense, structured summary the LLM can reference
 */
export function buildUserContext(data: {
  profile?: UserProfile | null;
  portfolio?: {
    name?: string;
    profile?: string;
    total_value_eur?: number;
    total_pnl_eur?: number;
    total_pnl_percent?: number;
    position_count?: number;
    positions?: Array<{
      ticker: string;
      name: string;
      weight_percent: number;
      market_value_eur: number;
      pnl_eur?: number;
      pnl_percent?: number;
      asset_class?: string;
      currency?: string;
      region?: string;
    }>;
  };
  analytics?: {
    concentration?: {
      top1_weight?: number;
      top5_weight?: number;
      top10_weight?: number;
      top_positions?: Array<{ ticker: string; name: string; weight_percent: number }>;
    };
    allocations_by_asset_class?: Array<{ category: string; weight_percent: number }>;
    allocations_by_currency?: Array<{ category: string; weight_percent: number }>;
    allocations_by_region?: Array<{ category: string; weight_percent: number }>;
    fx_exposure?: Array<{ currency: string; weight_percent: number }>;
    flags?: Array<{
      id?: string;
      title: string;
      explanation: string;
      severity: string;
      recommendation?: string;
    }>;
    scenarios?: {
      rate_cut?: { impact_percent: number; impact_eur: number };
      rate_hike?: { impact_percent: number; impact_eur: number };
      equity_crash?: { impact_percent: number; impact_eur: number };
      usd_depreciation?: { impact_percent: number; impact_eur: number };
    } | Array<{
      name: string;
      description?: string;
      impact_percent: number;
      impact_eur: number;
    }>;
  };
  selectedNews?: {
    title?: string;
    summary?: string;
    source?: string;
    published_at?: string;
    tags?: string[];
  };
}): string {
  let context = '## CLIENT PORTFOLIO SNAPSHOT\n';
  
  if (data.portfolio) {
    const p = data.portfolio;
    const pnlSign = (p.total_pnl_percent || 0) >= 0 ? '+' : '';
    
    context += `
**Account:** ${p.name || 'Primary Portfolio'}
**Risk Profile:** ${p.profile || 'Not specified'}
**Total AUM:** €${p.total_value_eur?.toLocaleString() || 'N/A'}
**Unrealized P&L:** €${p.total_pnl_eur?.toLocaleString() || 'N/A'} (${pnlSign}${p.total_pnl_percent?.toFixed(1) || 0}%)
**Position Count:** ${p.position_count || 'N/A'}`;

    if (p.positions && p.positions.length > 0) {
      // Sort by weight and show top holdings with full details
      const sortedPositions = [...p.positions].sort((a, b) => b.weight_percent - a.weight_percent);
      const topPositions = sortedPositions.slice(0, 8);
      
      context += '\n\n## TOP HOLDINGS';
      for (const pos of topPositions) {
        const pnlSign = (pos.pnl_percent || 0) >= 0 ? '+' : '';
        context += `\n  ${pos.ticker}: ${pos.weight_percent.toFixed(1)}% (€${pos.market_value_eur.toLocaleString()}, ${pnlSign}${pos.pnl_percent?.toFixed(1) || 0}% P&L)`;
      }

      // Identify concentration risks
      const concentrationRisks = p.positions.filter(pos => pos.weight_percent > 10);
      if (concentrationRisks.length > 0) {
        context += '\n\n## CONCENTRATION ALERTS';
        context += `\n  Positions exceeding 10%: ${concentrationRisks.map(p => `${p.ticker} at ${p.weight_percent.toFixed(1)}%`).join(', ')}`;
      }
    }
  }

  if (data.analytics) {
    const a = data.analytics;
    
    if (a.concentration) {
      context += '\n\n## CONCENTRATION ANALYSIS';
      context += `\n- Top 1 position: ${a.concentration.top1_weight?.toFixed(1) || 'N/A'}% of portfolio`;
      context += `\n- Top 5 positions: ${a.concentration.top5_weight?.toFixed(1) || 'N/A'}% of portfolio`;
    }

    if (a.allocations_by_asset_class && a.allocations_by_asset_class.length > 0) {
      context += '\n\n## ASSET ALLOCATION';
      for (const alloc of a.allocations_by_asset_class) {
        context += `\n- ${alloc.category}: ${alloc.weight_percent.toFixed(1)}%`;
      }
    }

    // Currency exposure
    const currencyData = a.fx_exposure || a.allocations_by_currency;
    if (currencyData && currencyData.length > 0) {
      context += '\n\n## CURRENCY EXPOSURE';
      for (const curr of currencyData) {
        const currency = 'currency' in curr ? curr.currency : curr.category;
        context += `\n- ${currency}: ${curr.weight_percent.toFixed(1)}%`;
      }
    }

    if (a.allocations_by_region && a.allocations_by_region.length > 0) {
      context += '\n\n## GEOGRAPHIC EXPOSURE';
      for (const region of a.allocations_by_region) {
        context += `\n- ${region.category}: ${region.weight_percent.toFixed(1)}%`;
      }
    }

    if (a.flags && a.flags.length > 0) {
      context += '\n\n## ACTIVE RISK FLAGS';
      for (const flag of a.flags) {
        context += `\n  [${flag.severity.toUpperCase()}] ${flag.title}`;
      }
    }

    // Handle both object and array scenario formats
    if (a.scenarios) {
      context += '\n\n## SCENARIO SENSITIVITIES';
      
      if (Array.isArray(a.scenarios)) {
        for (const s of a.scenarios) {
          const sign = s.impact_percent >= 0 ? '+' : '';
          context += `\n- ${s.name}: ${sign}${s.impact_percent.toFixed(1)}% (€${s.impact_eur.toLocaleString()})`;
        }
      } else {
        const scenarios = a.scenarios;
        if (scenarios.rate_cut) {
          const sign = scenarios.rate_cut.impact_percent >= 0 ? '+' : '';
          context += `\n- Rate cut (-50bps): ${sign}${scenarios.rate_cut.impact_percent.toFixed(1)}% (€${scenarios.rate_cut.impact_eur.toLocaleString()})`;
        }
        if (scenarios.rate_hike) {
          const sign = scenarios.rate_hike.impact_percent >= 0 ? '+' : '';
          context += `\n- Rate hike (+50bps): ${sign}${scenarios.rate_hike.impact_percent.toFixed(1)}% (€${scenarios.rate_hike.impact_eur.toLocaleString()})`;
        }
        if (scenarios.equity_crash) {
          context += `\n- Equity crash (-20%): ${scenarios.equity_crash.impact_percent.toFixed(1)}% (€${scenarios.equity_crash.impact_eur.toLocaleString()})`;
        }
        if (scenarios.usd_depreciation) {
          context += `\n- USD depreciation (-10%): ${scenarios.usd_depreciation.impact_percent.toFixed(1)}% (€${scenarios.usd_depreciation.impact_eur.toLocaleString()})`;
        }
      }
    }
  }

  if (data.selectedNews) {
    const n = data.selectedNews;
    context += '\n\n## NEWS CONTEXT FOR ANALYSIS';
    context += `\n**Headline:** ${n.title || 'N/A'}`;
    context += `\n**Source:** ${n.source || 'N/A'}`;
    context += `\n**Summary:** ${n.summary || 'N/A'}`;
    if (n.tags && n.tags.length > 0) {
      context += `\n**Tags:** ${n.tags.join(', ')}`;
    }
    context += '\n\nIMPORTANT: Analyze this news specifically in the context of the client\'s holdings above. Identify which positions are directly affected and quantify the potential impact.';
  }

  // Add user profile for personalization
  if (data.profile) {
    const p = data.profile;
    context += '\n\n## CLIENT PROFILE FOR PERSONALIZATION';
    
    if (p.displayName) {
      context += `\n**Name:** ${p.displayName}`;
    }
    
    if (p.investingExperience) {
      const expLabels: Record<string, string> = {
        beginner: 'Beginner (less than 2 years)',
        intermediate: 'Intermediate (2-10 years)',
        advanced: 'Advanced (10+ years)'
      };
      context += `\n**Experience Level:** ${expLabels[p.investingExperience] || p.investingExperience}`;
    }
    
    if (p.investmentHorizon) {
      const horizonLabels: Record<string, string> = {
        '<1y': 'Short-term (less than 1 year)',
        '1-3y': 'Short to medium-term (1-3 years)',
        '3-7y': 'Medium-term (3-7 years)',
        '7y+': 'Long-term (7+ years)'
      };
      context += `\n**Investment Horizon:** ${horizonLabels[p.investmentHorizon] || p.investmentHorizon}`;
    }
    
    if (p.riskComfort) {
      const riskLabels: Record<string, string> = {
        low: 'Low risk tolerance (capital preservation)',
        medium: 'Medium risk tolerance (balanced growth)',
        high: 'High risk tolerance (aggressive growth)'
      };
      context += `\n**Risk Comfort:** ${riskLabels[p.riskComfort] || p.riskComfort}`;
    }
    
    if (p.goals && p.goals.length > 0) {
      const goalLabels: Record<string, string> = {
        preserve: 'Capital preservation',
        grow: 'Wealth growth',
        income: 'Income generation',
        balanced: 'Balanced approach'
      };
      context += `\n**Investment Goals:** ${p.goals.map(g => goalLabels[g] || g).join(', ')}`;
    }
    
    if (p.answerStyle) {
      const styleLabels: Record<string, string> = {
        concise: 'Brief, to the point',
        standard: 'Standard explanations',
        detailed: 'Detailed, comprehensive'
      };
      context += `\n**Preferred Answer Style:** ${styleLabels[p.answerStyle] || p.answerStyle}`;
    }
    
    if (p.contentPriority) {
      const priorityLabels: Record<string, string> = {
        risk: 'Risk management',
        opportunities: 'Growth opportunities',
        education: 'Learning and education'
      };
      context += `\n**Primary Focus:** ${priorityLabels[p.contentPriority] || p.contentPriority}`;
    }
    
    if (p.avoidJargon) {
      context += '\n**Communication Preference:** Avoid technical jargon, use plain language';
    }
    
    context += '\n\nADAPT YOUR RESPONSES to match this client profile:';
    
    // Experience-based adaptation
    if (p.investingExperience === 'beginner') {
      context += '\n- Explain concepts clearly without assuming prior knowledge';
      context += '\n- Use analogies and examples to illustrate complex ideas';
      context += '\n- Define technical terms when you must use them';
    } else if (p.investingExperience === 'advanced') {
      context += '\n- Use technical terminology freely';
      context += '\n- Focus on nuanced analysis and advanced strategies';
      context += '\n- Skip basic explanations';
    }
    
    // Answer style adaptation
    if (p.answerStyle === 'concise') {
      context += '\n- Keep answers brief and scannable';
      context += '\n- Lead with the key insight in the first sentence';
      context += '\n- Use bullet points for multiple items';
    } else if (p.answerStyle === 'detailed') {
      context += '\n- Provide comprehensive analysis with supporting rationale';
      context += '\n- Include context and background where helpful';
      context += '\n- Walk through the reasoning step by step';
    }
    
    // Content priority adaptation
    if (p.contentPriority === 'risk') {
      context += '\n- Emphasize downside protection and risk mitigation';
      context += '\n- Highlight potential vulnerabilities in the portfolio';
    } else if (p.contentPriority === 'opportunities') {
      context += '\n- Focus on growth potential and opportunities';
      context += '\n- Highlight undervalued or high-potential positions';
    } else if (p.contentPriority === 'education') {
      context += '\n- Include educational context and explanations';
      context += '\n- Help the client understand the "why" behind advice';
    }
  }

  return context;
}

/**
 * Build the complete system prompt with profile-based personalization
 */
export function buildSystemPromptWithProfile(profile?: UserProfile | null): string {
  let prompt = COPILOT_SYSTEM_PROMPT;
  
  if (profile) {
    prompt += '\n\n## PERSONALIZATION OVERRIDES';
    
    // Language preference (always English per requirements, but note it)
    prompt += '\n- Respond in ENGLISH only';
    
    // Jargon preference
    if (profile.avoidJargon) {
      prompt += '\n- AVOID technical jargon - use plain language explanations';
    }
    
    // Experience-based tone
    if (profile.investingExperience === 'beginner') {
      prompt += '\n- Adopt an educational, supportive tone';
      prompt += '\n- Break down complex concepts into simple terms';
    } else if (profile.investingExperience === 'advanced') {
      prompt += '\n- Adopt a peer-to-peer professional tone';
      prompt += '\n- Assume deep market knowledge';
    }
    
    // Answer style
    if (profile.answerStyle === 'concise') {
      prompt += '\n- Be extremely concise - maximum value per word';
    } else if (profile.answerStyle === 'detailed') {
      prompt += '\n- Provide thorough, detailed explanations';
    }
    
    // Name personalization
    if (profile.displayName) {
      prompt += `\n- Address the client as "${profile.displayName}" when appropriate`;
    }
  }
  
  return prompt;
}
