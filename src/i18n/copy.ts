import { EraMeta, Lang } from '../types/timeline';

export const ERAS: EraMeta[] = [
  {
    id: '2024-chaos',
    period: '2024 Q4',
    title: {
      zh: '第一阶段 · 混沌几何与结构错位',
      en: 'Phase I · Geometric Chaos & Disconnected Anatomy',
    },
    subtitle: {
      zh: '早期非推理大模型几乎靠“盲画”：轮子常飘在半空、车架断裂，鹈鹕缩成几块几何色块。',
      en: 'Early non-reasoning LLMs drew blind: floating wheels, broken frames, and abstract geometric blobs.',
    },
    accentColor: '#94A3B8',
  },
  {
    id: '2025-reasoning',
    period: '2025',
    title: {
      zh: '第二阶段 · 推理觉醒与空间对齐',
      en: 'Phase II · Reasoning Awakening & Spatial Alignment',
    },
    subtitle: {
      zh: '引入长链思考（Thinking / o-series）后，模型开始学会算坐标：坐垫对齐车身、脚踏连上双腿、喉囊与鸟喙成形。',
      en: 'With chain-of-thought reasoning models, coordinates started clicking: saddles met frames, feet hit pedals, pouches took shape.',
    },
    accentColor: '#0E7490',
  },
  {
    id: '2026-mastery',
    period: '2026',
    title: {
      zh: '第三阶段 · 高精度矢量、开源爆发与“鹈鹕过拟合”',
      en: 'Phase III · High-Precision Vectors, Open-Weight Surge & Pelicanmaxxing',
    },
    subtitle: {
      zh: '中外开源与闭源旗舰集体卷出复杂分层 SVG、渐变光影乃至动画——社区也开始讨论“是不是特意刷题了？”。',
      en: 'Frontier & open-weight models alike began generating layered vector scenes, shading, and animations—sparking "pelicanmaxxing" debates.',
    },
    accentColor: '#E14D2A',
  },
];

export const UI_COPY: Record<
  Lang,
  {
    siteTitle: string;
    siteTagline: string;
    heroBadge: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroDesc: string;
    promptLabel: string;
    copyPrompt: string;
    copied: string;
    playTimeline: string;
    pauseTimeline: string;
    prevModel: string;
    nextModel: string;
    allLabs: string;
    eraJumpTitle: string;
    canvasBgLight: string;
    canvasBgDark: string;
    viewSource: string;
    hideSource: string;
    copySvg: string;
    pinCompareA: string;
    pinCompareB: string;
    compareTitle: string;
    compareSubtitle: string;
    comparePlaceholder: string;
    swapCompare: string;
    metricsSize: string;
    metricsElements: string;
    metricsPaths: string;
    metricsViewBox: string;
    animatedBadge: string;
    staticBadge: string;
    curatorNoteTitle: string;
    verifiedSource: string;
    archiveGridTitle: string;
    archiveGridSubtitle: string;
    jumpToStage: string;
    compareAction: string;
    footerOrigin: string;
    footerExtend: string;
    keyboardHint: string;
    effortLabel: string;
  }
> = {
  zh: {
    siteTitle: 'Riding Pelican',
    siteTagline: 'AI 智商进化时间轴 · 2024–2026',
    heroBadge: '大模型空间推理的“照妖镜”编年史',
    heroTitlePrefix: '一只鹈鹕骑自行车，如何测出',
    heroTitleHighlight: 'AI 两年来的智商跃迁',
    heroDesc:
      '2024 年 10 月 25 日，开发者 Simon Willison 用一句看似荒诞的提示词让大模型用纯 SVG 代码画“鹈鹕骑车”。本时间轴整理了从 2024 到 2026 年各大模型的真实公开输出样本，带你一滑看懂 AI 空间逻辑与矢量代码能力的进化史。',
    promptLabel: '标准测试提示词',
    copyPrompt: '复制提示词',
    copied: '已复制',
    playTimeline: '自动回放进化史',
    pauseTimeline: '暂停回放',
    prevModel: '上一个节点',
    nextModel: '下一个节点',
    allLabs: '全部厂商',
    eraJumpTitle: '三个演进时代',
    canvasBgLight: '浅色坐标纸',
    canvasBgDark: '深色画板',
    viewSource: '查看 SVG 源码',
    hideSource: '收起源码',
    copySvg: '复制 SVG',
    pinCompareA: '设为对比左侧 (A)',
    pinCompareB: '设为对比右侧 (B)',
    compareTitle: '跨时代同屏对比 · Then vs Now',
    compareSubtitle: '任选两个年份或厂商的真实输出并排查看，直观感受坐标对齐与结构精细度的代差。',
    comparePlaceholder: '从下方时间轴或档案卡片中选择样本',
    swapCompare: '左右互换',
    metricsSize: '代码体积',
    metricsElements: 'SVG 节点',
    metricsPaths: '路径数量',
    metricsViewBox: '画布 ViewBox',
    animatedBadge: '含动态效果',
    staticBadge: '静态矢量',
    curatorNoteTitle: '空间结构观察',
    verifiedSource: '查看原始测试出处',
    archiveGridTitle: '完整演进档案库',
    archiveGridSubtitle: '按时间顺序收录的公开测试样本（含开源模型与闭源旗舰），点击任意卡片即可跳转时间轴。',
    jumpToStage: '定位到主舞台',
    compareAction: '加入对比',
    footerOrigin: '历史样本与测试出处整理自 Simon Willison 的开源归档（simonw/pelican-bicycle 与 simonwillison.net），仅作教育展示与行业演进记录，版权归各原模型/归档出处所有。',
    footerExtend: '站点支持纯 JSON 扩展：只需向 src/data/timeline.json 追加条目即可新增模型里程碑。',
    keyboardHint: '支持键盘 ← / → 切换节点',
    effortLabel: '推理档位',
  },
  en: {
    siteTitle: 'Riding Pelican',
    siteTagline: 'AI Evolution Timeline · 2024–2026',
    heroBadge: 'An Informal Spatial-Reasoning Chronicle',
    heroTitlePrefix: 'How a Pelican on a Bike Charted',
    heroTitleHighlight: 'Two Years of AI Progress',
    heroDesc:
      'On October 25, 2024, Simon Willison gave LLMs a deceptively silly prompt: write raw SVG code for a pelican riding a bicycle. Scrub across real public benchmark outputs from 2024 to 2026 to watch models evolve from abstract geometric chaos to intricate vector geometry.',
    promptLabel: 'Canonical Prompt',
    copyPrompt: 'Copy Prompt',
    copied: 'Copied',
    playTimeline: 'Play Evolution',
    pauseTimeline: 'Pause',
    prevModel: 'Previous',
    nextModel: 'Next',
    allLabs: 'All Labs',
    eraJumpTitle: 'Three Eras of Spatial IQ',
    canvasBgLight: 'Light Grid',
    canvasBgDark: 'Dark Canvas',
    viewSource: 'View SVG Source',
    hideSource: 'Hide Source',
    copySvg: 'Copy SVG',
    pinCompareA: 'Pin Left (A)',
    pinCompareB: 'Pin Right (B)',
    compareTitle: 'Then vs. Now · Side-by-Side Diff',
    compareSubtitle: 'Compare any two milestones side by side to see how coordinate math, bird anatomy, and bicycle mechanics evolved.',
    comparePlaceholder: 'Select any milestone below',
    swapCompare: 'Swap',
    metricsSize: 'Payload',
    metricsElements: 'SVG Nodes',
    metricsPaths: '<path> Tags',
    metricsViewBox: 'ViewBox',
    animatedBadge: 'Animated',
    staticBadge: 'Static SVG',
    curatorNoteTitle: 'Spatial & Structural Notes',
    verifiedSource: 'Original Benchmark Source',
    archiveGridTitle: 'Full Chronological Archive',
    archiveGridSubtitle: 'Every curated benchmark specimen in chronological order. Click any card to inspect it on the main stage.',
    jumpToStage: 'Inspect',
    compareAction: 'Compare',
    footerOrigin: 'Archived samples & dates are curated from Simon Willison’s public Pelican Benchmark posts and simonw/pelican-bicycle repository with full attribution.',
    footerExtend: 'JSON-extensible architecture: append any new model output to src/data/timeline.json to extend the chronicle.',
    keyboardHint: 'Use ← / → arrow keys to scrub',
    effortLabel: 'Reasoning Effort',
  },
};
