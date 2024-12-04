// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Handle Authentication State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user);
        localStorage.setItem("isLoggedIn", "true");

        // Load User Details from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("account-name").innerText = userData.fullName;
            document.getElementById("account-email").innerText = userData.email;
            document.getElementById("account-address").innerText = userData.address;
            document.getElementById("account-contact").innerText = userData.contactNumber;
        } else {
            console.log("No user data found!");
        }

        // Load User Orders from Firestore
        const ordersRef = collection(db, "orders");
        const orderQuerySnapshot = await getDocs(ordersRef);
        const ordersContainer = document.getElementById("user-orders");
        orderQuerySnapshot.forEach((doc) => {
            if (doc.data().userId === user.uid) {
                const orderData = doc.data();
                const orderItem = document.createElement("div");
                orderItem.classList.add("order-item");
                orderItem.innerHTML = `
                    <p><strong>Order ID:</strong> ${doc.id}</p>
                    <p><strong>Items:</strong> ${orderData.items}</p>
                    <p><strong>Total Amount:</strong> $${orderData.total}</p>
                    <p><strong>Date:</strong> ${new Date(orderData.timestamp).toLocaleDateString()}</p>
                `;
                ordersContainer.appendChild(orderItem);
            }
        });

    } else {
        console.log("No user is logged in");
        localStorage.removeItem("isLoggedIn");
        window.location.href = "login.html"; // Redirect if user is not logged in
    }
});

// Place Order Function (Assuming the user has selected items in a cart)
document.getElementById("place-order-btn")?.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (user) {
        try {
            const cartItems = getCartItems(); // Replace with your function to get cart items
            const totalAmount = calculateTotal(cartItems); // Replace with your function to calculate total

            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: JSON.stringify(cartItems), // Store items as a JSON string
                total: totalAmount,
                timestamp: Date.now()
            });

            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order: " + error.message);
        }
    } else {
        alert("You must be logged in to place an order!");
    }
});

// Utility Functions
function getCartItems() {
    // This function should retrieve cart items from your application state
    return [
        { name: "Single Sheet", quantity: 1, price: 10 },
        { name: "Bath Towel", quantity: 2, price: 5 }
    ];
}

function calculateTotal(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}


