/* =====================================================
   SAGARMATHHA TREKS — vanilla JS (minimal, no framework)
   ===================================================== */

/* ---------- small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const showToast = (msg) => {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.style.display = "flex";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.style.display = "none"), 2600);
};

/* ---------- 1. HEADER SCROLL ---------- */
let lastScroll = 0, scrollTimer = null;
const header = $("#header");
const onScroll = () => {
  const now = Date.now();
  if (now - lastScroll < 100) {
    if (!scrollTimer) scrollTimer = setTimeout(() => { scrollTimer = null; onScroll(); }, 100);
    return;
  }
  lastScroll = now;
  header.classList.toggle("scrolled", window.scrollY > 24);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 2. REVEAL ON SCROLL ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
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
  // sync all heart buttons
  $$(".trek-card").forEach((card) => {
    const id = card.dataset.id;
    const btn = $(".heart-btn", card);
    if (wishlist.includes(id)) { btn.classList.add("active"); btn.setAttribute("aria-pressed", "true"); }
    else { btn.classList.remove("active"); btn.setAttribute("aria-pressed", "false"); }
  });
  // sync modal wish button if open
  if ($("#trekModal").style.display !== "none") {
    const id = $("#trekModal").dataset.currentId;
    const label = $("#mWishLabel");
    const btn = $("#mWish");
    if (wishlist.includes(id)) { label.textContent = "Saved"; btn.classList.add("wished"); }
    else { label.textContent = "Save"; btn.classList.remove("wished"); }
  }
};
saveWishlist(); // initial sync

/* ---------- 5. TREK CARD INTERACTIONS ---------- */
$("#trekGrid").addEventListener("click", (e) => {
  const heart = e.target.closest(".heart-btn");
  const card = e.target.closest(".trek-card");
  if (!card) return;
  const id = card.dataset.id;
  if (heart) {
    e.stopPropagation();
    const name = $(".trek-title", card).textContent;
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

/* ---------- 6. TREK MODAL ---------- */
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
  $("#mRating").textContent = d.rating;
  $("#mReviews").textContent = d.reviews + " reviews";
  $("#mStars").innerHTML = "";
  const r = parseFloat(d.rating);
  for (let i = 0; i < 5; i++) $("#mStars").insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg);
  $("#mDesc").textContent = d.desc;
  $("#mOld").textContent = "$" + parseInt(d.oldPrice).toLocaleString();
  $("#mPrice").textContent = "$" + parseInt(d.price).toLocaleString();
  const hl = $("#mHighlights"); hl.innerHTML = "";
  try {
    const items = JSON.parse(d.highlights || "[]");
    items.forEach((h) => {
      hl.insertAdjacentHTML("beforeend", `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> ${h}</li>`);
    });
  } catch {}
  $("#mWa").dataset.leadLink = "https://wa.me/9779800000000?text=" + encodeURIComponent("Namaste! I'm interested in the " + $(".trek-title", card).textContent + ".");
  trekModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  $("#mClose").focus();
  saveWishlist(); // sync wish button state
};

$("#mClose").addEventListener("click", closeTrekModal);
$("#mWish").addEventListener("click", () => {
  if (!currentTrekCard) return;
  const id = currentTrekCard.dataset.id;
  const name = $(".trek-title", currentTrekCard).textContent;
  if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); }
  else { wishlist.push(id); showToast("Added to your wishlist"); }
  saveWishlist();
});
function closeTrekModal() { trekModal.style.display = "none"; document.body.classList.remove("no-scroll"); }

/* ---------- 7. LEAD MODAL (intercepts WhatsApp) ---------- */
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
const menuBtn = $("#menuBtn");
const mobilePanel = $("#mobilePanel");
menuBtn.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
});
$$(".mobile-panel a").forEach((a) => a.addEventListener("click", () => {
  mobilePanel.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
}));

/* ---------- 9. ESCAPE closes modals ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (leadModal.style.display !== "none") closeLeadModal();
  else if (trekModal.style.display !== "none") closeTrekModal();
  else if (mobilePanel.classList.contains("open")) {
    mobilePanel.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
});

/* click-outside-to-close for modals */
trekModal.addEventListener("click", (e) => { if (e.target === trekModal) closeTrekModal(); });
leadModal.addEventListener("click", (e) => { if (e.target === leadModal) closeLeadModal(); });

/* ---------- 10. SEARCH & FILTER ---------- */
const cards = $$(".trek-card");
const totalCount = cards.length;
const filterBar = $("#filterBar");
const chips = $("#chips");
const keywordInput = $("#keywordInput");
const keywordClear = $("#keywordClear");
const fDest = $("#fDest");
const fDur = $("#fDur");
const fDiff = $("#fDiff");
const failsafe = $("#failsafe");

const durationBucket = (d) => (d < 8 ? "short" : d <= 13 ? "medium" : "long");
const SYNONYMS = {
  hard: ["hard", "difficult", "tough", "extreme"],
  easy: ["easy", "beginner", "gentle"],
  short: ["short", "weekend", "quick"],
  long: ["long", "epic", "extended"],
  cheap: ["cheap", "budget", "affordable"],
};

let activeMode = "none"; // "none" | "filters" | "query" | "surprise"
let activeQuery = "";

const renderChips = () => {
  chips.innerHTML = "";
  const makeChip = (label, onClick, cls = "chip") => {
    const b = document.createElement("button");
    b.className = cls;
    b.innerHTML = `${label} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    b.addEventListener("click", onClick);
    chips.appendChild(b);
  };
  if (activeMode === "query") makeChip(`"${activeQuery}"`, () => { keywordInput.value = ""; activeQuery = ""; activeMode = "filters"; applyFilters(); keywordClear.style.display = "none"; }, "chip chip-query");
  if (activeMode === "surprise") makeChip("Surprise pick", () => { activeMode = "filters"; applyFilters(); }, "chip chip-query");
  if (activeMode === "filters") {
    if (fDest.value !== "any") makeChip(fDest.options[fDest.selectedIndex].text, () => { fDest.value = "any"; applyFilters(); });
    if (fDur.value !== "any") makeChip(fDur.options[fDur.selectedIndex].text, () => { fDur.value = "any"; applyFilters(); });
    if (fDiff.value !== "any") makeChip(fDiff.value, () => { fDiff.value = "any"; applyFilters(); });
  }
  if (chips.children.length > 0 && activeMode === "filters") {
    const clear = document.createElement("button");
    clear.className = "chip chip-clear";
    clear.textContent = "Clear all";
    clear.addEventListener("click", () => { fDest.value = "any"; fDur.value = "any"; fDiff.value = "any"; applyFilters(); });
    chips.appendChild(clear);
  }
};

const applyFilters = () => {
  const q = activeQuery.toLowerCase().trim();
  const tokens = q ? q.split(/[^a-z0-9]+/).filter(Boolean) : [];
  let visible = 0;

  cards.forEach((card) => {
    if (card.dataset.featured === "true" && activeMode !== "query" && activeMode !== "surprise") {
      card.classList.add("hidden"); return;
    }
    let show = true;
    // dropdown filters (only apply in "filters" mode)
    if (activeMode === "filters") {
      if (fDest.value !== "any" && card.dataset.region !== fDest.value) show = false;
      if (fDur.value !== "any" && durationBucket(parseInt(card.dataset.days)) !== fDur.value) show = false;
      if (fDiff.value !== "any" && card.dataset.difficulty !== fDiff.value) show = false;
    }
    // keyword search (override filters)
    if (activeMode === "query" && tokens.length) {
      const hay = [card.dataset.region, card.dataset.difficulty, $(".trek-title", card).textContent, card.dataset.desc, card.dataset.highlights].join(" ").toLowerCase();
      show = tokens.some((tok) => {
        // synonym expansion
        for (const [group, keys] of Object.entries(SYNONYMS)) {
          if (keys.some((k) => tok === k || k.startsWith(tok))) {
            if (group === "hard" && (card.dataset.difficulty === "Strenuous" || card.dataset.difficulty === "Challenging")) return true;
            if (group === "easy" && card.dataset.difficulty === "Easy") return true;
            if (group === "short" && parseInt(card.dataset.days) < 8) return true;
            if (group === "long" && parseInt(card.dataset.days) >= 14) return true;
            if (group === "cheap") return true; // sort by price below
          }
        }
        return hay.includes(tok);
      });
    }
    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });

  $("#resultCount").textContent = visible;
  $("#totalCount").textContent = totalCount;

  if (activeMode === "none") {
    filterBar.style.display = "none";
    failsafe.style.display = "none";
  } else {
    filterBar.style.display = "flex";
    if (visible === 0 && activeMode === "query") {
      $("#failQuery").textContent = activeQuery;
      failsafe.style.display = "flex";
      $("#trekGrid").style.display = "none";
    } else {
      failsafe.style.display = "none";
      $("#trekGrid").style.display = "";
    }
  }
  renderChips();
};

/* dropdown changes => filters mode */
[fDest, fDur, fDiff].forEach((el) => el.addEventListener("change", () => {
  activeMode = "filters";
  activeQuery = "";
  keywordInput.value = "";
  keywordClear.style.display = "none";
  applyFilters();
  $("#treks").scrollIntoView({ behavior: "smooth" });
}));

$("#filterSearchBtn").addEventListener("click", () => {
  activeMode = "filters";
  activeQuery = "";
  applyFilters();
  $("#treks").scrollIntoView({ behavior: "smooth" });
});

/* keyword input */
keywordInput.addEventListener("input", () => {
  keywordClear.style.display = keywordInput.value ? "grid" : "none";
});
keywordClear.addEventListener("click", () => {
  keywordInput.value = "";
  keywordClear.style.display = "none";
  activeQuery = "";
  activeMode = "none";
  applyFilters();
});

const doKeywordSearch = () => {
  const q = keywordInput.value.trim();
  if (!q) return;
  activeQuery = q;
  activeMode = "query";
  fDest.value = "any"; fDur.value = "any"; fDiff.value = "any";
  applyFilters();
  $("#treks").scrollIntoView({ behavior: "smooth" });
};
$("#keywordSearchBtn").addEventListener("click", doKeywordSearch);
keywordInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doKeywordSearch(); } });

/* ---------- 11. SURPRISE ME ---------- */
const doSurprise = () => {
  const pool = cards.filter((c) => c.dataset.featured !== "true");
  const pick = pool[Math.floor(Math.random() * pool.length)];
  // hide all except pick
  cards.forEach((c) => c.classList.toggle("hidden", c !== pick));
  activeMode = "surprise";
  activeQuery = "";
  keywordInput.value = "";
  keywordClear.style.display = "none";
  fDest.value = "any"; fDur.value = "any"; fDiff.value = "any";
  $("#resultCount").textContent = 1;
  failsafe.style.display = "none";
  $("#trekGrid").style.display = "";
  filterBar.style.display = "flex";
  renderChips();
  showToast("Feeling lucky? How about the " + $(".trek-title", pick).textContent + "?");
  $("#treks").scrollIntoView({ behavior: "smooth" });
};
$("#surpriseBtn").addEventListener("click", doSurprise);
$("#failsafeSurprise").addEventListener("click", doSurprise);

/* ---------- 12. EXPLORE FEATURED ---------- */
$("#exploreFeatured").addEventListener("click", () => {
  const featured = $('[data-id="got"]');
  openTrekModal(featured);
});