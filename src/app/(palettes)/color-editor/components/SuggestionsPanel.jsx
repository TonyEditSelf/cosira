import { Info } from "lucide-react";

export function SuggestionsPanel({ suggestions, onApply }) {
  if (suggestions.length === 0) return null;
  return (
    <div className="p-3 border-b border-blue-500/30 bg-blue-500/5">
      <div className="flex items-center gap-1.5 mb-2">
        <Info className="w-4 h-4 text-blue-600" />
        <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest">
          Suggestions
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="p-2 rounded bg-white/50 border border-blue-500/30"
          >
            <p className="text-[9px] text-blue-700 mb-1.5">{s.message}</p>
            <button
              onClick={() => onApply(s.adjustment)}
              className="px-2 py-1 text-[8px] font-bold bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Apply This
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
