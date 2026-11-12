import { useMemo, useState } from 'react';
import { Check, Code2, Copy, Maximize2, Minimize2, Moon, Sparkles, Sun } from 'lucide-react';
import { Lang, TimelineEntry } from '../types/timeline';
import { UI_COPY } from '../i18n/copy';
import { formatBytes, prepareSvgDataUri } from '../utils/svg';

interface SvgStageProps {
  entry: TimelineEntry;
  lang: Lang;
  onPinCompare?: (slot: 'A' | 'B', entryId: string) => void;
  compareAId?: string;
  compareBId?: string;
}

export function SvgStage({
  entry,
  lang,
  onPinCompare,
  compareAId,
  compareBId,
}: SvgStageProps) {
  const t = UI_COPY[lang];
  const [darkCanvas, setDarkCanvas] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const dataUri = useMemo(() => prepareSvgDataUri(entry.svg), [entry.svg]);

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(entry.svg);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 1800);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-sm overflow-hidden">
      {/* Top Stage Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 bg-[#F5F2EB]/70 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 border border-zinc-200 font-medium text-zinc-800">
            {entry.date}
          </span>
          <span className="hidden sm:inline text-zinc-400">|</span>
          <span className="hidden sm:inline">{formatBytes(entry.metrics.bytes)}</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              entry.metrics.hasAnimation
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
            }`}
          >
            {entry.metrics.hasAnimation && <Sparkles className="w-3 h-3" />}
            {entry.metrics.hasAnimation ? t.animatedBadge : t.staticBadge}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDarkCanvas((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {darkCanvas ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{darkCanvas ? t.canvasBgLight : t.canvasBgDark}</span>
          </button>

          <button
            type="button"
            onClick={() => setZoomed((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            title={zoomed ? 'Fit' : 'Expand'}
          >
            {zoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowSource((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              showSource
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showSource ? t.hideSource : t.viewSource}</span>
          </button>
        </div>
      </div>

      {/* Main Drafting Canvas */}
      <div
        className={`relative flex items-center justify-center p-3.5 sm:p-6 transition-all duration-200 ${
          darkCanvas ? 'drafting-grid-dark' : 'drafting-grid'
        } ${zoomed ? 'h-[380px] sm:h-[560px]' : 'h-[280px] sm:h-[400px]'}`}
      >
        <img
          key={entry.id}
          src={dataUri}
          alt={`${entry.model} — Generate an SVG of a pelican riding a bicycle`}
          className="max-h-full max-w-full w-full h-full object-contain drop-shadow-sm select-none"
        />

        {/* ViewBox Corner Stamp */}
        <span
          className={`pointer-events-none absolute bottom-2.5 right-3 rounded px-2 py-0.5 font-mono text-[10px] ${
            darkCanvas ? 'bg-zinc-900/80 text-zinc-400' : 'bg-white/85 text-zinc-500 border border-zinc-200/70'
          }`}
        >
          viewBox: {entry.metrics.viewBox}
        </span>
      </div>

      {/* Bottom Pin-to-Compare Bar */}
      {onPinCompare && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/80 bg-[#FAF8F4] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPinCompare('A', entry.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border ${
                compareAId === entry.id
                  ? 'border-[#0E7490] bg-[#0E7490] text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}
            >
              {t.pinCompareA}
            </button>
            <button
              type="button"
              onClick={() => onPinCompare('B', entry.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border ${
                compareBId === entry.id
                  ? 'border-[#E14D2A] bg-[#E14D2A] text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}
            >
              {t.pinCompareB}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopySvg}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSvg ? t.copied : t.copySvg}</span>
          </button>
        </div>
      )}

      {/* Raw SVG Source Inspector */}
      {showSource && (
        <div className="border-t border-zinc-200 bg-zinc-950 text-zinc-100">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
            <span>{entry.model} · raw SVG ({formatBytes(entry.metrics.bytes)})</span>
            <button
              type="button"
              onClick={handleCopySvg}
              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white"
            >
              {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSvg ? t.copied : t.copySvg}</span>
            </button>
          </div>
          <pre className="max-h-72 overflow-auto p-4 text-xs font-mono leading-relaxed text-zinc-200 whitespace-pre-wrap break-all">
            {entry.svg}
          </pre>
        </div>
      )}
    </div>
  );
}
