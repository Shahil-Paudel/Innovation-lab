/* =====================================================
   SAGARMATHA TREKS — search listing page (vanilla JS)
===================================================== */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- toast ---------- */
const showToast = (msg) => {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.style.display = "flex";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.style.display = "none"), 2600);
};

/* ---------- reveal on scroll ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- wishlist (shared with home page) ---------- */
let wishlist = (() => { try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; } })();
const saveWishlist = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  $("#wlCount").textContent = wishlist.length;
  $$(".s-card").forEach((card) => {
    const btn = $(".heart-btn", card);
    const on = wishlist.includes(card.dataset.id);
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on);
  });
};
const toggleWish = (id) => {
  if (wishlist.includes(id)) { wishlist = wishlist.filter((x) => x !== id); showToast("Removed from your wishlist"); }
  else { wishlist.push(id); showToast("Added to your wishlist"); }
  saveWishlist();
};
saveWishlist();

/* ---------- search: ?q= param + live re-search ---------- */
const cards  = $$(".s-card");
const grid   = $("#sGrid");
const input  = $("#headSearchInput");
const params = new URLSearchParams(location.search);
let query = (params.get("q") || "everest").trim();
input.value = query;

const applySearch = () => {
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let visible = 0;
  cards.forEach((card) => {
    const hay = (card.dataset.search + " " + card.dataset.region + " " + $(".trek-title", card).textContent).toLowerCase();
    const show = !tokens.length || tokens.some((t) => hay.includes(t));
    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });
  const label = query ? `“${query}”` : "all treks";
  $("#resultCount").textContent = visible;
  $("#totalCount").textContent  = cards.length;
  $("#queryEcho").textContent   = label;
  $("#crumbQuery").textContent  = `Search results for ${label}`;
  $("#failsafe").style.display  = visible ? "none" : "flex";
  grid.style.display            = visible ? "" : "none";
  $("#pagination").style.display = visible ? "" : "none";
  if (!visible) $("#failQuery").textContent = query;
};

$("#headSearchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  query = input.value.trim();
  history.replaceState(null, "", query ? "?q=" + encodeURIComponent(query) : location.pathname);
  applySearch();
  grid.scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#clearSearch").addEventListener("click", () => {
  query = ""; input.value = "";
  history.replaceState(null, "", location.pathname);
  applySearch();
});

/* ---------- sorting (duration / price / difficulty / rating) ---------- */
const selDur = $("#sortDuration"), selPrice = $("#sortPrice"), selDiff = $("#sortDiff"), selRate = $("#sortRating");
const selects = [selDur, selPrice, selDiff, selRate];
const diffRank = { Easy: 1, Moderate: 2, Challenging: 3, Strenuous: 4 };
const valueOf = (sel, card) =>
  sel === selDur   ? parseInt(card.dataset.days)  :
  sel === selPrice ? parseInt(card.dataset.price) :
  sel === selDiff  ? (diffRank[card.dataset.difficulty] || 0) :
                     parseFloat(card.dataset.rating);

const applySort = () => {
  const active = selects.find((s) => s.value);
  selects.forEach((s) => s.classList.toggle("active", s === active));
  const ordered = !active ? cards.slice()
    : cards.slice().sort((a, b) => (valueOf(active, a) - valueOf(active, b)) * (active.value === "desc" ? -1 : 1));
  ordered.forEach((c) => grid.appendChild(c)); // re-orders DOM
};
selects.forEach((sel) => sel.addEventListener("change", () => {
  if (sel.value) selects.forEach((o) => { if (o !== sel) o.value = ""; }); // one sort at a time
  applySort();
}));

/* ---------- card interactions: heart + quick view (+) ---------- */
grid.addEventListener("click", (e) => {
  const qv = e.target.closest(".quick-view");
  if (qv) { qv.closest(".s-card").classList.toggle("expanded"); return; }
  const heart = e.target.closest(".heart-btn");
  if (heart) toggleWish(heart.closest(".s-card").dataset.id);
});

/* ---------- mobile menu ---------- */
const menuBtn = $("#menuBtn"), mobilePanel = $("#mobilePanel");
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

/* ---------- ESC closes panel / collapses quick views ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (mobilePanel.classList.contains("open")) {
    mobilePanel.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  } else {
    $$(".s-card.expanded").forEach((c) => c.classList.remove("expanded"));
  }
});

/* ---------- init ---------- */
applySearch();
applySort();