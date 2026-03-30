// js/ui.js
export function showToast(msg) {
  const t = document.createElement("div");
  t.style.cssText =
    "position:fixed; bottom:32px; left:50%; transform:translateX(-50%); background:#1a1a1a; color:#ff6b35; padding:16px 32px; border-radius:999px; border:1px solid #ff6b35; box-shadow:0 10px 30px rgba(255,107,53,0.3); z-index:9999; display:flex; align-items:center; gap:12px; font-weight:600;";
  t.innerHTML = `<i class="fa-solid fa-fire"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}
function filterCategory(cat) {
  alert(`Filtered: ${cat}`);
}
function openTheSage() {
  document.getElementById("theSageModal").classList.remove("hidden");
}

function closeTheSage() {
  document.getElementById("theSageModal").classList.add("hidden");
}
