let data = {};

async function loadData() {
    data = await fetch('data.json').then(r => r.json());
    showTab('overview');
}

function showTab(tab) {
    let html = "";

    if (tab === "overview") {
        html = `
            <h3>Overview</h3>
            <p>NAV: ${data.overview.nav}</p>
            <p>Profit: ${data.overview.profit}</p>
        `;
    }

    if (tab === "holdings") {
        html = "<h3>Holdings</h3><ul>";
        data.holdings.forEach(h => {
            html += `<li>${h.symbol} - ${h.qty} shares</li>`;
        });
        html += "</ul>";
    }

    if (tab === "trades") {
        html = "<h3>Trades</h3><ul>";
        data.trades.forEach(t => {
            html += `<li>${t.date} - ${t.action} ${t.symbol}</li>`;
        });
        html += "</ul>";
    }

    document.getElementById("content").innerHTML = html;
}

loadData();
