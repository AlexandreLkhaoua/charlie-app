'use client';

import { ChatMessage } from '@/types';
import { useEffect, useRef } from 'react';
import { CopilotAnswerCard } from '@/components/copilot';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-slate-900 mb-2">
            Wealth Management Copilot
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ask questions about your portfolio composition, risk exposure, or market conditions. Responses are personalized to your actual holdings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'user' ? (
            // User message bubble
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-slate-900 text-white">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          ) : message.structured ? (
            // V1.1 Structured response - Full width CopilotAnswerCard
            <div className="w-full">
              <CopilotAnswerCard response={message.structured} />
            </div>
          ) : message.legacyStructured ? (
            // Legacy V1.0 structured response
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-slate-100 text-slate-900">
              <div className="space-y-3">
                {message.legacyStructured.tldr && (
                  <p className="text-sm font-medium">{message.legacyStructured.tldr}</p>
                )}
                {message.legacyStructured.bullets && message.legacyStructured.bullets.length > 0 && (
                  <ul className="space-y-1.5">
                    {message.legacyStructured.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {message.legacyStructured.data_points && message.legacyStructured.data_points.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-slate-200">
                    {message.legacyStructured.data_points.map((dp, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="text-slate-500">{dp.label}: </span>
                        <span className="font-semibold">{dp.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {message.legacyStructured.actions && message.legacyStructured.actions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Considerations</p>
                    {message.legacyStructured.actions.map((action, idx) => (
                      <p key={idx} className="text-xs text-slate-600">{action}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Plain text fallback
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-slate-100 text-slate-900">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-slate-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="text-xs text-slate-500 ml-2">Analyzing...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
