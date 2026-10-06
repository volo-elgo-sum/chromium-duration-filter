(() => {
  "use strict";

  const gridSelector =
    ".grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5";
  const durationSelector =
    ".absolute.bottom-1.right-1.rounded-lg.px-2.py-1.text-xs.text-nord5.bg-gray-800.bg-opacity-75";
  const thresholdSeconds = 3 * 60 * 60;
  const hiddenClass = "duration-filter-hidden-card";
  const style = document.createElement("style");
  style.textContent = `${gridSelector} { grid-auto-flow: row dense !important; }
.${hiddenClass} { display: none !important; }`;
  (document.head || document.documentElement).append(style);

  function parseDuration(text) {
    const match = text.trim().match(/^(\d+):(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, hours, minutes, seconds] = match;
    if (Number(minutes) > 59 || Number(seconds) > 59) return null;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }

  function filterCards() {
    for (const grid of document.querySelectorAll(gridSelector)) {
      for (const badge of grid.querySelectorAll(durationSelector)) {
        const duration = parseDuration(badge.textContent || "");
        if (duration === null || duration <= thresholdSeconds) continue;

        const link = badge.closest("a");
        const card = link?.closest(`${gridSelector} > div`);
        if (card && grid.contains(card)) card.classList.add(hiddenClass);
      }
    }
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      filterCards();
    });
  });

  filterCards();
  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
})();
