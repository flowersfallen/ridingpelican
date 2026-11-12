import fs from 'node:fs';
import path from 'node:path';

const scriptsDir = 'd:/ridingpelican/scripts';
const outFile = 'd:/ridingpelican/src/data/timeline.json';

const raw = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'raw-samples.json'), 'utf8'));
const extra = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'extra-samples.json'), 'utf8'));
const more = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'more-samples.json'), 'utf8'));
const grid = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'grid-samples.json'), 'utf8'));

const svgMap = new Map();
for (const item of raw) svgMap.set(item.id, item.svg);
svgMap.set('gemini-25-pro', extra['gemini-25-pro-2'].svg);
svgMap.set('claude-sonnet-45', extra['claude-sonnet-45-alt'].svg);
svgMap.set('gpt-5-mini', more['gpt5-mini'].svg);
svgMap.set('gemini-3-flash-high', more['gem3-flash-high'].svg);
svgMap.set('gemini-35-flash', more['gemini35-flash'].svg);
svgMap.set('kimi-k3', extra['kimi-k3'].svg);
svgMap.set('claude-fable-51-max', grid.claudeFable51Max);
svgMap.set('gpt-6-astra-max', grid.gpt6AstraMax);

function computeMetrics(svg) {
  const bytes = Buffer.byteLength(svg, 'utf8');
  const elements = (svg.match(/<[a-zA-Z]+[\s>]/g) || []).length;
  const paths = (svg.match(/<path[\s>]/gi) || []).length;
  const circles = (svg.match(/<circle[\s>]/gi) || []).length;
  const hasAnimation = /<animate|@keyframes|animation\s*:/i.test(svg);
  const vbMatch = svg.match(/viewBox=["']([^"']+)["']/i);
  let viewBox = vbMatch ? vbMatch[1] : '';
  if (!viewBox) {
    const svgTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
    const w = svgTag.match(/(?:^|\s)width\s*=\s*["']?(\d+(?:\.\d+)?)/i)?.[1] ?? '?';
    const h = svgTag.match(/(?:^|\s)height\s*=\s*["']?(\d+(?:\.\d+)?)/i)?.[1] ?? '?';
    viewBox = w !== '?' && h !== '?' ? `0 0 ${w} ${h} (inferred)` : 'missing';
  }
  return { bytes, elements, paths, circles, hasAnimation, viewBox };
}

const specs = [
  {
    id: 'gpt-35-turbo',
    date: '2024-10-25',
    era: '2024-chaos',
    model: 'GPT-3.5 Turbo',
    lab: 'OpenAI',
    iqStageLabel: { zh: '原始几何积木期', en: 'Primitive Shape Soup' },
    headline: {
      zh: '用纯黑色长方形当“自行车车架”，9 个基础标签草草收场',
      en: 'A solid black rectangle stands in for a bike frame across just 9 SVG tags',
    },
    spatialNotes: {
      zh: '零 <path> 贝塞尔路径，仅靠 6 个圆、1 个黑矩形和 1 个小三角拼凑。两个 r=5 的实心小黑圆紧贴在矩形底部下方，完全没有机械结构概念。',
      en: 'Zero <path> elements—just 6 circles, 1 black rectangle as the "frame," and a tiny orange triangle. An iconic Day-1 baseline showing how early LLMs coded blind.',
    },
    tags: ['day-1-baseline', 'zero-paths', 'primitive-shapes'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/gpt-3.5-turbo.svg',
  },
  {
    id: 'claude-3-haiku',
    date: '2024-10-25',
    era: '2024-chaos',
    model: 'Claude 3 Haiku',
    lab: 'Anthropic',
    iqStageLabel: { zh: '抽象色块重叠期', en: 'Overlapping Gradient Blobs' },
    headline: {
      zh: '引入了渐变色和 <path>，但鹈鹕和车轮直接叠在了一起',
      en: 'Introduced linear gradients and paths, yet bird and wheels collide awkwardly',
    },
    spatialNotes: {
      zh: '虽然写出了 body-gradient 和 beak-gradient 渐变定义，但通过 translate(100,150) 组合后，实心灰轮和曲线鸟身上下交叠，缺乏清晰的骑乘空间关系。',
      en: 'Uses nice linear gradients and grouped <g> tags, but the solid grey wheels and blobby pelican geometry collide inside the coordinate group.',
    },
    tags: ['early-claude', 'gradients', 'overlap-bug'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/claude-3-haiku-20240307.svg',
  },
  {
    id: 'gpt-4o',
    date: '2024-10-25',
    era: '2024-chaos',
    model: 'GPT-4o',
    lab: 'OpenAI',
    iqStageLabel: { zh: '雪人直立悬空期', en: 'Vertical Snowman-Bird' },
    headline: {
      zh: '能画出三角车架，但鹈鹕像雪人一样直挺挺站在车顶且双脚悬空',
      en: 'Gets two wheels and a frame triangle, while a snowman-like bird floats vertically on top',
    },
    spatialNotes: {
      zh: '2024 主力旗舰的经典翻车图：双轮和简单三角架已经成型，但鹈鹕被画成直立椭圆+圆头，“双腿”垂直悬空在 y=100~120 之间，没有踏板也没有 viewBox。',
      en: 'A classic 2024 flagship artifact: proper hollow wheels and a frame triangle, topped by an upright snowman-like pelican whose short orange legs dangle in mid-air.',
    },
    tags: ['2024-flagship', 'floating-legs', 'no-viewbox'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/gpt-4o.svg',
  },
  {
    id: 'claude-35-sonnet',
    date: '2024-10-25',
    era: '2024-chaos',
    model: 'Claude 3.5 Sonnet (Oct 2024)',
    lab: 'Anthropic',
    iqStageLabel: { zh: '2024 年早期孤勇黑马', en: '2024 Early Standout' },
    headline: {
      zh: '仅用 15 个轻量标签就摆出了“前倾鸟身+弯颈+车架”的雏形',
      en: 'Achieved a recognizable side profile in just 15 minimalist SVG nodes',
    },
    spatialNotes: {
      zh: '这个基准梗在 2024 年 10 月走红时的代表作之一。虽然依然偏火柴人极简风，但已经比同期模型更早理解“鸟身水平伏在车架上方、脖子向前伸出”的姿态。',
      en: 'One of the standout outputs when the benchmark went viral in Oct 2024. Minimalist geometry, yet early mastery of horizontal bird posture above the bike.',
    },
    tags: ['viral-origin', 'minimalist', '15-nodes'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/claude-3-5-sonnet-20241022.svg',
  },
  {
    id: 'o1-preview',
    date: '2024-10-25',
    era: '2024-chaos',
    model: 'OpenAI o1-preview',
    lab: 'OpenAI',
    iqStageLabel: { zh: '初代推理模型试水', en: 'First Reasoning Attempt' },
    headline: {
      zh: '注释开始显露“分步施工思路”，但坐标依然停留在早期水平',
      en: 'Step-by-step code comments appear, though spatial proportions still lag',
    },
    spatialNotes: {
      zh: '源码注释出现了清晰的步骤拆解（Draw wheels → frame → handlebar → pedals），能画出脚踏雏形；但受限于早期训练分布，鹈鹕依旧呈垂直椭圆且缺少 viewBox。',
      en: 'Shows early chain-of-thought structure in its ordered comments, even adding pedal lines—yet still places a vertical slate-blue oval upright over the seat tube.',
    },
    tags: ['early-reasoning', 'step-by-step', 'missing-viewbox'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/o1-preview.svg',
  },
  {
    id: 'gemini-exp-1206',
    date: '2024-12-06',
    era: '2024-chaos',
    model: 'Gemini Exp 1206',
    lab: 'Google',
    iqStageLabel: { zh: '年末构图大跃迁', en: 'Late-2024 Compositional Leap' },
    headline: {
      zh: '代码量翻倍到 3.5 KB：首次补全蓝天草地背景与简化车轮辐条',
      en: 'Payload jumps to 3.5 KB with sky/ground scenery and simplified wheel spokes',
    },
    spatialNotes: {
      zh: '2024 年底的明显分水岭：开始采用规范的 <g id="bicycle"> 与 <g id="pelican"> 图层分组，加入了天空地面和车轮辐条，告别了早期纯线框时代。',
      en: 'A clear late-2024 inflection point: layered <g id="bicycle"> and <g id="pelican"> groups, sky-and-ground framing, and spoked wheels.',
    },
    tags: ['scene-backdrop', 'spokes', 'layer-groups'],
    sourceLabel: 'simonw/pelican-bicycle',
    sourceUrl: 'https://github.com/simonw/pelican-bicycle/blob/main/gemini-exp-1206.svg',
  },
  {
    id: 'gemini-25-pro',
    date: '2025-05-06',
    era: '2025-reasoning',
    model: 'Gemini 2.5 Pro Preview',
    lab: 'Google',
    iqStageLabel: { zh: '机械结构精准解构', en: 'Mechanical Frame Decomposition' },
    headline: {
      zh: '严格区分下叉、立管与主三角车架，推理坐标对齐明显成型',
      en: 'Explicitly models chainstays, seat tubes, and dual spoked wheels via reasoning',
    },
    spatialNotes: {
      zh: '2025 年春推理模型爆发的缩影：代码注释细致到 "Main triangle lower part and chainstay" 和 "Seat tube"，55 个矢量节点把单车机械结构稳定立住。',
      en: 'Reflects the spring-2025 reasoning leap: comments detail "Main triangle lower part and chainstay" and "Seat tube" across 55 clean geometric elements.',
    },
    tags: ['diamond-frame', '55-nodes', 'reasoning-era'],
    sourceLabel: 'Simon Willison · Gemini 2.5 Pro',
    sourceUrl: 'https://simonwillison.net/2025/May/6/gemini-25-pro-preview/',
  },
  {
    id: 'o3-pro',
    date: '2025-06-10',
    era: '2025-reasoning',
    model: 'OpenAI o3-pro',
    lab: 'OpenAI',
    iqStageLabel: { zh: '硬核工程师制图期', en: 'Engineering Blueprint Era' },
    headline: {
      zh: '仅 2.4 KB 就用工程制图般的分块把车架各管件精确对齐',
      en: 'Compact 2.4 KB blueprint explicitly naming seat tube, top tube, down tube & chainstay',
    },
    spatialNotes: {
      zh: '极具“理工科强迫症”风格的输出：用 ========== BICYCLE ========== 分区注释，依次计算立管、上管、下管和后下叉坐标，不再依赖盲猜。',
      en: 'Reads like a CAD spec sheet: sectioned comments separate seat tube, top tube, down tube, and chainstay so every joint meets cleanly.',
    },
    tags: ['cad-style', 'o3-series', 'clean-geometry'],
    sourceLabel: 'Simon Willison · o3-pro',
    sourceUrl: 'https://simonwillison.net/2025/Jun/10/o3-pro/',
  },
  {
    id: 'gpt-5-mini',
    date: '2025-08-07',
    era: '2025-reasoning',
    model: 'GPT-5 mini',
    lab: 'OpenAI',
    iqStageLabel: { zh: '光影与渐变全面普及', en: 'Shading, Filters & Rich Detail' },
    headline: {
      zh: '节点数破百：Mini 级模型开始自带多组渐变、投影滤镜与完整曲柄脚踏',
      en: 'Crosses 100+ nodes: mini-tier models now ship gradients, drop shadows & cranksets',
    },
    spatialNotes: {
      zh: '短短十个月内，连轻量档的 GPT-5 mini 也输出了 7.9 KB / 102 个节点：涵盖 sky、beakGrad、tireGrad 等 7 组渐变和 <filter id="shadow"> 阴影滤镜。',
      en: 'Just ten months after GPT-3.5’s 9 tags, even a mini model emits 102 nodes with 7 gradients (sky, beakGrad, tireGrad, frameGrad) plus an SVG shadow filter.',
    },
    tags: ['100+-nodes', 'drop-shadow', 'mini-tier-leap'],
    sourceLabel: 'Simon Willison · GPT-5',
    sourceUrl: 'https://simonwillison.net/2025/Aug/7/gpt-5/',
  },
  {
    id: 'claude-sonnet-45',
    date: '2025-09-29',
    era: '2025-reasoning',
    model: 'Claude Sonnet 4.5',
    lab: 'Anthropic',
    iqStageLabel: { zh: '凝练干净的矢量审美', en: 'Crisp Minimalist Precision' },
    headline: {
      zh: '不靠堆砌复杂滤镜，26 个节点就把轮距、车把和鸟身比例拿捏到位',
      en: 'Cleanly nails bike geometry and pelican posture in just 26 disciplined nodes',
    },
    spatialNotes: {
      zh: '典型 Claude 风格：克制、少冗余代码（仅 2.6 KB），车轮、车座、车把、踏板和鹈鹕轮廓的相对位置高度协调，几乎没有多余废笔。',
      en: 'Signature Claude restraint: just 2.6 KB and 26 elements, balancing seat height, handlebars, pedal crank, and pelican proportions cleanly.',
    },
    tags: ['claude-4.5', 'clean-svg', 'proportion'],
    sourceLabel: 'Simon Willison · Claude Sonnet 4.5',
    sourceUrl: 'https://simonwillison.net/2025/Sep/29/claude-sonnet-4-5/',
  },
  {
    id: 'gemini-3-flash-high',
    date: '2025-12-17',
    era: '2025-reasoning',
    model: 'Gemini 3 Flash',
    lab: 'Google',
    effort: 'high',
    iqStageLabel: { zh: '思考档位调优时代', en: 'Thinking-Level Scaling' },
    headline: {
      zh: '2025 年底的“思考预算”玩法：用 Flash 模型开 high 推理画出精炼矢量',
      en: 'Late-2025 thinking-budget paradigm: tuning Flash with high thinking effort',
    },
    spatialNotes: {
      zh: '年末测评开始重点对比同一模型在不同 thinking_level（minimal / low / medium / high）下的画风差异——仅 2.0 KB / 12 条路径就在 200x200 画布内紧凑完成。',
      en: 'Demonstrates the late-2025 shift toward controllable thinking effort—packing 12 paths and spoked wheels neatly inside a compact 200x200 coordinate space.',
    },
    tags: ['thinking-level', 'flash-tier', '2025-finale'],
    sourceLabel: 'Simon Willison · Gemini 3 Flash',
    sourceUrl: 'https://simonwillison.net/2025/Dec/17/gemini-3-flash/',
  },
  {
    id: 'claude-sonnet-46',
    date: '2026-02-17',
    era: '2026-mastery',
    model: 'Claude Sonnet 4.6',
    lab: 'Anthropic',
    iqStageLabel: { zh: '2026 高稳态基准达成', en: '2026 Baseline Mastery' },
    headline: {
      zh: '前后轮毂与辐条独立拆组，背景与骑行主体成为常规标配',
      en: 'Separate rear/front hubs, full spokes, and sky-ground composition become routine',
    },
    spatialNotes: {
      zh: '进入 2026 年初，主流中坚模型已能稳定输出 5 KB 左右的完整场景图，前轮辐条、后轮辐条和轮毂各成体系，基本告别结构崩塌。',
      en: 'By Feb 2026, mid-tier workhorse models routinely deliver ~5 KB multi-layered scenes with distinct rear/front wheel hubs and consistent proportions.',
    },
    tags: ['2026-start', '5kb-class', 'hub-spokes'],
    sourceLabel: 'Simon Willison · Claude Sonnet 4.6',
    sourceUrl: 'https://simonwillison.net/2026/Feb/17/claude-sonnet-46/',
  },
  {
    id: 'qwen-35',
    date: '2026-02-17',
    era: '2026-mastery',
    model: 'Qwen 3.5 (397B-A17B)',
    lab: 'Alibaba Qwen',
    iqStageLabel: { zh: '开源 MoE 追平闭源', en: 'Open-Weight MoE Surge' },
    headline: {
      zh: '开源大参数 MoE 加入战局：20 条贝塞尔路径与地面投影一次成型',
      en: 'Open-weight MoE delivers 20 smooth Bezier paths and grounded drop shadows',
    },
    spatialNotes: {
      zh: '2026 年中国开源模型在空间代码生成上的代表节点：500x500 画布内主动加入了 Ground Shadow 地面投影和独立 Bicycle Group，曲线流畅度显著提升。',
      en: 'Marks the 2026 surge of open-weight Chinese models: adds a dedicated ground shadow and 20 clean Bezier <path> curves inside a 500x500 frame.',
    },
    tags: ['open-weight', 'moe', 'ground-shadow'],
    sourceLabel: 'Simon Willison · Qwen 3.5',
    sourceUrl: 'https://simonwillison.net/2026/Feb/17/qwen35/',
  },
  {
    id: 'deepseek-v4-pro',
    date: '2026-04-24',
    era: '2026-mastery',
    model: 'DeepSeek V4 Pro',
    lab: 'DeepSeek',
    iqStageLabel: { zh: '电影级场景叙事', en: 'Full Scenic Vector Storytelling' },
    headline: {
      zh: '飙到 11 KB / 125 节点：加入烈日环境、速度风线、传动链条与喉囊渐变',
      en: 'Explodes to 11 KB / 125 nodes: sun, wind lines, drivetrain, and shaded gular pouch',
    },
    spatialNotes: {
      zh: '视觉细节密度剧增的里程碑：除了自行车传动系统（drivetrain）和左脚踏分层外，还自发渲染了 Wind Lines 速度线、地面阴影和专门的 Beak/Pouch 双渐变。',
      en: 'A massive leap in scene storytelling: adds wind motion lines, a full drivetrain group, ground shadows, and dual gradients for both beak and throat pouch.',
    },
    tags: ['11kb-svg', 'drivetrain', 'wind-lines'],
    sourceLabel: 'Simon Willison · DeepSeek V4',
    sourceUrl: 'https://simonwillison.net/2026/Apr/24/deepseek-v4/',
  },
  {
    id: 'gemini-35-flash',
    date: '2026-05-19',
    era: '2026-mastery',
    model: 'Gemini 3.5 Flash',
    lab: 'Google',
    iqStageLabel: { zh: '极致矢量细节狂潮', en: 'Ultra-Dense Vector Craft' },
    headline: {
      zh: '全档最高复杂度：17.6 KB / 187 节点，连车灯射出的光束和金属镀铬渐变都有',
      en: 'Highest density in the archive (17.6 KB / 187 nodes)—even includes a headlight beam',
    },
    spatialNotes: {
      zh: '包含 54 条 <path> 与 30 个 <circle>，定义了 sunset、chrome、lightBeam（车灯照射光束）、tireGrad、featherShadow 等 8 套渐变，把 Flash 级模型卷到了插画级。',
      en: 'Packs 54 paths, 30 circles, and 8 custom gradients (sunset, chrome, headlight beam, tire tread, feather shadow)—pushing Flash-tier SVG craft to illustration level.',
    },
    tags: ['17.6kb-svg', 'headlight-beam', '187-nodes'],
    sourceLabel: 'Simon Willison · Gemini 3.5 Flash',
    sourceUrl: 'https://simonwillison.net/2026/May/19/gemini-35-flash/',
  },
  {
    id: 'kimi-k3',
    date: '2026-07-16',
    era: '2026-mastery',
    model: 'Kimi K3',
    lab: 'Moonshot Kimi',
    iqStageLabel: { zh: '2.5D 遮挡纵深突破', en: 'True 2.5D Z-Order Layering' },
    headline: {
      zh: '解决“两条腿穿模”难题：显式把远侧腿垫在车架后面、近侧腿画在车架前面',
      en: 'Solves depth occlusion by interleaving far leg behind the frame and near leg in front',
    },
    spatialNotes: {
      zh: '观察源码注释可见关键进化：Wheels → Far leg (behind frame) → Bicycle frame → Drivetrain → Near leg。这是 2026 年模型真正理解三维遮挡顺序的标志。',
      en: 'Look at the layer order in code: Far leg (behind frame) → Bicycle frame → Drivetrain → Near leg. A landmark moment where LLMs mastered 2.5D occlusion.',
    },
    tags: ['z-order-depth', 'far-near-legs', '2.5d-occlusion'],
    sourceLabel: 'Simon Willison · Kimi K3',
    sourceUrl: 'https://simonwillison.net/2026/Jul/16/kimi-k3/',
  },
  {
    id: 'claude-fable-51-max',
    date: '2026-09-22',
    era: '2026-mastery',
    model: 'Claude Fable 5.1',
    lab: 'Anthropic',
    effort: 'max',
    iqStageLabel: { zh: '海滨风景插画级输出', en: 'Coastal Scenic Illustration' },
    headline: {
      zh: '10.9 KB / 139 节点：甚至自己加上了帆船、海浪、云朵与翅膀 <clipPath> 裁剪',
      en: '10.9 KB / 139 nodes complete with sailboat, ocean waves, speed lines & clipPath',
    },
    spatialNotes: {
      zh: '来自 2026 年 9 月 Claude 对比矩阵的 max 档输出：运用 wingClip 裁剪路径与远近双曲柄腿分层，整幅画面已经像是一张精心排版的海岸插画明信片。',
      en: 'Max-effort sample from the Sep 2026 Claude grid: combines sky, sea, sailboat, sand, speed lines, <clipPath> wing clipping, and front/back crank layering.',
    },
    tags: ['max-effort', 'clip-path', 'coastal-scene'],
    sourceLabel: 'Simon Willison · Claude Grid',
    sourceUrl: 'https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/',
  },
  {
    id: 'gpt-6-astra-max',
    date: '2026-10-26',
    era: '2026-mastery',
    model: 'GPT-6 Astra',
    lab: 'OpenAI',
    effort: 'max',
    iqStageLabel: { zh: '“刷榜时代”的巅峰答卷', en: 'Peak Precision & "Pelicanmaxxing"' },
    headline: {
      zh: '青绿色海滨车架、链条、脚蹼细节与头冠齐备——也引爆了“是否过拟合”的讨论',
      en: 'Teal frame, chain, webbed pedaling feet & head crest—fueling the "pelicanmaxxing" debate',
    },
    spatialNotes: {
      zh: '2026 年底基准测试已趋近“饱和”：GPT-6 Astra (max) 准确绘出链条、远近脚蹼、尾巴和头冠。同时社区也在热议：各家实验室是不是已经把鹈鹕骑车“刷进训练集”了？',
      en: 'By Oct 2026 the prompt hit benchmark saturation: GPT-6 Astra (max) nails the chain, webbed pedaling foot, far/near legs, and crest—raising "pelicanmaxxing" questions.',
    },
    tags: ['oct-2026-peak', 'max-effort', 'pelicanmaxxing'],
    sourceLabel: 'Simon Willison · OpenAI Oct 2026 Grid',
    sourceUrl: 'https://simonwillison.net/2026/Oct/26/gpt-61-terra/',
  },
];

const timeline = specs.map((spec) => {
  const svg = svgMap.get(spec.id);
  if (!svg) throw new Error('Missing SVG for ' + spec.id);
  return {
    ...spec,
    metrics: computeMetrics(svg),
    svg,
  };
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(timeline, null, 2));
console.log('Generated', outFile, 'with', timeline.length, 'entries, total size:', fs.statSync(outFile).size, 'bytes');
