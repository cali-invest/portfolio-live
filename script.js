// ===== CONFIG =====
const FILES = [
    "PORTFOLIO_raw",
    "DSI_raw"
];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    renderTabs();
    loadTab(FILES[0]); // load tab đầu tiên
});

// ===== RENDER TABS =====
function renderTabs() {
    let html = "";

    FILES.forEach((name, index) => {
        html += `
            <button class="tab-btn" onclick="loadTab('${name}', this)">
                ${name.toUpperCase()}
            </button>
        `;
    });

    document.getElementById("tabs").innerHTML = html;

    // active tab đầu tiên
    setTimeout(() => {
        const firstBtn = document.querySelector(".tab-btn");
        if (firstBtn) firstBtn.classList.add("active");
    }, 0);
}

// ===== LOAD CSV =====
async function loadTab(name, btn = null) {
    try {
        // highlight active tab
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");

        const res = await fetch(`data/${name}.csv`);
        //const res = await fetch(`data/${name}.csv?v=${Date.now()}`);
        const text = await res.text();

        renderCSV(text);

    } catch (err) {
        document.getElementById("content").innerHTML = `<p>❌ Load lỗi: ${name}</p>`;
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
    const now = new Date();
    document.getElementById("last-updated").innerText =
        "Last updated: " + now.toLocaleString();
}

// ===== FORMAT CELL =====
function formatCell(val) {
    // number format
    const num = parseFloat(val);

    if (!isNaN(num)) {
        return num.toLocaleString();
    }

    return val;
}
