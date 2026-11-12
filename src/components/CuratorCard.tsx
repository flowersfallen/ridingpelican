import { ExternalLink, Layers, Cpu, Calendar } from 'lucide-react';
import { Lang, TimelineEntry } from '../types/timeline';
import { UI_COPY } from '../i18n/copy';
import { formatBytes } from '../utils/svg';

interface CuratorCardProps {
  entry: TimelineEntry;
  lang: Lang;
}

const LAB_COLORS: Record<string, string> = {
  OpenAI: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Anthropic: 'bg-orange-50 text-orange-800 border-orange-200',
  Google: 'bg-sky-50 text-sky-800 border-sky-200',
  DeepSeek: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Alibaba Qwen': 'bg-violet-50 text-violet-800 border-violet-200',
  'Moonshot Kimi': 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
};

export function CuratorCard({ entry, lang }: CuratorCardProps) {
  const t = UI_COPY[lang];
  const labBadge = LAB_COLORS[entry.lab] ?? 'bg-zinc-100 text-zinc-700 border-zinc-200';

  return (
    <aside className="w-full min-w-0 rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
      <div>
        {/* Lab + Date + Effort Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${labBadge}`}>
            {entry.lab}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-[#FAF8F4] px-2.5 py-0.5 font-mono text-xs text-zinc-600">
            <Calendar className="w-3 h-3" />
            {entry.date}
          </span>
          {entry.effort && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-xs text-amber-800">
              <Cpu className="w-3 h-3" />
              {t.effortLabel}: {entry.effort}
            </span>
          )}
        </div>

        {/* Model Name & IQ Stage */}
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          {entry.model}
        </h2>
        <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E14D2A]">
          <Layers className="w-3.5 h-3.5" />
          <span>{entry.iqStageLabel[lang]}</span>
        </div>

        {/* Headline Verdict */}
        <p className="mt-3 text-base font-semibold leading-snug text-zinc-800">
          {entry.headline[lang]}
        </p>

        {/* Curator Spatial Notes */}
        <div className="mt-4 rounded-xl border border-zinc-200/80 bg-[#FAF8F4] p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            {t.curatorNoteTitle}
          </div>
          <p className="text-sm leading-relaxed text-zinc-700">
            {entry.spatialNotes[lang]}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Objective SVG Code Metrics & Verified Attribution */}
      <div className="pt-4 border-t border-zinc-200/80 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-zinc-200/80 bg-[#FAF8F4]/70 px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {t.metricsSize}
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-zinc-900">
              {formatBytes(entry.metrics.bytes)}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-[#FAF8F4]/70 px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {t.metricsElements}
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-zinc-900">
              {entry.metrics.elements}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-[#FAF8F4]/70 px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {t.metricsPaths}
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-zinc-900">
              {entry.metrics.paths}
            </div>
          </div>
        </div>

        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          <span className="truncate">
            {t.verifiedSource}: <span className="text-zinc-900">{entry.sourceLabel}</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
        </a>
      </div>
    </aside>
  );
}
