const POSITION_ORDER = {
  prefer: 0,
  acceptable: 1,
  accjuly: 2,
  weak: 3,
  wanting: 4,
  evaluating: 5,
  deficient: 6,
  no: 7,
  unknown: 8,
  "": 9
};

const POSITION_LABELS = {
  prefer: "Prefer",
  acceptable: "Acceptable",
  weak: "Weak",
  wanting: "Wanting",
  evaluating: "Evaluating",
  deficient: "Deficient",
  accjuly: "Acc. until July",
  no: "No",
  unknown: "Unknown"
};

function badge(value, label) {
  if (!value) return '<span class="badge badge-empty">—</span>';
  const text = label || POSITION_LABELS[value] || value;
  return `<span class="badge badge-${value}">${text}</span>`;
}

function posCell(value) {
  const cls = value ? `pos-${value}` : "pos-empty";
  const text = value ? (POSITION_LABELS[value] || value) : "—";
  return `<td class="pos-cell ${cls}">${text}</td>`;
}

function sourceLink(source) {
  if (!source) return '<span class="badge badge-empty">—</span>';
  return `<a class="source-link" href="${source.url}" target="_blank" rel="noopener">${source.label}</a>`;
}

function renderDeveloperRow(d) {
  return `<tr data-name="${d.name.toLowerCase()}" data-bip110="${d.bip110}">
    <td class="name-col">${d.name}</td>
    <td>${d.aff || "—"}</td>
    ${posCell(d.segwit)}
    ${posCell(d.bip141)}
    ${posCell(d.bip148)}
    ${posCell(d.bip149)}
    ${posCell(d.bip91)}
    ${posCell(d.segwit2x)}
    ${posCell(d.bip110)}
    <td>${sourceLink(d.source)}</td>
  </tr>`;
}

function renderBusinessRow(b) {
  return `<tr data-name="${b.name.toLowerCase()}" data-bip110="${b.bip110}">
    <td class="name-col">${b.name}</td>
    <td>${b.aff || "—"}</td>
    ${posCell(b.segwit)}
    ${posCell(b.bip141)}
    ${posCell(b.bip148)}
    ${posCell(b.bip149)}
    ${posCell(b.bip91)}
    ${posCell(b.segwit2x)}
    ${posCell(b.bip110)}
    <td>${sourceLink(b.source)}</td>
  </tr>`;
}

function renderInfluencerRow(i) {
  return `<tr data-name="${i.name.toLowerCase()}" data-bip110="${i.bip110}">
    <td class="name-col">${i.name}</td>
    <td>${i.handle || "—"}</td>
    ${posCell(i.bip110)}
    <td>${i.notes}</td>
    <td>${sourceLink(i.source)}</td>
  </tr>`;
}

function populateTables() {
  document.getElementById("developers-body").innerHTML = DEVELOPERS.map(renderDeveloperRow).join("");
  document.getElementById("businesses-body").innerHTML = BUSINESSES.map(renderBusinessRow).join("");
  document.getElementById("influencers-body").innerHTML = INFLUENCERS.map(renderInfluencerRow).join("");
}

function applyFilters() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const bip110Filter = document.getElementById("bip110-filter").value;
  const tableFilter = document.getElementById("table-filter").value;

  document.querySelectorAll(".table-section").forEach((section) => {
    const type = section.dataset.table;
    const showSection = tableFilter === "all" || tableFilter === type;
    section.style.display = showSection ? "" : "none";
  });

  document.querySelectorAll("#developers-body tr, #businesses-body tr, #influencers-body tr").forEach((row) => {
    const name = row.dataset.name || "";
    const bip110 = row.dataset.bip110 || "";
    const matchName = !query || name.includes(query);
    const matchBip110 = !bip110Filter || bip110 === bip110Filter;
    row.classList.toggle("hidden", !(matchName && matchBip110));
  });
}

function setupSorting() {
  document.querySelectorAll(".data-table.sortable").forEach((table) => {
    table.querySelectorAll("thead th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden)"));
        const asc = !th.classList.contains("sorted-asc");

        table.querySelectorAll("thead th").forEach((h) => h.classList.remove("sorted-asc", "sorted-desc"));
        th.classList.add(asc ? "sorted-asc" : "sorted-desc");

        const dataKey = key;
        const dataArray =
          table.id === "developers-table" ? DEVELOPERS :
          table.id === "influencers-table" ? INFLUENCERS :
          BUSINESSES;

        rows.sort((a, b) => {
          const nameA = a.cells[0].textContent;
          const nameB = b.cells[0].textContent;
          const itemA = dataArray.find((x) => x.name === nameA);
          const itemB = dataArray.find((x) => x.name === nameB);
          if (!itemA || !itemB) return 0;

          let valA = itemA[dataKey] ?? "";
          let valB = itemB[dataKey] ?? "";

          if (dataKey !== "name" && dataKey !== "aff" && dataKey !== "handle") {
            valA = POSITION_ORDER[valA] ?? 9;
            valB = POSITION_ORDER[valB] ?? 9;
          } else {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
          }

          if (valA < valB) return asc ? -1 : 1;
          if (valA > valB) return asc ? 1 : -1;
          return 0;
        });

        rows.forEach((row) => tbody.appendChild(row));
      });
    });
  });
}

async function fetchLiveStats() {
  try {
    const res = await fetch("https://bip110monitor.com/api");
    const data = await res.json();
    document.getElementById("stat-pct").textContent = `${data.pct.toFixed(2)}%`;
    document.getElementById("stat-count").textContent = `${data.signalingCount} / ${data.totalBlocks}`;
    document.getElementById("stat-blocks").textContent =
      `Period ${data.periodNum} · tip block ${data.chainTip}`;
  } catch {
    document.getElementById("stat-pct").textContent = "N/A";
    document.getElementById("stat-count").textContent = "—";
    document.getElementById("stat-blocks").textContent = "Could not fetch live data";
  }
}

function startApp() {
  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("bip110-filter").addEventListener("change", applyFilters);
  document.getElementById("table-filter").addEventListener("change", applyFilters);

  populateTables();
  setupSorting();
  fetchLiveStats();
}

function loadDataThenStart() {
  const script = document.createElement("script");
  script.src = "scripts/bip-110-economic-support-data.js?v=20260608";
  script.onload = startApp;
  script.onerror = () => {
    document.querySelectorAll("#developers-body, #businesses-body, #influencers-body").forEach((tbody) => {
      tbody.innerHTML = '<tr><td colspan="10">Could not load table data.</td></tr>';
    });
  };
  document.head.appendChild(script);
}

if (typeof DEVELOPERS !== "undefined") {
  startApp();
} else {
  loadDataThenStart();
}
