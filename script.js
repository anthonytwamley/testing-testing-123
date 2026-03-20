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

function seasonText(plant) {
  const items = [];
  if (plant.interest_spring) items.push("Spring");
  if (plant.interest_summer) items.push("Summer");
  if (plant.interest_autumn) items.push("Autumn");
  if (plant.interest_winter) items.push("Winter");
  return items;
}

function makeBadge(text, group, empty = false) {
  const span = document.createElement("span");
  span.className = `badge badge-${group}${empty ? " empty-badge" : ""}`;
  span.textContent = text;
  return span;
}

function addBadges(container, labels, group) {
  container.innerHTML = "";
  if (!labels.length) {
    container.appendChild(makeBadge("—", group, true));
    return;
  }
  labels.forEach((label) => container.appendChild(makeBadge(label, group)));
}

function tokensFromField(value) {
  if (!value) return [];
  return String(value).split(";").map(v => v.trim()).filter(Boolean);
}

function getAspectBadges(plant) {
  return [["north","North"],["east","East"],["south","South"],["west","West"]]
    .filter(([key]) => plant[key])
    .map(([,label]) => label);
}

function getSoilBadges(plant) {
  return [["clay","Clay"],["loam","Loam"],["sand","Sand"],["chalk","Chalk"]]
    .filter(([key]) => plant[key])
    .map(([,label]) => label);
}

function getPhBadges(plant) {
  return [["acid","Acid"],["neutral","Neutral"],["alkaline","Alkaline"]]
    .filter(([key]) => plant[key])
    .map(([,label]) => label);
}

function getLightBadges(plant) {
  return [["full_sun","Full sun"],["partial_shade","Partial shade"],["full_shade","Full shade"]]
    .filter(([key]) => plant[key])
    .map(([,label]) => label);
}

function getExtraBadges(plant) {
  const labels = [];
  if (plant.deciduous) labels.push("Deciduous");
  if (plant.evergreen) labels.push("Evergreen");
  if (plant.semi_evergreen) labels.push("Semi-evergreen");
  if (plant.wildlife) labels.push("Wildlife value");
  if (plant.low_maintenance) labels.push("Low maintenance");
  if (plant.moderate_maintenance) labels.push("Moderate maintenance");
  if (plant.high_maintenance) labels.push("High maintenance");
  return labels;
}

function getUseBadges(plant) {
  return [
    ["flower_border_bed","Flower border / bed"],
    ["ground_cover","Ground cover"],
    ["hedging","Hedging"],
    ["screen","Screen"],
    ["planter_patio_container","Planter / patio / container"],
    ["bank_slope","Bank / slope"],
    ["climber","Climber"]
  ].filter(([key]) => plant[key]).map(([,label]) => label);
}

function matchesTokenField(value, selected) {
  if (!selected) return true;
  if (!value) return false;
  const terms = tokensFromField(value).map(v => v.toLowerCase());
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

    for (const [filterId, key] of boolFilters) {
      if (el(filterId).checked && !plant[key]) return false;
    }
    return true;
  });

  renderPlants(filtered);
}

function renderPlants(list) {
  const results = el("results");
  const count = el("resultsCount");
  results.innerHTML = "";
  count.textContent = `${list.length} plant${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = "No plants match the current filters.";
    results.appendChild(div);
    return;
  }

  const template = el("plantCardTemplate");

  list.forEach((plant) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".latin-name").textContent = plant.latin_name || "";
    node.querySelector(".common-name").textContent = plant.english_name || "";
    node.querySelector(".type-badge").textContent = plant.plant_type || "";
    node.querySelector(".height").textContent = plant.height_m ? `${plant.height_m} m` : "—";
    node.querySelector(".spread").textContent = plant.spread_m ? `${plant.spread_m} m` : "—";
    node.querySelector(".colour").textContent = plant.colour || "—";
    node.querySelector(".feature").textContent = plant.feature || "—";

    addBadges(node.querySelector(".light-badges"), getLightBadges(plant), "light");
    addBadges(node.querySelector(".aspect-badges"), getAspectBadges(plant), "aspect");
    addBadges(node.querySelector(".soil-badges"), getSoilBadges(plant), "soil");
    addBadges(node.querySelector(".ph-badges"), getPhBadges(plant), "ph");
    addBadges(node.querySelector(".season-badges"), seasonText(plant), "season");
    addBadges(node.querySelector(".extra-badges"), getExtraBadges(plant), "extra");
    addBadges(node.querySelector(".use-badges"), getUseBadges(plant), "use");

    results.appendChild(node);
  });
}

function wireEvents() {
  document.querySelectorAll("input, select").forEach((control) => {
    control.addEventListener("input", filterPlants);
    control.addEventListener("change", filterPlants);
  });
  el("resetBtn").addEventListener("click", () => {
    document.querySelectorAll("input[type='checkbox']").forEach(cb => { cb.checked = false; });
    document.querySelectorAll("select").forEach(sel => { sel.value = ""; });
    el("searchInput").value = "";
    filterPlants();
  });
}

fetch("plants.json")
  .then((response) => response.json())
  .then((data) => {
    plants = data;

    populateSelect("typeFilter", [...new Set(plants.map(p => p.plant_type).filter(Boolean))].sort((a,b) => a.localeCompare(b)));
    populateSelect("colourFilter", uniqueTermsFromField("colour"));
    populateSelect("featureFilter", uniqueTermsFromField("feature"));

    wireEvents();
    filterPlants();
  })
  .catch((error) => {
    console.error(error);
    el("resultsCount").textContent = "Could not load plant data.";
  });
