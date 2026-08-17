/* =====================================================
   14 PEAKS — HORIZONTAL SCROLL ENGINE (vanilla JS)
   Vertical scroll drives horizontal movement + progress
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("hs-section");
  const track   = document.getElementById("hs-track");
  const fill    = document.getElementById("hs-fill");
  const counter = document.getElementById("hs-current");
  const cards   = Array.from(track.children);

  const SPEED = 1.35; // >1 = longer, smoother scroll journey

  /* Section height = horizontal distance × speed + one viewport */
  function layout() {
    const extra = track.scrollWidth - window.innerWidth;
    section.style.height = (Math.max(extra, 0) * SPEED + window.innerHeight) + "px";
    update();
  }

  function update() {
    const rect  = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return;

    /* 0 → 1 progress while the sticky section is pinned */
    let p = -rect.top / total;
    p = Math.min(1, Math.max(0, p));

    /* Move the track horizontally */
    const max = track.scrollWidth - window.innerWidth;
    track.style.transform = "translate3d(" + (-p * max) + "px,0,0)";

    /* Progress bar (brand gold) */
    fill.style.width = (p * 100).toFixed(2) + "%";

    /* Counter = card whose centre is closest to viewport centre */
    const centre = window.innerWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centre);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    counter.textContent = String(best + 1).padStart(2, "0");
  }

  /* rAF-throttled scroll */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout); // re-measure after images load
  layout();
});