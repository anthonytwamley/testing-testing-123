let plants = [];

const el = (id) => document.getElementById(id);

const boolFilters = [
  ["fullSunFilter", "full_sun"],
  ["partialShadeFilter", "partial_shade"],
  ["fullShadeFilter", "full_shade"],
  ["northFilter", "north"],
  ["eastFilter", "east"],
  ["southFilter", "south"],
  ["westFilter", "west"],
  ["clayFilter", "clay"],
  ["loamFilter", "loam"],
  ["sandFilter", "sand"],
  ["chalkFilter", "chalk"],
  ["acidFilter", "acid"],
  ["neutralFilter", "neutral"],
  ["alkalineFilter", "alkaline"],
  ["springFilter", "interest_spring"],
  ["summerFilter", "interest_summer"],
  ["autumnFilter", "interest_autumn"],
  ["winterFilter", "interest_winter"],
  ["wildlifeFilter", "wildlife"],
  ["deciduousFilter", "deciduous"],
  ["evergreenFilter", "evergreen"],
  ["semiEvergreenFilter", "semi_evergreen"],
  ["lowMaintenanceFilter", "low_maintenance"],
  ["moderateMaintenanceFilter", "moderate_maintenance"],
  ["highMaintenanceFilter", "high_maintenance"],
  ["flowerBorderBedFilter", "flower_border_bed"],
  ["groundCoverFilter", "ground_cover"],
  ["hedgingFilter", "hedging"],
  ["screenFilter", "screen"],
  ["planterFilter", "planter_patio_container"],
  ["bankSlopeFilter", "bank_slope"],
  ["climberFilter", "climber"]
];

function uniqueTermsFromField(field) {
  const set = new Set();
  plants.forEach((plant) => {
    const value = plant[field];
    if (!value) return;
    String(value).split(";").map(v => v.trim()).filter(Boolean).forEach(v => set.add(v));
  });
  return [...set].sort((a,b) => a.localeCompare(b));
}

function populateSelect(selectId, values) {
  const select = el(selectId);
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function makeBadge(label, group) {
  return `<span class="chip chip-${group}">${label}</span>`;
}

function imageBlock(plant) {
  if (plant.image && String(plant.image).trim()) {
    return `
      <figure class="plant-img-wrap">
        <img src="${plant.image}" alt="${plant.latin_name}" class="plant-img" loading="lazy" onerror="this.closest('.plant-img-wrap').outerHTML='<div class=&quot;plant-img-placeholder&quot;>Image unavailable</div>';">
      </figure>
    `;
  }
  return `<div class="plant-img-placeholder">No image added yet</div>`;
}

function matchesTokenField(value, selected) {
  if (!selected) return true;
  if (!value) return false;
  const terms = String(value).split(";").map(v => v.trim().toLowerCase());
  return terms.includes(selected.toLowerCase());
}

function filterPlants() {
  const q = el("searchInput").value.trim().toLowerCase();
  const type = el("typeFilter").value;
  const colour = el("colourFilter").value;
  const feature = el("featureFilter").value;

  const filtered = plants.filter((plant) => {
    if (q) {
      const hay = `${plant.latin_name || ""} ${plant.english_name || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (type && plant.plant_type !== type) return false;
    if (!matchesTokenField(plant.colour, colour)) return false;
    if (!matchesTokenField(plant.feature, feature)) return false;

    for (const [inputId, field] of boolFilters) {
      if (el(inputId).checked && !plant[field]) return false;
    }
    return true;
  });

  renderPlants(filtered);
}

function renderPlants(filtered) {
  const count = el("resultCount");
  const grid = el("resultsGrid");
  count.textContent = `${filtered.length} plant${filtered.length === 1 ? "" : "s"} found`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">No plants match the current filters.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((plant) => {
    const lightBadges = [];
    if (plant.full_sun) lightBadges.push(makeBadge("Full sun", "light"));
    if (plant.partial_shade) lightBadges.push(makeBadge("Partial shade", "light"));
    if (plant.full_shade) lightBadges.push(makeBadge("Full shade", "light"));

    const aspectBadges = [];
    if (plant.north) aspectBadges.push(makeBadge("North", "aspect"));
    if (plant.east) aspectBadges.push(makeBadge("East", "aspect"));
    if (plant.south) aspectBadges.push(makeBadge("South", "aspect"));
    if (plant.west) aspectBadges.push(makeBadge("West", "aspect"));

    const soilBadges = [];
    if (plant.clay) soilBadges.push(makeBadge("Clay", "soil"));
    if (plant.loam) soilBadges.push(makeBadge("Loam", "soil"));
    if (plant.sand) soilBadges.push(makeBadge("Sand", "soil"));
    if (plant.chalk) soilBadges.push(makeBadge("Chalk", "soil"));

    const phBadges = [];
    if (plant.acid) phBadges.push(makeBadge("Acid", "ph"));
    if (plant.neutral) phBadges.push(makeBadge("Neutral", "ph"));
    if (plant.alkaline) phBadges.push(makeBadge("Alkaline", "ph"));

    const seasonBadges = [];
    if (plant.interest_spring) seasonBadges.push(makeBadge("Spring", "season"));
    if (plant.interest_summer) seasonBadges.push(makeBadge("Summer", "season"));
    if (plant.interest_autumn) seasonBadges.push(makeBadge("Autumn", "season"));
    if (plant.interest_winter) seasonBadges.push(makeBadge("Winter", "season"));

    const useBadges = [];
    if (plant.flower_border_bed) useBadges.push(makeBadge("Border/bed", "use"));
    if (plant.ground_cover) useBadges.push(makeBadge("Ground cover", "use"));
    if (plant.hedging) useBadges.push(makeBadge("Hedging", "use"));
    if (plant.screen) useBadges.push(makeBadge("Screen", "use"));
    if (plant.planter_patio_container) useBadges.push(makeBadge("Patio/container", "use"));
    if (plant.bank_slope) useBadges.push(makeBadge("Bank/slope", "use"));
    if (plant.climber) useBadges.push(makeBadge("Climber", "use"));

    const otherBadges = [];
    if (plant.deciduous) otherBadges.push(makeBadge("Deciduous", "other"));
    if (plant.evergreen) otherBadges.push(makeBadge("Evergreen", "other"));
    if (plant.semi_evergreen) otherBadges.push(makeBadge("Semi-evergreen", "other"));
    if (plant.wildlife) otherBadges.push(makeBadge("Wildlife value", "other"));
    if (plant.low_maintenance) otherBadges.push(makeBadge("Low maintenance", "other"));
    if (plant.moderate_maintenance) otherBadges.push(makeBadge("Moderate maintenance", "other"));
    if (plant.high_maintenance) otherBadges.push(makeBadge("High maintenance", "other"));

    return `
      <article class="plant-card">
        ${imageBlock(plant)}
        <div class="plant-card-content">
          <div class="card-head">
            <div>
              <h3 class="latin-name">${plant.latin_name}</h3>
              <p class="common-name">${plant.english_name || ""}</p>
            </div>
            <span class="type-badge">${plant.plant_type || ""}</span>
          </div>

          <div class="meta-grid">
            <div><span class="label">Height:</span> ${plant.height_m ?? ""} m</div>
            <div><span class="label">Spread:</span> ${plant.spread_m ?? ""} m</div>
            <div><span class="label">Colour:</span> ${plant.colour || ""}</div>
            <div><span class="label">Feature:</span> ${plant.feature || ""}</div>
          </div>

          ${lightBadges.length ? `<div><span class="label">Light</span><div class="chips">${lightBadges.join("")}</div></div>` : ""}
          ${aspectBadges.length ? `<div><span class="label">Aspect</span><div class="chips">${aspectBadges.join("")}</div></div>` : ""}
          ${soilBadges.length ? `<div><span class="label">Soil</span><div class="chips">${soilBadges.join("")}</div></div>` : ""}
          ${phBadges.length ? `<div><span class="label">pH</span><div class="chips">${phBadges.join("")}</div></div>` : ""}
          ${seasonBadges.length ? `<div><span class="label">Season of interest</span><div class="chips">${seasonBadges.join("")}</div></div>` : ""}
          ${useBadges.length ? `<div><span class="label">Uses</span><div class="chips">${useBadges.join("")}</div></div>` : ""}
          ${otherBadges.length ? `<div><span class="label">Other</span><div class="chips">${otherBadges.join("")}</div></div>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function resetFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
  document.querySelectorAll('select').forEach(s => s.value = "");
  el("searchInput").value = "";
  filterPlants();
}

fetch("plants.json")
  .then((res) => res.json())
  .then((data) => {
    plants = data;
    populateSelect("typeFilter", [...new Set(plants.map(p => p.plant_type).filter(Boolean))].sort());
    populateSelect("colourFilter", uniqueTermsFromField("colour"));
    populateSelect("featureFilter", uniqueTermsFromField("feature"));
    filterPlants();

    el("searchInput").addEventListener("input", filterPlants);
    document.querySelectorAll("select, input[type='checkbox']").forEach((node) => {
      if (node.id !== "searchInput") node.addEventListener("change", filterPlants);
    });
    el("resetBtn").addEventListener("click", resetFilters);
  });
