// auth.js - User authentication

function openAuthModal() {
  document.getElementById("authModal").classList.remove("hidden");
  document.getElementById("authModal").classList.add("flex");
  document.getElementById("authTitle").textContent = "Login to Candle Sensei";
  document.getElementById("authButton").textContent = "LOGIN";
  document.getElementById("authToggleText").textContent =
    "Don't have an account? ";
}

function closeAuthModal() {
  document.getElementById("authModal").classList.remove("flex");
  document.getElementById("authModal").classList.add("hidden");
}

let currentUser = null;
let isLoginMode = true;

function openAuthModal() {
  document.getElementById("authModal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function toggleAuthMode() {
  isLoginMode = !isLoginMode;

  document.getElementById("authTitle").textContent = isLoginMode
    ? "Login"
    : "Register";
}

function handleAuth() {
  const email = document.getElementById("authEmail").value.trim();

  if (!email) return alert("Enter email");

  currentUser = { email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert(`Welcome ${email}`);
}

function handleAuth() {
  const email = document.getElementById("authEmail").value.trim();
  if (!email) return alert("Please enter email");

  currentUser = { email: email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  closeAuthModal();
  alert(`✅ Welcome, ${email.split("@")[0]}! You are now logged in.`);
  openDashboard();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  closeDashboard();
  alert("Logged out successfully.");
}

function updateLoginButton() {
  const text = document.getElementById("loginText");
  if (text)
    text.textContent = currentUser ? currentUser.email.split("@")[0] : "Login";
}
// auth.js - Real Firebase Authentication

// Login / Register
function openAuthModal() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  if (!email || !password) return;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email: currentUser.email, uid: currentUser.uid }),
      );
      alert("✅ Logged in successfully as " + currentUser.email);
      updateLoginButton();
      openDashboard();
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        // Auto register if user doesn't exist
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            currentUser = userCredential.user;
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                email: currentUser.email,
                uid: currentUser.uid,
              }),
            );
            alert("✅ Account created and logged in!");
            updateLoginButton();
            openDashboard();
          })
          .catch((err) => alert("Registration failed: " + err.message));
      } else {
        alert("Login failed: " + error.message);
      }
    });
}

function logout() {
  auth.signOut().then(() => {
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("Logged out successfully.");
    updateLoginButton();
  });
}

function updateLoginButton() {
  const text = document.getElementById("loginText");
  if (text) {
    text.textContent = currentUser ? currentUser.email.split("@")[0] : "Login";
  }
}

// Load saved user on start
function loadUser() {
  const saved = localStorage.getItem("currentUser");
  if (saved) currentUser = JSON.parse(saved);
}

loadUser();
