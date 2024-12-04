// Cart Functionality
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () => cart.classList.add("active");
closeCart.onclick = () => cart.classList.remove("active");

document.addEventListener("DOMContentLoaded", function () {
    const addCartButtons = document.querySelectorAll(".add-cart");

    addCartButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const product = event.target.closest(".product");
            const title = product.querySelector(".product-title").innerText;
            const price = product.querySelector(".price").innerText;
            const productImg = product.querySelector(".product-img").src;
            addProductToCart(title, price, productImg);
            saveProductToDatabase(title, 1, parseFloat(price.replace("$", ""))); // Save product to Firestore with initial quantity 1 and price
        });
    });

    document.querySelector(".btn-buy").addEventListener("click", () => {
        if (document.querySelector(".cart-content").childElementCount === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
        }
        alert("Order placed successfully!");
        document.querySelector(".cart-content").innerHTML = "";
        updateTotal();
    });

    // Check login status when accessing rental.html
    //checkLoginStatus();
});

function addProductToCart(title, price, img) {
    const cartItems = document.querySelector(".cart-content");
    const existingItems = cartItems.getElementsByClassName("cart-product-title");

    for (let i = 0; i < existingItems.length; i++) {
        if (existingItems[i].innerText === title) {
            alert("Item already added to the cart!");
            return;
        }
    }

    const item = document.createElement("div");
    item.classList.add("cart-box");
    item.innerHTML = `
        <img src="${img}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity" min="1">
        </div>
        <i class="fa-solid fa-trash cart-remove"></i>
    `;
    cartItems.appendChild(item);

    // Add event listeners to remove button and quantity input
    item.querySelector(".cart-remove").addEventListener("click", function () {
        item.remove();
        removeProductFromDatabase(title); // Remove product from Firestore
        updateTotal();
    });

    item.querySelector(".cart-quantity").addEventListener("change", function (e) {
        if (e.target.value <= 0) {
            e.target.value = 1;
        }
        updateTotal();
        updateProductQuantityInDatabase(title, parseInt(e.target.value)); // Update quantity in Firestore
    });

    updateTotal();
}

function updateTotal() {
    const cartItems = document.querySelectorAll(".cart-box");
    let total = 0;
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector(".cart-price").innerText.replace("$", ""));
        const quantity = parseInt(item.querySelector(".cart-quantity").value);
        total += price * quantity;
    });
    document.querySelector(".total-price").innerText = `$${total.toFixed(2)}`;
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtktkGm_uBhNZxf6mAzbSPCxpL8ThK99A",
    authDomain: "ralphstlaundry-10902.firebaseapp.com",
    projectId: "ralphstlaundry-10902",
    storageBucket: "ralphstlaundry-10902.appspot.com",
    messagingSenderId: "273429064875",
    appId: "1:273429064875:web:31a6c99ec3a7a632d25bee",
    measurementId: "G-EJFQ1CXH63"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();  // Reference to Firestore

// Function to save product to Firestore
async function saveProductToDatabase(title, quantity, price) {
    try {
        console.log("Attempting to save product to Firestore:", title, quantity, price);
        const snapshot = await db.collection('linenhire').where('name', '==', title).get();
        if (snapshot.empty) {
            console.log("No existing record found for product, adding new document...");
            await db.collection('linenhire').add({
                name: title,
                quantity: quantity,
                price: price,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp() // Add timestamp
            });
            console.log("Product added to Firestore");
        } else {
            console.log("Product already exists, updating quantity...");
            for (const doc of snapshot.docs) {
                await doc.ref.update({
                    quantity: doc.data().quantity + quantity,
                    price: price,
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp() // Update timestamp
                });
            }
            console.log("Product quantity updated in Firestore");
        }
    } catch (error) {
        console.error("Error adding/updating product in Firestore: ", error);
    }
}

// Function to update product quantity in Firestore
async function updateProductQuantityInDatabase(title, quantity) {
    try {
        console.log("Attempting to update product quantity in Firestore:", title, quantity);
        const snapshot = await db.collection('linenhire').where('name', '==', title).get();
        if (!snapshot.empty) {
            console.log("Updating product quantity...");
            for (const doc of snapshot.docs) {
                await doc.ref.update({
                    quantity: quantity,
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp() // Update timestamp
                });
            }
            console.log("Product quantity updated in Firestore");
        }
    } catch (error) {
        console.error("Error updating product quantity in Firestore: ", error);
    }
}

// Function to remove product from Firestore
async function removeProductFromDatabase(title) {
    try {
        console.log("Attempting to remove product from Firestore:", title);
        const snapshot = await db.collection('linenhire').where('name', '==', title).get();
        if (!snapshot.empty) {
            console.log("Removing product...");
            for (const doc of snapshot.docs) {
                await doc.ref.delete();
            }
            console.log("Product removed from Firestore");
        }
    } catch (error) {
        console.error("Error removing product from Firestore: ", error);
    }
}
