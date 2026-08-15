/* ============ SAGARMATHA — PACKAGE DETAIL (self-contained, index.js untouched) ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const showToast = (msg) => { const t = $("#toast"); if (!t) return; $("#toastMsg").textContent = msg; t.style.display = "flex"; clearTimeout(showToast._t); showToast._t = setTimeout(() => (t.style.display = "none"), 2600); };

/* 1. header: solid from load on this light page */
const header = $("#header");
if (header) header.classList.add("scrolled");

/* 2. reveal on scroll */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
} else $$(".reveal").forEach((el) => el.classList.add("in"));

/* 3. stars renderer */
const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const emptyStarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
$$(".stars").forEach((el) => { const r = parseFloat(el.dataset.rating) || 0; el.innerHTML = ""; for (let i = 0; i < 5; i++) el.insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg); });

/* 4. wishlist + detail heart */
let wishlist = (() => { try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; } })();
const saveWishlist = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  const c = $("#wlCount"); if (c) c.textContent = wishlist.length;
  $$(".pd-heart").forEach((b) => { const on = wishlist.includes(b.dataset.id); b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
};
saveWishlist();
const pdHeart = $("#pdHeart");
if (pdHeart) pdHeart.addEventListener("click", () => {
  const id = pdHeart.dataset.id;
  if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); }
  else { wishlist.push(id); showToast("Saved to your wishlist"); }
  saveWishlist();
});

/* 5. share */
const shareBtn = $("#shareBtn");
if (shareBtn) shareBtn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(location.href); showToast("Link copied — share the adventure"); }
  catch { showToast("Copy the URL from your address bar"); }
});

/* 6. mobile menu */
const menuBtn = $("#menuBtn"), mobilePanel = $("#mobilePanel");
if (menuBtn && mobilePanel) {
  menuBtn.addEventListener("click", () => { const o = mobilePanel.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); document.body.classList.toggle("no-scroll", o); });
  $$(".mobile-panel a").forEach((a) => a.addEventListener("click", () => { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); }));
}

/* 7. lead modal (intercepts data-lead-link CTAs) */
const leadModal = $("#leadModal"); let pendingLink = "";
function closeLead() { if (!leadModal) return; leadModal.style.display = "none"; document.body.classList.remove("no-scroll"); $("#leadError").style.display = "none"; $("#leadForm").reset(); }
if (leadModal) {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-lead-link]"); if (!t) return;
    e.preventDefault(); pendingLink = t.dataset.leadLink;
    leadModal.style.display = "flex"; document.body.classList.add("no-scroll"); $("#leadName").focus();
  });
  $("#lClose").addEventListener("click", closeLead);
  leadModal.addEventListener("click", (e) => { if (e.target === leadModal) closeLead(); });
  $("#leadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#leadName").value.trim(), em = $("#leadEmail").value.trim(), err = $("#leadError");
    if (!n) { err.textContent = "Please tell us your name."; err.style.display = "block"; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = "That email doesn't look right."; err.style.display = "block"; return; }
    try { localStorage.setItem("lead", JSON.stringify({ name: n, email: em, at: Date.now() })); } catch {}
    window.open(pendingLink, "_blank", "noopener"); closeLead();
  });
}

/* 8. gallery lightbox */
const lightbox = $("#lightbox");
const closeLightbox = () => { if (!lightbox) return; lightbox.style.display = "none"; document.body.classList.remove("no-scroll"); };
if (lightbox) {
  $$("[data-open-lightbox]").forEach((b) => b.addEventListener("click", () => { lightbox.style.display = "flex"; document.body.classList.add("no-scroll"); }));
  $("#lbClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  $$(".lb-thumb").forEach((t) => t.addEventListener("click", () => { $("#lbMain").src = t.dataset.full || $("img", t).src; $$(".lb-thumb").forEach((x) => x.classList.toggle("active", x === t)); }));
}

/* 9. group tiers collapse */
const tiersToggle = $("#tiersToggle");
if (tiersToggle) tiersToggle.addEventListener("click", () => { const o = $("#tiersWrap").classList.toggle("open"); tiersToggle.setAttribute("aria-expanded", o); });

/* 10. accordions (itinerary + faqs) + expand all */
$$(".acc-head").forEach((h) => h.addEventListener("click", () => { const it = h.closest(".acc-item"); const o = it.classList.toggle("open"); h.setAttribute("aria-expanded", o); }));
$$("[data-expand-all]").forEach((btn) => btn.addEventListener("click", () => {
  const root = $(btn.dataset.expandAll); if (!root) return;
  const items = $$(".acc-item", root); const allOpen = items.every((i) => i.classList.contains("open"));
  items.forEach((i) => { i.classList.toggle("open", !allOpen); $(".acc-head", i).setAttribute("aria-expanded", String(!allOpen)); });
  btn.textContent = allOpen ? "Expand all" : "Collapse all";
}));

/* 11. packing checklist (localStorage) */
const packInputs = $$(".pack-item input");
if (packInputs.length) {
  const KEY = "pack-ebc"; let saved = []; try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
  const counter = $("#packCount");
  const update = () => { if (counter) counter.textContent = packInputs.filter((i) => i.checked).length + " / " + packInputs.length + " packed"; };
  packInputs.forEach((i) => {
    i.checked = saved.includes(i.id);
    i.addEventListener("change", () => { try { localStorage.setItem(KEY, JSON.stringify(packInputs.filter((x) => x.checked).map((x) => x.id))); } catch {} update(); });
  });
  update();
  const reset = $("#packReset");
  if (reset) reset.addEventListener("click", () => { packInputs.forEach((i) => (i.checked = false)); try { localStorage.setItem(KEY, "[]"); } catch {} update(); showToast("Packing list reset"); });
}

/* 12. departures: tabs + month chips */
const pdTabs = $$(".pd-tab");
pdTabs.forEach((t) => t.addEventListener("click", () => {
  pdTabs.forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
  $$(".pd-panel").forEach((p) => p.classList.toggle("active", p.id === t.dataset.tab));
}));
const depChips = $$(".dep-chip");
depChips.forEach((c) => c.addEventListener("click", () => {
  depChips.forEach((x) => x.classList.toggle("chip-active", x === c));
  const m = c.dataset.month;
  $$(".dep-row").forEach((r) => r.classList.toggle("hidden", m !== "all" && r.dataset.month !== m));
}));

/* 13. video facade (click-to-load) */
const facade = $(".video-facade");
if (facade) facade.addEventListener("click", () => {
  const id = facade.dataset.yt;
  if (!id || id === "YOUR_VIDEO_ID") { showToast("Add your YouTube ID to data-yt to roll the film"); return; }
  facade.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" title="Everest Base Camp trek film" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
});

/* 14. ESC closes overlays */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (leadModal && leadModal.style.display !== "none") closeLead();
  else if (lightbox && lightbox.style.display !== "none") closeLightbox();
  else if (mobilePanel && mobilePanel.classList.contains("open")) { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); }
});