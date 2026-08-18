/* ============ SAGARMATHA — PACKAGE DETAIL (self-contained, index.js untouched) ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const showToast = (msg) => { const t = $("#toast"); if (!t) return; $("#toastMsg").textContent = msg; t.style.display = "flex"; clearTimeout(showToast._t); showToast._t = setTimeout(() => (t.style.display = "none"), 2600); };
/* 1. header solid */
const header = $("#header"); if (header) header.classList.add("scrolled");
/* 2. reveal */
if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1, rootMargin: "0px 0px -40px 0px" }); $$(".reveal").forEach((el) => io.observe(el)); } else $$(".reveal").forEach((el) => el.classList.add("in"));
/* 3. stars */
const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const emptyStarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
$$(".stars").forEach((el) => { const r = parseFloat(el.dataset.rating) || 0; el.innerHTML = ""; for (let i = 0; i < 5; i++) el.insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg); });
/* 4. wishlist */
let wishlist = (() => { try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; } })();
const saveWishlist = () => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); const c = $("#wlCount"); if (c) c.textContent = wishlist.length; $$(".pd-heart").forEach((b) => { const on = wishlist.includes(b.dataset.id); b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); }); };
saveWishlist();
const pdHeart = $("#pdHeart");
if (pdHeart) pdHeart.addEventListener("click", () => { const id = pdHeart.dataset.id; if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); } else { wishlist.push(id); showToast("Saved to your wishlist"); } saveWishlist(); });
/* 5. share */
const shareBtn = $("#shareBtn");
if (shareBtn) shareBtn.addEventListener("click", async () => { try { await navigator.clipboard.writeText(location.href); showToast("Link copied — share the adventure"); } catch { showToast("Copy the URL from your address bar"); } });
/* 6. mobile menu */
const menuBtn = $("#menuBtn"), mobilePanel = $("#mobilePanel");
if (menuBtn && mobilePanel) { menuBtn.addEventListener("click", () => { const o = mobilePanel.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); document.body.classList.toggle("no-scroll", o); }); $$(".mobile-panel a").forEach((a) => a.addEventListener("click", () => { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); })); }
/* 7. lead modal */
const leadModal = $("#leadModal"); let pendingLink = "";
function closeLead() { if (!leadModal) return; leadModal.style.display = "none"; document.body.classList.remove("no-scroll"); $("#leadError").style.display = "none"; $("#leadForm").reset(); }
if (leadModal) {
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-lead-link]"); if (!t) return; e.preventDefault(); pendingLink = t.dataset.leadLink; leadModal.style.display = "flex"; document.body.classList.add("no-scroll"); $("#leadName").focus(); });
  $("#lClose").addEventListener("click", closeLead);
  leadModal.addEventListener("click", (e) => { if (e.target === leadModal) closeLead(); });
  $("#leadForm").addEventListener("submit", (e) => { e.preventDefault(); const n = $("#leadName").value.trim(), em = $("#leadEmail").value.trim(), err = $("#leadError"); if (!n) { err.textContent = "Please tell us your name."; err.style.display = "block"; return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = "That email doesn't look right."; err.style.display = "block"; return; } try { localStorage.setItem("lead", JSON.stringify({ name: n, email: em, at: Date.now() })); } catch {} window.open(pendingLink, "_blank", "noopener"); closeLead(); });
}
/* 8. lightbox open/close (carousel rebuilt in append v2) */
const lightbox = $("#lightbox");
const closeLightbox = () => { if (!lightbox) return; lightbox.style.display = "none"; document.body.classList.remove("no-scroll"); };
if (lightbox) {
  $$("[data-open-lightbox]").forEach((b) => b.addEventListener("click", () => { lightbox.style.display = "flex"; document.body.classList.add("no-scroll"); }));
  $("#lbClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
}
/* 9. tiers */
const tiersToggle = $("#tiersToggle");
if (tiersToggle) tiersToggle.addEventListener("click", () => { const o = $("#tiersWrap").classList.toggle("open"); tiersToggle.setAttribute("aria-expanded", o); });
/* 10. accordions + expand all */
$$(".acc-head").forEach((h) => h.addEventListener("click", () => { const it = h.closest(".acc-item"); const o = it.classList.toggle("open"); h.setAttribute("aria-expanded", o); }));
$$("[data-expand-all]").forEach((btn) => btn.addEventListener("click", () => { const root = $(btn.dataset.expandAll); if (!root) return; const items = $$(".acc-item", root); const allOpen = items.every((i) => i.classList.contains("open")); items.forEach((i) => { i.classList.toggle("open", !allOpen); $(".acc-head", i).setAttribute("aria-expanded", String(!allOpen)); }); btn.textContent = allOpen ? "Expand all" : "Collapse all"; }));
/* 11. packing checklist */
const packInputs = $$(".pack-item input");
if (packInputs.length) {
  const KEY = "pack-ebc"; let saved = []; try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
  const counter = $("#packCount");
  const update = () => { if (counter) counter.textContent = packInputs.filter((i) => i.checked).length + " / " + packInputs.length + " packed"; };
  packInputs.forEach((i) => { i.checked = saved.includes(i.id); i.addEventListener("change", () => { try { localStorage.setItem(KEY, JSON.stringify(packInputs.filter((x) => x.checked).map((x) => x.id))); } catch {} update(); }); });
  update();
  const reset = $("#packReset");
  if (reset) reset.addEventListener("click", () => { packInputs.forEach((i) => (i.checked = false)); try { localStorage.setItem(KEY, "[]"); } catch {} update(); showToast("Packing list reset"); });
}
/* 12. departures */
const pdTabs = $$(".pd-tab");
pdTabs.forEach((t) => t.addEventListener("click", () => { pdTabs.forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); }); $$(".pd-panel").forEach((p) => p.classList.toggle("active", p.id === t.dataset.tab)); }));
const depChips = $$(".dep-chip");
depChips.forEach((c) => c.addEventListener("click", () => { depChips.forEach((x) => x.classList.toggle("chip-active", x === c)); const m = c.dataset.month; $$(".dep-row").forEach((r) => r.classList.toggle("hidden", m !== "all" && r.dataset.month !== m)); }));
/* 13. video facade */
const facade = $(".video-facade");
if (facade) facade.addEventListener("click", () => { const id = facade.dataset.yt; if (!id || id === "YOUR_VIDEO_ID") { showToast("Add your YouTube ID to data-yt to roll the film"); return; } facade.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" title="Everest Base Camp trek film" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; });
/* 14. ESC */
document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (leadModal && leadModal.style.display !== "none") closeLead(); else if (lightbox && lightbox.style.display !== "none") closeLightbox(); else if (mobilePanel && mobilePanel.classList.contains("open")) { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); } });

/* ============ [APPEND v2] ============ */
const PD_BASE = "https://image.qwenlm.ai/public_source/0ebad543-7d64-4b52-9bd2-c69da9de10fc/";
const PD_GALLERY = ["1fa768619-9df4-4178-b78d-1e296613996c.png","1f373039c-6f87-4586-8f8d-1b7b2a7f55bc.png","1c658ea57-deeb-4400-83ef-02020712c84c.png","1885ad880-8f91-402a-8117-348866c12eb8.png","1dc701fcb-3b2d-4bce-892f-792c84e87d5e.png","12b3da831-07ef-4718-918e-9e890831c35e.png","196d28169-128d-4da0-9622-702344878c98.png","1b1ee017e-6731-4045-b996-f1ac331a6053.png","1aaa55904-71ec-47cd-a664-ade9d97bb10e.png","182831355-4138-4630-821e-a1c189e9393d.png","1c10c8850-772e-41c6-9193-076f55e9d3dc.png","178045681-7112-40fd-90e0-498f3bd73c92.png","14caac0d7-edad-48c7-a03e-66d4542197ed.png","1f6b16199-0d1a-4e9f-991b-08f7ee825a01.png"].map((id) => PD_BASE + id);
/* [2] carousel lightbox */
(function buildCarousel() {
  const lb = $("#lightbox"), main = lb && $(".lb-main", lb); if (!lb || !main) return;
  const N = PD_GALLERY.length; let idx = 0;
  main.innerHTML = `<div class="lb-viewport"><div class="lb-track">` + PD_GALLERY.map((u, i) => `<div class="lb-slide"><img src="${u}" alt="Everest Base Camp trek photo ${i + 1}" draggable="false"></div>`).join("") + `</div><button class="lb-arrow lb-prev" aria-label="Previous photo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button><button class="lb-arrow lb-next" aria-label="Next photo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button></div>`;
  main.insertAdjacentHTML("afterend", `<div class="lb-bar"><span class="lb-count" id="lbCount">1 / ${N}</span><div class="lb-dots" id="lbDots"></div></div>`);
  const track = $(".lb-track", main), dotsWrap = $("#lbDots", lb), count = $("#lbCount", lb);
  dotsWrap.innerHTML = PD_GALLERY.map((_, i) => `<button class="lb-dot" data-i="${i}" aria-label="Go to photo ${i + 1}"></button>`).join("");
  const dots = $$(".lb-dot", dotsWrap);
  const go = (i) => { idx = (i + N) % N; track.style.transform = `translateX(-${idx * 100}%)`; dots.forEach((d, k) => d.classList.toggle("on", k === idx)); count.textContent = `${idx + 1} / ${N}`; };
  $(".lb-prev", main).addEventListener("click", () => go(idx - 1));
  $(".lb-next", main).addEventListener("click", () => go(idx + 1));
  dotsWrap.addEventListener("click", (e) => { const d = e.target.closest(".lb-dot"); if (d) go(+d.dataset.i); });
  document.addEventListener("keydown", (e) => { if (!lb.style.display || lb.style.display === "none") return; if (e.key === "ArrowRight") go(idx + 1); if (e.key === "ArrowLeft") go(idx - 1); });
  let px = null; const vp = $(".lb-viewport", main);
  vp.addEventListener("pointerdown", (e) => (px = e.clientX));
  vp.addEventListener("pointerup", (e) => { if (px === null) return; const dx = e.clientX - px; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); px = null; });
  $$("[data-open-lightbox]").forEach((b) => b.addEventListener("click", () => go(0)));
  $$(".pd-gallery .pd-tile").forEach((t, i) => t.addEventListener("click", (e) => { if (e.target.closest("button")) return; lb.style.display = "flex"; document.body.classList.add("no-scroll"); go(i); }));
  go(0);
})();
/* [3][4] long itinerary */
const PD_IC = {
  alt:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>',
  up:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  down:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>',
  bed:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
  meal:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  dist:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
  plane:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  jeep:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
  walk:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>'
};
const PD_TP = { plane: "Mountain flight", jeep: "Private vehicle", walk: "On foot" };
const PD_ITIN = [
  { t:"Arrival in Kathmandu", alt:1400, max:1400, up:0, down:0, hrs:"", km:0, tp:["plane","jeep"], sleep:"Kathmandu · hotel (twin-share)", meals:"Not included", p:["Upon your arrival at Tribhuvan International Airport in Kathmandu, one of our representatives will warmly welcome you and escort you to your Thamel hotel in a private tourist vehicle.","During the evening pre-trip meeting you'll meet your trek guide, check permits and gear, and walk through the days ahead — ask us anything."]},
  { t:"Fly to Lukla, trek to Phakding", alt:2610, max:2860, up:300, down:550, hrs:"3–4 h", km:8, tp:["plane","walk"], sleep:"Phakding · teahouse", meals:"B · L · D", p:["An early 25-minute mountain flight over the Himalaya drops you onto the world's most thrilling runway.","Then a gentle first walk along the Dudh Koshi through pine forest and prayer flags to Phakding."]},
  { t:"Trek to Namche Bazaar", alt:3440, max:3440, up:830, down:0, hrs:"6–7 h", km:11, tp:["walk"], sleep:"Namche · teahouse", meals:"B · L · D", p:["Cross the swaying Hillary Bridge and climb 800 m through rhododendron forest to the Sherpa capital — Everest teasing through the pines.","First views of Thamserku; evening among Namche's bakeries and gear shops."]},
  { t:"Acclimatization — Everest View Hotel", alt:3440, max:3880, up:440, down:440, hrs:"4–5 h", km:5, tp:["walk"], sleep:"Namche · teahouse", meals:"B · L · D", p:["Climb high, sleep low: a ridge hike to the Everest View Hotel (3,880 m) and the Tenzing Norgay statue.","Coffee above the clouds, then an easy afternoon in Namche — the bakery stop is mandatory."]},
  { t:"Trek to Tengboche", alt:3860, max:3860, up:550, down:130, hrs:"5 h", km:10, tp:["walk"], sleep:"Tengboche · teahouse", meals:"B · L · D", p:["Rhododendron forest opens to alpine views; Ama Dablam towers over the trail all morning.","Catch the evening puja at the Khumbu's greatest monastery, prayer flags snapping behind the gompa."]},
  { t:"Trek to Dingboche", alt:4410, max:4410, up:600, down:50, hrs:"5–6 h", km:8.5, tp:["walk"], sleep:"Dingboche · teahouse", meals:"B · L · D", p:["Past Pangboche's ancient gompa into stone-walled potato fields; the treeline falls away and the mountains close in.","Lhotse looms straight up the valley — keep your camera handy."]},
  { t:"Acclimatization — Nangkartshang", alt:4410, max:5083, up:670, down:670, hrs:"4–5 h", km:4, tp:["walk"], sleep:"Dingboche · teahouse", meals:"B · L · D", p:["A steady ridge hike with views of Makalu and Island Peak from 5,083 m.","Climb high, sleep low, hydrate, repeat — the formula that makes the big days easy."]},
  { t:"Trek to Lobuche via Thukla Pass", alt:4910, max:4910, up:500, down:170, hrs:"5–6 h", km:8, tp:["walk"], sleep:"Lobuche · teahouse", meals:"B · L · D", p:["A quiet pause at the Thukla Pass memorials, then moraine trails beside the Khumbu Glacier.","High-alpine country now: Pumori, Lingtren and Khumbutse ring the horizon."]},
  { t:"Everest Base Camp → Gorak Shep", alt:5164, max:5364, up:750, down:700, hrs:"8–9 h", km:13, tp:["walk"], sleep:"Gorak Shep · teahouse", meals:"B · L · D", p:["The big day: rocky moraine to the prayer flags and the Base Camp rock beside the Khumbu Icefall.","You sleep at Gorak Shep (5,164 m) — the highest lodge on the trail."]},
  { t:"Kala Patthar sunrise → Pheriche", alt:4240, max:5555, up:400, down:1300, hrs:"7 h", km:10, tp:["walk"], sleep:"Pheriche · teahouse", meals:"B · L · D", p:["Pre-dawn climb to Kala Patthar (5,555 m) for the classic Everest, Lhotse, Nuptse and Pumori panorama at first light.","Breakfast at Gorak Shep, then a long, satisfying descent to Pheriche."]},
  { t:"Descend to Namche Bazaar", alt:3440, max:3440, up:200, down:1000, hrs:"6–7 h", km:19, tp:["walk"], sleep:"Namche · teahouse", meals:"B · L · D", p:["A surprisingly fast return on warm, oxygen-rich trails.","Celebrate with a bakery stop in Namche — you've earned it."]},
  { t:"Trek to Lukla", alt:2860, max:2860, up:450, down:1030, hrs:"6 h", km:18, tp:["walk"], sleep:"Lukla · teahouse", meals:"B · L · D", p:["The final stroll down the Dudh Koshi, retracing suspension bridges and pine forest.","Thank your crew and swap trail stories over a last teahouse dinner."]},
  { t:"Fly to Kathmandu", alt:1400, max:2860, up:0, down:0, hrs:"", km:0, tp:["plane","jeep"], sleep:"Kathmandu · hotel (twin-share)", meals:"Breakfast", p:["Morning flight out of the mountains; a free afternoon for souvenirs or a well-earned massage in Thamel."]},
  { t:"Departure", alt:1400, max:1400, up:0, down:0, hrs:"", km:0, tp:["jeep"], sleep:"— (homeward)", meals:"Breakfast", p:["Private transfer to the airport three hours before your flight — certificate in hand, camera full, heart fuller."]}
];
(function renderLongItinerary() {
  const root = $("#longItinAcc"); if (!root) return;
  const m = (v, u) => (v ? `${v.toLocaleString()} ${u}` : "—");
  root.innerHTML = PD_ITIN.map((d, i) => {
    const n = String(i + 1).padStart(2, "0");
    const imgs = [PD_GALLERY[i % 14], PD_GALLERY[(i + 5) % 14], PD_GALLERY[(i + 9) % 14]];
    const tp = d.tp.map((k) => `<span class="tp">${PD_IC[k]}${PD_TP[k]}</span>`).join("");
    return `<div class="acc-item"><button class="acc-head" aria-expanded="false"><span class="day-pill">${n}</span><span class="acc-title">${d.t}</span><span class="acc-meta">${d.alt ? d.alt.toLocaleString() + " m" : "—"}${d.hrs ? " · " + d.hrs : ""}</span><span class="acc-chev">▾</span></button><div class="acc-body"><div>
      <div class="li-gal">${imgs.map((u, k) => `<img src="${u}" alt="${d.t} — photo ${k + 1}" loading="lazy">`).join("")}</div>
      ${d.p.map((x) => `<p style="padding:0 18px 12px 78px">${x}</p>`).join("")}
      <div class="fact-panel">
        <div class="fp-item">${PD_IC.alt}<div><small>Max altitude</small>${m(d.max, "m")}</div></div>
        <div class="fp-item">${PD_IC.up}<div><small>Ascent</small><span class="up">↑ ${m(d.up, "m")}</span></div></div>
        <div class="fp-item">${PD_IC.down}<div><small>Descent</small><span class="down">↓ ${m(d.down, "m")}</span></div></div>
        <div class="fp-item">${PD_IC.clock}<div><small>Walking time</small>${d.hrs || "—"}</div></div>
        <div class="fp-item">${PD_IC.dist}<div><small>Distance</small>${m(d.km, "km")}</div></div>
        <div class="fp-item">${PD_IC[d.tp[0]]}<div><small>Transport</small>${tp}</div></div>
        <div class="fp-item">${PD_IC.bed}<div><small>Overnight</small>${d.sleep}</div></div>
        <div class="fp-item">${PD_IC.meal}<div><small>Meals</small>${d.meals}</div></div>
      </div></div></div></div>`;
  }).join("");
  root.addEventListener("click", (e) => { const h = e.target.closest(".acc-head"); if (!h || !root.contains(h)) return; const it = h.closest(".acc-item"); const o = it.classList.toggle("open"); h.setAttribute("aria-expanded", o); });
  const xb = $("[data-xall]");
  if (xb) xb.addEventListener("click", () => { const items = $$(".acc-item", root); const allOpen = items.every((i) => i.classList.contains("open")); items.forEach((i) => { i.classList.toggle("open", !allOpen); $(".acc-head", i).setAttribute("aria-expanded", String(!allOpen)); }); xb.textContent = allOpen ? "Expand all" : "Collapse all"; xb.setAttribute("aria-expanded", String(!allOpen)); });
})();
/* [5] altitude chart */
(function altitudeChart() {
  const wrap = $("#elevWrap"); if (!wrap) return;
  const SLEEP = PD_ITIN.map((d) => d.alt), PLACE = ["Kathmandu","Phakding","Namche","Namche","Tengboche","Dingboche","Dingboche","Lobuche","Gorak Shep","Pheriche","Namche","Lukla","Kathmandu","Departure"];
  const W = 1000, H = 400, L = 46, R = 14, T = 30, B = 74, YMAX = 6000;
  const x = (i) => L + (i * (W - L - R)) / 13, y = (a) => T + (1 - a / YMAX) * (H - T - B);
  let grid = "", labs = "";
  for (let g = 1000; g <= YMAX; g += 1000) { grid += `<line x1="${L}" y1="${y(g)}" x2="${W - R}" y2="${y(g)}" stroke="rgba(23,26,23,.08)"/>`; labs += `<text x="${L - 8}" y="${y(g) + 3}" text-anchor="end" font-size="10" fill="#6b6f68">${g / 1000}k</text>`; }
  const pts = SLEEP.map((a, i) => [x(i), y(a)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${x(13)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const dots = pts.map((p, i) => `<circle class="elev-dot" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--gold)" stroke="#fff" stroke-width="1.6" tabindex="0" aria-label="Day ${i + 1} ${PLACE[i]}, ${SLEEP[i].toLocaleString()} metres"></circle>`).join("");
  const xlab = pts.map((p, i) => `<text x="${p[0]}" y="${H - 40}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#171a17">${i + 1}</text><text x="${p[0]}" y="${H - 26}" text-anchor="end" font-size="9.5" fill="#6b6f68" transform="rotate(-32 ${p[0]} ${H - 26})">${PLACE[i]}</text>`).join("");
  wrap.innerHTML = `<svg class="elev-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Elevation profile of the Everest Base Camp trek">${grid}${labs}<path d="${area}" fill="rgba(47,107,79,.14)"/><path class="elev-line" d="${line}" fill="none" stroke="var(--pine)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="${x(9)}" y="${y(5555) - 12}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#171a17">Kala Patthar 5,555 m</text><text x="${x(8)}" y="${y(5364) - 12}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#a06a12">EBC 5,364 m</text>${dots}${xlab}</svg><div class="pd-tip" id="elevTip"></div>`;
  const svg = $("svg", wrap), lineEl = $(".elev-line", wrap), tip = $("#elevTip", wrap);
  const animate = () => { const len = lineEl.getTotalLength(); lineEl.style.strokeDasharray = len; lineEl.style.strokeDashoffset = len; requestAnimationFrame(() => { lineEl.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)"; lineEl.style.strokeDashoffset = "0"; }); };
  if ("IntersectionObserver" in window) { const o = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { animate(); o.disconnect(); } }), { threshold: .3 }); o.observe(wrap); } else animate();
  const show = (c) => { const i = +c.dataset.i, d = PD_ITIN[i]; tip.innerHTML = `<b>Day ${i + 1} · ${PLACE[i]}</b> · ${d.alt.toLocaleString()} m<span>Sleep altitude · max ${d.max.toLocaleString()} m · ↑${d.up.toLocaleString()} m ↓${d.down.toLocaleString()} m</span>`; const r = wrap.getBoundingClientRect(), cr = c.getBoundingClientRect(); tip.style.left = cr.left + cr.width / 2 - r.left + "px"; tip.style.top = cr.top - r.top + "px"; tip.classList.add("on"); };
  svg.addEventListener("pointerover", (e) => { const c = e.target.closest(".elev-dot"); if (c) show(c); });
  svg.addEventListener("pointerout", (e) => { if (e.target.closest(".elev-dot")) tip.classList.remove("on"); });
  svg.addEventListener("focusin", (e) => { const c = e.target.closest(".elev-dot"); if (c) show(c); });
  svg.addEventListener("focusout", () => tip.classList.remove("on"));
})();
/* [6] geojson nepal map */
(function nepalMap() {
  const frame = $("#nepalMap"); if (!frame) return;
  const OUTLINE = [[80.06,28.85],[80.4,29.05],[80.9,29.35],[81.05,29.65],[81.5,29.95],[82.0,30.0],[82.35,30.1],[82.9,29.75],[83.3,29.1],[83.8,29.3],[84.1,29.3],[84.25,28.95],[84.6,28.7],[85.0,28.6],[85.1,28.3],[85.4,28.1],[85.6,27.7],[86.0,27.9],[86.5,27.9],[87.0,27.9],[87.3,27.8],[87.6,27.6],[87.9,27.4],[88.05,27.15],[88.15,26.85],[87.9,26.6],[87.5,26.45],[87.0,26.4],[86.5,26.55],[86.0,26.6],[85.5,26.75],[85.2,26.95],[84.8,27.05],[84.2,27.2],[83.7,27.35],[83.2,27.45],[82.7,27.55],[82.2,27.75],[81.7,27.95],[81.3,28.2],[80.9,28.4],[80.4,28.6],[80.06,28.85]];
  const PEAKS = [["Everest",86.925,27.988,8849,"The highest mountain on Earth."],["Kanchenjunga",88.148,27.703,8586,"Third highest — the eastern giant."],["Lhotse",86.933,27.962,8516,"Everest's southern neighbour."],["Makalu",87.088,27.89,8485,"The four-sided pyramid."],["Cho Oyu",86.661,28.094,8188,"The 'Turquoise Goddess'."],["Dhaulagiri",83.487,28.697,8167,"The white mountain of the west."],["Manaslu",84.56,28.55,8163,"Mountain of the spirit."],["Annapurna",83.82,28.596,8091,"Goddess of the harvests."],["Langtang Lirung",85.517,28.255,7227,"Langtang's crown."],["Ama Dablam",86.871,27.861,6812,"The Khumbu's most beautiful peak."]];
  const FALLBACK = { type:"FeatureCollection", features:[ { type:"Feature", properties:{ name:"Nepal" }, geometry:{ type:"Polygon", coordinates:[OUTLINE] } }, ...PEAKS.map(([n, lon, lat, e, d]) => ({ type:"Feature", properties:{ name:n, elevation_m:e, description:d, details_url:"#" }, geometry:{ type:"Point", coordinates:[lon, lat] } })) ] };
  const ROUTE = [[27.687,86.731,"Lukla",2],[27.742,86.71,"Phakding",0],[27.806,86.714,"Namche",3],[27.837,86.763,"Tengboche",5],[27.891,86.831,"Dingboche",6],[27.906,86.846,"Lobuche",8],[28.003,86.855,"EBC",9],[27.998,86.829,"Kala Patthar",10]];
  const merc = (lon, lat) => [lon * Math.PI / 180, Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))];
  function makeProj(pts, W, H, pad) {
    let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
    pts.forEach(([lon, lat]) => { const q = merc(lon, lat); a = Math.min(a, q[0]); b = Math.max(b, q[0]); c = Math.min(c, q[1]); d = Math.max(d, q[1]); });
    const s = Math.min((W - 2 * pad) / (b - a || 1), (H - 2 * pad) / (d - c || 1));
    const ox = (W - (b - a) * s) / 2, oy = (H - (d - c) * s) / 2;
    return (lon, lat) => { const q = merc(lon, lat); return [ox + (q[0] - a) * s, H - oy - (q[1] - c) * s]; };
  }
  const allCoords = (g) => g.type === "Polygon" ? g.coordinates.flat() : g.type === "MultiPolygon" ? g.coordinates.flat(2) : g.type === "Point" ? [g.coordinates] : [];
  function geomToPath(g, P) {
    const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
    return polys.map((poly) => poly.map((ring) => "M" + ring.map((pt, i) => { const p = P(pt[0], pt[1]); return (i ? "L" : "") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("") + "Z").join("")).join("");
  }
  function render(geo, live) {
    const W = 1000, H = 620;
    const P = makeProj(geo.features.flatMap((f) => allCoords(f.geometry)), W, H, 30);
    let paths = "", peaks = "";
    geo.features.forEach((f) => {
      const g = f.geometry, pr = f.properties || {};
      if (g.type === "Polygon" || g.type === "MultiPolygon") paths += `<path class="geo-boundary" d="${geomToPath(g, P)}"><title>${pr.name || "Nepal"}</title></path>`;
      else if (g.type === "Point") { const p = P(g.coordinates[0], g.coordinates[1]); const r = 4 + (pr.elevation_m || 6000) / 2200; peaks += `<circle class="geo-peak" data-name="${pr.name || ""}" data-e="${pr.elevation_m || ""}" data-d="${pr.description || ""}" data-u="${pr.details_url || "#"}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(1)}"/>`; if ((pr.elevation_m || 0) > 7900) peaks += `<text class="geo-peak-label" x="${p[0] + r + 4}" y="${p[1] + 3}">${pr.name}</text>`; }
    });
    const iP = makeProj(ROUTE.map(([la, lo]) => [lo, la]), 220, 190, 22);
    const routeD = "M" + ROUTE.map(([la, lo], i) => { const p = iP(lo, la); return `${i ? "L" : ""}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }).join(" ");
    const stops = ROUTE.filter((s) => s[3]).map(([la, lo, name, day]) => { const p = iP(lo, la); return `<circle class="geo-stop" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="7"/><text class="geo-stop-num" x="${p[0].toFixed(1)}" y="${(p[1] + 3).toFixed(1)}">${day}</text>`; }).join("");
    frame.innerHTML = `<svg class="geo-svg" viewBox="0 0 ${W} ${H}">${paths}${peaks}</svg><div class="map-inset"><h5>Khumbu route · day stops</h5><svg viewBox="0 0 220 190"><path class="geo-route" d="${routeD}"/>${stops}</svg></div><div class="pd-tip" id="mapTip"></div>${live ? "" : `<span class="map-note">Simplified outline — serve via local server to load nepal.geojson</span>`}`;
    const tip = $("#mapTip", frame);
    frame.addEventListener("pointerover", (e) => { const c = e.target.closest(".geo-peak"); if (!c) return; tip.innerHTML = `<b>${c.dataset.name}</b> · ${(+c.dataset.e).toLocaleString()} m<span>${c.dataset.d}</span><a href="${c.dataset.u}" target="_blank" rel="noopener">More →</a>`; const r = frame.getBoundingClientRect(), cr = c.getBoundingClientRect(); tip.style.left = cr.left + cr.width / 2 - r.left + "px"; tip.style.top = cr.top - r.top + "px"; tip.classList.add("on"); });
    frame.addEventListener("pointerout", (e) => { if (e.target.closest(".geo-peak") && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".pd-tip"))) tip.classList.remove("on"); });
    tip.addEventListener("pointerleave", () => tip.classList.remove("on"));
  }
  fetch("nepal.geojson").then((r) => { if (!r.ok) throw 0; return r.json(); }).then((g) => render(g, true)).catch(() => render(FALLBACK, false));
})();