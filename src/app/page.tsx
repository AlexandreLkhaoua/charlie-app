'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addToWaitlist, isValidEmail } from '@/lib/waitlist/waitlistStore';

const pillars = [
  {
    title: 'Portfolio Overview',
    description: 'See your holdings, allocations, and concentration metrics in one consolidated view.',
    benefit: 'Understand exactly where your money is invested',
  },
  {
    title: 'Risk Analysis',
    description: 'Identify concentration risks, currency exposure, and potential vulnerabilities.',
    benefit: 'Protect your wealth before problems arise',
  },
  {
    title: 'Market News',
    description: 'Curated financial news with analysis of how events impact your specific portfolio.',
    benefit: 'Stay informed without the noise',
  },
  {
    title: 'AI Copilot',
    description: 'Ask questions and get personalized insights based on your actual holdings.',
    benefit: 'Expert advice tailored to you',
  },
  {
    title: 'Scenario Sensitivity',
    description: 'See how rate changes, market crashes, or currency moves would affect your portfolio.',
    benefit: 'Plan for any market condition',
  },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    const result = addToWaitlist(email);
    if (result.success) {
      setSubmitted(true);
      setEmail('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">Charlie</span>
          </div>
          <Link
            href="/demo/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Try the demo
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-16 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your AI Wealth Management
            <span className="block text-slate-400">Copilot</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Charlie transforms how you understand and manage your portfolio. 
            Get personalized insights, risk analysis, and scenario planning 
            powered by AI that knows your investments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Try the demo
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Join the waitlist
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-left hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{pillar.description}</p>
                <p className="text-xs text-slate-500">{pillar.benefit}</p>
              </div>
            ))}
          </div>

          <div id="waitlist" className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Get early access
            </h2>
            <p className="text-slate-400 mb-6">
              Join the waitlist to be among the first to use Charlie when we launch.
            </p>
            
            {submitted ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium">You are on the list</p>
                <p className="text-sm text-slate-400 mt-2">We will notify you when Charlie is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 text-left">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Join the waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            Charlie AI Copilot - For informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
