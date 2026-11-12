export type Lang = 'zh' | 'en';

export type EraId = '2024-chaos' | '2025-reasoning' | '2026-mastery';

export type LabId =
  | 'OpenAI'
  | 'Anthropic'
  | 'Google'
  | 'DeepSeek'
  | 'Alibaba Qwen'
  | 'Moonshot Kimi';

export interface BilingualText {
  zh: string;
  en: string;
}

export interface SvgMetrics {
  bytes: number;
  elements: number;
  paths: number;
  circles: number;
  hasAnimation: boolean;
  viewBox: string;
}

export interface TimelineEntry {
  id: string;
  date: string; // YYYY-MM-DD
  era: EraId;
  model: string;
  lab: LabId;
  effort?: string;
  iqStageLabel: BilingualText;
  headline: BilingualText;
  spatialNotes: BilingualText;
  tags: string[];
  sourceLabel: string;
  sourceUrl: string;
  svgUrl?: string;
  svg: string;
  metrics: SvgMetrics;
}

export interface EraMeta {
  id: EraId;
  period: string;
  title: BilingualText;
  subtitle: BilingualText;
  accentColor: string;
}
