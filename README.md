# April Press

A monthly bilingual AI briefing, Stripe Press-inspired.

**Live:** https://cabiriawzy-hub.github.io/april-press/

Vol. 18 covers April 2026: 17 chapters across essays, products, research, industry, and open-source. Bilingual zh / en. Three themes (ink / paper / navy). Single static page, no build step — React 18 + Babel via CDN, hosted on GitHub Pages.

---

## For the next issue (May, June, …)

This repo is also a template. To produce the next month's issue without rediscovering structure:

1. **Read [`WORKFLOW.md`](./WORKFLOW.md)** — the full playbook (548 lines). It covers material selection, content rules, cover generation, UI/UX architecture, tech stack, deployment, monthly cadence, hard-won style rules, and reusable AI prompts.
2. Hand the workflow to an AI agent with this prompt (Prompt A from § 11):

   > I'm starting **[Month YYYY]**'s AI briefing, modeled on April Press · Vol. 18 (https://github.com/cabiriawzy-hub/april-press, see `WORKFLOW.md`).
   >
   > Help me set up the project: clone the structure, swap the masthead month/volume number, blank `data.js` `ITEMS` to a 17-element template, blank `covers/`, and update the deployment script for the new repo name.

3. The agent has everything it needs from the repo + that prompt. No local memory, no tribal knowledge.

---

## Local development

```bash
python3 -m http.server 8088
# → http://localhost:8088/
```

Or use the preset in `.claude/launch.json` if you're driving via Claude Code's preview tools.

## Files

```
April Press.html   # entry — inlined React + JSX, links to data.js + styles.css
data.js            # window.ITEMS = [...17 chapters], window.CATEGORIES = {...}
styles.css         # all styles
covers/vol-NN.png  # 1024×1536 portrait covers, auto-detected by filename
index.html         # meta-refresh redirect to entry (so / works)
WORKFLOW.md        # the playbook for monthly issues
```

## Deploy a new month

```bash
cd ../<month>-press
git init -b main && git add . && git commit -m "Initial commit"
gh repo create <month>-press --public --source=. --push
gh api -X POST /repos/<user>/<month>-press/pages \
  -f 'source[branch]=main' -f 'source[path]=/'
# Wait ~60s for Pages build → https://<user>.github.io/<month>-press/
```

Updates to an existing month: `git push`. Pages rebuilds automatically.

---

## License & credit

Editorial copy is original. Cover artwork is generated per-issue (prompts in `WORKFLOW.md` § 4). Type: Newsreader, JetBrains Mono, Noto Serif SC.
