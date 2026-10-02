import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

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

for (const url of requiredUrls) {
  assert.ok(html.includes(url), `Missing ${url}`);
}

for (const name of [
  "Battlefield 64",
  "Coffe.nvim",
  "Shine",
  "ai_models",
  "dante_LM",
  "Aminatron",
]) {
  assert.ok(html.includes(name), `Missing project ${name}`);
}

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const favicon = readFileSync(new URL("../favicon.svg", import.meta.url), "utf8");

for (const token of [
  "--paper",
  "--ink",
  "--muted",
  "--blue",
  "--line",
  "--display",
  "--body",
]) {
  assert.ok(css.includes(token), `Missing CSS token ${token}`);
}

assert.match(css, /:focus-visible/);
assert.match(css, /@media\s*\(max-width:\s*48rem\)/);
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(css, /min-height:\s*100dvh/);
assert.doesNotMatch(css, /#000000|#000\b/);
assert.doesNotMatch(
  css,
  /body\s*\{[^}]*min-width:/s,
  "Body min-width must not force horizontal scrolling on narrow screens",
);
assert.match(
  css,
  /\.feature,\s*\.feature-copy,\s*\.feature-visual\s*\{[^}]*min-width:\s*0/s,
  "Featured grid items must be allowed to shrink within the viewport",
);
assert.match(
  css,
  /@media\s*\(max-width:\s*48rem\)[\s\S]*?\.focus-note\s*\{[^}]*width:\s*100%[^}]*max-width:\s*none/s,
  "The mobile focus note must not shrink to its min-content width",
);
assert.match(favicon, /<svg/);
assert.match(favicon, /aria-hidden="true"/);

const js = readFileSync(new URL("../index.js", import.meta.url), "utf8");

assert.match(js, /document\.documentElement\.classList\.add\("js"\)/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /"IntersectionObserver" in window/);
assert.match(js, /aria-expanded/);
assert.match(js, /aria-current/);
assert.match(js, /prefers-reduced-motion/);

class FakeClassList {
  values = new Set();

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }

  toggle(name, force) {
    if (force) this.values.add(name);
    else this.values.delete(name);
  }

  contains(name) {
    return this.values.has(name);
  }
}

const revealItem = { classList: new FakeClassList() };
const menuButton = {
  addEventListener() {},
  getAttribute() {
    return "false";
  },
  setAttribute() {},
};
const menu = { querySelectorAll: () => [] };
const observers = [];

class FakeIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.unobserved = [];
    observers.push(this);
  }

  observe() {}

  unobserve(item) {
    this.unobserved.push(item);
  }
}

const fakeWindow = {
  addEventListener() {},
  IntersectionObserver: FakeIntersectionObserver,
  matchMedia: () => ({ matches: false }),
};
const fakeDocument = {
  body: { classList: new FakeClassList() },
  documentElement: { classList: new FakeClassList() },
  querySelector(selector) {
    if (selector === "[data-menu-button]") return menuButton;
    if (selector === "[data-menu]") return menu;
    return null;
  },
  querySelectorAll(selector) {
    if (selector === "[data-reveal]") return [revealItem];
    return [];
  },
};

runInNewContext(js, {
  document: fakeDocument,
  window: fakeWindow,
  IntersectionObserver: FakeIntersectionObserver,
});

observers[0].callback(
  [
    {
      boundingClientRect: { top: -1 },
      isIntersecting: false,
      target: revealItem,
    },
  ],
  observers[0],
);

assert.equal(
  revealItem.classList.contains("is-revealed"),
  true,
  "A reveal item skipped by a fast scroll must become visible",
);

const verifyImmediateReveal = ({ reducedMotion, withObserver }) => {
  const item = { classList: new FakeClassList() };
  const runtimeWindow = {
    addEventListener() {},
    matchMedia: () => ({ matches: reducedMotion }),
  };

  if (withObserver) {
    runtimeWindow.IntersectionObserver = FakeIntersectionObserver;
  }

  const runtimeDocument = {
    body: { classList: new FakeClassList() },
    documentElement: { classList: new FakeClassList() },
    querySelector: () => null,
    querySelectorAll(selector) {
      return selector === "[data-reveal]" ? [item] : [];
    },
  };

  runInNewContext(js, {
    document: runtimeDocument,
    window: runtimeWindow,
    ...(withObserver
      ? { IntersectionObserver: FakeIntersectionObserver }
      : {}),
  });

  return item.classList.contains("is-revealed");
};

assert.equal(
  verifyImmediateReveal({ reducedMotion: true, withObserver: true }),
  true,
  "Reduced-motion visitors must see content without reveal animation",
);
assert.equal(
  verifyImmediateReveal({ reducedMotion: false, withObserver: false }),
  true,
  "Content must remain visible when IntersectionObserver is unavailable",
);

console.log("site structure: ok");
