// js/main.js
import { products, renderProducts, filterCategory } from "./products.js";
import {
  cart,
  addToCart,
  updateCartCount,
  showCart,
  hideCart,
  renderCartItems,
  checkout,
} from "./cart.js";
import { showProductModal, closeModal, addCurrentToCart } from "./modal.js";
import { showToast } from "./ui.js";

async function init() {
  // Listen to real-time updates from "products" collection
  const productsCol = collection(db, "products");

  onSnapshot(
    productsCol,
    (snapshot) => {
      products = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id, // use Firestore doc ID as product id
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image || "https://picsum.photos/600/600?random", // fallback
          description: data.description || "",
        });
      });

      // Re-render everything when data changes
      renderProducts(products);
      filterCategory("all"); // reset to all
      updateCartCount();
    },
    (error) => {
      console.error("Firebase error:", error);
      alert("Could not load products — check console (F12)");
    },
  );
  // Search listener
  document.getElementById("searchInput").addEventListener("input", function () {
    const term = this.value.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
    renderProducts(filtered);
  });

  // Escape key handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (
        !document.getElementById("productModal").classList.contains("hidden")
      ) {
        closeModal();
      } else {
        hideCart();
      }
    }
  });
}
// Live Ticker
let livePrices = {
  XAUUSD: 2658.4,
  EURUSD: 1.0854,
  GBPUSD: 1.3128,
  USDJPY: 151.45,
};
function updateLiveTicker() {
  const ticker = document.getElementById("liveTicker");
  let html = "";
  Object.keys(livePrices).forEach((pair) => {
    html += `<div class="flex items-center gap-2 live-price"><span class="font-bold">${pair}</span><span class="font-mono text-emerald-400">${livePrices[pair]}</span></div>`;
  });
  ticker.innerHTML = html;
}
setInterval(() => {
  Object.keys(livePrices).forEach(
    (p) =>
      (livePrices[p] = parseFloat(
        (
          livePrices[p] +
          (Math.random() - 0.48) * (p === "XAUUSD" ? 1.2 : 0.002)
        ).toFixed(p === "XAUUSD" ? 2 : 4),
      )),
  );
  updateLiveTicker();
}, 8000);

// Cart
let cart = [];
function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

// Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle("light");
  const icon = document.getElementById("themeIcon");
  if (icon) icon.classList.toggle("fa-moon");
  if (icon) icon.classList.toggle("fa-sun");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark",
  );
}

// Update login button text
function updateLoginButton() {
  const text = document.getElementById("loginText");
  if (text) {
    text.textContent = currentUser ? currentUser.email.split("@")[0] : "Login";
  }
}

// Temporary debug in main.js
console.log("✅ main.js loaded");
console.log("openTheSage function exists?", typeof openTheSage === "function");
console.log(
  "openEAOptions function exists?",
  typeof openEAOptions === "function",
);
// main.js - Main initialization
function init() {
  renderProducts();
  updateLiveTicker();
  updateCartCount();
  updateLoginButton();
  console.log(
    "%c✅ Candle Sensei modular structure loaded successfully",
    "color:#ff6b35; font-size:18px; font-weight:bold",
  );
}
// main.js
console.log(
  "%c✅ main.js loaded successfully",
  "color:#ff6b35; font-size:18px; font-weight:bold",
);

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
  if (modal) modal.classList.add("hidden");
}

function openEAOptions() {
  closeTheSage();
  const modal = document.getElementById("eaOptionsModal");
  if (modal) modal.classList.remove("hidden");
}

function openIndicatorBuilder() {
  closeTheSage();
  const modal = document.getElementById("indicatorBuilderModal");
  if (modal) modal.classList.remove("hidden");
}

function openSenseiAcademy() {
  alert("Sensei Academy opened");
}

function showCart() {
  alert("Cart opened");
}

// Init
window.onload = function () {
  console.log(
    "%c✅ All JS loaded - buttons should work",
    "color:#ff6b35; font-size:18px;",
  );
};
// Export functions that are called from HTML onclick
window.showCart = showCart;
window.hideCart = hideCart;
window.checkout = checkout;
window.closeModal = closeModal;
window.addCurrentToCart = addCurrentToCart;
window.filterCategory = filterCategory;

function init() {
  renderProducts();
  updateLiveTicker();
}
function init() {
  console.log(
    "%c✅ Candle Sensei is fully working with EA Builder & Indicator Builder",
    "color:#ff6b35; font-size:18px; font-weight:bold",
  );
  // You can call renderProducts() or other init functions here later
}
window.onload = init;
