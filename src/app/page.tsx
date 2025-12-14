import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Users, Bell, MessageSquare, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-2xl">Charlie</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            🚀 MVP v1.0 - Now Live
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Your AI-Powered
            <span className="text-primary"> Wealth Management</span> Copilot
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Charlie helps private bankers, wealth advisors and family offices manage portfolios, 
            stay compliant, and provide exceptional client service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/michael">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Talk to Michael AI <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          <FeatureCard
            icon={BarChart3}
            title="Multi-Client Dashboard"
            description="Consolidated view of all portfolios with real-time KPIs, performance metrics, and risk indicators."
          />
          <FeatureCard
            icon={Users}
            title="Client Management"
            description="Complete client profiles with allocation details, compliance status, and tax optimization tools."
          />
          <FeatureCard
            icon={Bell}
            title="Market Alerts"
            description="Contextual market alerts with portfolio impact analysis and actionable recommendations."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Michael AI Assistant"
            description="Natural language interface for market insights, client data, and portfolio recommendations."
          />
          <FeatureCard
            icon={Shield}
            title="Compliance Tracking"
            description="KYC, AML, FATCA monitoring with automated alerts for upcoming renewals and issues."
          />
          <FeatureCard
            icon={Zap}
            title="Investment Simulation"
            description="Analyze investment impact on allocation, risk metrics, and expected returns before execution."
          />
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start managing your clients more efficiently with AI-powered insights and automation.
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="font-semibold">Charlie</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Charlie. Built for wealth management professionals.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
