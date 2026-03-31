// admin.js

const firebaseConfig = {
  apiKey: "AIzaSyD599Ac1y_4AzkrFqY4cYrKNF4kupYQHnM",
  authDomain: "candle-sensei.firebaseapp.com",
  projectId: "candle-sensei",
  storageBucket: "candle-sensei.firebasestorage.app",
  messagingSenderId: "281164401480",
  appId: "1:281164401480:web:ecf86614b5d8890e23417d",
  measurementId: "G-Z0WHW3LCWF",
};

// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase initialized successfully");

console.log("Firebase initialized successfully");

let currentEditingId = null;

window.login = async () => {
  console.log("Login button clicked!");
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  if (!email || !pass) {
    alert("Enter email + password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    console.log("Sign-in SUCCESS! User:", userCredential.user.uid);
  } catch (e) {
    console.error("Sign-in ERROR:", e.code, e.message);
    alert("Login failed: " + (e.message || "Check console."));
  }
};

// Explicit button hooking to avoid inline event issues
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.login();
  });
} else {
  console.warn(
    "Missing #login-btn, fallback to onclick login() might still work.",
  );
}

window.logout = () => {
  signOut(auth);
  console.log("Logged out");
};

onAuthStateChanged(auth, (user) => {
  console.log(
    "onAuthStateChanged fired → user is:",
    user ? "LOGGED IN" : "NOT logged in",
    user?.email || "",
  );
  if (user) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadProducts();
  } else {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("dashboard").classList.add("hidden");
  }
});

// Load products
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  const tbody = document.getElementById("productsTable");
  tbody.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const p = docSnap.data();
    const tr = document.createElement("tr");
    tr.className = "border-t border-gray-800";
    tr.innerHTML = `
      <td class="p-6"><img src="${p.image || "https://picsum.photos/80"}" class="w-16 h-16 object-cover rounded-xl"></td>
      <td class="p-6 font-semibold">${p.name}</td>
      <td class="p-6">KES ${p.price.toLocaleString()}</td>
      <td class="p-6">${p.category}</td>
      <td class="p-6 text-center">
        <button onclick="editProduct('${docSnap.id}')" class="text-orange-400 mr-4">Edit</button>
        <button onclick="deleteProduct('${docSnap.id}')" class="text-red-500">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.showAddModal = () => {
  currentEditingId = null;
  document.getElementById("modalTitle").textContent = "Add New Product";
  document.getElementById("prodName").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodCategory").value = "";
  document.getElementById("prodDesc").value = "";
  document.getElementById("productModal").classList.remove("hidden");
};

window.closeModal = () => {
  document.getElementById("productModal").classList.add("hidden");
};

window.saveProduct = async () => {
  const name = document.getElementById("prodName").value.trim();
  const price = Number(document.getElementById("prodPrice").value);
  const category = document.getElementById("prodCategory").value.trim();
  const desc = document.getElementById("prodDesc").value.trim();
  const fileInput = document.getElementById("prodImage");
  const file = fileInput.files[0];
  if (file) {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, `products/${fileName}`); // ← ref comes from the import above

    console.log("Uploading file...");
    const uploadSnapshot = await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(uploadSnapshot.ref);
    console.log("File uploaded! URL:", imageUrl);
  }

  if (!name || !price || isNaN(price)) {
    alert("Name and valid price required!");
    return;
  }

  let imageUrl = "https://picsum.photos/id/1005/600/600"; // fallback

  try {
    if (file) {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const storageRef = ref(storage, `products/${fileName}`);

      console.log("Uploading file...");
      const uploadSnapshot = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(uploadSnapshot.ref);
      console.log("File uploaded! URL:", imageUrl);
    }

    const productData = {
      name,
      price,
      category,
      description: desc,
      image: imageUrl,
      updatedAt: serverTimestamp(),
    };

    if (currentEditingId) {
      await updateDoc(doc(db, "products", currentEditingId), productData);
      console.log("Product updated:", currentEditingId);
    } else {
      productData.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("New product added:", docRef.id);
    }

    closeModal();
    loadProducts();
    fileInput.value = ""; // clear file input
    alert("Product saved successfully! 🔥");
  } catch (e) {
    console.error("Save error:", e);
    alert("Error saving: " + e.message);
  }
};

window.editProduct = async (id) => {
  currentEditingId = id;
  document.getElementById("modalTitle").textContent = "Edit Product";

  try {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) {
      alert("Product not found");
      return;
    }
    const p = snap.data();
    document.getElementById("prodName").value = p.name || "";
    document.getElementById("prodPrice").value = p.price || "";
    document.getElementById("prodCategory").value = p.category || "";
    document.getElementById("prodDesc").value = p.description || "";
    document.getElementById("productModal").classList.remove("hidden");
  } catch (e) {
    console.error("Edit load error:", e);
    alert("Error loading product data: " + (e.message || e));
  }
};

window.deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
    alert("Product deleted 🚮");
  } catch (e) {
    console.error("Delete error:", e);
    alert("Error deleting product: " + (e.message || e));
  }
};

window.loadProducts = loadProducts;
