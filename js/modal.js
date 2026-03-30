// modal.js - All modal open/close functions

console.log("%c✅ modal.js loaded successfully", "color:#22c55e");

// ====================== SAGE MODALS ======================
function openTheSage() {
  const modal = document.getElementById("theSageModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    console.log("Sage modal opened");
  } else {
    console.error("theSageModal not found in HTML");
  }
}

function closeTheSage() {
  const modal = document.getElementById("theSageModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function openEAOptions() {
  closeTheSage();
  const modal = document.getElementById("eaOptionsModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    showTab(0);
  }
}

function closeEAOptionsModal() {
  const modal = document.getElementById("eaOptionsModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function openIndicatorBuilder() {
  closeTheSage();
  const modal = document.getElementById("indicatorBuilderModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeIndicatorBuilderModal() {
  const modal = document.getElementById("indicatorBuilderModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}
// modal.js - Checkout flow

function showOrderSummary() {
  const container = document.getElementById("summaryItems");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "flex justify-between py-2";
    div.innerHTML = `<span>${item.name}</span><span>$${item.price}</span>`;
    container.appendChild(div);
  });
  document.getElementById("summaryTotal").textContent = `$${total}`;
  document.getElementById("orderSummaryModal").classList.remove("hidden");
  document.getElementById("orderSummaryModal").classList.add("flex");
}

function showEmailModal() {
  document.getElementById("orderSummaryModal").classList.add("hidden");
  document.getElementById("emailModal").classList.remove("hidden");
  document.getElementById("emailModal").classList.add("flex");
}

function sendOrderToTelegram() {
  const email =
    document.getElementById("customerEmail").value.trim() ||
    "customer@example.com";
  let message = "🛒 *New Order from Candle Sensei!*\n\n";
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    message += `• ${item.name} - $${item.price}\n`;
  });
  message += `\nTotal: $${total}\nEmail: ${email}\n\nPlease send payment details.`;

  const encoded = encodeURIComponent(message);
  window.open(`https://t.me/yourtelegramusername?text=${encoded}`, "_blank"); // Change to your real Telegram username

  alert("✅ Order sent to Telegram!\nCheck your Telegram for confirmation.");
  cart = [];
  updateCartCount();
  document.getElementById("emailModal").classList.add("hidden");
}

// ====================== OTHER MODALS ======================
function openSenseiAcademy() {
  const modal = document.getElementById("academyModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else {
    alert("Sensei Academy opened");
  }
}

function closeAcademyModal() {
  const modal = document.getElementById("academyModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function openMarketAnalysis() {
  closeTheSage();
  const modal = document.getElementById("marketAnalysisModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeMarketAnalysisModal() {
  const modal = document.getElementById("marketAnalysisModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function openAutomatedTrading() {
  closeTheSage();
  const modal = document.getElementById("autoTradingModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeAutoTradingModal() {
  const modal = document.getElementById("autoTradingModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function openSignalGeneration() {
  closeTheSage();
  const modal = document.getElementById("signalModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeSignalModal() {
  const modal = document.getElementById("signalModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

// ====================== TAB HANDLER ======================
function showTab(tabIndex) {
  document
    .querySelectorAll('#eaOptionsModal > div > div[id^="content"]')
    .forEach((c) => c.classList.add("hidden"));
  const content = document.getElementById("content" + tabIndex);
  if (content) content.classList.remove("hidden");

  document
    .querySelectorAll('#eaOptionsModal button[id^="tab"]')
    .forEach((b) => b.classList.remove("border-b-4", "border-amber-400"));
  const tabBtn = document.getElementById("tab" + tabIndex);
  if (tabBtn) tabBtn.classList.add("border-b-4", "border-amber-400");
}

// ====================== PRODUCT MODAL ======================
let currentProduct = null;

function showProductModal(product) {
  currentProduct = product;
  const modal = document.getElementById("productModal");
  if (modal) {
    document.getElementById("modalImage").innerHTML =
      `<img src="${product.image}" class="w-full h-full object-cover">`;
    document.getElementById("modalTitle").textContent = product.name;
    document.getElementById("modalPrice").textContent =
      `KES ${product.price.toLocaleString()}`;
    document.getElementById("modalDescription").textContent =
      product.description;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

function addCurrentToCart() {
  if (currentProduct) {
    addToCart(currentProduct.id); // This function should be in cart.js
    closeModal();
  }
}
// modal.js - Full EA Builder and Indicator Builder

// EA Builder Form & Logic
function createEA() {
  const name = document.getElementById("eaName").value.trim() || "My Custom EA";
  const strategy = document.getElementById("eaStrategy").value;
  const indicators = Array.from(
    document.querySelectorAll("#indicatorCheckboxes input:checked"),
  )
    .map((i) => i.value)
    .join(" + ");
  const sl = document.getElementById("sl").value;
  const tp = document.getElementById("tp").value;
  const risk = document.getElementById("risk").value;

  const code = `// =============================================
// Candle Sensei EA Builder
// Name: ${name}
// Strategy: ${strategy}
// Indicators: ${indicators}
// SL: ${sl} pips | TP: ${tp} pips | Risk: ${risk}%
// Generated: ${new Date().toLocaleString()}
// =============================================

#property copyright "Candle Sensei"
input double RiskPercent = ${risk};
input int StopLoss = ${sl};
input int TakeProfit = ${tp};

void OnTick() {
    // Custom logic based on your selected indicators
    Comment("Candle Sensei EA is running - ${name}");
}`;

  // Save to My EAs
  myEAs.push({
    name: name,
    version: `MQL${currentMQL}`,
    date: new Date().toLocaleDateString(),
    code: code,
  });

  localStorage.setItem("myEAs", JSON.stringify(myEAs));

  alert(`✅ ${name} created and saved to My EA!`);
  closeEAOptionsModal();
  setTimeout(() => openEAOptions(), 300); // refresh My EA tab
}

// Indicator Builder
function generateIndicatorCode() {
  const name = document.getElementById("indName").value || "Custom Indicator";
  const type = document.getElementById("indType").value;
  const period = document.getElementById("period").value;
  const color = document.getElementById("lineColor").value;

  const code = `// =============================================
// Candle Sensei Custom Indicator
// Name: ${name}
// Type: ${type} | Period: ${period}
// =============================================

#property copyright "Candle Sensei"
#property indicator_chart_window
#property indicator_buffers 1
#property indicator_color1 ${color}

double Buffer1[];

int OnInit() {
    SetIndexBuffer(0, Buffer1);
    SetIndexStyle(0, DRAW_LINE);
    SetIndexLabel(0, "${name}");
    return(INIT_SUCCEEDED);
}

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[], const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[]) {
    for(int i = 0; i < rates_total; i++) {
        Buffer1[i] = close[i]; // Replace with real logic later
    }
    return(rates_total);
}`;

  document.getElementById("indPreviewCode").textContent = code;
}

function copyIndicatorCode() {
  const code = document.getElementById("indPreviewCode").textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert("✅ Indicator code copied to clipboard!");
  });
}
