/* =====================================================
   TEAM LIST PAGE — scoped JS
   Handles search + filter chips only.
   Header, wishlist, lead modal, reveal animations
   are already handled by the global index.js.
   ===================================================== */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- DOM refs ---------- */
  const searchInput = $("#teamSearch");
  const searchClear = $("#teamSearchClear");
  const grid = $("#teamGrid");
  const cards = $$(".team-card");
  const countEl = $("#teamCount");
  const totalEl = $("#teamTotal");
  const emptyEl = $("#teamEmpty");
  const emptyClear = $("#teamEmptyClear");
  const chips = $$(".team-chip");

  /* ---------- State ---------- */
  let activeFilter = "all";
  let activeQuery = "";

  /* ---------- Core render ---------- */
  const apply = () => {
    const q = activeQuery.toLowerCase().trim();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    let visible = 0;

    cards.forEach((card) => {
      const cat = card.dataset.category;
      const hay = (card.dataset.search || "").toLowerCase();
      const name = (card.dataset.name || "").toLowerCase();
      const role = (card.dataset.role || "").toLowerCase();

      const matchFilter = activeFilter === "all" || cat === activeFilter;
      const matchQuery =
        !tokens.length ||
        tokens.some((tok) => hay.includes(tok) || name.includes(tok) || role.includes(tok));

      const show = matchFilter && matchQuery;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });

    countEl.textContent = visible;
    if (totalEl) totalEl.textContent = cards.length;
    emptyEl.classList.toggle("visible", visible === 0);
  };

  /* ---------- Search input ---------- */
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      activeQuery = searchInput.value;
      searchClear.classList.toggle("visible", !!activeQuery);
      apply();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        clearSearch();
        searchInput.blur();
      }
    });
  }

  const clearSearch = () => {
    if (!searchInput) return;
    searchInput.value = "";
    activeQuery = "";
    searchClear.classList.remove("visible");
    apply();
  };

  if (searchClear) searchClear.addEventListener("click", () => {
    clearSearch();
    searchInput.focus();
  });

  /* ---------- Filter chips ---------- */
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      apply();
    });
  });

  /* ---------- Empty state reset ---------- */
  if (emptyClear) emptyClear.addEventListener("click", () => {
    clearSearch();
    activeFilter = "all";
    chips.forEach((c) => c.classList.toggle("active", c.dataset.filter === "all"));
    apply();
    searchInput && searchInput.focus();
  });

  /* ---------- Keyboard shortcut: "/" focuses search ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || !searchInput) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable) return;
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  });

  /* ---------- Initial render ---------- */
  apply();
})();