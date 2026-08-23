/* =====================================================
   SAGARMATHA TREKS — shared header / mega-menu (sub-pages)
   ===================================================== */
(() => {
  "use strict";
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const desktop = window.matchMedia("(min-width: 1101px)");

  /* ---------- sticky shadow ---------- */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- topbar dismiss ---------- */
  $("#topbarClose")?.addEventListener("click", () => $("#topbar")?.remove());

  /* ---------- mega / dropdown open-close ---------- */
  const items  = $$(".nav-item[data-menu]");
  const panelOf = (item) => $("#mega-" + item.dataset.menu);
  let closeT = null;

  const setOpen = (item, open) => {
    item.classList.toggle("open", open);
    $(".nav-trigger", item)?.setAttribute("aria-expanded", open);
    const p = panelOf(item);
    if (p) p.hidden = !open;
  };
  const closeAll = () => items.forEach((i) => setOpen(i, false));
  const openOnly = (item) => { closeAll(); setOpen(item, true); };

  items.forEach((item) => {
    const panel = panelOf(item);
    $(".nav-trigger", item)?.addEventListener("click", () =>
      item.classList.contains("open") ? closeAll() : openOnly(item)
    );
    [item, panel].forEach((el) => {
      if (!el) return;
      el.addEventListener("mouseenter", () => { if (desktop.matches) { clearTimeout(closeT); openOnly(item); } });
      el.addEventListener("mouseleave", () => { if (desktop.matches) { clearTimeout(closeT); closeT = setTimeout(closeAll, 160); } });
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav-item") && !e.target.closest(".mega")) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* ---------- rail tabs (Destinations mega) ---------- */
  $$(".mega-rail").forEach((rail) => {
    const tabs = $$(".rail-tab", rail);
    const show = (tab) => {
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      $$(".mega-panel", rail.closest(".mega")).forEach((p) => p.classList.toggle("active", p.id === tab.dataset.panel));
    };
    tabs.forEach((t) => {
      t.addEventListener("click", () => show(t));
      t.addEventListener("mouseenter", () => show(t));
    });
  });

  /* ---------- mobile drawer ---------- */
  const mBtn = $("#mnavBtn"), mPanel = $("#mnavPanel");
  const setDrawer = (open) => {
    mPanel.classList.toggle("open", open);
    mBtn.setAttribute("aria-expanded", open);
    document.body.classList.toggle("no-scroll", open);
  };
  mBtn.addEventListener("click", () => setDrawer(!mPanel.classList.contains("open")));
  $$(".mnav-acc", mPanel).forEach((b) => b.addEventListener("click", () => b.closest(".mnav-sec").classList.toggle("open")));
  $$("a", mPanel).forEach((a) => a.addEventListener("click", () => setDrawer(false)));

  /* ---------- wishlist badge sync (same storage as home) ---------- */
  try {
    const n = (JSON.parse(localStorage.getItem("wishlist")) || []).length;
    $$(".wl-count").forEach((el) => (el.textContent = n));
  } catch {}
})();