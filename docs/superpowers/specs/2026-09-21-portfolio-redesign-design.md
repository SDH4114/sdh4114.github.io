# SDH4114 Portfolio Redesign

## Purpose

Replace the current portfolio with a polished English-language website that presents Haos as a programmer and student building developer tools, programming languages, games, and machine-learning systems. The site should help a visitor understand who he is, inspect selected work, and reach his public profiles or Telegram contacts with minimal effort.

## Product goals

- Make the portfolio feel authored and technically credible rather than template-driven.
- Give Battlefield 64 and Coffe.nvim prominent live-demo and source-code paths.
- Present Shine, ai_models, dante_LM, and Aminatron with accurate, concise descriptions.
- Link GitHub, Hugging Face, Break Rules Studio, and the personal Telegram account.
- Work well on phones, tablets, laptops, and wide desktop screens.
- Remain a fast static GitHub Pages site with no build step.

## Content and information architecture

The site is one scrolling page with these sections:

1. **Header** — SDH4114 wordmark, in-page navigation, and a compact availability/status marker.
2. **Hero** — the statement “I build tools, languages and intelligent systems,” a short introduction written in first person, and direct links to selected work and GitHub.
3. **Featured work** — large editorial case-study blocks for Battlefield 64 and Coffe.nvim. Each block includes a short outcome-focused description, technology labels, a source link, and a live-demo link.
4. **Selected systems** — asymmetric project entries for Shine, ai_models, dante_LM, and Aminatron. Projects with no public demo show only a repository or model link.
5. **About** — a concise first-person explanation of Haos’s interests in Python, Rust, data science, machine learning, automation, developer tools, and experimental software. The copy does not state an age so it cannot become stale.
6. **Profiles** — clear links to the complete GitHub and Hugging Face profiles.
7. **Contact** — separate calls to contact Haos personally and to follow Break Rules Studio.
8. **Footer** — concise identity, location, and copyright text.

## Visual direction

The site uses a light editorial system inspired by an independent technical journal:

- warm paper background rather than pure white;
- near-black ink text and one restrained deep-blue accent;
- an expressive serif display face paired with a clean sans-serif body face;
- large, tightly set headings and readable body lines capped near 65 characters;
- asymmetrical project layouts and varied image-free graphic compositions instead of a uniform card grid;
- thin rules, numbered project labels, code-like metadata, and subtle paper grain;
- generous whitespace and a constrained content width.

The design will not retain the current Japanese labels, orange/blue cyberpunk gradients, glitch effects, or hidden tab-style sections.

## Interaction design

- Navigation links scroll to visible page sections; content is never hidden behind JavaScript tabs.
- A compact mobile menu appears on narrow screens and closes after navigation.
- Project links have visible hover, pressed, and keyboard-focus states.
- Content enters with subtle opacity and vertical movement when it reaches the viewport.
- `prefers-reduced-motion` disables nonessential movement.
- External links open in a new tab with safe `rel` attributes.
- The page remains usable if JavaScript is unavailable; only enhancement animations and the mobile menu depend on it.

## Technical approach

- Keep the project as a static site suitable for GitHub Pages.
- Replace the monolithic Tailwind-CDN document with semantic `index.html`, local `index.css`, and local `index.js`.
- Do not add a framework, package manager, icon library, or build system.
- Use small inline SVG marks where an icon materially improves recognition.
- Add a custom SVG favicon and complete title, description, Open Graph, and theme-color metadata.
- Keep project content in semantic HTML so links and descriptions are visible to search engines and assistive technology.

## Project descriptions

Descriptions must stay within claims supported by the public repositories and model page:

- **Battlefield 64** — a top-down pixel-art chess game with custom pieces, pastel boards, smooth movement, and a calm retro presentation.
- **Coffe.nvim** — an installable Neovim 0.11+ distribution and Lua plugin with projects, search, Git/diff, Markdown tools, notes, sessions, and an offline-capable core.
- **Shine** — a readable programming language implemented in Rust and growing toward scientific, data, ML, CLI, and server workloads; current capabilities must not be described as native LLVM compilation.
- **ai_models** — an experimental Python repository for model-training work; the copy must remain conservative because its public README is minimal.
- **dante_LM** — an experimental language-model repository; the copy must not claim capabilities absent from its public materials.
- **Aminatron** — a Hugging Face model project; use only model-card claims that can be verified during implementation.

## Responsive behavior

- Desktop uses a wide editorial grid with offset text and project media panels.
- Tablet collapses complex project spreads into two balanced columns.
- Mobile uses a single reading column, appropriately scaled display text, full-width primary actions, and horizontally safe metadata.
- No section uses fixed `100vh`; hero sizing uses content-driven spacing and `min-height` only where appropriate.

## Accessibility and robustness

- Semantic landmarks, a skip link, logical heading order, and descriptive link labels.
- Sufficient text and control contrast.
- Visible `:focus-visible` treatment.
- Touch targets of at least 44px where practical.
- No content conveyed by color alone.
- JavaScript errors must not block navigation or project links.

## Verification

- Validate that every requested URL is present and correct.
- Check HTML semantics and run a JavaScript syntax check.
- Serve the site locally and inspect it in a real browser at desktop and mobile widths.
- Verify keyboard navigation, mobile menu behavior, reduced-motion handling, external links, overflow, and missing assets.
- Run `git diff --check` before handoff.

## Out of scope

- A CMS, blog, analytics, contact form, backend, framework migration, or automated GitHub statistics.
- Invented project metrics, testimonials, client logos, or unverifiable technical claims.
