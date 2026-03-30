// utils.js
// ====================== LIVE TICKER ======================
let livePrices = {
  XAUUSD: 2658.4,
  EURUSD: 1.0854,
  GBPUSD: 1.3128,
  USDJPY: 151.45,
};

function updateLiveTicker() {
  const ticker = document.getElementById("liveTicker");
  if (!ticker) return;

  let html = "";
  Object.keys(livePrices).forEach((pair) => {
    html += `
        <div class="flex items-center gap-2 live-price">
            <span class="font-bold">${pair}</span>
            <span class="font-mono text-emerald-400">${livePrices[pair]}</span>
        </div>`;
  });

  ticker.innerHTML = html;
}

setInterval(() => {
  Object.keys(livePrices).forEach((p) => {
    livePrices[p] = parseFloat(
      (
        livePrices[p] +
        (Math.random() - 0.48) * (p === "XAUUSD" ? 1.2 : 0.002)
      ).toFixed(p === "XAUUSD" ? 2 : 4),
    );
  });
  updateLiveTicker();
}, 8000);
