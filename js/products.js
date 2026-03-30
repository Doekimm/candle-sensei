// js/products.js
export let products = [];

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    products = await response.json();
    renderProducts(products);
    renderAcademyGrid();
    updateCartCount();
    filterCategory("all");
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Could not load products. Check console.");
  }
}

window.onload = loadProducts;

filteredProducts.forEach((product) => {
  const card = document.createElement("div");
  card.className =
    "product-card rounded-3xl overflow-hidden cursor-pointer shadow-xl";
  card.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover opacity-90">
                <div class="absolute top-4 right-4 flame-gradient px-4 py-1.5 rounded-3xl text-sm font-bold text-white shadow">
                    KES ${product.price.toLocaleString()}
                </div>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-xl mb-2 gold-accent">${product.name}</h3>
                <p class="text-gray-400 text-sm line-clamp-3 mb-4">${product.description}</p>
                <button class="w-full bg-gradient-to-r from-orange-700 to-red-700 text-white py-3 rounded-2xl font-semibold hover:brightness-110 transition-all add-to-cart-btn">
                    Claim This Power
                </button>
            </div>
        `;

  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-to-cart-btn")) {
      showProductModal(product);
    }
  });

  card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product.id);
  });

  grid.appendChild(card);
});

export function filterCategory(cat) {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active", "bg-orange-600", "text-white");
    btn.classList.add("bg-gray-800");
  });

  const activeBtn = Array.from(document.querySelectorAll(".category-btn")).find(
    (btn) => btn.getAttribute("onclick")?.includes(`'${cat}'`),
  );

  if (activeBtn) {
    activeBtn.classList.add("active", "bg-orange-600", "text-white");
    activeBtn.classList.remove("bg-gray-800");
  }

  const filtered =
    cat === "all" ? products : products.filter((p) => p.category === cat);
  renderProducts(filtered);
}
// admin/js/products.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const productsCol = collection(db, "products");

export async function addProduct(name, price, desc, category, imageUrl) {
  try {
    await addDoc(productsCol, {
      name,
      price: Number(price),
      description: desc,
      category,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });
    alert("Product added 🔥");
    loadProducts();
  } catch (e) {
    console.error(e);
  }
}

export async function loadProducts() {
  const snapshot = await getDocs(productsCol);
  const list = document.getElementById("products-table-body");
  list.innerHTML = "";
  snapshot.forEach((d) => {
    const data = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.name}</td>
      <td>KES ${data.price.toLocaleString()}</td>
      <td>${data.category}</td>
      <td><img src="${data.image}" class="w-16 h-16 object-cover rounded"></td>
      <td>
        <button onclick="editProduct('${d.id}')" class="text-orange-400">Edit</button>
        <button onclick="deleteProduct('${d.id}')" class="text-red-400 ml-2">Delete</button>
      </td>
    `;
    list.appendChild(tr);
  });
}
// product.js
let currentProduct = null;

const products = [
  {
    id: 1,
    name: "Cobra Scalper EA",
    price: 299,
    category: "eas",
    desc: "High frequency MT5 EA",
    image: "https://picsum.photos/id/1015/600/400",
  },
  {
    id: 2,
    name: "Gold Killer Indicator",
    price: 149,
    category: "indicators",
    desc: "Advanced XAUUSD indicator",
    image: "https://picsum.photos/id/201/600/400",
  },
  {
    id: 3,
    name: "Kill Zone Strategy Pack",
    price: 89,
    category: "strategies",
    desc: "Complete London & NY strategy",
    image: "https://picsum.photos/id/301/600/400",
  },
];

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = "bg-[#1a1a1a] border border-gray-700 rounded-3xl overflow-hidden cursor-pointer";
        div.innerHTML = `
            <img src="${p.image}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="font-bold text-xl">${p.name}</h3>
                <p class="text-orange-400 text-2xl font-semibold mt-2">$${p.price}</p>
                <button onclick="showProductDetail(${p.id}); event.stopImmediatePropagation()" 
                        class="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-2xl">View Details</button>
            </div>`;
        div.onclick = () => showProductDetail(p.id);
        grid.appendChild(div);
    });
}

function showProductDetail(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    document.getElementById('detailTitle').textContent = currentProduct.name;
    document.getElementById('detailImage').src = currentProduct.image;
    document.getElementById('detailDesc').textContent = currentProduct.desc;
    document.getElementById('detailPrice').textContent = `$${currentProduct.price}`;
    document.getElementById('productDetailModal').classList.remove('hidden');
    document.getElementById('productDetailModal').classList.add('flex');
}

function closeProductDetail() {
    document.getElementById('productDetailModal').classList.remove('flex');
    document.getElementById('productDetailModal').classList.add('hidden');
}

function addCurrentToCart() {
    if (!currentProduct) return;
    cart.push({...currentProduct});
    updateCartCount();
    alert(`${currentProduct.name} added to cart!`);
    closeProductDetail();
}