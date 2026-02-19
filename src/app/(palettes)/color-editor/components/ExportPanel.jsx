import { useState } from "react";
import { Check } from "lucide-react";
import { generateExportText, toHex } from "../utils";

const FORMATS = ["css", "tailwind", "scss", "json", "hex"];

export function ExportPanel({ adjustedPalette }) {
  const [exportFormat, setExportFormat] = useState("css");
  const [exportCopied, setExportCopied] = useState(false);

  const exportText = generateExportText(exportFormat, adjustedPalette);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">
          Export Adjusted Palette
        </div>
        <div className="flex gap-1.5">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setExportFormat(fmt)}
              className={`px-2 py-1 text-[8px] font-bold rounded border transition-all uppercase ${
                exportFormat === fmt
                  ? "bg-(--brand) text-white border-(--brand)"
                  : "border-(--navBorder) hover:border-(--brand) text-foreground/60"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <pre className="text-[10px] font-mono p-4 rounded-lg border border-(--navBorder) bg-foreground/[0.02] overflow-x-auto leading-relaxed whitespace-pre">
          {exportText}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-[8px] font-bold rounded border border-(--navBorder) bg-background hover:border-(--brand) transition-all"
        >
          {exportCopied ? (
            <>
              <Check className="w-3 h-3 text-green-500" /> Copied!
            </>
          ) : (
            "Copy All"
          )}
        </button>
      </div>
    </div>
  );
}
