/* =====================================================
   8000'ers PANORAMA — responsive fit / scroll edition
   • wide screens  : range scales down to fit (no scroll)
   • small screens : horizontal pan + snap + progress HUD
   • hover / tap   : gold-ink crossfade (unchanged)
   ===================================================== */
(() => {
  "use strict";

  const mulberry32 = (seed) => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const PEAKS = [
    { name:"SHISHAPANGMA",         m:"8027m.",    ft:"26335ft.", elev:8027, lift:34,  seed:11,  img:"img/peaks/shishapangma.png"  },
    { name:"GASHERBRUM I",         m:"8080m.",    ft:"26510ft.", elev:8080, lift:58,  seed:22,  img:"img/peaks/gasherbrum-1.png"  },
    { name:"NANGAPARBAT",          m:"8125m.",    ft:"26657ft.", elev:8125, lift:74,  seed:33,  img:"img/peaks/nanga-parbat.png"  },
    { name:"DHAULAGIRI I",         m:"8167m.",    ft:"26795ft.", elev:8167, lift:88,  seed:44,  img:"img/peaks/dhaulagiri.png"    },
    { name:"MAKALU",               m:"8485m.",    ft:"27838ft.", elev:8485, lift:102, seed:55,  img:"img/peaks/makalu.png"        },
    { name:"KANCHENJUNGA",         m:"8586m.",    ft:"28169ft.", elev:8586, lift:116, seed:66,  img:"img/peaks/kanchenjunga.png"  },
    { name:"EVEREST (SAGARMATHA)", m:"8848.86m.", ft:"29032ft.", elev:8848, lift:132, seed:77,  img:"img/peaks/everest.png"       },
    { name:"K2 (CHHOGORI)",        m:"8611m.",    ft:"28251ft.", elev:8611, lift:112, seed:88,  img:"img/peaks/k2.png"            },
    { name:"LHOTSE",               m:"8516m.",    ft:"27940ft.", elev:8516, lift:94,  seed:99,  img:"img/peaks/lhotse.png"        },
    { name:"CHO OYU",              m:"8188m.",    ft:"26864ft.", elev:8188, lift:72,  seed:111, img:"img/peaks/cho-oyu.png"       },
    { name:"MANASLU",              m:"8163m.",    ft:"26781ft.", elev:8163, lift:58,  seed:122, img:"img/peaks/manaslu.png"       },
    { name:"ANNAPURNA I",          m:"8091m.",    ft:"26545ft.", elev:8091, lift:50,  seed:133, img:"img/peaks/annapurna.png"     },
    { name:"BROAD PEAK",           m:"8051m.",    ft:"26414ft.", elev:8051, lift:42,  seed:144, img:"img/peaks/broad-peak.png"    },
    { name:"GASHERBRUM II",        m:"8034m.",    ft:"26358ft.", elev:8034, lift:36,  seed:155, img:"img/peaks/gasherbrum-2.png"  },
  ];

  /* ---------- fallback line-art sketch ---------- */
  const jag = (a, b, rnd, r) => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const steps = Math.max(2, Math.round(Math.hypot(dx, dy) / 22));
    const out = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      out.push([a[0] + dx * t + (rnd() - .5) * r, a[1] + dy * t + (rnd() - .5) * r * 1.4]);
    }
    return out;
  };
  const toPath = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const sketchURI = (seed, stroke) => {
    const rnd = mulberry32(seed);
    const ax = 170 + rnd() * 60, ay = 34 + rnd() * 22;
    const verts = [[-8, 208], [70 + rnd() * 40, 120 + rnd() * 30], [ax, ay], [290 - rnd() * 40, 128 + rnd() * 30], [408, 212]];
    const pts = [verts[0]];
    for (let i = 1; i < verts.length; i++) pts.push(...jag(verts[i - 1], verts[i], rnd, 6), verts[i]);
    let d = toPath(pts);
    for (let k = 0; k < 3; k++) {
      const s = [ax + (k - 1) * 14, ay + 18 + rnd() * 10];
      const e = [ax + (k - 1) * 70, 150 + rnd() * 40];
      d += " " + toPath([s, ...jag(s, e, rnd, 4), e]);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  };

  /* ---------- file probing + paper stripping (unchanged) ---------- */
  const candidates = (url) => [url, url.replace(/\.png$/i, ".jpg"), url.replace(/\.png$/i, ".jpeg"), url.replace(/\.png$/i, ".webp"), url + ".png"];
  const probe = (urls) => new Promise((resolve) => {
    let i = 0;
    (function next() {
      if (i >= urls.length) return resolve(null);
      const im = new Image();
      im.onload = () => resolve(urls[i]);
      im.onerror = () => { i++; next(); };
      im.src = urls[i];
    })();
  });
  const stripPaper = (img) => {
    const MAXW = 1000;
    const scale = Math.min(1, MAXW / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      d[i + 3] = Math.min(d[i + 3], lum > 235 ? 0 : lum < 120 ? 255 : Math.round(((235 - lum) / 115) * 255));
    }
    ctx.putImageData(id, 0, 0);
    return c.toDataURL("image/png");
  };

  /* ---------- refs ---------- */
  const stage  = document.getElementById("peaksStage");
  const range  = document.getElementById("peaksRange");
  const hud    = document.getElementById("peaksHud");
  const fill   = document.getElementById("peaksFill");
  const countEl= document.getElementById("peaksCount");
  const PAD = 48, MIN_SCALE = 0.55;
  let designW = 0, peakEls = [], suppressClick = false;

  /* ---------- fit-when-you-can, scroll-when-you-must ---------- */
  const measure = () => {
    stage.style.setProperty("--scale", 1);
    designW = range.scrollWidth;
    fit();
  };
  const fit = () => {
    if (!designW) return;
    const avail = stage.clientWidth - PAD * 2;
    let s = Math.min(1, avail / designW);
    const scrollable = s < MIN_SCALE;
    stage.style.setProperty("--scale", Math.max(s, MIN_SCALE));
    stage.classList.toggle("is-scroll", scrollable);
    hud.classList.toggle("show", scrollable);
    if (!scrollable) stage.scrollLeft = 0;
    updateHud();
  };
  const updateHud = () => {
    const max = stage.scrollWidth - stage.clientWidth;
    fill.style.transform = `scaleX(${max > 0 ? stage.scrollLeft / max : 1})`;
    const center = range.getBoundingClientRect().left + stage.scrollLeft + stage.clientWidth / 2;
    let best = 0, bd = Infinity;
    peakEls.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left - range.getBoundingClientRect().left + stage.scrollLeft + r.width / 2 - (stage.scrollLeft + stage.clientWidth / 2));
      if (d < bd) { bd = d; best = i; }
    });
    countEl.textContent = `[${best + 1} / ${peakEls.length}]`;
  };
  let raf = 0;
  const queueMeasure = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
  window.addEventListener("resize", queueMeasure);
  stage.addEventListener("scroll", () => requestAnimationFrame(updateHud), { passive: true });

  /* ---------- drag-to-pan (mouse; touch scrolls natively) ---------- */
  let down = false, sx = 0, ss = 0, moved = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || !stage.classList.contains("is-scroll")) return;
    down = true; moved = 0; sx = e.clientX; ss = stage.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx));
    stage.scrollLeft = ss - dx;
  });
  window.addEventListener("pointerup", () => {
    if (down && moved > 8) { suppressClick = true; setTimeout(() => (suppressClick = false), 0); }
    down = false;
  });

  /* ---------- build ---------- */
  PEAKS.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "peak";
    fig.tabIndex = 0;
    fig.setAttribute("role", "img");
    fig.setAttribute("aria-label", `${p.name} — ${p.m}/${p.ft}`);
    fig.style.setProperty("--h", Math.round(120 + (p.elev - 8000) * 0.15) + "px");
    fig.style.setProperty("--lift", p.lift + "px");
    fig.style.setProperty("--i", i);

    const base = document.createElement("img");
    base.className = "img-base"; base.alt = ""; base.draggable = false;
    base.src = sketchURI(p.seed, "#4a4f55");
    base.addEventListener("load", queueMeasure);

    const gold = document.createElement("img");
    gold.className = "img-gold"; gold.alt = ""; gold.draggable = false;
    gold.src = sketchURI(p.seed, "#b9821f");

    const cap = document.createElement("figcaption");
    cap.className = "peak-label";
    cap.innerHTML = `<span class="pl-bracket"></span>
      <span class="pl-text"><strong>${p.name}</strong><small>${p.m}/${p.ft}</small></span>`;

    fig.append(base, gold, cap);
    range.appendChild(fig);
    peakEls.push(fig);

    probe(candidates(p.img)).then((hit) => {
      if (!hit) return console.warn(`[peaks] ${p.name}: sketch not found — built-in line-art used.`);
      const im = new Image();
      im.onload = () => {
        try {
          const clean = stripPaper(im);
          base.src = clean; gold.src = clean;
          base.addEventListener("load", queueMeasure, { once: true });
        } catch {
          fig.classList.add("blend-fallback");
          base.src = hit; gold.src = hit;
        }
      };
      im.src = hit;
    });
  });

  /* tap / click pins the gold highlight */
  range.addEventListener("click", (e) => {
    if (suppressClick) return;
    const fig = e.target.closest(".peak");
    const wasActive = fig && fig.classList.contains("is-active");
    range.querySelectorAll(".peak.is-active").forEach((n) => n.classList.remove("is-active"));
    if (fig && !wasActive) fig.classList.add("is-active");
  });

  window.addEventListener("load", queueMeasure);
  queueMeasure();
})();