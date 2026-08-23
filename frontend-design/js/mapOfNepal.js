/* ============================================================
   Explore Nepal — Interactive Map
   ============================================================ */

/* ---------- Destination data ---------- */
const DESTINATIONS = [
  { id: "everest-base-camp", name: "Everest Base Camp", category: "trekking", lat: 27.9881, lng: 86.9250, x: 1264, y: 516 },
  { id: "gokyo", name: "Gokyo", category: "trekking", lat: 27.9780, lng: 86.6940, x: 1223, y: 518 },
  { id: "three-passes", name: "Three Passes", category: "trekking", lat: 27.9800, lng: 86.7200, x: 1228, y: 518 },
  { id: "annapurna-base-camp", name: "Annapurna Base Camp", category: "trekking", lat: 28.5306, lng: 83.8780, x: 723, y: 405 },
  { id: "annapurna-circuit", name: "Annapurna Circuit", category: "trekking", lat: 28.7900, lng: 84.3500, x: 807, y: 352 },
  { id: "mardi-himal", name: "Mardi Himal", category: "trekking", lat: 28.4410, lng: 83.8750, x: 722, y: 423 },
  { id: "ghorepani-poon-hill", name: "Ghorepani / Poon Hill", category: "trekking", lat: 28.4000, lng: 83.6920, x: 690, y: 432 },
  { id: "langtang", name: "Langtang", category: "trekking", lat: 28.2000, lng: 85.5500, x: 1020, y: 473 },
  { id: "manaslu", name: "Manaslu", category: "trekking", lat: 28.6600, lng: 84.5600, x: 844, y: 379 },
  { id: "mustang-upper-mustang", name: "Mustang / Upper Mustang", category: "trekking", lat: 29.1800, lng: 83.8500, x: 718, y: 272 },
  { id: "kanchenjunga", name: "Kanchenjunga", category: "trekking", lat: 27.7000, lng: 88.1500, x: 1482, y: 575 },
  { id: "dolpo", name: "Dolpo", category: "trekking", lat: 29.2500, lng: 82.9000, x: 549, y: 258 },
  { id: "tsum-valley", name: "Tsum Valley", category: "trekking", lat: 28.4800, lng: 84.7600, x: 880, y: 416 },
  { id: "kathmandu", name: "Kathmandu", category: "tours", lat: 27.7172, lng: 85.3240, x: 980, y: 572 },
  { id: "pokhara", name: "Pokhara", category: "tours", lat: 28.2096, lng: 83.9856, x: 742, y: 471 },
  { id: "chitwan", name: "Chitwan", category: "tours", lat: 27.5291, lng: 84.3542, x: 807, y: 610 },
  { id: "lumbini", name: "Lumbini", category: "tours", lat: 27.4833, lng: 83.2769, x: 616, y: 619 },
  { id: "janakpur", name: "Janakpur", category: "tours", lat: 26.7288, lng: 85.9250, x: 1087, y: 774 },
  { id: "bandipur", name: "Bandipur", category: "tours", lat: 27.9380, lng: 84.4060, x: 817, y: 526 },
  { id: "palpa-tansen", name: "Palpa / Tansen", category: "tours", lat: 27.8673, lng: 83.5467, x: 664, y: 541 },
  { id: "gorkha", name: "Gorkha", category: "tours", lat: 28.0000, lng: 84.6330, x: 857, y: 514 },
  { id: "muktinath", name: "Muktinath", category: "pilgrimage", lat: 28.8167, lng: 83.8700, x: 721, y: 347 },
  { id: "pashupatinath", name: "Pashupatinath", category: "pilgrimage", lat: 27.7104, lng: 85.3488, x: 984, y: 573 },
  { id: "lumbini-pilgrimage", name: "Lumbini", category: "pilgrimage", lat: 27.4833, lng: 83.2769, x: 616, y: 619 },
  { id: "janakpur-pilgrimage", name: "Janakpur", category: "pilgrimage", lat: 26.7288, lng: 85.9250, x: 1087, y: 774 },
  { id: "pathibhara", name: "Pathibhara", category: "pilgrimage", lat: 27.4140, lng: 87.7610, x: 1413, y: 634 },
  { id: "manakamana", name: "Manakamana", category: "pilgrimage", lat: 27.9490, lng: 84.8670, x: 899, y: 524 },
  { id: "rafting-trishuli", name: "Rafting (Trishuli River)", category: "adventure", lat: 27.880, lng: 84.520, x: 827, y: 527 },
  { id: "paragliding-sarangkot", name: "Paragliding (Sarangkot, Pokhara)", category: "adventure", lat: 28.240, lng: 83.950, x: 736, y: 465 },
  { id: "bungee-last-resort", name: "Bungee (The Last Resort)", category: "adventure", lat: 27.910, lng: 85.930, x: 1087, y: 538 },
  { id: "canyoning-jalbire", name: "Canyoning (Jalbire)", category: "adventure", lat: 27.780, lng: 85.720, x: 1050, y: 565 },
  { id: "zipline-sarangkot", name: "Zipline (Sarangkot, Pokhara)", category: "adventure", lat: 28.240, lng: 83.950, x: 736, y: 465 },
  { id: "mountain-biking-kathmandu", name: "Mountain Biking (Kathmandu Valley)", category: "adventure", lat: 27.720, lng: 85.320, x: 979, y: 572 },
  { id: "upper-mustang", name: "Upper Mustang", category: "premium-offbeat", lat: 29.180, lng: 83.850, x: 718, y: 272 },
  { id: "dolpo-premium", name: "Dolpo", category: "premium-offbeat", lat: 29.250, lng: 82.900, x: 549, y: 258 },
  { id: "rara-lake", name: "Rara Lake", category: "premium-offbeat", lat: 29.530, lng: 82.080, x: 403, y: 201 },
  { id: "kanchenjunga-premium", name: "Kanchenjunga", category: "premium-offbeat", lat: 27.700, lng: 88.150, x: 1482, y: 575 },
  { id: "nar-phu", name: "Nar Phu", category: "premium-offbeat", lat: 28.800, lng: 84.150, x: 771, y: 350 },
  { id: "makalu", name: "Makalu", category: "premium-offbeat", lat: 27.890, lng: 87.090, x: 1294, y: 536 }
];

/* ---------- Teasers ---------- */
const TEASERS = {
  "everest-base-camp": "Trek to the base of the world's highest peak.",
  "gokyo": "Visit the stunning turquoise Gokyo Lakes in the Khumbu.",
  "three-passes": "Cross three high passes on Nepal's most challenging trek.",
  "annapurna-base-camp": "Walk through rhododendron forests to the Annapurna sanctuary.",
  "annapurna-circuit": "Complete the classic loop around the Annapurna massif.",
  "mardi-himal": "A short trek with close-up views of Machhapuchhre.",
  "ghorepani-poon-hill": "Sunrise views of the Annapurna and Dhaulagiri ranges.",
  "langtang": "Explore the valley of glaciers close to Kathmandu.",
  "manaslu": "Circle the world's eighth-highest peak on this remote trek.",
  "mustang-upper-mustang": "Discover the forbidden kingdom of Lo Manthang.",
  "kanchenjunga": "Trek to the base of the world's third-highest peak.",
  "dolpo": "Journey through the remote and mystical Shey Phoksundo.",
  "tsum-valley": "Explore the sacred hidden valley of the Tsum people.",
  "kathmandu": "Explore ancient temples and vibrant streets of Nepal's capital.",
  "pokhara": "Relax by Phewa Lake with stunning Annapurna views.",
  "chitwan": "Spot rhinos and tigers in Nepal's premier jungle park.",
  "lumbini": "Visit the birthplace of Lord Buddha.",
  "janakpur": "Discover the ancient city of Sita and Mithila culture.",
  "bandipur": "Wander a preserved Newari hilltop town with mountain views.",
  "palpa-tansen": "Explore a charming hill town overlooking the Terai plains.",
  "gorkha": "Visit the historic birthplace of modern Nepal.",
  "muktinath": "Sacred temple revered by Hindus and Buddhists alike.",
  "pashupatinath": "Nepal's most sacred Hindu temple on the Bagmati River.",
  "lumbini-pilgrimage": "Pilgrimage to the birthplace of Lord Buddha.",
  "janakpur-pilgrimage": "Sacred city of Goddess Sita and the Ramayana.",
  "pathibhara": "Hilltop temple of Goddess Bhagwati in eastern Nepal.",
  "manakamana": "Cable car ride to the wish-fulfilling goddess temple.",
  "rafting-trishuli": "White-water rafting on the scenic Trishuli River.",
  "paragliding-sarangkot": "Soar above Phewa Lake with Annapurna panoramas.",
  "bungee-last-resort": "Nepal's ultimate 160m bungee jump over the Bhote Koshi.",
  "canyoning-jalbire": "Rappel, slide and jump through Jalbire's waterfalls.",
  "zipline-sarangkot": "One of the world's steepest ziplines over Pokhara valley.",
  "mountain-biking-kathmandu": "Ride through Kathmandu Valley's trails and villages.",
  "upper-mustang": "Explore the forbidden kingdom's ancient caves and monasteries.",
  "dolpo-premium": "Remote wilderness of Shey Phoksundo and ancient Bon culture.",
  "rara-lake": "Nepal's largest lake in a pristine, remote national park.",
  "kanchenjunga-premium": "Offbeat trek to the world's third-highest peak base.",
  "nar-phu": "Hidden valleys with ancient monasteries near Annapurna.",
  "makalu": "Trek to the base of the world's fifth-highest peak."
};

/* ---------- Category config ---------- */
const CATEGORIES = {
  trekking: {
    label: "Trekking",
    color: "#C0392B",
    icon: (color) => `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M18 4 L32 30 L4 30 Z" fill="${color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M18 4 L24 17 L12 17 Z" fill="#fff" stroke="${color}" stroke-width="0.6" stroke-linejoin="round"/>
      </svg>`
  },
  tours: {
    label: "Tours",
    color: "#2980B9",
    icon: (color) => `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect x="8" y="14" width="20" height="18" fill="${color}" stroke="#fff" stroke-width="1.2" rx="1"/>
        <rect x="14" y="22" width="8" height="10" fill="#fff"/>
        <path d="M12 14 L12 8 L18 8 L18 14 M18 14 L18 6 L24 6 L24 14" fill="${color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
        <rect x="11" y="17" width="4" height="4" fill="#fff"/>
        <rect x="21" y="17" width="4" height="4" fill="#fff"/>
      </svg>`
  },
  pilgrimage: {
    label: "Pilgrimage",
    color: "#8E44AD",
    icon: (color) => `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M18 4 L20 10 L26 10 L21 14 L23 20 L18 16 L13 20 L15 14 L10 10 L16 10 Z" fill="${color}" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>
        <rect x="12" y="20" width="12" height="12" fill="${color}" stroke="#fff" stroke-width="1.2"/>
        <path d="M18 22 L18 32 M14 27 L22 27" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`
  },
  "premium-offbeat": {
    label: "Premium/Offbeat",
    color: "#D4AC0D",
    icon: (color) => `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M18 4 L21.5 13 L31 13 L23.5 19 L26.5 29 L18 23 L9.5 29 L12.5 19 L5 13 L14.5 13 Z" fill="${color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
      </svg>`
  },
  adventure: {
    label: "Adventure",
    color: "#E67E22",
    icon: (color) => `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M20 4 L8 20 L16 20 L14 32 L28 16 L20 16 Z" fill="${color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
      </svg>`
  }
};

/* ---------- Constants ---------- */
const NATURAL_WIDTH = 1536;
const NATURAL_HEIGHT = 864;
const TOOLTIP_HIDE_DELAY = 150;

/* ---------- DOM ---------- */
const mapImage = document.getElementById("mapImage");
const mapError = document.getElementById("mapError");
const markersLayer = document.getElementById("markersLayer");
const tooltip = document.getElementById("tooltip");
const filterBtns = document.querySelectorAll(".filter-btn");

/* ---------- State ---------- */
let activeCategory = "all";
let hideTimer = null;
let activeMarker = null;

/* ---------- Helpers ---------- */
function validateDestination(d) {
  if (!d || typeof d.name !== "string" || d.name.trim() === "") {
    console.warn("Skipping destination: missing name.", d);
    return false;
  }
  if (typeof d.x !== "number" || typeof d.y !== "number") {
    console.warn("Skipping destination: missing coordinates.", d.name);
    return false;
  }
  return true;
}

function getCategories(d) {
  if (Array.isArray(d.categories) && d.categories.length) return d.categories;
  if (typeof d.category === "string" && d.category.trim()) return [d.category];
  console.warn("Destination missing category, defaulting to trekking:", d.name);
  return ["trekking"];
}

function getTeaser(d) {
  return TEASERS[d.id] || `${d.name} — a ${CATEGORIES[getCategories(d)[0]]?.label || "destination"} in Nepal.`;
}

function getDetailsUrl(d) {
  return `destination.html?id=${encodeURIComponent(d.id)}`;
}

/* ---------- Duplicate coordinate offset ---------- */
function computeOffsets(destinations) {
  const coordMap = new Map();
  destinations.forEach((d) => {
    const key = `${d.x},${d.y}`;
    if (!coordMap.has(key)) coordMap.set(key, []);
    coordMap.get(key).push(d);
  });

  const offsets = new Map();
  coordMap.forEach((group) => {
    if (group.length <= 1) {
      offsets.set(group[0].id, { dx: 0, dy: 0 });
      return;
    }
    // Deterministic offsets rotating around the original point
    const directions = [
      { dx: 10, dy: 0 },
      { dx: -10, dy: 0 },
      { dx: 0, dy: 10 },
      { dx: 0, dy: -10 },
      { dx: 10, dy: 10 },
      { dx: -10, dy: -10 }
    ];
    group.forEach((d, i) => {
      if (i === 0) offsets.set(d.id, { dx: 0, dy: 0 });
      else offsets.set(d.id, directions[(i - 1) % directions.length]);
    });
  });
  return offsets;
}

/* ---------- Marker creation ---------- */
/* ---------- Category emoji map ---------- */
const CATEGORY_EMOJIS = {
  trekking: '🏔️',
  tours: '🏙️',
  pilgrimage: '🛕',
  'premium-offbeat': '⭐',
  adventure: '🧗'
};

/* ---------- Marker creation ---------- */
function createMarker(d, offset) {
  const leftPercent = (d.x / NATURAL_WIDTH) * 100;
  const topPercent = (d.y / NATURAL_HEIGHT) * 100;
  const cats = getCategories(d);
  const primaryCat = cats[0];
  const emoji = CATEGORY_EMOJIS[primaryCat] || '📍';

  const btn = document.createElement('button');
  btn.className = 'map-marker';
  btn.id = `marker-${d.id}`;
  btn.setAttribute('aria-label', `${emoji} ${d.name}`);
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('data-destination-id', d.id);
  btn.style.left = `calc(${leftPercent}% + ${offset.dx}px)`;
  btn.style.top = `calc(${topPercent}% + ${offset.dy}px)`;
  btn.textContent = emoji;

  btn.addEventListener('mouseenter', () => showTooltip(d, btn));
  btn.addEventListener('mouseleave', () => scheduleHide());
  btn.addEventListener('focus', () => showTooltip(d, btn));
  btn.addEventListener('blur', () => scheduleHide());

  return btn;
}

/* ---------- Tooltip ---------- */
function buildTooltipContent(d) {
  const cats = getCategories(d);
  const catLabels = cats
    .map((c) => (CATEGORIES[c] ? CATEGORIES[c].label : c))
    .join(", ");

  const name = document.createElement("div");
  name.className = "tooltip__name";
  name.textContent = d.name;

  const category = document.createElement("div");
  category.className = "tooltip__category";
  category.textContent = catLabels;

  const teaser = document.createElement("div");
  teaser.className = "tooltip__teaser";
  teaser.textContent = getTeaser(d);

  const link = document.createElement("a");
  link.className = "tooltip__link";
  link.href = getDetailsUrl(d);
  link.textContent = "Read more";
  link.setAttribute("data-destination-id", d.id);

  const frag = document.createDocumentFragment();
  frag.appendChild(name);
  frag.appendChild(category);
  frag.appendChild(teaser);
  frag.appendChild(link);
  return frag;
}

function positionTooltip(marker) {
  const markerRect = marker.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let top = markerRect.bottom + 10;
  let left = markerRect.left + markerRect.width / 2 - tooltipRect.width / 2;
  let placement = "below";

  if (top + tooltipRect.height > viewportH - 8) {
    top = markerRect.top - tooltipRect.height - 10;
    placement = "above";
  }

  if (left < 8) left = 8;
  if (left + tooltipRect.width > viewportW - 8) {
    left = viewportW - tooltipRect.width - 8;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;

  tooltip.classList.remove("tooltip--below", "tooltip--above");
  tooltip.classList.add(`tooltip--${placement}`);
}

function showTooltip(d, marker) {
  clearTimeout(hideTimer);
  hideTimer = null;

  tooltip.classList.remove("visible");
  tooltip.innerHTML = "";
  tooltip.appendChild(buildTooltipContent(d));
  tooltip.setAttribute("aria-hidden", "false");

  tooltip.classList.add("visible");
  activeMarker = marker;

  requestAnimationFrame(() => positionTooltip(marker));
}

function hideTooltip() {
  tooltip.classList.remove("visible");
  tooltip.setAttribute("aria-hidden", "true");
  activeMarker = null;
}

function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!tooltip.matches(":hover")) hideTooltip();
  }, TOOLTIP_HIDE_DELAY);
}

tooltip.addEventListener("mouseenter", () => {
  clearTimeout(hideTimer);
  hideTimer = null;
});

tooltip.addEventListener("mouseleave", () => scheduleHide());

/* ---------- Rendering ---------- */
function renderMarkers() {
  markersLayer.innerHTML = "";
  const offsets = computeOffsets(DESTINATIONS);

  DESTINATIONS.forEach((d) => {
    if (!validateDestination(d)) return;

    const cats = getCategories(d);
    if (activeCategory !== "all" && !cats.includes(activeCategory)) return;

    const offset = offsets.get(d.id) || { dx: 0, dy: 0 };
    markersLayer.appendChild(createMarker(d, offset));
  });
}

/* ---------- Filter buttons ---------- */
function updateFilterButtons() {
  filterBtns.forEach((btn) => {
    const isActive = btn.dataset.category === activeCategory;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category;
    updateFilterButtons();
    renderMarkers();
    hideTooltip();
  });
});

/* ---------- Outside click ---------- */
document.addEventListener("click", (e) => {
  if (
    activeMarker &&
    !activeMarker.contains(e.target) &&
    !tooltip.contains(e.target)
  ) {
    hideTooltip();
  }
});

/* ---------- Resize ---------- */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (activeMarker && tooltip.classList.contains("visible")) {
      positionTooltip(activeMarker);
    }
  }, 150);
});

/* ---------- Image load handling ---------- */
function handleImageError() {
  mapImage.hidden = true;
  mapError.hidden = false;
}

function handleImageLoad() {
  mapImage.hidden = false;
  mapError.hidden = true;
  renderMarkers();
}

mapImage.addEventListener("error", handleImageError);
mapImage.addEventListener("load", handleImageLoad);

if (mapImage.complete) {
  if (mapImage.naturalWidth === 0) handleImageError();
  else handleImageLoad();
}

/* ---------- Init ---------- */
updateFilterButtons();