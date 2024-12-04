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

document.addEventListener("DOMContentLoaded", function () {
    // Get the review form and add a submit event listener
    const reviewForm = document.getElementById("review-form");
    reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();  // Prevent default form submission

        // Get form values
        const name = document.getElementById("review-name").value;
        const reviewText = document.getElementById("review-text").value;
        const rating = parseInt(document.getElementById("review-rating").value);

        // Add a new review to Firestore
        db.collection("reviews").add({
            name: name,
            reviewText: reviewText,
            rating: rating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()  // Timestamp to sort reviews by
        }).then(() => {
            alert("Review submitted successfully!");
            reviewForm.reset();  // Clear the form
            displayReviews();  // Refresh reviews after adding a new one
        }).catch((error) => {
            console.error("Error adding review: ", error);
            alert("Error submitting review. Please try again.");
        });
    });

    // Function to display reviews
    function displayReviews() {
        const reviewsContainer = document.getElementById("reviews-container");
        reviewsContainer.innerHTML = "";  // Clear previous reviews

        // Fetch reviews from Firestore and listen for changes in real-time
        db.collection("reviews")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                reviewsContainer.innerHTML = "";  // Clear previous reviews each time new data arrives
                snapshot.forEach((doc) => {
                    const review = doc.data();

                    // Create a review item element
                    const reviewItem = document.createElement("div");
                    reviewItem.classList.add("review-item");

                    reviewItem.innerHTML = `
                        <h3>${review.name}</h3>
                        <p>${review.reviewText}</p>
                        <span>Rating: ${review.rating}/5</span>
                    `;

                    reviewsContainer.appendChild(reviewItem);
                });
            });
    }

    // Load the reviews when the page loads
    displayReviews();
});
