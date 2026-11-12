# Riding Pelican (`ridingpelican.com`)

**AI 智商进化时间轴 · AI Evolution Timeline (2024–2026)**

An interactive bilingual (中文 / EN) timeline showcasing how frontier and open-weight LLMs evolved on Simon Willison's famous SVG benchmark:

> `Generate an SVG of a pelican riding a bicycle`

## Features

- **2024–2026 Interactive Timeline Scrubber**: Scrub across 18 curated benchmark outputs from Oct 2024 (`GPT-3.5 Turbo`, `Claude 3 Haiku`, `GPT-4o`, `Claude 3.5 Sonnet`) through 2025 (`Gemini 2.5 Pro`, `OpenAI o3-pro`, `GPT-5 mini`, `Claude Sonnet 4.5`, `Gemini 3 Flash`) to 2026 (`Qwen 3.5`, `DeepSeek V4 Pro`, `Gemini 3.5 Flash`, `Kimi K3`, `Claude Fable 5.1`, `GPT-6 Astra`).
- **Auto-Play Time-Lapse & Keyboard Navigation**: Watch AI spatial reasoning evolve step-by-step or scrub with `←` / `→` arrow keys.
- **Then vs. Now Side-by-Side Diff**: Compare any two models side-by-side.
- **Drafting Grid Preview + Raw SVG Inspector**: Toggle light/dark coordinate canvas, zoom, copy raw SVG, and inspect real node/path metrics.
- **Bilingual Switcher**: Instant `中文 / EN` UI and curator notes toggle.

## Development

```bash
npm install
npm run dev
npm run build
```

## Extending the Timeline

Append a new entry to `src/data/timeline.json` following the `TimelineEntry` schema in `src/types/timeline.ts`.

## Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`

## Attribution

Historical benchmark SVGs, dates, and references are curated with attribution from Simon Willison's public posts (`simonwillison.net/tags/pelican-riding-a-bicycle/`) and `github.com/simonw/pelican-bicycle`.
