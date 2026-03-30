// cart.js - Complete Cart Logic for Candle Sensei

// Global cart array

// Update cart count badge in navbar
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = count;
}

// Add product to cart
function addToCart(id) {
  const product = products.find((p) => p.id === id); // 'products' must be defined in main file
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  renderCartItems();
  showToast(`${product.name} added to your arsenal! 🔥`);
}

// Render items inside cart sidebar
function renderCartItems() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 py-16">Your dojo is empty, Sensei...</p>`;
    document.getElementById("cartTotal").textContent = "KES 0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item flex gap-5 bg-gray-800/50 p-4 rounded-2xl";
    div.innerHTML = `
            <img src="${item.image}" class="w-20 h-20 object-cover rounded-xl">
            <div class="flex-1">
                <div class="flex justify-between mb-1">
                    <h4 class="font-semibold gold-accent">${item.name}</h4>
                    <button onclick="removeFromCart(${index})" class="text-red-400 text-sm">Remove</button>
                </div>
                <p class="text-orange-400 font-medium">KES ${item.price.toLocaleString()}</p>
                <div class="flex items-center gap-4 mt-3">
                    <button onclick="changeQuantity(${index}, -1)" class="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-orange-300 hover:bg-gray-700">-</button>
                    <span class="font-mono w-8 text-center">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" class="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-orange-300 hover:bg-gray-700">+</button>
                </div>
            </div>
            <div class="font-bold gold-accent self-end">KES ${subtotal.toLocaleString()}</div>
        `;
    container.appendChild(div);
  });

  document.getElementById("cartTotal").textContent =
    `KES ${total.toLocaleString()}`;
}

// Change item quantity
function changeQuantity(index, delta) {
  cart[index].quantity = Math.max(1, cart[index].quantity + delta);
  renderCartItems();
  updateCartCount();
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCartItems();
  updateCartCount();
}

// Show cart sidebar
function showCart() {
  const sidebar = document.getElementById("cartSidebar");
  if (sidebar) sidebar.classList.remove("translate-x-full");
  renderCartItems();
}

// Hide cart sidebar
function hideCart() {
  const sidebar = document.getElementById("cartSidebar");
  if (sidebar) sidebar.classList.add("translate-x-full");
}

// === CHECKOUT FLOW ===
function checkout() {
  if (cart.length === 0) return;

  let message = "🛒 New Order Placed!\n\n";
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    message += `• ${item.name} × ${item.quantity} = KES ${subtotal}\n`;
  });

  message += `\nTotal: KES ${total}\n\n`;
  message += "Please choose your payment method:\n";
  message += "1. M-Pesa\n";
  message += "2. PayPal\n";
  message += "3. Bank Transfer\n\n";
  message += "Reply with the number of your choice.";

  const encodedMessage = encodeURIComponent(message);
  window.open(`${telegramLink}?text=${encodedMessage}`, "_blank");

  alert(
    "✅ Order sent to Telegram Bot!\n\nThe bot will ask for payment method.",
  );

  // Clear cart
  cart = [];
  hideCart();
  updateCartCount();
  renderCartItems();
}

// Order Summary Modal
function showOrderSummary() {
  const summaryItems = document.getElementById("summaryItems");
  summaryItems.innerHTML = "";

  if (cart.length === 0) return;

  let total = 0;
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center bg-gray-800/50 p-4 rounded-xl";
    div.innerHTML = `
            <div>
                <p class="font-semibold gold-accent">${item.name}</p>
                <p class="text-sm text-gray-400">KES ${item.price.toLocaleString()} × ${item.quantity}</p>
            </div>
            <p class="font-bold gold-accent">KES ${subtotal.toLocaleString()}</p>
        `;
    summaryItems.appendChild(div);
  });

  document.getElementById("summaryTotal").textContent =
    `KES ${total.toLocaleString()}`;
  document.getElementById("orderSummaryModal").classList.remove("hidden");
}

function closeOrderSummary() {
  document.getElementById("orderSummaryModal").classList.add("hidden");
}

function proceedToEmail() {
  closeOrderSummary();
  document.getElementById("emailModal").classList.remove("hidden");
}

function closeEmailModal() {
  document.getElementById("emailModal").classList.add("hidden");
}

// Confirm order and send to Telegram
function confirmOrder() {
  const email = document.getElementById("buyerEmail").value.trim();
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address!");
    return;
  }

  // Build order message
  let message = `New Order!\n\nCustomer Email: ${email}\n\nItems:\n`;
  cart.forEach((item) => {
    message += `- ${item.name} (KES ${item.price} × ${item.quantity})\n`;
  });
  message += `\nTotal: ${document.getElementById("cartTotal").textContent}\n\nPlease send files to ${email}`;

  // YOUR TELEGRAM LINK (change this)
  const telegramLink = "https://t.me/CandleSensei_bot"; // ← REPLACE WITH YOUR REAL TELEGRAM LINK
  const encodedMessage = encodeURIComponent(message);
  window.open(`${telegramLink}?text=${encodedMessage}`, "_blank");

  // Success message
  alert(
    `Order sent successfully! 🎉\n\nFiles will be delivered to ${email} shortly.\nThank you for shopping with Candle Sensei!`,
  );

  // Clear cart & close modals
  cart = [];
  closeEmailModal();
  hideCart();
  updateCartCount();
  renderCartItems();
}

// Toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed; bottom:32px; left:50%; transform:translateX(-50%); background:#1a1a1a; color:#ff6b35; padding:16px 32px; border-radius:999px; border:1px solid #ff6b35; box-shadow:0 10px 30px rgba(255,107,53,0.3); z-index:9999; display:flex; align-items:center; gap:12px; font-weight:600;";
  toast.innerHTML = `<i class="fa-solid fa-fire"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}
// cart.js
let cart = [];

function addCurrentToCart() {
    if (!currentProduct) return;
    cart.push({...currentProduct});
    updateCartCount();
    alert(`${currentProduct.name} added to cart!`);
    closeProductDetail();
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = cart.length;
}

function showCart() {
    if (cart.length === 0) return alert("Your cart is empty");
    showOrderSummary();
}

function proceedToCheckout() {
    if (cart.length === 0) return alert("Cart is empty");
    showOrderSummary();
}
function renderCartItems() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "flex justify-between p-4";

    div.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price}</span>
            <button onclick="removeFromCart(${index})">X</button>
        `;

    container.appendChild(div);
  });

  document.getElementById("cartTotal").textContent = `$${total}`;
}
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCartItems();
}

// Make all functions globally available for onclick handlers
window.addToCart = addToCart;
window.showCart = showCart;
window.hideCart = hideCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.closeOrderSummary = closeOrderSummary;
window.proceedToEmail = proceedToEmail;
window.closeEmailModal = closeEmailModal;
window.confirmOrder = confirmOrder;
