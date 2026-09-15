/**
 * Sonnet Explorer Widget
 *
 * Static, pre-generated poem explorer for the transformer-poetry project page.
 * The pool holds sonnets from the project's final writer (the plan-then-poem
 * pipeline with the distilled writer), scheme-valid without repair. The widget
 * streams saved text to the screen; no generation happens in the browser and
 * only checker metadata is shown.
 */

(function () {
  "use strict";

  const POOL_URL = "/assets/js/sonnet-pool-pipeline.json";
  const TARGET_DURATION_MS = 4000;
  const CHAR_DELAY_MIN_MS = 6;
  const CHAR_DELAY_MAX_MS = 30;
  const LINE_PAUSE_MS = 120;
  const CHIP_DELAY_MS = 70;

  let pool = null;
  let activeIndex = null;
  let streamToken = 0;

  let root = null;
  let titleEl = null;
  let noteEl = null;
  let poemEl = null;
  let metaEl = null;
  let counterEl = null;
  let statusEl = null;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function prefersReducedMotion() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function chip(label, value, ok) {
    const span = el("span", "sonnet-chip");
    span.appendChild(el("span", "sonnet-chip__label", label + ": "));
    span.appendChild(el("strong", "sonnet-chip__value" + (ok === false ? " sonnet-chip__value--bad" : ""), value));
    return span;
  }

  function showStatus(text) {
    statusEl.textContent = text;
  }

  function revealChips(poem) {
    const chips = [
      chip("Rhyme scheme", poem.scheme || "none", poem.scheme_valid),
      chip("Scheme valid", poem.scheme_valid ? "yes" : "no", poem.scheme_valid),
      chip("Lines", String(poem.line_count)),
      chip("Hendecasyllables", poem.accepted_lines + " / 14"),
      chip("Rhyme score", poem.rhyme_score.toFixed(2)),
    ];
    metaEl.innerHTML = "";
    if (prefersReducedMotion()) {
      chips.forEach(function (item) {
        metaEl.appendChild(item);
      });
      return;
    }
    let index = 0;
    function next() {
      if (index >= chips.length) return;
      metaEl.appendChild(chips[index]);
      index += 1;
      window.setTimeout(next, CHIP_DELAY_MS);
    }
    next();
  }

  function showInstant(poem, lines) {
    poemEl.innerHTML = "";
    lines.forEach(function (line, lineIndex) {
      const row = el("div", "sonnet-line" + (lineIndex === 0 ? " fw-semibold" : ""));
      row.textContent = line;
      poemEl.appendChild(row);
    });
    revealChips(poem);
    showStatus("Poem " + (activeIndex + 1) + " of " + pool.count + " shown.");
  }

  function streamPoem(poem, lines) {
    if (prefersReducedMotion()) {
      showInstant(poem, lines);
      return;
    }

    const totalChars = lines.join("").length || 1;
    const charDelay = Math.max(CHAR_DELAY_MIN_MS, Math.min(CHAR_DELAY_MAX_MS, TARGET_DURATION_MS / totalChars));

    poemEl.innerHTML = "";
    metaEl.innerHTML = "";
    showStatus("Writing to scheme " + (poem.scheme || "…") + "…");

    const token = streamToken;
    const caret = el("span", "sonnet-caret", "\u258d");
    caret.setAttribute("aria-hidden", "true");

    let lineIndex = 0;
    let charIndex = 0;
    let row = null;

    function step() {
      if (token !== streamToken) return;
      if (lineIndex >= lines.length) {
        caret.remove();
        revealChips(poem);
        showStatus("Poem " + (activeIndex + 1) + " of " + pool.count + " shown.");
        return;
      }
      const text = lines[lineIndex];
      if (!row) {
        row = el("div", "sonnet-line" + (lineIndex === 0 ? " fw-semibold" : ""));
        poemEl.appendChild(row);
      }
      if (charIndex < text.length) {
        charIndex += 1;
        row.textContent = text.slice(0, charIndex);
        row.appendChild(caret);
        window.setTimeout(step, charDelay);
        return;
      }
      row.textContent = text;
      lineIndex += 1;
      charIndex = 0;
      row = null;
      window.setTimeout(step, LINE_PAUSE_MS);
    }

    step();
  }

  function renderPoem(index) {
    activeIndex = index;
    const poem = pool.poems[index];
    counterEl.textContent = "Poem " + (index + 1) + " of " + pool.count;
    streamToken += 1;
    const lines = poem.text
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(function (line) {
        return line.length > 0;
      });
    if (!lines.length) return;
    streamPoem(poem, lines);
  }

  function showRandom() {
    if (!pool || !pool.poems.length) return;
    let next = Math.floor(Math.random() * pool.poems.length);
    if (pool.poems.length > 1 && next === activeIndex) {
      next = (next + 1) % pool.poems.length;
    }
    renderPoem(next);
  }

  function showFromHash() {
    if (!pool) return false;
    const match = /#poem=([0-9a-f]+)/.exec(window.location.hash || "");
    if (!match) return false;
    const index = pool.poems.findIndex(function (poem) {
      return poem.id === match[1];
    });
    if (index < 0) return false;
    renderPoem(index);
    return true;
  }

  function buildUi() {
    root.innerHTML = "";
    root.className = "sonnet-explorer my-4 p-3 border rounded";

    const header = el("div", "d-flex flex-wrap align-items-center justify-content-end mb-2");
    const shuffle = el("button", "btn btn-sm btn-primary", "Another poem");
    shuffle.type = "button";
    shuffle.addEventListener("click", showRandom);
    header.appendChild(shuffle);
    root.appendChild(header);

    titleEl = el("div", "fw-semibold");
    root.appendChild(titleEl);
    noteEl = el("div", "text-muted small mb-2");
    root.appendChild(noteEl);

    poemEl = el("div", "sonnet-poem font-italic mb-2");
    root.appendChild(poemEl);

    metaEl = el("div", "sonnet-meta");
    root.appendChild(metaEl);

    const footer = el("div", "d-flex justify-content-between align-items-center mt-2");
    counterEl = el("span", "text-muted small");
    footer.appendChild(counterEl);
    statusEl = el("span", "text-muted small");
    statusEl.setAttribute("aria-live", "polite");
    footer.appendChild(statusEl);
    root.appendChild(footer);
  }

  function init() {
    root = document.getElementById("sonnet-generator");
    if (!root) return;
    buildUi();
    fetch(POOL_URL)
      .then(function (response) {
        if (!response.ok) throw new Error("pool unavailable");
        return response.json();
      })
      .then(function (data) {
        pool = data;
        titleEl.textContent = pool.label;
        noteEl.textContent = pool.note;
        if (!showFromHash()) showRandom();
      })
      .catch(function () {
        showStatus("Poem pool could not be loaded.");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
