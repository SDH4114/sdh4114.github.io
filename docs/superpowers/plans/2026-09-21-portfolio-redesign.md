# SDH4114 Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished English-language editorial portfolio that accurately presents Haos, his selected projects, public profiles, and Telegram contacts on GitHub Pages.

**Architecture:** Keep the site as a progressively enhanced static document. Semantic content lives in `index.html`, the complete visual system and responsive layout live in `index.css`, and `index.js` adds only the mobile navigation, scroll-state, and reveal effects; all links and content remain usable without JavaScript.

**Tech Stack:** HTML5, modern CSS, vanilla JavaScript, inline SVG, Node.js built-ins for structural checks, local HTTP server and browser automation for visual QA.

**Spec:** `docs/superpowers/specs/2026-09-21-portfolio-redesign-design.md`

## Global Constraints

- The public website is English-only.
- The site must remain deployable by GitHub Pages with no build step.
- Do not add a framework, package manager, icon library, analytics, backend, CMS, or contact form.
- Use a warm paper background, near-black text, and one restrained deep-blue accent.
- Do not state Haos's age or use invented metrics, testimonials, client logos, or unverifiable claims.
- Keep every requested GitHub, live-demo, Hugging Face, and Telegram URL exact.
- Content and navigation must remain usable when JavaScript is disabled.
- Support keyboard navigation, visible focus, touch targets, and `prefers-reduced-motion`.

## Review Focus

- **JavaScript disabled:** every section and every external link remains visible and usable; Task 1's structural test checks that content is not hidden by default.
- **Narrow mobile viewport:** no horizontal overflow and navigation remains operable at 320 CSS pixels; Task 4 checks the 320px browser viewport.
- **Keyboard-only navigation:** skip link, header navigation, project actions, menu button, and contact links receive visible focus in logical order; Tasks 2 and 4 test this.
- **Reduced motion:** reveal content is immediately visible and nonessential transitions are removed; Tasks 2, 3, and 4 test this.
- **Missing enhancement APIs:** the page does not fail when `IntersectionObserver` is unavailable; Tasks 3 and 4 test the fallback.

---

## File map

- `index.html` — metadata, semantic page structure, English copy, project links, and inline SVG marks.
- `index.css` — design tokens, typography, editorial grid, project compositions, responsive layouts, focus states, and motion preferences.
- `index.js` — mobile navigation, current-section marker, and progressive reveal enhancement.
- `favicon.svg` — small SDH monogram for browser tabs and bookmarks.
- `tests/site-check.mjs` — dependency-free structural assertions for required content, links, CSS contracts, and JavaScript source.

### Task 1: Replace the monolithic page with semantic English content

**Files:**
- Create: `tests/site-check.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: the approved content structure and verified project facts in the design spec.
- Produces: stable section IDs `home`, `work`, `about`, and `contact`; hooks `data-menu-button`, `data-menu`, `data-reveal`, and `data-section`; all later CSS and JavaScript depend on these exact names.

- [ ] **Step 1: Write the failing structural test**

Create `tests/site-check.mjs` with dependency-free checks for the new document:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const requiredUrls = [
  "https://github.com/SDH4114/Battlefield-64",
  "https://sdh4114.github.io/Battlefield-64/",
  "https://github.com/SDH4114/Coffe_nvim",
  "https://sdh4114.github.io/Coffe_nvim/",
  "https://github.com/SDH4114/ai_models",
  "https://github.com/SDH4114/shine",
  "https://github.com/SDH4114/dante_LM",
  "https://github.com/SDH4114",
  "https://huggingface.co/sdhaos",
  "https://huggingface.co/sdhaos/Aminatron",
  "https://t.me/BreakRulesStudio",
  "https://t.me/sdhaos4114",
];

assert.match(html, /<html lang="en">/);
assert.match(html, /<meta name="description"/);
assert.match(html, /<meta property="og:title"/);
assert.match(html, /<link rel="stylesheet" href="index\.css"/);
assert.match(html, /<script src="index\.js" defer><\/script>/);
assert.match(html, /class="skip-link"/);
assert.match(html, /<header[\s>]/);
assert.match(html, /<main[^>]*id="main-content"/);
assert.match(html, /<footer[\s>]/);
assert.match(html, /id="home"/);
assert.match(html, /id="work"/);
assert.match(html, /id="about"/);
assert.match(html, /id="contact"/);
assert.match(html, /I build tools, languages and intelligent systems\./);
assert.doesNotMatch(html, /cdn\.tailwindcss\.com|unpkg\.com\/lucide/);
assert.doesNotMatch(html, /class="[^"]*\bhidden\b/);
for (const url of requiredUrls) assert.ok(html.includes(url), `Missing ${url}`);
for (const name of ["Battlefield 64", "Coffe.nvim", "Shine", "ai_models", "dante_LM", "Aminatron"]) {
  assert.ok(html.includes(name), `Missing project ${name}`);
}

console.log("site structure: ok");
```

- [ ] **Step 2: Run the test and confirm the old page fails**

Run: `node tests/site-check.mjs`

Expected: FAIL because the old page has no local `index.js`, no semantic editorial structure, and still references Tailwind CDN and Lucide.

- [ ] **Step 3: Rewrite `index.html` with the final information architecture and copy**

Use semantic landmarks and these exact section/link contracts:

```html
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" data-header>
    <a class="wordmark" href="#home" aria-label="SDH4114, home">SDH<span>/4114</span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-button>
      <span>Menu</span><span aria-hidden="true">↗</span>
    </button>
    <nav id="site-navigation" class="site-navigation" aria-label="Primary navigation" data-menu>
      <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
    </nav>
  </header>
  <main id="main-content">
    <section id="home" class="hero" data-section>
      <p class="eyebrow">Independent developer · Baku, Azerbaijan</p>
      <h1>I build tools, languages and intelligent systems.</h1>
      <p class="hero-intro">I'm Haos, a programmer and student from Baku. I work across Python, Rust, machine learning and developer tooling — turning ideas into software people can actually run, inspect and use.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="#work">Explore selected work</a>
        <a class="text-link" href="https://github.com/SDH4114" target="_blank" rel="noreferrer noopener">GitHub profile</a>
      </div>
      <span class="hero-index" aria-hidden="true">01</span>
    </section>
    <section id="work" class="work" aria-labelledby="work-title" data-section>
      <header class="section-heading"><p class="eyebrow">Selected work · 2025–2026</p><h2 id="work-title">Projects built to be used.</h2></header>
      <div class="featured-work">
        <article class="feature feature-battlefield" data-reveal><h3>Battlefield 64</h3></article>
        <article class="feature feature-coffe" data-reveal><h3>Coffe.nvim</h3></article>
      </div>
      <div class="project-index" aria-label="More selected projects">
        <article class="project-row" data-reveal><h3>Shine</h3></article>
        <article class="project-row" data-reveal><h3>ai_models</h3></article>
        <article class="project-row" data-reveal><h3>dante_LM</h3></article>
        <article class="project-row" data-reveal><h3>Aminatron</h3></article>
      </div>
    </section>
    <section id="about" class="about" aria-labelledby="about-title" data-section>
      <p class="eyebrow">About</p>
      <h2 id="about-title">I learn by building.</h2>
      <p>My work moves between developer experience, programming language design, machine learning and small interactive worlds. I care about clear systems, useful interfaces and the freedom to understand how the whole thing works.</p>
    </section>
    <section id="contact" class="contact" aria-labelledby="contact-title" data-section>
      <p class="eyebrow">Contact</p>
      <h2 id="contact-title">Let's make something worth opening.</h2>
      <div class="contact-links">
        <a href="https://t.me/sdhaos4114" target="_blank" rel="noreferrer noopener">Personal Telegram</a>
        <a href="https://t.me/BreakRulesStudio" target="_blank" rel="noreferrer noopener">Break Rules Studio</a>
      </div>
    </section>
  </main>
  <footer class="site-footer"><p>SDH4114 · Baku, Azerbaijan</p><p>Building in public.</p></footer>
  <script src="index.js" defer></script>
</body>
```

Use this approved first-person hero and about copy:

```text
I build tools, languages and intelligent systems.

I'm Haos, a programmer and student from Baku. I work across Python, Rust,
machine learning and developer tooling — turning ideas into software people
can actually run, inspect and use.

I learn by building. My work moves between developer experience, programming
language design, machine learning and small interactive worlds. I care about
clear systems, useful interfaces and the freedom to understand how the whole
thing works.
```

Use these project descriptions without adding unsupported claims:

```text
Battlefield 64 — A top-down pixel-art chess game with custom pieces, pastel
boards, smooth movement and a calm retro atmosphere.

Coffe.nvim — An installable Neovim 0.11+ distribution and Lua plugin with
projects, search, Git and diff tools, Markdown workflows, quick notes,
automatic sessions and an offline-capable core.

Shine — A readable programming language written in Rust and growing toward
scientific, data, ML, CLI and server workloads. Its current runtime combines a
tree-walking evaluator with a compact numeric VM.

ai_models — My experimental Python workspace for training, testing and
understanding machine-learning models, including the early Aminatron work.

dante_LM — An early language-model experiment. The repository is intentionally
small and currently documents the starting point rather than a finished model.

Aminatron — A multi-object detection project that returns object classes,
confidence scores, bounding boxes and an annotated image, with a Gradio app on
Hugging Face.
```

Give Battlefield 64 and Coffe.nvim both `Live demo` and `Source code` actions. Give Shine, ai_models, and dante_LM `View repository` actions. Give Aminatron `View on Hugging Face`. Add separate `GitHub profile`, `Hugging Face profile`, `Personal Telegram`, and `Break Rules Studio` actions.

Add `target="_blank" rel="noreferrer noopener"` to every external link. Add `<noscript>` only if it communicates that animations are disabled; never hide content inside it.

- [ ] **Step 4: Run the structural test**

Run: `node tests/site-check.mjs`

Expected: `site structure: ok`

- [ ] **Step 5: Check document links and formatting**

Run: `rg -o 'https://[^" ]+' index.html | sort -u`

Expected: all twelve required destinations appear and `https://t.me/BreakLoop` does not appear.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 6: Commit the semantic page**

```bash
git add index.html tests/site-check.mjs
git commit -m "feat: rebuild portfolio content"
```

### Task 2: Build the light editorial visual system

**Files:**
- Modify: `tests/site-check.mjs`
- Modify: `index.css`
- Create: `favicon.svg`

**Interfaces:**
- Consumes: the section IDs and class names created in Task 1.
- Produces: CSS custom properties and responsive contracts used unchanged by Task 3: `--paper`, `--ink`, `--muted`, `--blue`, `--line`, `--display`, `--body`, `.menu-open`, `.is-revealed`, and `[data-reveal]`.

- [ ] **Step 1: Extend the test with failing style and favicon contracts**

Append before the final log statement in `tests/site-check.mjs`:

```js
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const favicon = readFileSync(new URL("../favicon.svg", import.meta.url), "utf8");

for (const token of ["--paper", "--ink", "--muted", "--blue", "--line", "--display", "--body"]) {
  assert.ok(css.includes(token), `Missing CSS token ${token}`);
}
assert.match(css, /:focus-visible/);
assert.match(css, /@media\s*\(max-width:\s*48rem\)/);
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(css, /min-height:\s*100dvh/);
assert.doesNotMatch(css, /#000000|#000\b/);
assert.match(favicon, /<svg/);
assert.match(favicon, /aria-hidden="true"/);
```

- [ ] **Step 2: Run the test and confirm the old stylesheet fails**

Run: `node tests/site-check.mjs`

Expected: FAIL on missing `--paper` and missing `favicon.svg`.

- [ ] **Step 3: Replace `index.css` with the editorial system**

Start with these exact tokens and base behavior:

```css
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap");

:root {
  --paper: #f2f0e9;
  --paper-deep: #e7e3da;
  --ink: #171713;
  --muted: #686861;
  --blue: #2447d8;
  --blue-dark: #1833a6;
  --line: rgba(23, 23, 19, 0.18);
  --display: "Newsreader", Georgia, serif;
  --body: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --page: min(90rem, calc(100% - 3rem));
}

html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--body); }
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
}
:focus-visible { outline: 3px solid var(--blue); outline-offset: 4px; }
.hero { min-height: 100dvh; }
```

Implement these compositions:

- sticky translucent header with a hairline bottom border;
- hero grid with a small issue label, 5–8rem serif headline, constrained introduction, and a large `01` typographic marker;
- featured projects as alternating editorial spreads rather than equal cards;
- a blue Battlefield panel with an abstract 8×8 CSS chess grid and a paper Coffe.nvim panel resembling a terminal/editor sheet;
- selected systems as a ruled list with oversized project numbers and responsive two-column descriptions;
- about section with an offset serif quotation and a small capability index;
- contact section as a near-black ink panel placed within the otherwise light palette, using paper text and blue focus/hover details;
- varied radii limited to visual compositions, while text rows and rules stay square;
- a fixed-width page container and no `height: 100vh`.

Use `clamp()` for all large type, reserve at least `1.5rem` side padding on phones, and keep paragraph widths at `65ch` or less. At `48rem`, collapse the header navigation behind the menu button, stack project spreads, reduce decoration, and keep every action at least `2.75rem` tall.

For motion, define `[data-reveal]` as visible by default. Apply the hidden transform only under `.js [data-reveal]`, then reveal with `.is-revealed`. Under reduced motion, force opacity and transform back to their final states and set scroll behavior to `auto`.

- [ ] **Step 4: Create the favicon**

Create a square SVG with paper background, blue border, and a centered `S/4` monogram. Include `aria-hidden="true"`, `focusable="false"`, and no external assets.

- [ ] **Step 5: Run structural and formatting checks**

Run: `node tests/site-check.mjs`

Expected: `site structure: ok`

Run: `git diff --check`

Expected: no output.

- [ ] **Step 6: Commit the visual system**

```bash
git add index.css favicon.svg tests/site-check.mjs
git commit -m "feat: add editorial portfolio design"
```

### Task 3: Add resilient progressive enhancement

**Files:**
- Modify: `tests/site-check.mjs`
- Create: `index.js`

**Interfaces:**
- Consumes: `[data-menu-button]`, `[data-menu]`, `[data-header]`, `[data-section]`, and `[data-reveal]` from Task 1 plus `.menu-open` and `.is-revealed` from Task 2.
- Produces: no public API; behavior is isolated in an IIFE and communicates only through `aria-expanded`, `.menu-open`, `.is-revealed`, and `aria-current="location"`.

- [ ] **Step 1: Extend the test with failing JavaScript contracts**

Append before the final log statement in `tests/site-check.mjs`:

```js
const js = readFileSync(new URL("../index.js", import.meta.url), "utf8");

assert.match(js, /document\.documentElement\.classList\.add\("js"\)/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /"IntersectionObserver" in window/);
assert.match(js, /aria-expanded/);
assert.match(js, /aria-current/);
assert.match(js, /prefers-reduced-motion/);
```

- [ ] **Step 2: Run the checks and confirm `index.js` is missing**

Run: `node tests/site-check.mjs`

Expected: FAIL with `ENOENT` for `index.js`.

- [ ] **Step 3: Implement the enhancement script**

Create `index.js` as an IIFE with this behavior:

```js
(() => {
  document.documentElement.classList.add("js");

  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = [...document.querySelectorAll('[data-menu] a[href^="#"]')];
  const sections = [...document.querySelectorAll("[data-section]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${visible.target.id}`;
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-25% 0px -60%", threshold: [0.01, 0.25, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
```

Keep null-safe optional chaining so missing enhancement hooks cannot block the page. Do not prevent default anchor navigation.

- [ ] **Step 4: Run automated checks**

Run: `node --check index.js`

Expected: no output and exit code 0.

Run: `node tests/site-check.mjs`

Expected: `site structure: ok`

- [ ] **Step 5: Commit progressive enhancement**

```bash
git add index.js tests/site-check.mjs
git commit -m "feat: add portfolio interactions"
```

### Task 4: Perform browser QA and finish responsive hardening

**Files:**
- Modify: `index.html` only if content, labels, or semantics fail browser review.
- Modify: `index.css` only if layout, focus, overflow, or reduced-motion review fails.
- Modify: `index.js` only if menu, reveal, or current-section behavior fails.
- Modify: `tests/site-check.mjs` when a browser-found regression can be pinned structurally.

**Interfaces:**
- Consumes: the complete static page and enhancement hooks from Tasks 1–3.
- Produces: a visually inspected, keyboard-checked, responsive final GitHub Pages artifact.

- [ ] **Step 1: Start the local site**

Run: `python3 -m http.server 4173`

Expected: server listens on `http://127.0.0.1:4173/` without file errors.

- [ ] **Step 2: Inspect desktop rendering**

Open `http://127.0.0.1:4173/` at 1440×1000 in a real browser. Verify:

- hero headline remains balanced and does not collide with the issue marker;
- featured projects alternate composition without equal-card repetition;
- all six project descriptions and actions are visible;
- Google Fonts failure falls back cleanly to Georgia and the system sans stack;
- sticky header does not cover section headings;
- the final contact panel remains visually integrated with the light page;
- browser console contains no errors and Network contains no missing local assets.

Capture a desktop screenshot for visual comparison during the task; do not add the screenshot to Git.

- [ ] **Step 3: Inspect mobile rendering and interaction**

At 390×844 and 320×700, verify:

- document width equals viewport width with no horizontal scroll;
- menu button reports `aria-expanded="false"`, opens the navigation, closes on link selection, and closes on Escape;
- all text remains readable without zooming;
- project actions do not clip or overlap;
- contact links have at least 44px touch height;
- the chess and editor compositions simplify rather than overflow.

- [ ] **Step 4: Verify keyboard and motion behavior**

Use Tab from the top of the page. Verify the skip link appears first, focus remains visible on every actionable element, and the order follows the document.

Emulate `prefers-reduced-motion: reduce`, reload, and verify all `[data-reveal]` elements are immediately visible with no transform. In the console, temporarily set `window.IntersectionObserver = undefined` before reloading a local copy or use browser feature override; verify the content remains visible and navigation links still work.

- [ ] **Step 5: Pin and fix any discovered regression**

For every browser-found issue, first add a focused assertion to `tests/site-check.mjs` when the property is representable as source structure, run it to see the failure, then make the smallest HTML/CSS/JS correction. Re-run the browser check at the viewport where the issue appeared.

- [ ] **Step 6: Run the final verification suite**

Run:

```bash
node --check index.js
node tests/site-check.mjs
git diff --check
git status --short
```

Expected:

```text
site structure: ok
```

`node --check` and `git diff --check` produce no output. `git status --short` contains only intentional portfolio files, or is clean after the final commit.

- [ ] **Step 7: Commit final hardening**

If browser QA required changes:

```bash
git add index.html index.css index.js favicon.svg tests/site-check.mjs
git commit -m "fix: harden portfolio responsive behavior"
```

If no browser changes were needed, do not create an empty commit.
