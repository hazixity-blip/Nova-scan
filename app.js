// Nova-Scan prototype interactions.
// This simulates the app experience described in the pitch deck.
// No real spectral hardware is involved — results are drawn from a
// small demo dataset so the flow can be explored end to end.

const RESULTS = [
  {
    verdict: "green",
    label: "Pure",
    name: "Turmeric — matches baseline",
    desc: "Spectral signature aligns with your saved pure sample within tolerance.",
    wavelength: "±0.4nm",
  },
  {
    verdict: "yellow",
    label: "Substandard",
    name: "Milk — diluted",
    desc: "Composition suggests added water beyond acceptable range. Not hazardous, but under-strength.",
    wavelength: "+6.2nm shift",
  },
  {
    verdict: "red",
    label: "Adulterated",
    name: "Metanil Yellow detected",
    desc: "Prohibited industrial dye, not approved for human consumption. Neurotoxic with repeated exposure.",
    wavelength: "+14.8nm shift",
    hazard: "metanil",
  },
  {
    verdict: "red",
    label: "Adulterated",
    name: "Argemone Oil detected",
    desc: "Common mustard-oil adulterant linked to Epidemic Dropsy. Do not consume this sample.",
    wavelength: "+11.3nm shift",
    hazard: "argemone",
  },
];

const HAZARDS = {
  metanil: {
    name: "Metanil Yellow",
    found: "Pulses, turmeric, food colouring",
    who: "Prohibited industrial dye",
    impact: "Neurotoxic — linked to brain damage and stunted growth in children.",
  },
  argemone: {
    name: "Argemone Oil",
    found: "Adulterated mustard oil",
    who: "Causes Epidemic Dropsy",
    impact: "Can lead to heart failure, permanent blindness, multi-organ failure.",
  },
  mineral: {
    name: "Mineral Oil",
    found: "Black pepper, cooking oils",
    who: "WHO Group 1 Carcinogen",
    impact: "Liver and spleen damage, gastrointestinal cancers.",
  },
};

const MAP_PINS = [
  { x: 22, y: 30, verdict: "green", label: "Sector 12 market — Purity 82" },
  { x: 68, y: 22, verdict: "red", label: "Chandni Chowk stall #4 — Adulterated turmeric" },
  { x: 44, y: 55, verdict: "yellow", label: "Lajpat Nagar dairy — Diluted milk" },
  { x: 78, y: 68, verdict: "red", label: "Sadar Bazaar — Argemone oil flagged" },
  { x: 30, y: 75, verdict: "green", label: "Green Park co-op — Purity 91" },
];

let lastResult = RESULTS[0];
let currentScreen = "scan";
const screenEl = document.getElementById("phoneScreen");
const navButtons = document.querySelectorAll(".phone__nav button");

function setScreen(name) {
  currentScreen = name;
  navButtons.forEach((b) => b.classList.toggle("active", b.dataset.screen === name));
  render();
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => setScreen(btn.dataset.screen));
});

document.querySelectorAll('[data-action="try-scan"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("phone").scrollIntoView({ behavior: "smooth", block: "center" });
    setScreen("scan");
  });
});

function render() {
  if (currentScreen === "scan") renderScan();
  else if (currentScreen === "report") renderReport();
  else if (currentScreen === "learn") renderLearn();
  else if (currentScreen === "map") renderMap();
}

function renderScan(scanning = false, locked = false) {
  screenEl.innerHTML = `
    <div class="scr">
      <p class="scr__label">Live scan</p>
      <h2 class="scr__title">Point at a sample</h2>
      <div class="viewfinder ${locked ? "viewfinder--locked" : ""}">
        <div class="viewfinder__spectrum"></div>
        <div class="viewfinder__grid"></div>
        <div class="viewfinder__reticle"></div>
        ${!locked ? '<div class="viewfinder__scanline"></div>' : ""}
      </div>
      <div class="readout">
        <span>MODE: DIFFRACTION</span>
        <span>${scanning ? "READING…" : locked ? "LOCKED" : "READY"}</span>
      </div>
      <button class="scan-btn" id="scanBtn" ${scanning ? "disabled" : ""}>
        ${scanning ? "Scanning…" : "Scan sample"}
      </button>
    </div>
  `;
  document.getElementById("scanBtn").addEventListener("click", runScan);
}

function runScan() {
  renderScan(true, false);
  setTimeout(() => {
    lastResult = RESULTS[Math.floor(Math.random() * RESULTS.length)];
    renderVerdict();
  }, 1400);
}

function renderVerdict() {
  const r = lastResult;
  screenEl.innerHTML = `
    <div class="scr">
      <p class="scr__label">Result</p>
      <div class="verdict verdict--${r.verdict}">
        <span class="verdict__tag"><span class="verdict__light"></span>${r.label}</span>
        <span class="verdict__name">${r.name}</span>
        <p class="verdict__desc">${r.desc}</p>
        <p class="verdict__desc" style="font-family:var(--font-mono); font-size:0.7rem;">Spectral shift: ${r.wavelength}</p>
        <div class="verdict__actions">
          ${r.verdict === "red" ? '<button class="primary" id="toReport">Report vendor</button>' : ""}
          ${r.hazard ? '<button id="toLearn">Health info</button>' : '<button id="toScanAgain">Scan again</button>'}
        </div>
      </div>
    </div>
  `;
  const toReport = document.getElementById("toReport");
  const toLearn = document.getElementById("toLearn");
  const again = document.getElementById("toScanAgain");
  if (toReport) toReport.addEventListener("click", () => setScreen("report"));
  if (toLearn) toLearn.addEventListener("click", () => setScreen("learn"));
  if (again) again.addEventListener("click", () => renderScan());
}

function renderReport() {
  const r = lastResult;
  const isRed = r.verdict === "red";
  screenEl.innerHTML = `
    <div class="scr">
      <p class="scr__label">Whistleblower report</p>
      <h2 class="scr__title">${isRed ? "Evidence captured" : "No active alert"}</h2>
      ${
        isRed
          ? `
        <div class="evidence-list">
          <div class="evidence-item"><span>Spectral signature</span><span>saved</span></div>
          <div class="evidence-item"><span>GPS coordinates</span><span>28.65°N, 77.23°E</span></div>
          <div class="evidence-item"><span>Vendor ID</span><span>photo pending</span></div>
          <div class="evidence-item"><span>Identity</span><span>anonymous</span></div>
        </div>
        <button class="submit-btn" id="submitReport">Submit to FSSAI</button>
        <p class="submit-note">Your identity is never shared with the vendor.</p>
      `
          : `<p style="color:var(--text-on-dark-muted); font-size:0.85rem;">Scan a sample first — reporting unlocks automatically on a red verdict.</p>
             <button class="scan-btn" id="goScan" style="margin-top:16px;">Go to scan</button>`
      }
    </div>
  `;
  const submitBtn = document.getElementById("submitReport");
  const goScan = document.getElementById("goScan");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      submitBtn.textContent = "Submitted ✓";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
    });
  }
  if (goScan) goScan.addEventListener("click", () => setScreen("scan"));
}

function renderLearn() {
  const activeHazardKey = lastResult.hazard;
  const keys = Object.keys(HAZARDS);
  screenEl.innerHTML = `
    <div class="scr">
      <p class="scr__label">Medical &amp; hazard intelligence</p>
      <h2 class="scr__title">What you're up against</h2>
      <div style="overflow-y:auto;">
        ${keys
          .map((k) => {
            const h = HAZARDS[k];
            const active = k === activeHazardKey;
            return `
            <div class="hazard-card" style="${active ? "border:1px solid var(--red);" : ""}">
              <h4>${h.name}</h4>
              <p>Found in: ${h.found}</p>
              <p>${h.impact}</p>
              <span class="who">${h.who}</span>
            </div>`;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderMap() {
  screenEl.innerHTML = `
    <div class="scr">
      <p class="scr__label">Community risk map</p>
      <h2 class="scr__title">Nearby scans, last 48h</h2>
      <div class="map-canvas" id="mapCanvas">
        <div class="map-canvas__grid"></div>
        ${MAP_PINS.map(
          (p, i) => `<div class="pin pin--${p.verdict}" style="left:${p.x}%; top:${p.y}%;" data-i="${i}"></div>`
        ).join("")}
        <div class="pin-tooltip" id="pinTooltip"></div>
      </div>
      <dl class="score-row">
        <div><dt>78</dt></div>
        <dd>Aggregate purity score for markets within 2km, from resident scans</dd>
      </dl>
    </div>
  `;
  const tooltip = document.getElementById("pinTooltip");
  document.querySelectorAll(".pin").forEach((pin) => {
    pin.addEventListener("click", () => {
      const p = MAP_PINS[+pin.dataset.i];
      tooltip.textContent = p.label;
      tooltip.style.left = pin.style.left;
      tooltip.style.top = pin.style.top;
      tooltip.classList.add("show");
      setTimeout(() => tooltip.classList.remove("show"), 2200);
    });
  });
}

render();
