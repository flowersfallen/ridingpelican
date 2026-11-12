import { useMemo } from 'react';
import { ArrowUpRight, GitCompare } from 'lucide-react';
import { Lang, TimelineEntry } from '../types/timeline';
import { UI_COPY } from '../i18n/copy';
import { formatBytes, prepareSvgDataUri } from '../utils/svg';

interface ArchiveGridProps {
  entries: TimelineEntry[];
  activeId: string;
  onJump: (id: string) => void;
  onCompare: (id: string) => void;
  lang: Lang;
}

function ArchiveCard({
  entry,
  isActive,
  onJump,
  onCompare,
  lang,
}: {
  entry: TimelineEntry;
  isActive: boolean;
  onJump: () => void;
  onCompare: () => void;
  lang: Lang;
}) {
  const t = UI_COPY[lang];
  const dataUri = useMemo(() => prepareSvgDataUri(entry.svg), [entry.svg]);

  return (
    <article
      className={`group rounded-2xl border bg-white p-3.5 transition-all flex flex-col ${
        isActive
          ? 'border-[#E14D2A] ring-2 ring-[#E14D2A]/15 shadow-md'
          : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={onJump}
        className="drafting-grid relative h-44 w-full rounded-xl border border-zinc-200/80 p-3 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <img
          src={dataUri}
          alt={entry.model}
          loading="lazy"
          className="max-h-full max-w-full w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-200"
        />
        <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-700 border border-zinc-200/80">
          {entry.date}
        </span>
        {entry.metrics.hasAnimation && (
          <span className="absolute top-2 right-2 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            {t.animatedBadge}
          </span>
        )}
      </button>

      <div className="mt-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {entry.lab}
            </div>
            <h3 className="text-sm font-bold text-zinc-900 leading-snug">{entry.model}</h3>
          </div>
          <span className="font-mono text-[11px] text-zinc-500 shrink-0">
            {formatBytes(entry.metrics.bytes)}
          </span>
        </div>

        <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 flex-1">
          {entry.headline[lang]}
        </p>

        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onJump}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#E14D2A] hover:underline"
          >
            <span>{t.jumpToStage}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onCompare}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-[#FAF8F4] px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <GitCompare className="w-3 h-3" />
            <span>{t.compareAction}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ArchiveGrid({
  entries,
  activeId,
  onJump,
  onCompare,
  lang,
}: ArchiveGridProps) {
  const t = UI_COPY[lang];

  return (
    <section id="archive" className="mt-16 scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          {t.archiveGridTitle}
        </h2>
        <p className="mt-1 text-sm text-zinc-600">{t.archiveGridSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {entries.map((entry) => (
          <ArchiveCard
            key={entry.id}
            entry={entry}
            isActive={entry.id === activeId}
            onJump={() => onJump(entry.id)}
            onCompare={() => onCompare(entry.id)}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
