// ---------------- Stock Dashboard ----------------
const stockApiKey = "EZVKWNIWWLG7FG62"; // Alpha Vantage API key
let currentSymbol = "ASML";
let stockChart;
let lastStockFetch = 0;
const searchCooldown = 15000; // 15 seconds cooldown

function fetchStockPrice(symbol) {
  const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockApiKey}`;

  fetch(priceUrl)
    .then(res => res.json())
    .then(data => {
      const quote = data["Global Quote"];
      if (!quote || Object.keys(quote).length === 0) {
        document.getElementById("stock-price").textContent = "Not Found";
        document.getElementById("stock-change").textContent = "--";
        document.getElementById("stock-change-percent").textContent = "--";
        // show fallback time if available
        document.getElementById("last-updated").textContent = "Data not available";
        return;
      }

      const price = parseFloat(quote["05. price"]);
      const change = parseFloat(quote["09. change"]);
      const changePercent = quote["10. change percent"];

      document.getElementById("stock-symbol-title").textContent = `${symbol.toUpperCase()} Price`;
      document.getElementById("stock-price").textContent = isNaN(price) ? "--" : `$${price.toFixed(2)}`;

      // --- use API-provided date (GLOBAL_QUOTE usually has only the trading day) ---
      const lastUpdatedEl = document.getElementById("last-updated");
      if (quote["07. latest trading day"]) {
        // GLOBAL_QUOTE returns a date like "2025-09-12" — show that and note it's market date
        lastUpdatedEl.textContent = `${quote["07. latest trading day"]} (market date)`;
      } else {
        // fallback: use client time if API gives no date
        lastUpdatedEl.textContent = new Date().toLocaleString();
      }

      const changeElem = document.getElementById("stock-change");
      const percentElem = document.getElementById("stock-change-percent");

      if (!isNaN(change)) {
        if (change >= 0) {
          changeElem.innerHTML = `<span class="text-success"><i class="bi bi-arrow-up"></i> +${change.toFixed(2)}</span>`;
          percentElem.className = "badge bg-success";
        } else {
          changeElem.innerHTML = `<span class="text-danger"><i class="bi bi-arrow-down"></i> ${change.toFixed(2)}</span>`;
          percentElem.className = "badge bg-danger";
        }
        percentElem.textContent = changePercent || "--";
      } else {
        changeElem.textContent = "--";
        percentElem.textContent = "--";
        percentElem.className = "badge bg-secondary";
      }
    })
    .catch(err => {
      console.error("Error fetching stock price:", err);
      document.getElementById("stock-price").textContent = "Error";
      document.getElementById("last-updated").textContent = "Error";
    });
}

function fetchStockHistory(symbol) {
  const historyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${stockApiKey}`;

  fetch(historyUrl)
    .then(res => res.json())
    .then(data => {
      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) return;

      // get the most recent trading date provided by the API
      const allDates = Object.keys(timeSeries);
      const latestDate = allDates.length ? allDates[0] : null;
      if (latestDate) {
        const formattedDate = new Date(latestDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        document.getElementById("last-updated").textContent = `As of ${formattedDate} (last market close)`;
      }


      const dates = allDates.slice(0, 10).reverse(); // last 10 days, oldest->newest
      const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

      const ctx = document.getElementById("stockChart").getContext("2d");
      if (stockChart) stockChart.destroy();

      stockChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [{
            label: `${symbol.toUpperCase()} Closing Price`,
            data: prices,
            borderColor: "rgb(13, 110, 253)",
            backgroundColor: "rgba(13, 110, 253, 0.2)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "white",
            pointBorderColor: "rgb(13, 110, 253)",
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true }
          },
          scales: {
            y: { ticks: { callback: value => `$${value}` } }
          }
        }
      });
    })
    .catch(err => console.error("Error fetching stock history:", err));
}

function updateMarketStatus() {
  const now = new Date();

  // Convert to US Eastern Time
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = est.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = est.getHours();
  const minutes = est.getMinutes();

  const statusEl = document.getElementById("market-status");

  if (day === 0 || day === 6) {
    // Weekend
    statusEl.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill"></i> Closed</span>`;
  } else if (hours > 9 || (hours === 9 && minutes >= 30)) {
    if (hours < 16) {
      statusEl.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill"></i> Open</span>`;
    } else {
      statusEl.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill"></i> Closed</span>`;
    }
  } else {
    statusEl.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill"></i> Closed</span>`;
  }
}

// Run once on page load and update every minute
updateMarketStatus();
setInterval(updateMarketStatus, 60000);



// ---------------- Search Handler with Cooldown ----------------
document.getElementById("stock-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const now = Date.now();
  if (now - lastStockFetch < searchCooldown) {
    alert(`Please wait ${searchCooldown / 1000} seconds between searches.`);
    return;
  }
  lastStockFetch = now;

  const input = document.getElementById("stock-input").value.trim();
  if (input) {
    currentSymbol = input.toUpperCase();
    fetchStockPrice(currentSymbol);
    fetchStockHistory(currentSymbol);
  }
});

// ---------------- Initial Load ----------------
fetchStockPrice(currentSymbol);
fetchStockHistory(currentSymbol);

// ---------------- Refresh stock price every 60s ----------------
setInterval(() => fetchStockPrice(currentSymbol), 60000);
