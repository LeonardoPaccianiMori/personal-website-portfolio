/**
 * Sonnet Explorer Widget
 *
 * Static, pre-generated poem explorer for the transformer-poetry project page.
 * Two pools are available: sonnets from the 2026-09 plan-then-poem pipeline
 * (scheme-valid, no repair) and a sample of the 2026-08 published model.
 * Only checker metadata is shown; no live generation happens in the browser.
 */

(function () {
  "use strict";

  const baseUrl = window.location.origin;
  const POOL_URLS = {
    pipeline: `${baseUrl}/assets/js/sonnet-pool-pipeline.json`,
    published: `${baseUrl}/assets/js/sonnet-pool-published.json`,
  };

  const pools = {};
  let activeMode = "pipeline";
  let activeIndex = null;

  let root = null;
  let titleEl = null;
  let noteEl = null;
  let poemEl = null;
  let metaEl = null;
  let counterEl = null;
  let statusEl = null;
  let modeButtons = [];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function loadPool(mode) {
    if (pools[mode]) return Promise.resolve(pools[mode]);
    return fetch(POOL_URLS[mode])
      .then(function (response) {
        if (!response.ok) throw new Error("pool unavailable");
        return response.json();
      })
      .then(function (data) {
        pools[mode] = data;
        return data;
      });
  }

  function chip(label, value, ok) {
    const span = el("span", "badge rounded-pill text-bg-light border me-1 mb-1");
    span.appendChild(el("span", "text-muted", label + ": "));
    span.appendChild(el("strong", ok === false ? "text-danger" : "text-body", value));
    return span;
  }

  function renderPoem(pool, index) {
    const poem = pool.poems[index];
    activeIndex = index;
    poemEl.innerHTML = "";
    const lines = poem.text.split("\n").filter(function (line) {
      return line.trim().length > 0;
    });
    lines.forEach(function (line, lineIndex) {
      const row = el("div", "sonnet-line" + (lineIndex === 0 ? " fw-semibold" : ""));
      row.textContent = line.trim();
      poemEl.appendChild(row);
    });
    metaEl.innerHTML = "";
    metaEl.appendChild(chip("Rhyme scheme", poem.scheme || "none", poem.scheme_valid));
    metaEl.appendChild(chip("Scheme valid", poem.scheme_valid ? "yes" : "no", poem.scheme_valid));
    metaEl.appendChild(chip("Lines", String(poem.line_count)));
    metaEl.appendChild(chip("Hendecasyllables", poem.accepted_lines + " / 14"));
    metaEl.appendChild(chip("Rhyme score", poem.rhyme_score.toFixed(2)));
    counterEl.textContent = "Poem " + (index + 1) + " of " + pool.count;
  }

  function showRandom() {
    const pool = pools[activeMode];
    if (!pool || !pool.poems.length) return;
    let next = Math.floor(Math.random() * pool.poems.length);
    if (pool.poems.length > 1 && next === activeIndex) {
      next = (next + 1) % pool.poems.length;
    }
    renderPoem(pool, next);
  }

  function showFromHash() {
    const pool = pools[activeMode];
    if (!pool) return false;
    const match = /#poem=([0-9a-f]+)/.exec(window.location.hash || "");
    if (!match) return false;
    const index = pool.poems.findIndex(function (poem) {
      return poem.id === match[1];
    });
    if (index < 0) return false;
    renderPoem(pool, index);
    return true;
  }

  function setMode(mode) {
    if (!pools[mode]) return;
    activeMode = mode;
    activeIndex = null;
    const pool = pools[mode];
    titleEl.textContent = pool.label;
    noteEl.textContent = pool.note;
    modeButtons.forEach(function (button) {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (!showFromHash()) showRandom();
  }

  function buildUi() {
    root.innerHTML = "";
    root.className = "sonnet-explorer my-4 p-3 border rounded";

    const header = el("div", "d-flex flex-wrap align-items-center justify-content-between mb-2");
    const toggle = el("div", "btn-group btn-group-sm", undefined);
    toggle.setAttribute("role", "group");
    [
      ["pipeline", "2026-09 pipeline"],
      ["published", "2026-08 published model"],
    ].forEach(function (pair) {
      const button = el("button", "btn btn-outline-secondary", pair[1]);
      button.type = "button";
      button.dataset.mode = pair[0];
      button.addEventListener("click", function () {
        loadPool(pair[0]).then(function () {
          setMode(pair[0]);
        });
      });
      toggle.appendChild(button);
      modeButtons.push(button);
    });
    header.appendChild(toggle);
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
    poemEl.setAttribute("aria-live", "polite");
    root.appendChild(poemEl);

    metaEl = el("div", "sonnet-meta");
    root.appendChild(metaEl);

    const footer = el("div", "d-flex justify-content-between align-items-center mt-2");
    counterEl = el("span", "text-muted small");
    footer.appendChild(counterEl);
    statusEl = el("span", "text-muted small");
    footer.appendChild(statusEl);
    root.appendChild(footer);
  }

  function init() {
    root = document.getElementById("sonnet-generator");
    if (!root) return;
    buildUi();
    loadPool("pipeline")
      .then(function () {
        pools.pipeline = pools.pipeline;
        setMode("pipeline");
      })
      .catch(function () {
        statusEl.textContent = "Poem pool could not be loaded.";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
