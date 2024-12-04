// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCtktkGm_uBhNZxf6mAzbSPCxpL8ThK99A",
  authDomain: "ralphstlaundry-10902.firebaseapp.com",
  projectId: "ralphstlaundry-10902",
  storageBucket: "ralphstlaundry-10902.firebasestorage.app",
  messagingSenderId: "273429064875",
  appId: "1:273429064875:web:31a6c99ec3a7a632d25bee",
  measurementId: "G-EJFQ1CXH63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle Sign Up
document.getElementById("sign-up-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Retrieve values from the sign-up form
  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;
  const fullName = document.getElementById("sign-up-full-name").value;
  const address = document.getElementById("sign-up-address").value;
  const contactNumber = document.getElementById("sign-up-contact").value;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // After successful sign-up, store additional user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName,
      address: address,
      contactNumber: contactNumber,
      email: email,
    });

    alert("Sign Up Successful!");
    console.log("User details:", user);
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "Index.html"; // Redirect to homepage after signup
  } catch (error) {
    alert("Error: " + error.message);
    console.error("Sign-up error:", error);
  }
});

// Handle Login
document.getElementById("login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    console.log("User details:", userCredential.user);
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "Index.html"; // Redirect to rental page after login
  } catch (error) {
    alert("Error: " + error.message);
    console.error("Login error:", error);
  }
});

// Handle Sign Out through Hamburger Menu Link
document.getElementById("logout-link")?.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default link action
  try {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn");
    alert("Logged Out Successfully!");
    console.log("Redirecting to login page after logout...");
    window.location.href = "login.html"; // Redirect to login page after logout
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Firebase Authentication State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
    localStorage.setItem("isLoggedIn", "true");
  } else {
    console.log("No user is logged in");
    localStorage.removeItem("isLoggedIn");
  }
});

// Check login status on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn && !window.location.href.includes("login.html") && !window.location.href.includes("signup.html")) {
    // Display a popup message before redirecting
    alert("You must be logged in to access this page. Please log in first.");
    window.location.href = "login.html"; // Redirect to login page if not logged in
  }
});
