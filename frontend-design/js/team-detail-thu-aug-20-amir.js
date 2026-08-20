/* =====================================================
   TEAM DETAIL PAGE — page-scoped JS
   Mirrors index.js behavior for trek cards, wishlist,
   modals & lead capture. Self-contained & vanilla.
   ===================================================== */

/* ---------- helpers ---------- */
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
const header = $("#header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
}, { passive: true });

/* ---------- 2. REVEAL ON SCROLL ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- 3. STARS RENDERER ---------- */
const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const emptyStarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

const renderStars = (el, rating) => {
  const r = parseFloat(rating) || 0;
  el.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    el.insertAdjacentHTML("beforeend", i < Math.floor(r) ? starSvg : emptyStarSvg);
  }
};
$$(".stars").forEach((el) => renderStars(el, el.dataset.rating));

/* ---------- 4. WISHLIST (localStorage) ---------- */
let wishlist = (() => {
  try { return JSON.parse(localStorage.getItem("wishlist")) || []; }
  catch { return []; }
})();

const saveWishlist = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  $("#wlCount").textContent = wishlist.length;

  // sync all heart buttons on trek cards
  $$(".trek-card").forEach((card) => {
    const id = card.dataset.id;
    const btn = $(".heart-btn", card);
    if (wishlist.includes(id)) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    }
  });

  // sync modal wish button if open
  if ($("#trekModal").style.display !== "none") {
    const id = $("#trekModal").dataset.currentId;
    const label = $("#mWishLabel");
    const btn = $("#mWish");
    if (wishlist.includes(id)) {
      label.textContent = "Saved";
      btn.classList.add("wished");
    } else {
      label.textContent = "Save";
      btn.classList.remove("wished");
    }
  }
};
saveWishlist();

/* ---------- 5. TREK CARD INTERACTIONS ---------- */
$("#trekGrid").addEventListener("click", (e) => {
  const heart = e.target.closest(".heart-btn");
  const card = e.target.closest(".trek-card");
  if (!card) return;
  const id = card.dataset.id;

  if (heart) {
    e.stopPropagation();
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
  $("#mRegion").textContent = d.region;
  $("#mTitle").textContent = $(".trek-title", card).textContent;
  $("#mDays").textContent = d.days;

  const diff = $("#mDiff");
  diff.textContent = d.difficulty;
  diff.className = "diff diff-" + d.difficulty.toLowerCase();

  $("#mElev").textContent = d.elevation;
  $("#mRating").textContent = d.rating;
  $("#mReviews").textContent = d.reviews + " reviews";
  renderStars($("#mStars"), d.rating);

  $("#mDesc").textContent = d.desc;
  $("#mOld").textContent = "$" + parseInt(d.oldPrice).toLocaleString();
  $("#mPrice").textContent = "$" + parseInt(d.price).toLocaleString();

  const hl = $("#mHighlights");
  hl.innerHTML = "";
  try {
    const items = JSON.parse(d.highlights || "[]");
    items.forEach((h) => {
      hl.insertAdjacentHTML("beforeend",
        `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> ${h}</li>`
      );
    });
  } catch {}

  $("#mWa").dataset.leadLink = "https://wa.me/9779800000000?text=" +
    encodeURIComponent("Namaste! I'm interested in the " +
      $(".trek-title", card).textContent + " led by Pasang.");

  trekModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  $("#mClose").focus();
  saveWishlist();
};

const closeTrekModal = () => {
  trekModal.style.display = "none";
  document.body.classList.remove("no-scroll");
};

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

const closeLeadModal = () => {
  leadModal.style.display = "none";
  document.body.classList.remove("no-scroll");
  $("#leadError").style.display = "none";
  $("#leadForm").reset();
};

$("#leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#leadName").value.trim();
  const email = $("#leadEmail").value.trim();
  const err = $("#leadError");

  if (!name) {
    err.textContent = "Please tell us your name.";
    err.style.display = "block";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "That email doesn't look right.";
    err.style.display = "block";
    return;
  }
  try {
    localStorage.setItem("lead", JSON.stringify({ name, email, at: Date.now() }));
  } catch {}
  window.open(pendingLink, "_blank", "noopener");
  closeLeadModal();
});

/* ---------- 8. MOBILE MENU ---------- */
const menuBtn = $("#menuBtn");
const mobilePanel = $("#mobilePanel");

menuBtn.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  mobilePanel.setAttribute("aria-hidden", !open);
  document.body.classList.toggle("no-scroll", open);
});

$$(".mobile-panel a").forEach((a) => a.addEventListener("click", () => {
  mobilePanel.classList.remove("open");
  mobilePanel.setAttribute("aria-hidden", "true");
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
    mobilePanel.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
});

/* click-outside-to-close for modals */
trekModal.addEventListener("click", (e) => { if (e.target === trekModal) closeTrekModal(); });
leadModal.addEventListener("click", (e) => { if (e.target === leadModal) closeLeadModal(); });