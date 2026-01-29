let PLANTS = [];

function parseBand(value) {
  // "30-60" -> [30,60]
  const [a, b] = value.split("-").map(n => Number(n));
  return [a, b];
}

function overlaps(minA, maxA, minB, maxB) {
  // overlap check between [minA,maxA] and [minB,maxB]
  return !(maxA < minB || maxB < minA);
}

function includesOrAny(arr, value) {
  if (!value) return true;
  if (!Array.isArray(arr)) return false;
  return arr.includes(value);
}

function matchesStringField(fieldValue, selected) {
  if (!selected) return true;
  return fieldValue === selected;
}

function matchesArrayField(arrayValue, selected) {
  if (!selected) return true;
  return includesOrAny(arrayValue, selected);
}

function filterPlants() {
  const plantType = document.getElementById("plantType").value;
  const sunlight = document.getElementById("sunlight").value;
  const aspect = document.getElementById("aspect").value;
  const soilTexture = document.getElementById("soilTexture").value;
  const ph = document.getElementById("ph").value;
  const situation = document.getElementById("situation").value;
  const characteristics = document.getElementById("characteristics").value;
  const season = document.getElementById("season").value;
  const feature = document.getElementById("feature").value;
  const colour = document.getElementById("colour").value;
  const heightBand = document.getElementById("heightBand").value;
  const spreadBand = document.getElementById("spreadBand").value;

  const filtered = PLANTS.filter(p => {
    if (plantType && p.plant_type !== plantType) return false;

    if (!matchesArrayField(p.sunlight, sunlight)) return false;
    if (!matchesArrayField(p.aspect, aspect)) return false;
    if (!matchesArrayField(p.soil_texture, soilTexture)) return false;
    if (!matchesArrayField(p.ph, ph)) return false;

    if (!matchesArrayField(p.situation, situation)) return false;
    if (!matchesArrayField(p.characteristics, characteristics)) return false;
    if (!matchesArrayField(p.season_interest, season)) return false;
    if (!matchesArrayField(p.features, feature)) return false;
    if (!matchesArrayField(p.colours, colour)) return false;

    if (heightBand) {
      const [minB, maxB] = parseBand(heightBand);
      if (!overlaps(p.height_min_cm, p.height_max_cm, minB, maxB)) return false;
    }

    if (spreadBand) {
      const [minB, maxB] = parseBand(spreadBand);
      if (!overlaps(p.spread_min_cm, p.spread_max_cm, minB, maxB)) return false;
    }

    return true;
  });

  renderResults(filtered);
}

function renderResults(list) {
  const results = document.getElementById("results");
  const count = document.getElementById("count");
  count.textContent = `${list.length} plant(s) match`;

  results.innerHTML = "";

  if (list.length === 0) {
    results.innerHTML = `<div class="card">No matches. Try widening a filter.</div>`;
    return;
  }

  list
    .sort((a, b) => a.botanical_name.localeCompare(b.botanical_name))
    .forEach(p => {
      const pills = [
        p.plant_type,
        ...(p.sunlight || []),
        ...(p.ph || [])
      ].slice(0, 6);

      const pillHtml = pills.map(x => `<span class="pill">${x.replaceAll("_"," ")}</span>`).join("");

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div style="font-weight:700;">${p.botanical_name}</div>
        <div class="meta">${p.common_name || ""}</div>
        <div class="meta">Height: ${p.height_min_cm}–${p.height_max_cm} cm | Spread: ${p.spread_min_cm}–${p.spread_max_cm} cm</div>
        <div style="margin-top:6px;">${pillHtml}</div>
      `;
      results.appendChild(div);
    });
}

function attachListeners() {
  document.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", filterPlants);
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    document.querySelectorAll("select").forEach(sel => (sel.value = ""));
    filterPlants();
  });
}

async function init() {
  const res = await fetch("plants.json");
  PLANTS = await res.json();
  attachListeners();
  filterPlants();
}

init().catch(err => {
  document.getElementById("results").innerHTML =
    `<div class="card">Error loading plants.json. If running locally, use a simple local server or open via GitHub Pages.<br><br><code>${err}</code></div>`;
});
