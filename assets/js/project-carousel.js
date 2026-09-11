(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-project-scroller]").forEach((scroller) => {
    const group = scroller.closest(".site-project-group");
    const controls = group ? group.querySelector("[data-project-controls]") : null;
    const prev = group ? group.querySelector("[data-project-prev]") : null;
    const next = group ? group.querySelector("[data-project-next]") : null;
    const grid = scroller.querySelector(".site-project-grid");
    const card = scroller.querySelector(".site-project-card");

    if (!controls || !prev || !next || !grid || !card) {
      return;
    }

    const stepSize = () => {
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const update = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const overflows = maxScroll > 1;
      controls.hidden = !overflows;
      prev.disabled = !overflows || scroller.scrollLeft <= 1;
      next.disabled = !overflows || scroller.scrollLeft >= maxScroll - 1;
    };

    const scrollByStep = (direction) => {
      scroller.scrollBy({
        left: direction * stepSize(),
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    };

    prev.addEventListener("click", () => scrollByStep(-1));
    next.addEventListener("click", () => scrollByStep(1));
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();
