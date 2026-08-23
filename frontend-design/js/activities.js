/* =====================================================
ACTIVITIES PAGE — vanilla JS (self-contained)
Shared block + page module. Will factor shared.js later.
===================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const showToast = (msg) => {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.style.display = "flex";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.style.display = "none"), 2600);
};

/* ---------- 1. HEADER (solid variant aware) ---------- */
let lastScroll = 0, scrollTimer = null;
const header = $("#header");
const onScroll = () => {
  const now = Date.now();
  if (now - lastScroll < 100) {
    if (!scrollTimer) scrollTimer = setTimeout(() => { scrollTimer = null; onScroll(); }, 100);
    return;
  }
  lastScroll = now;
  header.classList.toggle("scrolled", window.scrollY > 24 || header.dataset.solid === "true");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 2. REVEAL ON SCROLL ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- 3. STARS RENDERER ---------- */
const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const emptyStarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
$$(".stars").forEach((el) => {
  const r = parseFloat(el.dataset.rating) || 0;
  el.innerHTML = "";
  for (let i = 0; i < 5; i++) el.insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg);
});

/* ---------- 4. WISHLIST (localStorage) ---------- */
let wishlist = (() => { try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; } })();
const saveWishlist = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  $("#wlCount").textContent = wishlist.length;
  $$(".trek-card").forEach((card) => {
    const btn = $(".heart-btn", card);
    if (!btn) return;
    const on = wishlist.includes(card.dataset.id);
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on);
  });
  if ($("#trekModal").style.display !== "none") {
    const on = wishlist.includes($("#trekModal").dataset.currentId);
    $("#mWishLabel").textContent = on ? "Saved" : "Save";
    $("#mWish").classList.toggle("wished", on);
  }
};
saveWishlist();

/* ---------- 5. TREK MODAL (v2 for activities) ---------- */
const trekModal = $("#trekModal");
let currentTrekCard = null;

const CATEGORY_NAMES = {
  city: "City Tours",
  heli: "Heli Tours",
  bike: "Bike Tours",
  bird: "Bird Watching",
  safari: "Jungle Safari",
  hike: "Day Hikes"
};

const openTrekModal = (card) => {
  currentTrekCard = card;
  const d = card.dataset;
  trekModal.dataset.currentId = d.id;

  $("#mImg").src = $("img", $(".trek-media", card)).src;
  $("#mImg").alt = $(".trek-title", card).textContent;
  $("#mCategory").textContent = CATEGORY_NAMES[d.category] || "";
  $("#mTitle").textContent = $(".trek-title", card).textContent;
  $("#mDuration").textContent = d.duration;
  $("#mGroup").textContent = d.group || "";
  if (d.departure) {
    $("#mDepWrap").style.display = "";
    $("#mDepVal").textContent = d.departure;
  } else {
    $("#mDepWrap").style.display = "none";
  }
  $("#mRating").textContent = d.rating;
  $("#mReviews").textContent = "(" + d.reviews + " reviews)";
  $("#mDesc").textContent = d.desc;
  $("#mOld").textContent = "$" + parseInt(d.oldPrice).toLocaleString();
  $("#mPrice").textContent = "$" + parseInt(d.price).toLocaleString();

  const hl = $("#mHighlights");
  hl.innerHTML = "";
  try {
    JSON.parse(d.highlights || "[]").forEach((h) =>
      hl.insertAdjacentHTML("beforeend",
        `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> ${h}</li>`
      )
    );
  } catch {}

  $("#mIncludes").textContent = "Includes: " + (d.includes || "");
  $("#mWa").dataset.leadLink = "https://wa.me/9779800000000?text=" + encodeURIComponent(
    "Namaste! I'm interested in the " + $(".trek-title", card).textContent + "."
  );
  trekModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  $("#mClose").focus();
  saveWishlist();
};

function closeTrekModal() {
  trekModal.style.display = "none";
  document.body.classList.remove("no-scroll");
}

$("#mClose").addEventListener("click", closeTrekModal);
$("#mWish").addEventListener("click", () => {
  if (!currentTrekCard) return;
  const id = currentTrekCard.dataset.id;
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((x) => x !== id);
    showToast("Removed from your wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to your wishlist");
  }
  saveWishlist();
});

/* ---------- 6. CARD INTERACTIONS ---------- */
$("#trekGrid").addEventListener("click", (e) => {
  const heart = e.target.closest(".heart-btn");
  const card = e.target.closest(".trek-card");
  if (!card) return;
  if (heart) {
    e.stopPropagation();
    const id = card.dataset.id;
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((x) => x !== id);
      showToast("Removed from your wishlist");
    } else {
      wishlist.push(id);
      showToast("Added to your wishlist");
    }
    saveWishlist();
    return;
  }
  openTrekModal(card);
});

document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("trek-card")) {
    e.preventDefault();
    openTrekModal(e.target);
  }
});

/* Editorial strip — delegate clicks to open the target card's modal */
$$(".editorial-card").forEach((card) => {
  card.addEventListener("click", () => {
    const targetId = card.dataset.linkTo;
    const target = $(`[data-id="${targetId}"]`);
    if (target) {
      // ensure target is visible first (apply filters may have hidden it)
      state.mode = "browse";
      state.cat = "any";
      state.dur = "any";
      state.int = "any";
      $("#fDur").value = "any";
      $("#fInt").value = "any";
      applyState();
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => openTrekModal(target), 400);
      }, 50);
    }
  });
});

/* ---------- 7. LEAD MODAL + HONEST SKIP ---------- */
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
$("#leadSkip").addEventListener("click", () => {
  if (pendingLink) window.open(pendingLink, "_blank", "noopener");
  closeLeadModal();
});
function closeLeadModal() {
  leadModal.style.display = "none";
  document.body.classList.remove("no-scroll");
  $("#leadError").style.display = "none";
  $("#leadForm").reset();
}
$("#leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#leadName").value.trim();
  const email = $("#leadEmail").value.trim();
  const err = $("#leadError");
  if (!name) { err.textContent = "Please tell us your name."; err.style.display = "block"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "That email doesn't look right."; err.style.display = "block"; return; }
  try { localStorage.setItem("lead", JSON.stringify({ name, email, at: Date.now() })); } catch {}
  window.open(pendingLink, "_blank", "noopener");
  closeLeadModal();
});

/* ---------- 8. MOBILE MENU ---------- */
const menuBtn = $("#menuBtn"), mobilePanel = $("#mobilePanel");
menuBtn.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
});
$$(".mobile-panel a").forEach((a) =>
  a.addEventListener("click", () => {
    mobilePanel.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  })
);

/* ---------- 9. ESC + FOCUS TRAP ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (leadModal.style.display !== "none") closeLeadModal();
    else if (trekModal.style.display !== "none") closeTrekModal();
    else if (mobilePanel.classList.contains("open")) {
      mobilePanel.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
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
PAGE MODULE — category + vibe + filters + pick-of-month
===================================================== */
(() => {
  const grid = $("#trekGrid");
  const models = $$(".trek-card", grid).map((el) => ({
    el,
    id: el.dataset.id,
    category: el.dataset.category,
    duration: el.dataset.duration,
    bucket: el.dataset.bucket,
    intensity: el.dataset.intensity,
    price: parseInt(el.dataset.price),
    oldPrice: parseInt(el.dataset.oldPrice),
    rating: parseFloat(el.dataset.rating),
    reviews: parseInt(el.dataset.reviews),
    pickMonths: (el.dataset.pickMonths || "").split(",").filter(Boolean).map(Number),
    pickWhy: el.dataset.pickWhy || "",
    signature: el.dataset.signature === "true"
  }));

  const state = {
    cat: "any",
    dur: "any",
    int: "any",
    sort: "popular",
    mode: "browse",
    visible: 9,
    surpriseId: null
  };

  const els = {
    res: $("#resultCount"),
    tot: $("#totalCount"),
    chips: $("#chips"),
    fDur: $("#fDur"),
    fInt: $("#fInt"),
    sort: $("#sortSelect"),
    load: $("#loadMore"),
    loadRow: $("#loadMoreRow"),
    failsafe: $("#failsafe")
  };

  const CAT_NAMES = {
    city: "City Tours",
    heli: "Heli Tours",
    bike: "Bike Tours",
    bird: "Bird Watching",
    safari: "Jungle Safari",
    hike: "Day Hikes"
  };

  let currentPickId = null;

  /* Honest counts from DOM */
  const counts = {};
  models.forEach((m) => (counts[m.category] = (counts[m.category] || 0) + 1));
  $$("[data-count-for]").forEach((el) => {
    const n = counts[el.dataset.countFor] || 0;
    el.textContent = el.classList.contains("rt-count")
      ? n + " curated " + (n === 1 ? "experience" : "experiences")
      : n;
  });

  const SORTS = {
    popular: (a, b) => b.reviews - a.reviews,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    duration_asc: (a, b) => {
      const ord = { half: 1, full: 2, multi: 3 };
      return ord[a.bucket] - ord[b.bucket];
    },
    duration_desc: (a, b) => {
      const ord = { half: 1, full: 2, multi: 3 };
      return ord[b.bucket] - ord[a.bucket];
    },
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews
  };

  const syncURL = () => {
    const p = new URLSearchParams();
    if (state.cat !== "any") p.set("category", state.cat);
    if (state.dur !== "any") p.set("duration", state.dur);
    if (state.int !== "any") p.set("intensity", state.int);
    if (state.sort !== "popular") p.set("sort", state.sort);
    history.replaceState(null, "", p.toString() ? "?" + p.toString() : location.pathname);
  };

  const renderChips = () => {
    els.chips.innerHTML = "";
    const make = (label, onX, cls = "chip") => {
      const b = document.createElement("button");
      b.className = cls;
      b.innerHTML = `${label} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      b.addEventListener("click", onX);
      els.chips.appendChild(b);
    };
    if (state.mode === "surprise") make("Surprise pick", () => { state.mode = "browse"; applyState(); }, "chip chip-query");
    if (state.cat !== "any") make(CAT_NAMES[state.cat], () => { state.cat = "any"; syncPillsUI(); applyState(); });
    if (state.dur !== "any") make(els.fDur.options[els.fDur.selectedIndex].text, () => { state.dur = "any"; els.fDur.value = "any"; applyState(); });
    if (state.int !== "any") make(state.int, () => { state.int = "any"; els.fInt.value = "any"; applyState(); });
    if (els.chips.children.length) {
      const c = document.createElement("button");
      c.className = "chip chip-clear";
      c.textContent = "Clear all";
      c.addEventListener("click", clearAll);
      els.chips.appendChild(c);
    }
  };

  const clearAll = () => {
    Object.assign(state, { cat: "any", dur: "any", int: "any", mode: "browse" });
    els.fDur.value = "any";
    els.fInt.value = "any";
    syncPillsUI();
    applyState();
  };

  const syncPillsUI = () => {
    $$(".switcher-pills .pill").forEach((p) => {
      const active = p.dataset.cat === state.cat || (state.cat === "any" && p.dataset.cat === "all");
      p.classList.toggle("active", active);
      p.setAttribute("aria-pressed", active);
    });
    $$("#catTiles .region-tile").forEach((t) => {
      t.setAttribute("aria-pressed", t.dataset.cat === state.cat ? "true" : "false");
    });
  };

  const applyState = (resetVisible = true) => {
    if (resetVisible && state.mode !== "surprise") state.visible = 9;
    let match = models.filter((m) => {
      if (state.mode === "surprise") return m.id === state.surpriseId;
      if (state.cat !== "any" && m.category !== state.cat) return false;
      if (state.dur !== "any" && m.bucket !== state.dur) return false;
      if (state.int !== "any" && m.intensity !== state.int) return false;
      return true;
    });
    match.sort(SORTS[state.sort] || SORTS.popular);
    match.forEach((m) => grid.appendChild(m.el));
    match.forEach((m, i) => m.el.classList.toggle("hidden", i >= state.visible));
    models.forEach((m) => { if (!match.includes(m)) m.el.classList.add("hidden"); });
    els.res.textContent = Math.min(state.visible, match.length);
    els.tot.textContent = match.length;
    els.loadRow.style.display = state.mode === "surprise" || state.visible >= match.length ? "none" : "";
    els.failsafe.style.display = match.length === 0 ? "flex" : "none";
    grid.style.display = match.length === 0 ? "none" : "";
    renderChips();
    syncURL();
  };

  /* Category switcher pills */
  $$(".switcher-pills .pill").forEach((p) => {
    p.addEventListener("click", (e) => {
      if (p.dataset.cat === "all") {
        state.cat = "any";
      } else if (state.cat === p.dataset.cat) {
        state.cat = "any";
      } else {
        state.cat = p.dataset.cat;
      }
      state.mode = "browse";
      syncPillsUI();
      applyState();
      $("#activities").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Category tiles */
  $$("#catTiles .region-tile").forEach((t) => {
    t.addEventListener("click", () => {
      if (state.cat === t.dataset.cat) state.cat = "any";
      else state.cat = t.dataset.cat;
      state.mode = "browse";
      syncPillsUI();
      applyState();
      $("#activities").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Toolbar */
  els.fDur.addEventListener("change", () => { state.dur = els.fDur.value; state.mode = "browse"; applyState(); });
  els.fInt.addEventListener("change", () => { state.int = els.fInt.value; state.mode = "browse"; applyState(); });
  els.sort.addEventListener("change", () => { state.sort = els.sort.value; applyState(); });

  /* Vibe presets */
  $$(".chip-preset").forEach((b) => {
    b.addEventListener("click", () => {
      const v = b.dataset.vibe;
      if (v === "short") { state.dur = "half"; els.fDur.value = "half"; }
      if (v === "family") { state.int = "Easy"; els.fInt.value = "Easy"; }
      if (v === "multi") { state.dur = "multi"; els.fDur.value = "multi"; }
      if (v === "adrenaline") { state.int = "Challenging"; els.fInt.value = "Challenging"; }
      state.mode = "browse";
      applyState();
      $("#activities").scrollIntoView({ behavior: "smooth" });
    });
  });

  els.load.addEventListener("click", () => { state.visible += 6; applyState(false); });
  $("#failsafeClear").addEventListener("click", clearAll);

  const doSurprise = () => {
    const pool = models.filter((m) => m.id !== currentPickId);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.mode = "surprise";
    state.surpriseId = pick.id;
    state.visible = 1;
    applyState(false);
    showToast("Feeling lucky? How about the " + $(".trek-title", pick.el).textContent + "?");
    $("#activities").scrollIntoView({ behavior: "smooth" });
  };
  $("#surpriseBtn").addEventListener("click", doSurprise);
  $("#failsafeSurprise").addEventListener("click", doSurprise);

  /* ---------- Pick of the Month (season-smart) ---------- */
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const seasonOf = (m) => (m >= 3 && m <= 5 ? "SPRING" : m >= 6 && m <= 8 ? "MONSOON" : m >= 9 && m <= 11 ? "AUTUMN" : "WINTER");

  const populatePick = (m) => {
    currentPickId = m.id;
    const d = m.el.dataset;
    const now = new Date();
    $("#pkMonth").textContent = "Pick of the Month — " + MONTHS[now.getMonth()] + " " + now.getFullYear();
    $("#pkTitle").textContent = $(".trek-title", m.el).textContent;
    $("#pkDuration").textContent = d.duration;
    const diff = $("#pkDiff");
    diff.textContent = d.intensity;
    diff.className = "diff diff-" + d.intensity.toLowerCase();
    $("#pkFact").textContent = d.category === "heli" ? "Max 5" : "Max " + (d.group || "").replace(/\D/g, "");
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
  $("#pkExplore").addEventListener("click", (e) => {
    const m = models.find((x) => x.id === e.currentTarget.dataset.id);
    openTrekModal(m.el);
  });

  /* ---------- FAQ (one open) ---------- */
  $$(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const was = item.classList.contains("open");
      $$(".faq-item").forEach((i) => {
        i.classList.remove("open");
        $(".faq-q", i).setAttribute("aria-expanded", "false");
      });
      if (!was) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Hydrate from URL ---------- */
  const p = new URLSearchParams(location.search);
  if (CAT_NAMES[p.get("category")]) {
    state.cat = p.get("category");
    syncPillsUI();
  }
  if (["half", "full", "multi"].includes(p.get("duration"))) {
    state.dur = p.get("duration");
    els.fDur.value = state.dur;
  }
  if (["Easy", "Moderate", "Challenging"].includes(p.get("intensity"))) {
    state.int = p.get("intensity");
    els.fInt.value = state.int;
  }
  if (SORTS[p.get("sort")]) {
    state.sort = p.get("sort");
    els.sort.value = state.sort;
  }

  applyState();
})();