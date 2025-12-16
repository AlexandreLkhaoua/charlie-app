import { NextRequest, NextResponse } from 'next/server';
import { 
  COPILOT_SCHEMA, 
  COPILOT_SYSTEM_PROMPT, 
  buildUserContext, 
  validateCopilotResponse,
  CopilotStructuredResponse,
  buildSystemPromptWithProfile,
} from '@/lib/copilot';
import type { UserProfile } from '@/lib/profile/profileStore';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Request body type
interface CopilotRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  portfolio?: {
    name?: string;
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
    }>;
  };
  analytics?: {
    concentration?: { top1_weight?: number; top5_weight?: number; top10_weight?: number };
    allocations_by_asset_class?: Array<{ category: string; weight_percent: number }>;
    allocations_by_currency?: Array<{ category: string; weight_percent: number }>;
    allocations_by_region?: Array<{ category: string; weight_percent: number }>;
    flags?: Array<{ title: string; explanation: string; severity: string; recommendation?: string }>;
    scenarios?: Array<{ name: string; description: string; impact_percent: number; impact_eur: number }>;
  };
  selectedNews?: {
    title?: string;
    summary?: string;
    source?: string;
    published_at?: string;
    tags?: string[];
  };
  userProfile?: UserProfile | null;
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userContext: string,
  userMessage: string,
  isRetry: boolean = false
): Promise<CopilotStructuredResponse | null> {
  const startTime = Date.now();
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `${userContext}\n\n## QUESTION DE L'UTILISATEUR\n${userMessage}${isRetry ? '\n\nIMPORTANT: Ta réponse DOIT être un JSON valide conforme au schéma. Aucun texte avant ou après le JSON.' : ''}` },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: {
          type: 'json_schema',
          json_schema: COPILOT_SCHEMA,
        },
      }),
    });

    const latency = Date.now() - startTime;
    console.log(`[Copilot API] OpenAI call completed in ${latency}ms (retry: ${isRetry})`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[Copilot API] OpenAI error ${response.status}:`, errorData);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[Copilot API] No content in response');
      return null;
    }

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('[Copilot API] Failed to parse JSON:', e);
      return null;
    }

    // Validate structure
    if (!validateCopilotResponse(parsed)) {
      console.error('[Copilot API] Response does not match schema');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('[Copilot API] Network error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const requestStart = Date.now();
  
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      console.log(`[Copilot API] Rate limit exceeded for ${ip}`);
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[Copilot API] OPENAI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    // Parse request
    const body: CopilotRequest = await request.json();
    const { messages, portfolio, analytics, selectedNews, userProfile } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages requis' },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'Message utilisateur requis' },
        { status: 400 }
      );
    }

    // Build context with profile for personalization
    const userContext = buildUserContext({ portfolio, analytics, selectedNews, profile: userProfile });
    
    // Build personalized system prompt based on user profile
    const systemPrompt = buildSystemPromptWithProfile(userProfile);

    // First attempt
    let result = await callOpenAI(
      apiKey,
      systemPrompt,
      userContext,
      lastUserMessage.content,
      false
    );

    // Retry once if failed
    if (!result) {
      console.log('[Copilot API] First attempt failed, retrying...');
      result = await callOpenAI(
        apiKey,
        systemPrompt,
        userContext,
        lastUserMessage.content,
        true
      );
    }

    if (!result) {
      console.error('[Copilot API] Both attempts failed');
      return NextResponse.json(
        { error: 'Impossible de générer une réponse. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    const totalLatency = Date.now() - requestStart;
    console.log(`[Copilot API] Request completed in ${totalLatency}ms`);

    return NextResponse.json({
      structured: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Copilot API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
