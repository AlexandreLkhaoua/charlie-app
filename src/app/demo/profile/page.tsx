'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserProfile, 
  getProfile, 
  saveProfile, 
  resetProfile,
  InvestingExperience,
  PreferredLanguage,
  InvestmentHorizon,
  RiskComfort,
  InvestmentGoal,
  AnswerStyle,
  ContentPriority,
} from '@/lib/profile/profileStore';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    saveProfile(profile);
    setIsSaving(false);
    setSaveMessage('Saved');
    
    // Clear message after 2s
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleReset = () => {
    const fresh = resetProfile();
    setProfile(fresh);
    setSaveMessage('Reset to defaults');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...updates });
  };

  const toggleGoal = (goal: InvestmentGoal) => {
    if (!profile) return;
    const goals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    updateProfile({ goals });
  };

  if (!profile) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/demo/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">Customize your Charlie experience</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        
        {/* Display Name */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => updateProfile({ displayName: e.target.value })}
            placeholder="Your name"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
          <p className="mt-2 text-xs text-slate-500">Optional. Used for personalized greetings.</p>
        </div>

        {/* Experience Level */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Investing Experience</label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as InvestingExperience[]).map((level) => (
              <button
                key={level}
                onClick={() => updateProfile({ investingExperience: level })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.investingExperience === level
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {profile.investingExperience === 'beginner' && 'Charlie will explain concepts in simple terms.'}
            {profile.investingExperience === 'intermediate' && 'Charlie will balance clarity with appropriate terminology.'}
            {profile.investingExperience === 'advanced' && 'Charlie can use technical terms freely.'}
          </p>
        </div>

        {/* Language Preference */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Preferred Language</label>
          <div className="grid grid-cols-2 gap-2">
            {(['EN', 'FR'] as PreferredLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => updateProfile({ preferredLanguage: lang })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.preferredLanguage === lang
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'EN' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Horizon */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Investment Horizon</label>
          <div className="grid grid-cols-4 gap-2">
            {(['<1y', '1-3y', '3-7y', '7y+'] as InvestmentHorizon[]).map((horizon) => (
              <button
                key={horizon}
                onClick={() => updateProfile({ investmentHorizon: horizon })}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.investmentHorizon === horizon
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {horizon}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Charlie will frame advice based on your time horizon.</p>
        </div>

        {/* Risk Comfort */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Risk Comfort</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as RiskComfort[]).map((risk) => (
              <button
                key={risk}
                onClick={() => updateProfile({ riskComfort: risk })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.riskComfort === risk
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Goals */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Investment Goals</label>
          <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'preserve', label: 'Preserve Capital' },
              { key: 'grow', label: 'Grow Wealth' },
              { key: 'income', label: 'Generate Income' },
              { key: 'balanced', label: 'Balanced Approach' },
            ] as { key: InvestmentGoal; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleGoal(key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.goals.includes(key)
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Answer Style */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Preferred Answer Style</label>
          <div className="grid grid-cols-3 gap-2">
            {(['concise', 'standard', 'detailed'] as AnswerStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => updateProfile({ answerStyle: style })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.answerStyle === style
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Content Focus</label>
          <p className="text-xs text-slate-500 mb-3">What should Charlie prioritize?</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'risk', label: 'Risks' },
              { key: 'opportunities', label: 'Opportunities' },
              { key: 'education', label: 'Education' },
            ] as { key: ContentPriority; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => updateProfile({ contentPriority: key })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  profile.contentPriority === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Jargon Toggle */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-slate-700">Avoid Financial Jargon</label>
              <p className="text-xs text-slate-500 mt-1">Charlie will explain technical terms when used</p>
            </div>
            <button
              onClick={() => updateProfile({ avoidJargon: !profile.avoidJargon })}
              title={profile.avoidJargon ? 'Disable jargon avoidance' : 'Enable jargon avoidance'}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.avoidJargon ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  profile.avoidJargon ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <p className="text-center text-sm text-emerald-600">{saveMessage}</p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center">
        Your preferences are stored locally on this device.
      </p>
    </div>
  );
}
