import { CSSProperties, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { EraId, LabId, Lang, TimelineEntry } from '../types/timeline';
import { ERAS, UI_COPY } from '../i18n/copy';

interface TimelineScrubberProps {
  entries: TimelineEntry[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  selectedLab: LabId | 'ALL';
  onSelectLab: (lab: LabId | 'ALL') => void;
  availableLabs: LabId[];
  lang: Lang;
}

const ERA_BADGE_STYLE: Record<EraId, string> = {
  '2024-chaos': 'bg-slate-200/80 text-slate-700 border-slate-300',
  '2025-reasoning': 'bg-cyan-50 text-[#0E7490] border-cyan-200',
  '2026-mastery': 'bg-orange-50 text-[#E14D2A] border-orange-200',
};

export function TimelineScrubber({
  entries,
  activeIndex,
  onSelectIndex,
  isPlaying,
  onTogglePlay,
  selectedLab,
  onSelectLab,
  availableLabs,
  lang,
}: TimelineScrubberProps) {
  const t = UI_COPY[lang];
  const current = entries[activeIndex];
  const count = entries.length;
  const maxIndex = Math.max(0, count - 1);
  const clampedIndex = Math.min(Math.max(0, activeIndex), maxIndex);
  const progressPct = maxIndex > 0 ? (clampedIndex / maxIndex) * 100 : 100;

  // Rail spans from center of column 0 (0.5 / N) to center of column N-1 (1 - 0.5 / N)
  const railInsetPct = count > 0 ? 50 / count : 0;
  const railSpanPct = count > 1 ? ((count - 1) / count) * 100 : 0;

  const trackScrollRef = useRef<HTMLDivElement | null>(null);
  const activeTickRef = useRef<HTMLButtonElement | null>(null);

  // Center the active tick horizontally inside its own scroll container without scrolling the page vertically
  useEffect(() => {
    const container = trackScrollRef.current;
    const tick = activeTickRef.current;
    if (!container || !tick) return;
    if (container.scrollWidth <= container.clientWidth) return;

    const containerRect = container.getBoundingClientRect();
    const tickRect = tick.getBoundingClientRect();
    const delta =
      tickRect.left + tickRect.width / 2 - (containerRect.left + containerRect.width / 2);
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetLeft = Math.max(0, Math.min(maxScroll, container.scrollLeft + delta));

    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  }, [clampedIndex, selectedLab, count]);

  const jumpToEra = (eraId: EraId) => {
    const idx = entries.findIndex((e) => e.era === eraId);
    if (idx >= 0) onSelectIndex(idx);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur p-3.5 sm:p-5 shadow-sm">
      {/* Top Row: Lab Filter Pills + Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-0.5 sm:pb-0 -mx-0.5 px-0.5">
          <button
            type="button"
            onClick={() => onSelectLab('ALL')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all border ${
              selectedLab === 'ALL'
                ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                : 'border-zinc-200 bg-[#FAF8F4] text-zinc-600 hover:border-zinc-300'
            }`}
          >
            {t.allLabs}
          </button>
          {availableLabs.map((lab) => (
            <button
              key={lab}
              type="button"
              onClick={() => onSelectLab(lab)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                selectedLab === lab
                  ? 'border-[#E14D2A] bg-[#E14D2A] text-white shadow-sm'
                  : 'border-zinc-200 bg-[#FAF8F4] text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {lab}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {current && (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-zinc-200/80 bg-[#FAF8F4] px-2 sm:px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-700 sm:mr-1">
              <span className="text-[#E14D2A]">
                {clampedIndex + 1}/{count}
              </span>
              <span className="text-zinc-300">·</span>
              <span>{current.date.slice(0, 7)}</span>
            </span>
          )}

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span className="hidden lg:inline whitespace-nowrap text-[11px] font-mono text-zinc-400 mr-1">
              {t.keyboardHint}
            </span>
            <button
              type="button"
              onClick={() => onSelectIndex(Math.max(0, clampedIndex - 1))}
              disabled={clampedIndex <= 0}
              aria-label={t.prevModel}
              className="inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-35 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              disabled={count <= 1}
              className={`inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-colors ${
                isPlaying
                  ? 'bg-zinc-900 text-white'
                  : 'bg-[#E14D2A] text-white hover:bg-[#c94120]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
              <span>{isPlaying ? t.pauseTimeline : t.playTimeline}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectIndex(Math.min(maxIndex, clampedIndex + 1))}
              disabled={clampedIndex >= maxIndex}
              aria-label={t.nextModel}
              className="inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-35 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Era Quick Jump Pills — compact 3-column strip on both WAP & PC */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
        {ERAS.map((era) => {
          const hasInFilter = entries.some((e) => e.era === era.id);
          const isCurrentEra = current?.era === era.id;
          return (
            <button
              key={era.id}
              type="button"
              disabled={!hasInFilter}
              onClick={() => jumpToEra(era.id)}
              className={`text-left rounded-xl border px-2 py-1.5 sm:px-3 sm:py-2 transition-all disabled:opacity-40 min-w-0 ${
                isCurrentEra
                  ? 'border-zinc-900 bg-[#FAF8F4] ring-1 ring-zinc-900/10'
                  : 'border-zinc-200/80 bg-white hover:bg-[#FAF8F4]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                <span
                  className={`inline-block truncate rounded px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold border ${ERA_BADGE_STYLE[era.id]}`}
                >
                  {era.period}
                </span>
                {isCurrentEra && (
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-[#E14D2A] animate-pulse" />
                )}
              </div>
              <div className="mt-1 text-[11px] sm:text-xs font-semibold text-zinc-900 truncate">
                {era.title[lang]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Unified Tactile Scrubber Track: Rail, Thumb & Ticks share one scrollable coordinate grid */}
      <div
        ref={trackScrollRef}
        className="overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5"
      >
        <div
          className="timeline-track-inner relative"
          style={{ '--tick-count': count } as CSSProperties}
        >
          {/* Progress Rail & Synchronized Thumb Band */}
          <div className="relative h-7 w-full">
            {count > 1 ? (
              <>
                <div
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-zinc-200/90"
                  style={{ left: `${railInsetPct}%`, width: `${railSpanPct}%` }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-slate-500 via-[#0E7490] to-[#E14D2A] transition-[width] duration-200 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-[20px] w-[20px] rounded-full bg-[#E14D2A] border-[3px] border-[#FAF8F4] shadow-[0_2px_10px_rgba(225,77,42,0.45)] transition-[left] duration-200 ease-out"
                    style={{ left: `${progressPct}%` }}
                  />
                </div>

                {/* Accessible drag overlay whose 20px thumb travel matches the rail [0%..100%] */}
                <input
                  type="range"
                  min={0}
                  max={maxIndex}
                  step={1}
                  value={clampedIndex}
                  onChange={(e) => onSelectIndex(Number(e.target.value))}
                  aria-label="AI IQ Evolution Timeline Slider"
                  className="timeline-slider absolute inset-y-0 z-10 h-7 block"
                  style={{
                    left: `calc(${railInsetPct}% - 10px)`,
                    width: `calc(${railSpanPct}% + 20px)`,
                  }}
                />
              </>
            ) : count === 1 ? (
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-12 rounded-full bg-[#E14D2A]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[20px] w-[20px] rounded-full bg-[#E14D2A] border-[3px] border-[#FAF8F4] shadow-[0_2px_10px_rgba(225,77,42,0.45)]" />
              </div>
            ) : null}
          </div>

          {/* Clickable Milestone Ticks locked to identical 1fr columns directly under the rail */}
          <div
            className="mt-1 grid w-full"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, count)}, minmax(0, 1fr))` }}
          >
            {entries.map((entry, idx) => {
              const isActive = idx === clampedIndex;
              return (
                <button
                  key={entry.id}
                  ref={isActive ? activeTickRef : null}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  title={`${entry.date} · ${entry.model}`}
                  className={`group flex flex-col items-center min-w-0 overflow-hidden rounded-lg px-1 py-1.5 transition-colors ${
                    isActive ? 'bg-[#E14D2A]/10' : 'hover:bg-zinc-100'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-transform ${
                      isActive
                        ? 'bg-[#E14D2A] scale-125'
                        : idx < clampedIndex
                        ? 'bg-[#0E7490]'
                        : 'bg-zinc-300 group-hover:bg-zinc-400'
                    }`}
                  />
                  <span
                    className={`mt-1.5 w-full text-center truncate font-mono text-[10px] leading-tight ${
                      isActive ? 'font-bold text-[#E14D2A]' : 'text-zinc-500'
                    }`}
                  >
                    {entry.date.slice(0, 7)}
                  </span>
                  <span
                    className={`mt-0.5 w-full text-center truncate text-[10px] leading-tight ${
                      isActive ? 'font-semibold text-zinc-900' : 'text-zinc-500'
                    }`}
                  >
                    {entry.model.replace(/\s*\([^)]*\)/g, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
