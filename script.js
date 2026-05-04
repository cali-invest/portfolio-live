// ===== CONFIG =====
const FILES = [
    "PORTFOLIO_raw",
    "DSI_raw"
];

// ===== CACHE =====
const CACHE = {};
const META  = {};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
    await preloadAll();     // 👉 load hết trước
    renderTabs();
    loadTab(FILES[0]);      // 👉 render ngay (không delay)
});

// ===== PRELOAD ALL =====
async function preloadAll() {
    const promises = FILES.map(async (name) => {
        const res = await fetch(`data/${name}.csv`);
        const text = await res.text();
        CACHE[name] = text;

        // 👉 lấy last modified
        const lastModified = res.headers.get("Last-Modified");
        META[name] = lastModified;
    });

    await Promise.all(promises);
}

// ===== RENDER TABS =====
function renderTabs() {
    let html = "";

    FILES.forEach((name) => {
        html += `
            <button class="tab-btn" onclick="loadTab('${name}', this)">
                ${name.toUpperCase()}
            </button>
        `;
    });

    document.getElementById("tabs").innerHTML = html;

    setTimeout(() => {
        const firstBtn = document.querySelector(".tab-btn");
        if (firstBtn) firstBtn.classList.add("active");
    }, 0);
}

// ===== LOAD TAB (NO FETCH) =====
function loadTab(name, btn = null) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    renderCSV(CACHE[name]); // 👉 dùng cache

    // 👉 hiển thị last modified
    const lm = META[name];
    if (lm) {
        const dt = new Date(lm);
        document.getElementById("last-updated").innerText =
            "Updated: " + dt.toLocaleString();
    } else {
        document.getElementById("last-updated").innerText = "";
    }

}

// ===== RENDER TABLE =====
function renderCSV(csv) {
    const rows = csv.trim().split("\n").map(r => r.split(","));

    let html = "<table>";

    rows.forEach((row, i) => {
        html += "<tr>";

        row.forEach(cell => {
            if (i === 0) {
                html += `<th>${cell}</th>`;
            } else {
                html += `<td>${formatCell(cell)}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</table>";

    document.getElementById("content").innerHTML = html;
}

// ===== FORMAT CELL =====
function formatCell(val) {
    const num = parseFloat(val);
    return !isNaN(num) ? num.toLocaleString() : val;
}
