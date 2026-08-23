/* =====================================================
   PACKAGE-LIST PAGE — self-contained (shared + page)
   Shared block will be factored into shared.js later.
===================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const showToast = (msg) => {
  const t = $("#toast"); $("#toastMsg").textContent = msg;
  t.style.display = "flex"; clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.style.display = "none"), 2600);
};

/* ---------- header (solid variant aware) ---------- */
let lastScroll = 0, scrollTimer = null;
const header = $("#header");
const onScroll = () => {
  const now = Date.now();
  if (now - lastScroll < 100) { if (!scrollTimer) scrollTimer = setTimeout(() => { scrollTimer = null; onScroll(); }, 100); return; }
  lastScroll = now;
  header.classList.toggle("scrolled", window.scrollY > 24 || header.dataset.solid === "true");
};
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- reveal ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
} else $$(".reveal").forEach((el) => el.classList.add("in"));

/* ---------- stars ---------- */
const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const emptyStarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
$$(".stars").forEach((el) => { const r = parseFloat(el.dataset.rating) || 0; el.innerHTML = ""; for (let i = 0; i < 5; i++) el.insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg); });

/* ---------- wishlist ---------- */
let wishlist = (() => { try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; } })();
const saveWishlist = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  $("#wlCount").textContent = wishlist.length;
  $$(".trek-card").forEach((card) => {
    const btn = $(".heart-btn", card);
    const on = wishlist.includes(card.dataset.id);
    btn.classList.toggle("active", on); btn.setAttribute("aria-pressed", on);
  });
  if ($("#trekModal").style.display !== "none") {
    const on = wishlist.includes($("#trekModal").dataset.currentId);
    $("#mWishLabel").textContent = on ? "Saved" : "Save";
    $("#mWish").classList.toggle("wished", on);
  }
};
saveWishlist();

/* ---------- trek modal (v2: group + departure) ---------- */
const trekModal = $("#trekModal");
let currentTrekCard = null;
const openTrekModal = (card) => {
  currentTrekCard = card;
  const d = card.dataset;
  trekModal.dataset.currentId = d.id;
  $("#mImg").src = $("img", $(".trek-media", card)).src;
  $("#mImg").alt = $(".trek-title", card).textContent;
  $("#mRegion").textContent = d.region + " Region";
  $("#mTitle").textContent = $(".trek-title", card).textContent;
  $("#mDays").textContent = d.days;
  const diff = $("#mDiff"); diff.textContent = d.difficulty; diff.className = "diff diff-" + d.difficulty.toLowerCase();
  $("#mElev").textContent = d.elevation;
  const g = $("#mGroup"); if (g) g.textContent = d.group || "";
  const dep = $("#mDep"); if (dep) { dep.style.display = d.departure ? "" : "none"; if (d.departure) $("#mDepVal").textContent = d.departure; }
  $("#mRating").textContent = d.rating;
  $("#mReviews").textContent = "(" + d.reviews + " reviews)";
  $("#mDesc").textContent = d.desc;
  $("#mOld").textContent = "$" + parseInt(d.oldPrice).toLocaleString();
  $("#mPrice").textContent = "$" + parseInt(d.price).toLocaleString();
  const hl = $("#mHighlights"); hl.innerHTML = "";
  try { JSON.parse(d.highlights || "[]").forEach((h) => hl.insertAdjacentHTML("beforeend", `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> ${h}</li>`)); } catch {}
  $("#mWa").dataset.leadLink = "https://wa.me/9779800000000?text=" + encodeURIComponent("Namaste! I'm interested in the " + $(".trek-title", card).textContent + ".");
  trekModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  $("#mClose").focus();
  saveWishlist();
};
function closeTrekModal() { trekModal.style.display = "none"; document.body.classList.remove("no-scroll"); }
$("#mClose").addEventListener("click", closeTrekModal);
$("#mWish").addEventListener("click", () => {
  if (!currentTrekCard) return;
  const id = currentTrekCard.dataset.id;
  if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); }
  else { wishlist.push(id); showToast("Added to your wishlist"); }
  saveWishlist();
});

/* ---------- card interactions (click + keyboard) ---------- */
$("#trekGrid").addEventListener("click", (e) => {
  const heart = e.target.closest(".heart-btn");
  const card = e.target.closest(".trek-card");
  if (!card) return;
  if (heart) {
    e.stopPropagation();
    const id = card.dataset.id;
    if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); }
    else { wishlist.push(id); showToast("Added to your wishlist"); }
    saveWishlist(); return;
  }
  openTrekModal(card);
});
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("trek-card")) { e.preventDefault(); openTrekModal(e.target); }
});

/* ---------- lead modal + honest skip link ---------- */
const leadModal = $("#leadModal");
let pendingLink = "";
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-lead-link]");
  if (!trigger) return;
  e.preventDefault();
  pendingLink = trigger.dataset.leadLink;
  leadModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  $("#leadName").focus();
});
$("#lClose").addEventListener("click", closeLeadModal);
function closeLeadModal() { leadModal.style.display = "none"; document.body.classList.remove("no-scroll"); $("#leadError").style.display = "none"; $("#leadForm").reset(); }
$("#leadSkip").addEventListener("click", () => { if (pendingLink) window.open(pendingLink, "_blank", "noopener"); closeLeadModal(); });
$("#leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#leadName").value.trim(), email = $("#leadEmail").value.trim(), err = $("#leadError");
  if (!name) { err.textContent = "Please tell us your name."; err.style.display = "block"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "That email doesn't look right."; err.style.display = "block"; return; }
  try { localStorage.setItem("lead", JSON.stringify({ name, email, at: Date.now() })); } catch {}
  window.open(pendingLink, "_blank", "noopener");
  closeLeadModal();
});

/* ---------- mobile menu ---------- */
const menuBtn = $("#menuBtn"), mobilePanel = $("#mobilePanel");
menuBtn.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
});
$$(".mobile-panel a").forEach((a) => a.addEventListener("click", () => { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); }));

/* ---------- ESC + focus trap ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (leadModal.style.display !== "none") closeLeadModal();
    else if (trekModal.style.display !== "none") closeTrekModal();
    else if (mobilePanel.classList.contains("open")) { mobilePanel.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); }
    return;
  }
  if (e.key !== "Tab") return;
  const open = [trekModal, leadModal].find((m) => m.style.display !== "none");
  if (!open) return;
  const f = $$("button, a[href], input, select", open).filter((el) => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
trekModal.addEventListener("click", (e) => { if (e.target === trekModal) closeTrekModal(); });
leadModal.addEventListener("click", (e) => { if (e.target === leadModal) closeLeadModal(); });

/* =====================================================
   PAGE MODULE — filters, map, pick-of-month, chart, faq
===================================================== */
(() => {
  const grid = $("#trekGrid");
  const models = $$(".trek-card", grid).map((el) => ({
    el, id: el.dataset.id, region: el.dataset.region, days: parseInt(el.dataset.days),
    price: parseInt(el.dataset.price), rating: parseFloat(el.dataset.rating),
    reviews: parseInt(el.dataset.reviews), difficulty: el.dataset.difficulty,
    pickMonths: (el.dataset.pickMonths || "").split(",").filter(Boolean).map(Number),
    pickWhy: el.dataset.pickWhy || "", signature: el.dataset.signature === "true"
  }));
  const bucket = (d) => (d < 8 ? "short" : d <= 13 ? "medium" : "long");
  const state = { region: "any", dur: "any", diff: "any", sort: "popular", mode: "browse", visible: 9, surpriseId: null };
  const els = { res: $("#resultCount"), tot: $("#totalCount"), chips: $("#chips"), fDur: $("#fDur"), fDiff: $("#fDiff"), sort: $("#sortSelect"), load: $("#loadMore"), failsafe: $("#failsafe") };
  const REGION_NAMES = { everest: "Everest", annapurna: "Annapurna", langtang: "Langtang", manaslu: "Manaslu", mustang: "Mustang", short: "Short Treks" };
  let currentPickId = null;

  /* honest counts, computed from the DOM */
  const counts = {};
  models.forEach((m) => (counts[m.region] = (counts[m.region] || 0) + 1));
  $$("[data-count-for]").forEach((el) => {
    const n = counts[el.dataset.countFor] || 0;
    el.textContent = el.classList.contains("rt-count") ? n + " curated " + (n === 1 ? "journey" : "journeys") : n;
  });

  const SORTS = {
    popular: (a, b) => b.reviews - a.reviews,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    days_asc: (a, b) => a.days - b.days,
    days_desc: (a, b) => b.days - a.days,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews
  };

  const syncURL = () => {
    const p = new URLSearchParams();
    if (state.region !== "any") p.set("region", state.region);
    if (state.dur !== "any") p.set("duration", state.dur);
    if (state.diff !== "any") p.set("difficulty", state.diff);
    if (state.sort !== "popular") p.set("sort", state.sort);
    history.replaceState(null, "", p.toString() ? "?" + p.toString() : location.pathname);
  };

  const renderChips = () => {
    els.chips.innerHTML = "";
    const make = (label, onX, cls = "chip") => {
      const b = document.createElement("button"); b.className = cls;
      b.innerHTML = label + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
      b.addEventListener("click", onX); els.chips.appendChild(b);
    };
    if (state.mode === "surprise") make("Surprise pick", () => { state.mode = "browse"; applyState(); }, "chip chip-query");
    if (state.region !== "any") make(REGION_NAMES[state.region], () => { state.region = "any"; applyState(); });
    if (state.dur !== "any") make(els.fDur.options[els.fDur.selectedIndex].text, () => { state.dur = "any"; els.fDur.value = "any"; applyState(); });
    if (state.diff !== "any") make(state.diff, () => { state.diff = "any"; els.fDiff.value = "any"; applyState(); });
    if (els.chips.children.length) { const c = document.createElement("button"); c.className = "chip chip-clear"; c.textContent = "Clear all"; c.addEventListener("click", clearAll); els.chips.appendChild(c); }
  };

  const clearAll = () => { Object.assign(state, { region: "any", dur: "any", diff: "any", mode: "browse" }); els.fDur.value = "any"; els.fDiff.value = "any"; applyState(); };

  const applyState = (resetVisible = true) => {
    if (resetVisible && state.mode !== "surprise") state.visible = 9;
    let match = models.filter((m) => {
      if (state.mode === "surprise") return m.id === state.surpriseId;
      if (state.region !== "any" && m.region !== state.region) return false;
      if (state.dur !== "any" && bucket(m.days) !== state.dur) return false;
      if (state.diff !== "any" && m.difficulty !== state.diff) return false;
      return true;
    });
    match.sort(SORTS[state.sort] || SORTS.popular);
    match.forEach((m) => grid.appendChild(m.el));
    match.forEach((m, i) => m.el.classList.toggle("hidden", i >= state.visible));
    models.forEach((m) => { if (!match.includes(m)) m.el.classList.add("hidden"); });
    els.res.textContent = Math.min(state.visible, match.length);
    els.tot.textContent = match.length;
    els.load.style.display = state.mode === "surprise" || state.visible >= match.length ? "none" : "";
    els.failsafe.style.display = match.length === 0 ? "flex" : "none";
    grid.style.display = match.length === 0 ? "none" : "";
    $$(".region-tile, .map-pin").forEach((t) => t.setAttribute("aria-pressed", t.dataset.region === state.region ? "true" : "false"));
    renderChips();
    syncURL();
  };

  /* region entry points: tiles, pins, weather links */
  const setRegion = (r, scroll) => { state.region = state.region === r ? "any" : r; state.mode = "browse"; applyState(); if (scroll) $("#packages").scrollIntoView({ behavior: "smooth" }); };
  $$(".region-tile, .map-pin").forEach((t) => t.addEventListener("click", () => setRegion(t.dataset.region, true)));
  $$("[data-region-link]").forEach((b) => b.addEventListener("click", () => setRegion(b.dataset.regionLink, true)));

  /* toolbar */
  els.fDur.addEventListener("change", () => { state.dur = els.fDur.value; state.mode = "browse"; applyState(); });
  els.fDiff.addEventListener("change", () => { state.diff = els.fDiff.value; state.mode = "browse"; applyState(); });
  els.sort.addEventListener("change", () => { state.sort = els.sort.value; applyState(); });
  $$(".chip-preset").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "easy") { state.diff = "Easy"; els.fDiff.value = "Easy"; }
    if (b.dataset.preset === "short") { state.dur = "short"; els.fDur.value = "short"; }
    state.mode = "browse"; applyState(); $("#packages").scrollIntoView({ behavior: "smooth" });
  }));
  els.load.addEventListener("click", () => { state.visible += 6; applyState(false); });
  $("#failsafeClear").addEventListener("click", clearAll);

  const doSurprise = () => {
    const pool = models.filter((m) => m.id !== currentPickId);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.mode = "surprise"; state.surpriseId = pick.id; state.visible = 1;
    applyState(false);
    showToast("Feeling lucky? How about the " + $(".trek-title", pick.el).textContent + "?");
    $("#packages").scrollIntoView({ behavior: "smooth" });
  };
  $("#surpriseBtn").addEventListener("click", doSurprise);
  $("#failsafeSurprise").addEventListener("click", doSurprise);

  /* tiles ⇄ map */
  $$(".vt-btn").forEach((b) => b.addEventListener("click", () => {
    $$(".vt-btn").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    $("#regionTiles").hidden = b.dataset.view !== "tiles";
    $("#regionMap").hidden = b.dataset.view !== "map";
  }));

  /* ---------- Pick of the Month (season-smart) ---------- */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const seasonOf = (m) => (m >= 3 && m <= 5 ? "SPRING" : m >= 6 && m <= 8 ? "MONSOON" : m >= 9 && m <= 11 ? "AUTUMN" : "WINTER");
  const populatePick = (m) => {
    currentPickId = m.id;
    const d = m.el.dataset, now = new Date();
    $("#pkMonth").textContent = "Pick of the Month — " + MONTHS[now.getMonth()] + " " + now.getFullYear();
    $("#pkTitle").textContent = $(".trek-title", m.el).textContent;
    $("#pkDays").textContent = d.days + " Days";
    const diff = $("#pkDiff"); diff.textContent = d.difficulty; diff.className = "diff diff-" + d.difficulty.toLowerCase();
    $("#pkElev").textContent = "Max " + d.elevation;
    $("#pkRating").textContent = d.rating + " (" + d.reviews + ")";
    $("#pkDesc").textContent = d.desc;
    $("#pkWhy").textContent = m.pickWhy;
    $("#pkPrice").textContent = $("#pkPrice2").textContent = "$" + parseInt(d.price).toLocaleString();
    $("#pkOld").textContent = "$" + parseInt(d.oldPrice).toLocaleString();
    $("#pkImg").src = $("img", $(".trek-media", m.el)).src;
    $("#pkImg").alt = $(".trek-title", m.el).textContent;
    $("#pkExplore").dataset.id = m.id;
    $("#stampText").textContent = seasonOf(now.getMonth() + 1) + " PICK • PICK OF THE MONTH • ";
  };
  const month = new Date().getMonth() + 1;
  populatePick(models.find((m) => m.pickMonths.includes(month)) || models.find((m) => m.signature));
  $("#pkExplore").addEventListener("click", (e) => { const m = models.find((x) => x.id === e.currentTarget.dataset.id); openTrekModal(m.el); });

  /* ---------- climate chart ---------- */
  const CLIMATE = {
    kathmandu: { t: [11,13,17,20,22,24,24,24,23,20,16,12], r: [14,22,34,60,120,240,360,310,200,70,10,14] },
    pokhara:   { t: [12,14,18,22,24,26,26,26,25,22,17,13], r: [20,30,50,90,220,500,830,600,330,110,20,15] },
    namche:    { t: [-2,0,3,6,8,10,11,11,9,6,2,0],        r: [5,8,12,20,40,90,160,150,90,25,5,4] }
  };
  const svg = $("#climateSvg"), tip = $("#chartTip");
  let city = "kathmandu";
  const X = (i) => 34 + i * 58;
  const drawChart = () => {
    const { t, r } = CLIMATE[city], maxR = Math.max(...r), tMin = Math.min(...t) - 4, tMax = Math.max(...t) + 4;
    const yT = (v) => 175 - ((v - tMin) / (tMax - tMin)) * 130, yR = (v) => (v / maxR) * 110;
    let s = "";
    r.forEach((v, i) => (s += `<rect class="cl-bar" x="${X(i) - 11}" y="${200 - yR(v)}" width="22" height="${yR(v)}" rx="4"/>`));
    s += `<path class="cl-line" d="${t.map((v, i) => (i ? "L" : "M") + X(i) + " " + yT(v)).join(" ")}"/>`;
    t.forEach((v, i) => (s += `<circle class="cl-dot" cx="${X(i)}" cy="${yT(v)}" r="4"/>`));
    ["J","F","M","A","M","J","J","A","S","O","N","D"].forEach((m, i) => (s += `<text class="cl-month" x="${X(i)}" y="224" text-anchor="middle">${m}</text>`));
    s += `<line class="cl-guide" id="clGuide" x1="0" x2="0" y1="30" y2="200" style="display:none"/>`;
    svg.innerHTML = s;
    /* screen-reader table */
    const tbl = $("#climateTable");
    if (tbl) tbl.innerHTML = "<caption>Typical monthly temperature (°C) and rainfall (mm) — " + city + "</caption><tr><th>Month</th>" + MONTHS.map((m) => `<th>${m.slice(0,3)}</th>`).join("") + "</tr><tr><th>°C</th>" + t.map((v) => `<td>${v}</td>`).join("") + "</tr><tr><th>mm</th>" + r.map((v) => `<td>${v}</td>`).join("") + "</tr>";
  };
  const showTip = (e) => {
    const rect = svg.getBoundingClientRect();
    const i = Math.max(0, Math.min(11, Math.round((((e.clientX - rect.left) / rect.width) * 720 - 34) / 58)));
    const { t, r } = CLIMATE[city];
    const g = $("#clGuide"); g.style.display = ""; g.setAttribute("x1", X(i)); g.setAttribute("x2", X(i));
    tip.hidden = false; tip.style.left = (X(i) / 720) * rect.width + "px"; tip.style.top = "60px";
    tip.innerHTML = `<b>${MONTHS[i].slice(0, 3)}</b> · ${t[i]}°C · ${r[i]} mm`;
  };
  svg.addEventListener("pointermove", showTip);
  svg.addEventListener("pointerdown", showTip);
  svg.addEventListener("pointerleave", () => { tip.hidden = true; const g = $("#clGuide"); if (g) g.style.display = "none"; });
  $$(".city-chips .chip").forEach((c) => c.addEventListener("click", () => {
    $$(".city-chips .chip").forEach((x) => x.classList.toggle("active", x === c));
    city = c.dataset.city; drawChart();
  }));
  drawChart();

  /* ---------- FAQ (one open) ---------- */
  $$(".faq-q").forEach((q) => q.addEventListener("click", () => {
    const item = q.closest(".faq-item"), was = item.classList.contains("open");
    $$(".faq-item").forEach((i) => { i.classList.remove("open"); $(".faq-q", i).setAttribute("aria-expanded", "false"); });
    if (!was) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
  }));

  /* ---------- hydrate from URL ---------- */
  const p = new URLSearchParams(location.search);
  const cat = p.get("category");
  if (cat && cat !== "trekking") showToast("That activity page is coming soon — showing Trekking for now.");
  if (REGION_NAMES[p.get("region")]) state.region = p.get("region");
  if (["short", "medium", "long"].includes(p.get("duration"))) { state.dur = p.get("duration"); els.fDur.value = state.dur; }
  if (["Easy", "Moderate", "Challenging", "Strenuous"].includes(p.get("difficulty"))) { state.diff = p.get("difficulty"); els.fDiff.value = state.diff; }
  if (SORTS[p.get("sort")]) { state.sort = p.get("sort"); els.sort.value = state.sort; }
  applyState();
})();