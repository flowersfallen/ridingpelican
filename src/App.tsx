import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Globe, Sparkles, Terminal } from 'lucide-react';
import rawTimeline from './data/timeline.json';
import { LabId, Lang, TimelineEntry } from './types/timeline';
import { UI_COPY } from './i18n/copy';
import { PelicanLogo } from './components/PelicanLogo';
import { TimelineScrubber } from './components/TimelineScrubber';
import { SvgStage } from './components/SvgStage';
import { CuratorCard } from './components/CuratorCard';
import { ComparisonPanel } from './components/ComparisonPanel';
import { ArchiveGrid } from './components/ArchiveGrid';

const ALL_ENTRIES = rawTimeline as TimelineEntry[];
const CANONICAL_PROMPT = 'Generate an SVG of a pelican riding a bicycle';

export function App() {
  const [lang, setLang] = useState<Lang>('zh');
  const [selectedLab, setSelectedLab] = useState<LabId | 'ALL'>('ALL');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Default Then-vs-Now diff: Oct 2024 GPT-4o vs Oct 2026 GPT-6 Astra
  const [compareAId, setCompareAId] = useState<string>('gpt-4o');
  const [compareBId, setCompareBId] = useState<string>('gpt-6-astra-max');

  const t = UI_COPY[lang];

  const availableLabs = useMemo<LabId[]>(() => {
    const seen = new Set<LabId>();
    for (const item of ALL_ENTRIES) seen.add(item.lab);
    return Array.from(seen);
  }, []);

  const filteredEntries = useMemo(() => {
    if (selectedLab === 'ALL') return ALL_ENTRIES;
    return ALL_ENTRIES.filter((item) => item.lab === selectedLab);
  }, [selectedLab]);

  const safeIndex = Math.min(activeIndex, Math.max(0, filteredEntries.length - 1));
  const activeEntry = filteredEntries[safeIndex] ?? ALL_ENTRIES[0];

  // Auto-play progression across the filtered timeline
  useEffect(() => {
    if (!isPlaying || filteredEntries.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= filteredEntries.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying, filteredEntries.length]);

  // Keyboard arrow scrubbing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        setIsPlaying(false);
        setActiveIndex((i) => Math.min(filteredEntries.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setIsPlaying(false);
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredEntries.length]);

  const handleSelectLab = (lab: LabId | 'ALL') => {
    setIsPlaying(false);
    setSelectedLab(lab);
    setActiveIndex(0);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (safeIndex >= filteredEntries.length - 1) {
      setActiveIndex(0);
    }
    setIsPlaying(true);
  };

  const handleSelectIndex = (idx: number) => {
    setIsPlaying(false);
    setActiveIndex(idx);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(CANONICAL_PROMPT);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleJumpToId = (id: string) => {
    setIsPlaying(false);
    setSelectedLab('ALL');
    const idx = ALL_ENTRIES.findIndex((e) => e.id === id);
    if (idx >= 0) {
      setActiveIndex(idx);
      document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePinCompare = (slot: 'A' | 'B', id: string) => {
    if (slot === 'A') setCompareAId(id);
    else setCompareBId(id);
  };

  const handleQuickCompareFromCard = (id: string) => {
    setCompareBId(id);
    document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#18181B]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#FAF8F4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
          <a href="#" className="flex items-center gap-3 group">
            <PelicanLogo className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-900">
                  {t.siteTitle}
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#E14D2A]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#E14D2A]">
                  ridingpelican.com
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">{t.siteTagline}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-600">
              <a href="#timeline" className="hover:text-zinc-900 transition-colors">
                {lang === 'zh' ? '演进时间轴' : 'Timeline'}
              </a>
              <a href="#compare" className="hover:text-zinc-900 transition-colors">
                {lang === 'zh' ? '跨时代对比' : 'Compare'}
              </a>
              <a href="#archive" className="hover:text-zinc-900 transition-colors">
                {lang === 'zh' ? '完整档案' : 'Archive'}
              </a>
            </nav>

            <button
              type="button"
              onClick={() => setLang((l) => (l === 'zh' ? 'en' : 'zh'))}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#0E7490]" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>
        </div>

        {/* Compact Mobile Quick-Jump Strip */}
        <nav className="flex md:hidden items-center justify-around border-t border-zinc-200/70 bg-[#FAF8F4]/95 px-2 py-1.5 text-[11px] font-semibold text-zinc-600">
          <a href="#timeline" className="rounded-md px-2.5 py-1 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            {lang === 'zh' ? '演进时间轴' : 'Timeline'}
          </a>
          <a href="#compare" className="rounded-md px-2.5 py-1 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            {lang === 'zh' ? '跨时代对比' : 'Compare'}
          </a>
          <a href="#archive" className="rounded-md px-2.5 py-1 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            {lang === 'zh' ? '完整档案' : 'Archive'}
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16 sm:pb-20">
        {/* Editorial Hero */}
        <section className="max-w-4xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E14D2A]/25 bg-[#E14D2A]/[0.08] px-3 py-1 text-xs font-semibold text-[#E14D2A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[26px] sm:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15] sm:leading-[1.12]">
            {t.heroTitlePrefix}{' '}
            <span className="text-[#E14D2A]">{t.heroTitleHighlight}</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 max-w-3xl">
            {t.heroDesc}
          </p>

          {/* Canonical Prompt Strip */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200/90 bg-white p-3 sm:px-4 shadow-sm max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-[#0E7490]" />
              {t.promptLabel}:
            </span>
            <code className="flex-1 min-w-[180px] break-words font-mono text-xs sm:text-sm font-medium text-zinc-900">
              {CANONICAL_PROMPT}
            </code>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-[#FAF8F4] px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? t.copied : t.copyPrompt}</span>
            </button>
          </div>
        </section>

        {/* Main Interactive Timeline Section */}
        <section id="timeline" className="mt-8 sm:mt-10 scroll-mt-24 sm:scroll-mt-20 space-y-4 sm:space-y-5">
          <TimelineScrubber
            entries={filteredEntries}
            activeIndex={safeIndex}
            onSelectIndex={handleSelectIndex}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            selectedLab={selectedLab}
            onSelectLab={handleSelectLab}
            availableLabs={availableLabs}
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            <div className="lg:col-span-7 min-w-0">
              <SvgStage
                entry={activeEntry}
                lang={lang}
                onPinCompare={handlePinCompare}
                compareAId={compareAId}
                compareBId={compareBId}
              />
            </div>
            <div className="lg:col-span-5 flex min-w-0">
              <CuratorCard entry={activeEntry} lang={lang} />
            </div>
          </div>
        </section>

        {/* Side-by-Side Diff */}
        <ComparisonPanel
          entries={ALL_ENTRIES}
          leftId={compareAId}
          rightId={compareBId}
          onChangeLeft={setCompareAId}
          onChangeRight={setCompareBId}
          onSwap={() => {
            setCompareAId(compareBId);
            setCompareBId(compareAId);
          }}
          lang={lang}
        />

        {/* Full Chronological Archive Grid */}
        <ArchiveGrid
          entries={ALL_ENTRIES}
          activeId={activeEntry.id}
          onJump={handleJumpToId}
          onCompare={handleQuickCompareFromCard}
          lang={lang}
        />
      </main>

      <footer className="border-t border-zinc-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="space-y-1 max-w-2xl">
            <p>{t.footerOrigin}</p>
            <p className="font-mono text-[11px] text-zinc-400">{t.footerExtend}</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-zinc-600 shrink-0">
            <PelicanLogo className="w-6 h-6" />
            <span>ridingpelican.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
