# Monthly AI Press · Workflow

> Hand this doc to an AI agent at the start of a new month; it should rebuild the same publication from the same template, only swapping content.
>
> Reference issue: April Press · Vol. 18 — https://cabiriawzy-hub.github.io/april-press/
> Reference repo: https://github.com/cabiriawzy-hub/april-press

---

## 0. TL;DR — what gets shipped each month

A single static site, ~17 chapters, bilingual zh/en, deployed to GitHub Pages.
Stripe Press-inspired editorial design: a stack of "books" on the home page, a long-scroll detail reader, three color themes, two languages, per-chapter drop-cap palette, real-time color blending as you scroll between chapters. No build step (React + Babel via CDN).

Deliverables:
1. `April Press.html` (React app, single file)
2. `data.js` (`window.ITEMS` array + `window.CATEGORIES`)
3. `styles.css`
4. `covers/vol-01.png` … `covers/vol-NN.png` (1024×1536 portrait)
5. `index.html` (meta-refresh redirect to entry)
6. Public URL on GitHub Pages

---

## 1. Concept & voice

**What this publication is.** A monthly editorial digest of one calendar month in AI: model releases, products, research, industry moves, open-source. NOT a news aggregator — every chapter is a written piece with a thesis, sourced. Closer in tone to *Stratechery* + *Stripe Press* than to *TechCrunch*.

**Target reader.** Someone who follows AI but missed half of last month. Each chapter should give them the framing they need to talk about that event with a peer, not just the news.

**Voice.**
- Concrete > clever. No wordplay that conflates technical and non-technical jargon.
- Short sentences inside long paragraphs.
- A clear thesis in the first 1–2 sentences.
- Bilingual: zh and en written separately (NOT translated). They can diverge in detail; both must read native.
- Pull quote per chapter — one line a peer would screenshot.

**Hard style rules** (learned from prior issues — do not relax):
- ❌ Never end a paragraph with a punny technical/non-technical conflation. Bad example: "可以 GA 但不可被读完的速度". Reads as decoded riddle, not understood.
- ❌ Never write "把它放在卷 X，是因为…" / "We placed it in Volume X because…". Connections between chapters belong INSIDE the prose, not as meta-placement justifications.
- ❌ No translation-style Chinese. E.g. "刀" as a batch quantifier reads as English-translated; use 「批」「轮」「次」.
- ✅ The first paragraph of each chapter must start with a DIFFERENT character across the issue (drop caps render the first letter big, so 17 chapters all starting with 「四」 looks like a typo).

---

## 2. Material selection

### Sources to scan (during the month)

| Source | Why |
|---|---|
| openai.com/blog, anthropic.com/news, deepmind.google/blog, x.ai/news | Lab announcements (model releases) |
| Stratechery, Latent Space, Import AI, Pragmatic Engineer | Editorial framing for stories |
| Karpathy gists, Mitchell Hashimoto blog, Simon Willison | Practitioner-level signals |
| Hacker News (top this month) | Sentiment + meta-discussion |
| arXiv cs.LG / cs.CL trending | Research breakthroughs |
| GitHub trending (Python + JS, language tag "AI") | Open-source momentum |
| AI Engineer (NA + Europe), NeurIPS/ICML/ICLR if in-month | Conference signals |
| TechCrunch / The Information / FT / WSJ AI desk | Industry deals, IPO, M&A |

### Volume count

15–18 chapters. Vol. 18 had 17. Less than 12 feels thin; more than 20 feels like a list, not an issue.

### Categories (5 fixed)

```js
window.CATEGORIES = {
  "all":         { zh: "全部",       en: "All" },
  "essay":       { zh: "思潮 · 评论", en: "Essays" },
  "product":     { zh: "新产品",      en: "Products" },
  "research":    { zh: "研究",        en: "Research" },
  "industry":    { zh: "行业 · 动态", en: "Industry" },
  "open-source": { zh: "开源",        en: "Open Source" }
};
```

Aim for 3–4 chapters per non-"all" category.

### Selection criteria (per candidate)

A candidate becomes a chapter if at least 2 of these are true:
1. It will still matter in 12 months (not just this week).
2. It connects to ≥1 other chapter in the same issue (cross-references in the prose make the issue feel coherent).
3. It has a non-obvious framing — something most people missed, OR a contrarian take.
4. It has a quotable line (for the pull quote).

If a candidate is just "X released Y" with no framing, drop it or merge into a roundup chapter.

---

## 3. Content writing

### Per-chapter data shape

```js
{
  id: "vol-01",                       // "vol-NN"
  no: "01",                           // padded
  cat: "research",                    // one of CATEGORIES keys (not "all")
  title_zh: "情绪向量",
  title_en: "Emotion Vectors",
  sub_zh: "Anthropic 在模型内部找到了 171 种情绪概念的方向",
  sub_en: "Anthropic located 171 emotion-concept directions inside the model.",
  pull_zh: "「我们或许从未需要「真情感」的证明，只需要承认它在内部留下的痕迹。」",
  pull_en: "「Perhaps we never needed proof of 'real emotion'; we only needed to admit the trace it leaves inside.」",
  body_zh: ["第一段…", "第二段…", ...],   // array, 4–6 paragraphs
  body_en: ["First para…", "Second…", ...],
  author: "Anthropic Interpretability",
  date: "April 02, 2026",
  minutes: 6,                         // estimated read time
  sources: [
    { label: "Anthropic · interpretability post", url: "https://…" },
    { label: "Lex Fridman interview clip",          url: "https://…" }
  ],
  spine: {                            // 3D book palette
    w: 50, h: 320,                    // spine size (visual variety)
    bg: "#5C2A2A",                    // book cover bg / detail page bg base
    fg: "#EFE4CC",                    // cover text color
    accent: "#A33A2A",                // gold/red accent
    drop: "#E8B49C"                   // drop cap & active rail color
  }
}
```

### Length targets

- title: 4–10 chars zh / 1–4 words en
- sub: 1 sentence
- pull: 1 sentence in 「」
- body: ~1500 chars zh / ~1500–2000 words en (roughly equivalent reading time, NOT line-by-line equivalent)
- 4–6 paragraphs per body
- sources: 2–4 entries

### Issue-level intro (in App.jsx / `T` object)

- **Hero subtitle (`sub`)**: ONE sentence stating the issue's headline takeaway. Must NOT overlap with editor's note.
- **Editor's note (`editor`)**: 80–120 chars zh, names 3–5 specific events from the issue, ends with how to read it. NEVER use closing wordplay like "落定的几条边" — reads as opaque metaphor.

Example (Vol. 18, after revision):

```
sub_zh: "四月，AI 的工程重心第一次明确从模型本身，移到了模型外那一层。"

editor_zh: "本期 17 篇，写在四月——一个节奏太密、需要慢读的月份。模型按周发布、harness 自成学科、开源同月被拆成三种立场、OpenAI 第一次像在做减法。每一篇单独看是新闻；合起来看，是 2026 年 AI 工程在朝哪个方向收敛。"
```

### Drop-cap variety rule

Each chapter's first body paragraph starts with a different first character. With 17 chapters in zh, do NOT let 「四月」 / 「四日」 / 「四号」 stack at the top of every chapter. Vary openings: name, place, action verb, quoted phrase, time other than month. After drafting, scan body_zh[0][0] for all chapters and rewrite collisions.

### Cross-references

Inside a chapter's prose, refer to other chapters as `卷 N` / `Volume N` for the issue-internal index. Don't justify volume placement — describe the connection naturally.

> Good: "Karpathy 的 LLM Wiki（卷二）、Hashimoto 的 Agent = Model + Harness（卷六）共同指向同一件事——工程边界在外移。"
>
> Bad: "我们把它放在卷 7，是因为它和卷二、卷六构成了 harness 家族。"

---

## 4. Cover art

### Specs

- Dimensions: **1024 × 1536** (portrait, 2:3)
- Format: PNG
- Filenames: `covers/vol-01.png` … `covers/vol-NN.png` (numeric, padded)
- Optional `covers/manifest.js` for manual override:
  ```js
  window.COVER_ASSETS = {
    "vol-01": "covers/custom-emotion.png",  // overrides auto-detection
    // ...
  };
  ```

### Style direction

Stripe Press / book-cover language, NOT generic AI poster art:
- One central motif (object, diagram, anatomy plate, geometric form, single illustration). NOT a collage.
- Restrained palette: 2–3 colors max, dominated by the spine.bg.
- Type-driven OR central-illustration; avoid both at once.
- Slight texture (paper grain, halftone, etching cross-hatch). NEVER glossy AI gradient.
- Era references that work: 19th-century medical engravings, mid-century Polish poster, Penguin Modern Classics, Stripe Press itself, NYRB Classics.

### Generation prompt template

For GPT Image / DALL·E 3 / Midjourney v6+:

```
A book cover, portrait 2:3, Stripe Press editorial style.
Subject: [one sentence describing the chapter's central image — e.g.
"a 19th-century anatomical phrenology head with 171 numbered emotion
labels radiating outward like meridians"].
Color palette: [primary], [secondary], [accent] — drawn from a single
era reference (e.g. "Mid-century Polish film poster · faded ochre + ink").
Texture: paper grain, slight halftone.
Type: NO TYPE on the cover (we composite title in the UI).
Composition: centered, generous margin, single dominant element,
nothing in corners.
Avoid: AI sheen, neon gradients, holographic, glassmorphism, photographic
realism, multi-layered collage, chrome, 3D render look.
```

Run all 17 prompts in one batch with shared style preamble + per-vol subject. Save each as `covers/vol-NN.png`. **Do NOT include text on the cover** — the UI overlays the title at runtime.

### Spine palette (data.js)

For each chapter define `spine: { w, h, bg, fg, accent, drop }`. Pick `bg` to match the cover's dominant color so the detail-page bg blends naturally as the user scrolls. Pick `drop` to be a clearly distinguishable warm/saturated note that pops against bg AND varies across the issue. Bad: 17 chapters with `accent: "#D9B26A"` (gold) → drop caps all gold. Good: oxblood→peach, navy→ice blue, charcoal→terracotta, plum→rose-pink, etc.

Reference palette from Vol. 18 (use as starting points, vary per cover):

| spine.bg | drop |
|---|---|
| `#5C2A2A` oxblood | `#E8B49C` peach-rose |
| `#1F3A4A` teal-navy | `#F0C56A` warm gold |
| `#1A2A3F` deep navy | `#BFD2E8` ice blue |
| `#2A2A2A` charcoal | `#E0A56A` terracotta |
| `#4A3F2A` olive brown | `#E8C474` mustard |
| `#2A2F3A` slate | `#BCD0E5` steel cool |
| `#7A1F1F` deep red | `#F0DAA0` champagne |
| `#1F3A2A` forest | `#E2BC60` wheat |
| `#4A1F4A` plum | `#E0A8D2` rose-pink |
| `#3F2A1F` cocoa | `#F0CFA0` cream |
| `#1A3A3A` teal | `#DDB060` ochre |
| `#2A2A4A` indigo | `#B8A0DC` lavender |
| `#5C3A1F` sienna | `#F0DCB8` linen |
| `#1F4A4A` deep teal | `#E89A6A` coral |
| `#2A1F3A` deep purple | `#D9A8E2` orchid |
| `#1A2A2A` dark slate | `#B8D2C8` sage mint |
| `#0F2A4A` deep blue | `#E8B47A` warm peach |

---

## 5. UI/UX architecture

### Three themes

```css
ink:   dark warm (paper #1A1814, ink #EDE6D6)   /* default */
paper: cream light (paper #F4EFE6, ink #1A1814)
navy:  deep blue (paper #0F1A2A, ink #E8DCC4)
```

### Two languages

`zh` / `en`. Full duplicate copy (NOT translation). Persists in localStorage via `useTweaks()` hook.

### Top-bar controls — UI affordances, not text

- **Theme**: 3 colored circles (filled discs in actual theme paper-bg color, thin neutral border, active state has outer ring). NOT text labels.
- **Language**: pill with 「文 / A」 (active highlighted). NOT 「中文 / EN」.
- On detail page: same controls + an icon-only `×` close (no "关闭" / "Close" text).

### Home page

```
[topbar: brand · theme swatches · lang toggle]

EYEBROW:  卷 NN · M 篇 · 二〇YY年MM月
TITLE:    [month] · AI 简报          (zh) / [Month] & AI Briefing (en, italic)
SUBTITLE: hero one-liner             (centered)

[filter row: 全部 N · 思潮·评论 N · 新产品 N · 研究 N · 行业·动态 N · 开源 N]

DIVIDER

EDITORS' NOTE
[label: 导读]    [body — left column, max 72ch]

DIVIDER

[stack of book "spines" — one per chapter, lying horizontally,
 cover lid + spine. Click anywhere on a book → opens detail.]

[colophon footer]
```

### Detail page

```
[fixed top bar: April Press · 卷 N / NN  ·  filter tabs  ·  theme · lang · ×]

[fixed left rail: ← back-to-home button + 17 short tick lines, dock-zoom on hover,
 active row has long line in spine.drop color + breath animation]

[long vertical scroll]
  per chapter:
    [vol meta line: April Press · 卷 N / NN · 约 M 分钟阅读]
    
    [BigBook 3D — left column]   [article — right column]
                                  KICKER: [category] · 卷 N
                                  TITLE
                                  AUTHOR · DATE
                                  ─── divider
                                  SUBHEAD
                                  ─── divider
                                  「PULL QUOTE」
                                  ─── divider
                                  Ⓐnthropic Body para 1 (drop cap on first letter,
                                                          color = spine.drop)
                                  Body para 2…
                                  
                                  SOURCES (mono, small caps):
                                    · Source 1 → url
                                    · Source 2 → url
                                  
                                  — End — · April Press · No. NN
    
    [bridge between chapters: dot · "继续翻页" · dot]
```

### Real-time color blending on scroll

As the user scrolls between chapters, the detail page's `--detailBg`, `--ink`, `--accent`, `--drop` interpolate via `color-mix(in oklab, …, … P%)` based on scroll progress within the current chapter. Implemented with direct `setProperty` calls in the scroll handler — does NOT go through React state (would cause 60fps re-renders).

### BigBook (3D book illustration in detail)

A hand-built CSS-3D book object showing the cover artwork as the front face, plus visible spine, page edges (head / tail / fore-edge with cream-stripe gradient simulating page stack), and dual drop-shadow for depth. Cover image fills the front face (no thumbnail-with-cloth-around-it look — the cover should look like it IS the book).

Default rotation: `rotateX(-6deg) rotateY(-16deg)` — tilted enough to read spine but not so much that the cover gets squished.

### Drop cap & rail color

Both use `var(--drop, var(--accent))`. The `--drop` is set:
- Per-section inline on `<section className="vol-section" style={{ "--drop": item.spine.drop }}>` so each article's drop cap stays its own color even when the page-level `--drop` is mid-blend.
- On `.detail` root via `setProperty` in the scroll handler so the chapter rail's active row picks up the current chapter's drop color.

### Filter UX (both home and detail)

Same 6 chips (全部 + 5 categories). On the detail page they live in the fixed top bar, centered between meta-left and controls-right. Clicking filters BOTH the chapter rail and the article stream. If the currently active article gets filtered out, auto-scroll to the first visible.

> ⚠️ When wiring detail-page filter, do NOT have the "openId-changed → reset filter" effect fire on every scroll. Use a `useRef` to detect only the null→id transition (i.e. opening from home), not id→id (scrolling internally). Otherwise: click filter → article scrolls → openId changes → filter resets to all → user sees no filter applied.

---

## 6. Tech stack & file structure

### Stack

- React 18 + ReactDOM (CDN UMD)
- Babel standalone (CDN, transforms inline `<script type="text/babel">`)
- No bundler, no npm install for the runtime
- Pure CSS (no Tailwind, no CSS-in-JS)
- Fonts via Google Fonts: `Newsreader`, `JetBrains Mono`, `Noto Serif SC`, `Noto Sans SC`

### Files

```
april-press/
├── index.html              # meta-refresh redirect → April Press.html
├── April Press.html        # main entry: <link styles.css>, react CDN, JSX inline
├── data.js                 # window.ITEMS = [...], window.CATEGORIES = {...}
├── styles.css
├── covers/
│   ├── manifest.js         # optional window.COVER_ASSETS = {} for overrides
│   ├── vol-01.png
│   ├── …
│   └── vol-NN.png
├── .gitignore              # .DS_Store, .claude/, *.log, node_modules/
├── .claude/
│   └── launch.json         # python3 -m http.server 8088 for local preview
└── WORKFLOW.md             # this file
```

### Cache busting

Inside `<head>`:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<script>document.write('<link rel="stylesheet" href="styles.css?v='+Date.now()+'" />')</script>
```

Inside `<body>` before the React script:

```html
<script>document.write('<scr'+'ipt src="covers/manifest.js?v='+Date.now()+'"></scr'+'ipt>')</script>
<script>document.write('<scr'+'ipt src="data.js?v='+Date.now()+'"></scr'+'ipt>')</script>
```

Without these, browsers (especially Safari, Comet) aggressively cache styles.css and stale you for hours.

### Cover auto-detection

On mount, the App fetches `covers/` directory listing (python http.server's default index page is HTML), parses anchor tags via DOMParser, matches filenames against `vol-NN.png` regex + a `VOLUME_KEYWORDS` map of Chinese/English title substrings as fallback. Result merged with `window.COVER_ASSETS` (manual overrides win).

User does NOT have to rename files manually — drop them into `covers/` named `vol-NN.png` and they're picked up.

---

## 7. Local development

```bash
cd april-press
python3 -m http.server 8088
# → http://localhost:8088/
```

`.claude/launch.json` is set up so the Claude Code preview MCP can spin this up:

```json
{
  "version": "0.0.1",
  "configurations": [{
    "name": "april-press",
    "runtimeExecutable": "python3",
    "runtimeArgs": ["-m", "http.server", "8088"],
    "port": 8088
  }]
}
```

---

## 8. Public deployment (GitHub Pages)

### One-time setup (repeats for each new month)

```bash
cd ~/Desktop/CC\ playground/<month>-press
git init -b main
git add .
git commit -m "Initial commit: <Month> Press · Vol. NN"
gh repo create <month>-press --public --source=. --push \
  --description "<Month> Press · Vol. NN — <Month> 2026 AI briefing"
gh api -X POST /repos/<user>/<month>-press/pages \
  -f 'source[branch]=main' -f 'source[path]=/'
```

URL: `https://<user>.github.io/<month>-press/`

Pages takes 30–90 seconds to build. Poll:

```bash
gh api /repos/<user>/<month>-press/pages/builds/latest --jq .status
# until "built"
```

Smoke test:

```bash
curl -sI -L "https://<user>.github.io/<month>-press/" -o /dev/null -w "%{http_code}\n"
curl -sI    "https://<user>.github.io/<month>-press/data.js" -o /dev/null -w "%{http_code}\n"
curl -sI    "https://<user>.github.io/<month>-press/covers/vol-01.png" -o /dev/null -w "%{http_code}\n"
```

All should return 200.

### Monthly content updates

```bash
git add -A && git commit -m "..." && git push
# Pages rebuilds in ~60s
```

---

## 9. Suggested cadence (4 weeks)

| Week | Focus |
|---|---|
| Week 1 | Skim sources daily, drop URLs + 1-line takes into a running notes file. Don't write yet. |
| Week 2 | Same. Mid-week, do a coverage audit: which categories are thin? Force scan for those. |
| Week 3 | Pick the 17. Outline each chapter (thesis + 3-bullet structure + pull quote). |
| Week 3.5 | Draft body_zh for all 17. Drop cap variety check at end. |
| Week 4 (mon-wed) | Draft body_en for all 17 (parallel native voice, not translation). |
| Week 4 (thu) | Cover prompts → run all 17 in batch → save to `covers/`. Spine palette + drop colors filled in. |
| Week 4 (fri) | Layout review with full data. Fix overflows, check filter counts, scroll the whole detail stream end-to-end at all 3 themes × 2 langs. |
| Last day | Hero subtitle + editor's note. Deploy. Verify public URL. |

Do NOT write hero/editor first — they're the last thing. They summarize the issue, so they need the issue to exist.

---

## 10. Hard-won lessons (from Vol. 18)

These are not nice-to-haves; they're places previous iterations went wrong:

1. **Drop caps must vary.** Default writing instinct in Chinese is to start half the chapters with 「四月」. Audit + rewrite.
2. **Theme/lang switcher is UI not text.** Text labels like 「深墨 / 米白 / 海军」 read as a control panel; colored swatches + 「文/A」 read as a finished product.
3. **Cover lid: full image, no crop, no thumbnail-with-cloth.** When rotating a portrait cover artwork onto a horizontal slab, the slab's aspect must accommodate the rotated image (3:2). Do NOT center-crop a thumbnail with cloth fill on either side — the user will reject it 4 iterations in.
4. **BigBook in detail must look photorealistic.** Cover image visible on front face, clear spine/pages texture, dual drop shadow. A flat cover with accent border reads as placeholder.
5. **Background blends on scroll, not on click.** Use `setProperty` in the scroll handler (not React state). React rerendering at 60fps tanks scroll perf.
6. **Filter useEffect deps need a useRef gate.** See § 5 — the openId-reset trap.
7. **Hero subtitle ≠ editor's note.** They serve different functions. If they overlap, drop the hero to one sentence and let the editor carry the structure.
8. **Never close a paragraph with a clever metaphor.** Especially metaphors that conflate technical and non-technical jargon (「可以 GA 但不可被读完的速度」). The reader has to decode rather than understand.
9. **Drop the meta-placement framing.** "把它放在卷 X" reads like a TOC commentary, not an editorial close.
10. **Covers via auto-detection, not manual rename.** User explicitly asks for this. `covers/vol-NN.png` is enough.

---

## 11. Reusable AI prompts

### Prompt A — Issue scaffold (start of month)

> I'm starting Month YYYY's AI briefing, modeled on April Press · Vol. 18 (https://github.com/cabiriawzy-hub/april-press, see WORKFLOW.md). 
> 
> Help me set up the project: clone the structure of april-press, swap the masthead month/volume number, blank out `data.js` ITEMS to a 17-element template, blank covers/, and update the deployment script for the new repo name.

### Prompt B — Chapter draft

> Drafting Vol. NN, chapter `vol-NN` for Month YYYY's briefing. Topic: [event name] from [source URL]. Category: [research|product|essay|industry|open-source].
> 
> Following WORKFLOW.md style rules: concrete > clever, no wordplay closures, no meta-placement framing, drop-cap variety. Bilingual zh + en, both written native.
> 
> Target length: ~1500 chars zh / ~1500 words en, 4–6 paragraphs each. 
> 
> Give me title_zh, title_en, sub_zh, sub_en, pull_zh, pull_en, body_zh, body_en, sources (2–4), spine.bg + spine.drop suggestions tied to the chapter's mood.

### Prompt C — Cover batch

> 17 cover prompts for Month YYYY's briefing. For each chapter (titles below), give me a self-contained prompt for GPT Image / DALL·E 3, 1024×1536 portrait, Stripe Press editorial style, single central motif, restrained 2–3 color palette, no text on cover, no AI gloss.
> 
> Vol-01: [title] · [subtitle] · spine.bg = #...  
> Vol-02: …
> 
> Output as a list I can paste each prompt independently. Save outputs as covers/vol-NN.png — auto-detection picks them up by filename.

### Prompt D — Hero + editor's note (end of month)

> The 17 chapters are drafted. Help me write the hero subtitle (one sentence, the issue's headline takeaway) and the editor's note (导读, 80–120 chars zh, names 3–5 specific events, ends with how to read the issue).
> 
> They MUST NOT overlap — hero is the thesis; editor is the reading lens. Avoid wordplay endings like "落定的几条边" / "可以 GA 但不可被读完的速度".

### Prompt E — Deploy

> Project is ready at ~/Desktop/CC playground/<month>-press. Deploy to GitHub Pages (public repo, auto-enable Pages, smoke test with curl). Use gh CLI; my account is already authed. Repo name: `<month>-press`. Give me the public URL when built.

---

## 12. Variations & extensions

- **Different cadence**: same workflow works for quarterly / weekly. Adjust chapter count: weekly ~3, quarterly ~30.
- **Different domain**: swap CATEGORIES + voice; the architecture (stack of books, 3D detail, theme/lang) is domain-agnostic.
- **Audio**: add a `<audio>` element in the chapter detail right rail with per-chapter narration.
- **Print export**: `@media print` styles + `window.print()` button → readable PDF version.
- **RSS**: generate `feed.xml` from `data.js` at build time (would require a small build step — Node script that reads data.js + emits XML).

---

## Reference

- Live: https://cabiriawzy-hub.github.io/april-press/
- Repo: https://github.com/cabiriawzy-hub/april-press
- This file: ./WORKFLOW.md
