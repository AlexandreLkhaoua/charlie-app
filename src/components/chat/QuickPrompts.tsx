import { QuickPrompt } from '@/types';

interface QuickPromptsProps {
  prompts: QuickPrompt[];
  onSelect: (prompt: QuickPrompt) => void;
  disabled?: boolean;
}

export function QuickPrompts({ prompts, onSelect, disabled }: QuickPromptsProps) {
  return (
    <div className="border-t border-slate-200 p-4 bg-slate-50">
      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-3">Suggested Questions</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {prompt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
