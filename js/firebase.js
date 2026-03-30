// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// Add other imports later (auth, firestore, storage) as needed

export const firebaseConfig = {
  apiKey: "AIzaSyD599Ac1y_4AzkrFqY4cYrKNF4kupYQHnM",
  authDomain: "candle-sensei.firebaseapp.com",
  projectId: "candle-sensei",
  storageBucket: "candle-sensei.firebasestorage.app",
  messagingSenderId: "281164401480",
  appId: "1:281164401480:web:ecf86614b5d8890e23417d",
  measurementId: "G-Z0WHW3LCWF",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// You can export other services later, e.g.
// export { getAuth } from "firebase/auth";
