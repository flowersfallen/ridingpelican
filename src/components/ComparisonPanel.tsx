import { useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Lang, TimelineEntry } from '../types/timeline';
import { UI_COPY } from '../i18n/copy';
import { formatBytes, prepareSvgDataUri } from '../utils/svg';

interface ComparisonPanelProps {
  entries: TimelineEntry[];
  leftId: string;
  rightId: string;
  onChangeLeft: (id: string) => void;
  onChangeRight: (id: string) => void;
  onSwap: () => void;
  lang: Lang;
}

function CompareSlot({
  entry,
  allEntries,
  selectedId,
  onSelect,
  slotLabel,
  accentClass,
  lang,
}: {
  entry?: TimelineEntry;
  allEntries: TimelineEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
  slotLabel: string;
  accentClass: string;
  lang: Lang;
}) {
  const t = UI_COPY[lang];
  const dataUri = useMemo(() => (entry ? prepareSvgDataUri(entry.svg) : ''), [entry]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold text-white ${accentClass}`}>
          {slotLabel}
        </span>
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 min-w-0 rounded-lg border border-zinc-200 bg-[#FAF8F4] px-2.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#E14D2A]/30"
        >
          {allEntries.map((item) => (
            <option key={item.id} value={item.id}>
              [{item.date.slice(0, 7)}] {item.model} ({item.lab})
            </option>
          ))}
        </select>
      </div>

      {entry ? (
        <>
          <div className="drafting-grid relative h-56 sm:h-64 rounded-xl border border-zinc-200/80 p-3 flex items-center justify-center">
            <img
              src={dataUri}
              alt={entry.model}
              className="max-h-full max-w-full w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">{entry.iqStageLabel[lang]}</span>
            <span className="font-mono text-zinc-500">
              {formatBytes(entry.metrics.bytes)} · {entry.metrics.elements} nodes
            </span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 line-clamp-3">
            {entry.spatialNotes[lang]}
          </p>
        </>
      ) : (
        <div className="h-56 rounded-xl border border-dashed border-zinc-300 flex items-center justify-center text-xs text-zinc-400">
          {t.comparePlaceholder}
        </div>
      )}
    </div>
  );
}

export function ComparisonPanel({
  entries,
  leftId,
  rightId,
  onChangeLeft,
  onChangeRight,
  onSwap,
  lang,
}: ComparisonPanelProps) {
  const t = UI_COPY[lang];
  const leftEntry = entries.find((e) => e.id === leftId);
  const rightEntry = entries.find((e) => e.id === rightId);

  return (
    <section id="compare" className="mt-14 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            {t.compareTitle}
          </h2>
          <p className="mt-1 text-sm text-zinc-600">{t.compareSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={onSwap}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{t.swapCompare}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CompareSlot
          entry={leftEntry}
          allEntries={entries}
          selectedId={leftId}
          onSelect={onChangeLeft}
          slotLabel="A · THEN"
          accentClass="bg-[#0E7490]"
          lang={lang}
        />
        <CompareSlot
          entry={rightEntry}
          allEntries={entries}
          selectedId={rightId}
          onSelect={onChangeRight}
          slotLabel="B · NOW"
          accentClass="bg-[#E14D2A]"
          lang={lang}
        />
      </div>
    </section>
  );
}
