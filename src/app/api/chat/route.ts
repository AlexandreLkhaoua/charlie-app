import { NextResponse } from 'next/server'
import { ChatMessage } from '@/types'
import { clients } from '@/data/clients'
import { marketAlerts } from '@/data/alerts'
import { products } from '@/data/products'

// Responses simulées pour Michael (AI Assistant)
// Dans un vrai MVP, on intégrerait un LLM (OpenAI, Anthropic, etc.)

const MICHAEL_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm Michael, your AI assistant for wealth management. I can help you with market insights, client information, portfolio analysis, and product recommendations. What would you like to know?",
  
  market_general: "Based on current market conditions, here's what I'm seeing:\n\n📈 **US Markets**: S&P 500 is up 22.8% YTD, led by tech sector\n📉 **Fixed Income**: Yields have risen, putting pressure on bond portfolios\n💱 **FX**: Dollar strength continues vs EUR and JPY\n\nWould you like me to dig deeper into any specific area?",
  
  client_overview: "You currently have 6 active clients with a total AUM of $272.8M. Here's a quick summary:\n\n✅ **4 clients** are in good standing\n⚠️ **1 client** needs a portfolio review\n🚨 **1 client** is at risk due to underperformance\n\nWould you like details on any specific client?",
  
  portfolio_recommendation: "Based on current market conditions and your clients' profiles, I'd recommend:\n\n1. **Reduce duration** in bond portfolios given rising rates\n2. **Consider adding** international equity exposure for diversification\n3. **Review tech allocation** after recent NVDA earnings miss\n\nShall I prepare a detailed rebalancing proposal?",
  
  compliance_alert: "I've identified some compliance items that need attention:\n\n🔴 **High Priority**: Elizabeth Thornton's KYC expires in 17 days\n🟡 **Medium**: Chen Family Trust needs W-8BEN update\n🟡 **Medium**: Williams account has unusual activity flag\n\nWant me to draft the renewal documents?",
  
  unknown: "I understand you're asking about that. Let me check our data and get back to you with relevant information. In the meantime, is there anything specific about your clients, portfolios, or market conditions I can help with?",
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return MICHAEL_RESPONSES.greeting
  }
  
  if (lowerMessage.includes('market') || lowerMessage.includes('macro') || lowerMessage.includes('economy')) {
    return MICHAEL_RESPONSES.market_general
  }
  
  if (lowerMessage.includes('client') || lowerMessage.includes('portfolio') || lowerMessage.includes('aum')) {
    return MICHAEL_RESPONSES.client_overview
  }
  
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion') || lowerMessage.includes('rebalance')) {
    return MICHAEL_RESPONSES.portfolio_recommendation
  }
  
  if (lowerMessage.includes('compliance') || lowerMessage.includes('kyc') || lowerMessage.includes('aml')) {
    return MICHAEL_RESPONSES.compliance_alert
  }
  
  // Recherche de client spécifique
  const clientMatch = clients.find(c => lowerMessage.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()))
  if (clientMatch) {
    return `Here's what I found about **${clientMatch.name}**:\n\n` +
      `📊 **AUM**: $${(clientMatch.totalAUM / 1_000_000).toFixed(1)}M\n` +
      `📈 **YTD Return**: ${clientMatch.ytdReturn > 0 ? '+' : ''}${clientMatch.ytdReturn}%\n` +
      `🎯 **Risk Profile**: ${clientMatch.riskProfile}\n` +
      `📅 **Next Review**: ${clientMatch.nextReview}\n` +
      `⚡ **Status**: ${clientMatch.status}\n\n` +
      `Would you like more details on their portfolio or compliance status?`
  }
  
  return MICHAEL_RESPONSES.unknown
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Simuler un délai de réponse réaliste
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const response = generateResponse(message)
    
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      context: {
        type: 'general',
      },
    }
    
    return NextResponse.json({
      success: true,
      data: assistantMessage,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
