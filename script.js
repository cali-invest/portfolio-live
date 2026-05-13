// ===== CONFIG =====
const FILES = [
    "DSI_raw",
    "PORTFOLIO",
    "order_flow",
    "ATC"
    "CMD"
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
        //const res = await fetch(`data/${name}.csv`);
        const res = await fetch(`data/${name}.csv?ts=${Date.now()}`, {
            cache: "no-store"
        });
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

        row.forEach((cell, j) => {
            if (i === 0) {
                // 👉 header căn theo data
                const sample = rows[1]?.[j];
                const isNumber = sample && !isNaN(parseFloat(sample));

                html += `<th class="${isNumber ? 'num' : 'text'}">${cell}</th>`;
            } else {
                const isNumber = !isNaN(parseFloat(cell));

                html += `<td class="${isNumber ? 'num' : 'text'}">${formatCell(cell)}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</table>";

    document.getElementById("content").innerHTML = html;
}

// ===== FORMAT CELL =====
function formatCell(val) {
    if (val.includes("%")) return val
    const num = parseFloat(val);
    return !isNaN(num) ? num.toLocaleString() : val;
}
