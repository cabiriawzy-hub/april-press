/* April Press — 3D book stack with drag-to-rotate */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const ITEMS = window.BRIEFING_ITEMS;
const CATS = window.CATEGORIES;

const TWEAK_DEFAULTS = {
  lang: "zh",
  theme: "ink",
};

/* Lightweight standalone replacement for the design-tool's useTweaks hook.
   Persists tweaks to localStorage so language + theme survive reloads. */
function useTweaks(defaults) {
  const STORAGE_KEY = "april-press:tweaks";
  const [tweaks, setTweaks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...defaults };
  });
  const setTweak = useCallback((key, value) => {
    setTweaks((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  return [tweaks, setTweak];
}

function categoryLabel(cat, lang) {
  return CATS[cat] ? CATS[cat][lang] : cat;
}

/* Hook: drag to rotate a book element. */
function useDragRotate(initialRy = -22, initialRx = -4) {
  const [rot, setRot] = useState({ ry: initialRy, rx: initialRx });
  const [dragging, setDragging] = useState(false);
  const ref = useRef({ startX: 0, startY: 0, startRy: 0, startRx: 0 });

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    ref.current = {
      startX: e.clientX, startY: e.clientY,
      startRy: rot.ry, startRx: rot.rx,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [rot]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - ref.current.startX;
    const dy = e.clientY - ref.current.startY;
    const ry = ref.current.startRy + dx * 0.5;
    const rx = Math.max(-60, Math.min(70, ref.current.startRx - dy * 0.4));
    setRot({ ry, rx });
  }, [dragging]);

  const onPointerUp = useCallback((e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }, []);

  return {
    ry: rot.ry, rx: rot.rx, dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    reset: () => setRot({ ry: initialRy, rx: initialRx }),
  };
}

/* Horizontal book in the stack — Stripe Press style */
function StackBook({ item, lang, onOpen }) {
  const { spine } = item;
  const title = lang === "zh" ? item.title_zh : item.title_en;
  const sub = lang === "zh" ? item.sub_zh : item.sub_en;

  const style = {
    "--bg": spine.bg,
    "--fg": spine.fg,
    "--acc": spine.accent,
    color: spine.fg,
  };

  return (
    <div className="book" style={style} onClick={() => onOpen(item)}>
      <div className="book-cover">
        <div className="bc-frame">
          <div className="bc-no">No. {item.no} · {categoryLabel(item.cat, lang).toUpperCase()}</div>
          <div className="bc-mark" />
          <div className="bc-title">{title}</div>
          <div className="bc-sub">{sub}</div>
        </div>
      </div>
      <div className="book-spine">
        <span className="bs-author">{item.author}</span>
        <span className="bs-title">{title}</span>
        <span className="bs-mark" />
      </div>
    </div>
  );
}

/* Big standing book in detail view */
function BigBook({ item, lang }) {
  const { ry, rx, dragging, handlers } = useDragRotate(-28, -8);
  const { spine } = item;
  const style = {
    "--bg": spine.bg,
    "--fg": spine.fg,
    "--acc": spine.accent,
    "--ry": ry + "deg",
    transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
    color: spine.fg,
  };
  return (
    <div
      className={"big-book" + (dragging ? " dragging" : "")}
      style={style}
      {...handlers}
    >
      <div className="bb-face front">
        <div>
          <div className="c-no">No. {item.no} · {categoryLabel(item.cat, lang).toUpperCase()}</div>
          <div className="c-title">{lang === "zh" ? item.title_zh : item.title_en}</div>
          <div className="c-author">{item.author}</div>
        </div>
        <div className="c-foot">
          <span>April Press</span>
          <div className="c-mark" />
        </div>
      </div>
      <div className="bb-face back" />
      <div className="bb-face spine">
        <div className="s-no">{item.no}</div>
        <div className="s-title">{lang === "zh" ? item.title_zh : item.title_en}</div>
        <div className="s-mark" />
      </div>
      <div className="bb-face foredge" />
      <div className="bb-face head" />
      <div className="bb-face tail" />
    </div>
  );
}

/* One full-volume section in the continuous scroll detail view */
function VolumeSection({ item, lang, t, isLast, registerRef }) {
  const ref = useRef(null);
  useEffect(() => { registerRef(item.id, ref.current); }, [item.id]);

  const title = lang === "zh" ? item.title_zh : item.title_en;
  const sub   = lang === "zh" ? item.sub_zh : item.sub_en;
  const pull  = lang === "zh" ? item.pull_zh : item.pull_en;
  const body  = lang === "zh" ? item.body_zh : item.body_en;

  return (
    <section className="vol-section" ref={ref} data-vol={item.id} data-vol-no={item.no}>
      <div className="vol-header">
        <span className="vol-meta">April Press · {t.vol} {item.no} / {String(ITEMS.length).padStart(2, "0")} · {t.readMin(item.minutes)}</span>
      </div>
      <div className="detail-spread">
        <div className="detail-left">
          <BigBook item={item} lang={lang} />
        </div>
        <div className="detail-right">
          <div className="dr-kicker">{categoryLabel(item.cat, lang)} · {t.vol} {item.no}</div>
          <h1 className="dr-title">{title}</h1>
          <div className="dr-author">{item.author} · {item.date}</div>
          <div className="dr-divider" />
          <div className="dr-sub">{sub}</div>
          <blockquote className="dr-pull">{pull}</blockquote>
          <div className="dr-body">
            {body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {item.sources && item.sources.length > 0 && (
            <div className="dr-sources">
              <div className="dr-sources-label">{t.sources}</div>
              <ul>
                {item.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="dr-foot">
            <span>{t.end}</span>
            <span>April Press · No. {item.no}</span>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="vol-bridge">
          <span className="vol-bridge-dot" />
          <span className="vol-bridge-text">{t.continue}</span>
          <span className="vol-bridge-dot" />
        </div>
      )}
    </section>
  );
}

/* Detail view — continuous scroll through all volumes */
function Detail({ items, openId, lang, onClose, onActiveChange }) {
  if (openId == null) return null;
  const containerRef = useRef(null);
  const sectionRefs = useRef(new Map());
  const [activeId, setActiveId] = useState(openId);
  const [activeProgress, setActiveProgress] = useState(0);

  const t = lang === "zh"
    ? { close: "关闭", end: "— 完 —", vol: "卷",
        readMin: m => `约 ${m} 分钟阅读`,
        continue: "继续翻页", index: "目录", sources: "来源" }
    : { close: "Close", end: "— End —", vol: "Volume",
        readMin: m => `${m} min read`,
        continue: "continue", index: "Index", sources: "Sources" };

  const registerRef = (id, el) => {
    if (el) sectionRefs.current.set(id, el);
  };

  const activeItem = items.find(it => it.id === activeId) || items[0];
  const detailBg = `color-mix(in oklab, ${activeItem.spine.bg} 22%, var(--paper))`;
  const accentTone = activeItem.spine.accent;

  // Scroll to opened item on mount
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    requestAnimationFrame(() => {
      const target = sectionRefs.current.get(openId);
      if (target) {
        root.scrollTop = target.offsetTop;
      }
    });
  }, []);

  // Track which section is in view
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const viewportMid = root.scrollTop + root.clientHeight * 0.4;
        let bestId = activeId;
        let bestEl = null;
        let bestDist = Infinity;
        sectionRefs.current.forEach((el, id) => {
          const top = el.offsetTop;
          const bot = top + el.offsetHeight;
          if (top <= viewportMid && bot >= viewportMid) {
            const dist = Math.abs(top + el.offsetHeight / 2 - viewportMid);
            if (dist < bestDist) { bestDist = dist; bestId = id; bestEl = el; }
          }
        });
        if (bestId !== activeId) {
          setActiveId(bestId);
          if (onActiveChange) onActiveChange(bestId);
        }
        if (bestEl) {
          const top = bestEl.offsetTop;
          const h = bestEl.offsetHeight;
          const p = Math.max(0, Math.min(1, (root.scrollTop - top) / Math.max(1, h - root.clientHeight)));
          setActiveProgress(p);
        }
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { root.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [activeId, onActiveChange]);

  const rail = items.map(it => ({
    id: it.id,
    no: it.no,
    paraCount: (lang === "zh" ? it.body_zh : it.body_en).length + 3,
  }));

  return (
    <div className="detail open" ref={containerRef}
      style={{ "--detailBg": detailBg, "--accent": accentTone }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="chapter-rail tilt">
        <button className="ch-back" onClick={onClose}>←</button>
        {rail.map(r => {
          const isActive = r.id === activeId;
          return (
            <span key={r.id} className="rail-vol-group">
              <span className={"ch-line vol-tick" + (isActive ? " active" : "")}
                style={{ width: (isActive ? 64 : 26) + "px" }}
                onClick={() => {
                  const el = sectionRefs.current.get(r.id);
                  if (el && containerRef.current) containerRef.current.scrollTop = el.offsetTop;
                }}
              />
              {isActive && Array.from({ length: Math.min(r.paraCount, 12) }).map((_, j) => (
                <span key={j} className="ch-line ch-sub"
                  style={{
                    width: (16 + (j % 3) * 6) + "px",
                    opacity: j / Math.max(1, Math.min(r.paraCount, 12) - 1) <= activeProgress ? 0.95 : 0.3,
                  }}
                />
              ))}
            </span>
          );
        })}
      </div>

      <div className="detail-top-fixed">
        <span className="dt-meta">April Press · {t.vol} {activeItem.no} / {String(items.length).padStart(2, "0")}</span>
        <button className="close" onClick={onClose}>
          <span>{t.close}</span><span className="x" />
        </button>
      </div>

      <div className="detail-stream">
        {items.map((it, i) => (
          <VolumeSection key={it.id} item={it} lang={lang} t={t}
            isLast={i === items.length - 1}
            registerRef={registerRef}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = tweaks.lang || "zh";
  const theme = tweaks.theme || "ink";

  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.classList.toggle("lang-zh", lang === "zh");
    document.documentElement.setAttribute("data-theme", theme);
  }, [lang, theme]);

  useEffect(() => {
    function onKey(e) {
      if (openId == null) return;
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  useEffect(() => {
    document.body.style.overflow = openId != null ? "hidden" : "";
  }, [openId]);

  const counts = useMemo(() => {
    const c = { all: ITEMS.length };
    ITEMS.forEach(i => { c[i.cat] = (c[i.cat] || 0) + 1; });
    return c;
  }, []);

  const visible = useMemo(() =>
    filter === "all" ? ITEMS : ITEMS.filter(i => i.cat === filter),
    [filter]
  );

  const setLang = (L) => setTweak("lang", L);
  const setTheme = (Th) => setTweak("theme", Th);

  const T = lang === "zh"
    ? { topLeft: "April Press", issue: "Vol. 18 · 二〇二六年四月",
        eyebrow: "卷 一八", title1: "四月", title2: "AI 简报",
        sub: "本月十四件值得停下来读完的事——一架可翻阅的书。",
        editor: "本期收录十四件四月间值得停下来读完的事——三篇思潮、四款新产品、三份研究、三则行业动态，与一份开源礼物。它们彼此并不为对方而生，但放在一起时，构成了关于这个月的一种可读的形状。",
        hint: "点击任一卷 → 进入阅读",
        col1: "April Press · 编辑独立选编。",
        col2: "Set in Newsreader & Noto Serif。",
        col3: "Vol. 18 · 2026 年 4 月 30 日付印。",
        themeLabel: "主题",
        themes: { ink: "深墨", paper: "米白", navy: "海军" },
      }
    : { topLeft: "April Press", issue: "Vol. 18 · April 2026",
        eyebrow: "Volume 18", title1: "April", title2: "AI Briefing",
        sub: "Fourteen things from this month worth stopping for. Click any volume to read.",
        editor: "Fourteen things from April worth stopping for — three essays, four products, three notes from the research literature, three from industry, and one open-source gift.",
        hint: "Click any volume → start reading",
        col1: "April Press is independently edited.",
        col2: "Set in Newsreader & JetBrains Mono.",
        col3: "Vol. 18 · went to press April 30, 2026.",
        themeLabel: "Theme",
        themes: { ink: "Ink", paper: "Paper", navy: "Navy" },
      };

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <span className="mark" />
          <span>{T.topLeft} · {T.issue}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="langpill" role="group" aria-label="theme">
            {["ink", "paper", "navy"].map(k => (
              <button key={k}
                className={theme === k ? "active" : ""}
                onClick={() => setTheme(k)}
                title={T.themes[k]}>
                {T.themes[k]}
              </button>
            ))}
          </div>
          <div className="langpill">
            <button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中文</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>

      <header className="masthead">
        <div className="mh-eyebrow">
          <span>{T.eyebrow}</span>
          <span className="dot" />
          <span>14 {lang === "zh" ? "卷" : "VOLUMES"}</span>
          <span className="dot" />
          <span>{lang === "zh" ? "二〇二六年四月" : "APRIL 2026"}</span>
        </div>
        <h1 className="mh-title">
          {lang === "zh"
            ? <>四月<span className="ampersand"> · </span>AI 简报</>
            : <>{T.title1} <span className="ampersand">&amp;</span> <em>{T.title2}</em></>
          }
        </h1>
        <div className="mh-sub">{T.sub}</div>
      </header>

      <div className="filters">
        {Object.keys(CATS).map(k => (
          <button key={k} className={filter === k ? "active" : ""} onClick={() => setFilter(k)}>
            {categoryLabel(k, lang)}
            <span className="count">{counts[k] || 0}</span>
          </button>
        ))}
      </div>

      <div className="editors">{T.editor}</div>

      <section className="stack-wrap">
        <div className="stack">
          {visible.map((item, i) => (
            <div className="stack-item" key={item.id} style={{ animationDelay: (i * 60) + "ms" }}>
              <StackBook item={item} lang={lang} onOpen={(it) => setOpenId(it.id)} />
            </div>
          ))}
        </div>
      </section>

      <footer className="colophon">
        <div>{T.col1}</div>
        <div className="center">{T.col2}</div>
        <div className="right">{T.col3}</div>
      </footer>

      <Detail
        items={ITEMS}
        openId={openId}
        lang={lang}
        onClose={() => setOpenId(null)}
        onActiveChange={(id) => setOpenId(id)}
      />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
