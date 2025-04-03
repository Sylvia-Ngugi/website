// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlzrGDlXrfLyHObwF2ey2i4-3wa2WKaYw",
    authDomain: "slyskitchen-403cc.firebaseapp.com",
    projectId: "slyskitchen-403cc",
    storageBucket: "slyskitchen-403cc.firebasestorage.app",
    messagingSenderId: "822961338193",
    appId: "1:822961338193:web:761f9caee519b87d2cc570",
    measurementId: "G-8G3QK91ME8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Initialize EmailJS
import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
emailjs.init("your_public_key"); // Replace with your EmailJS Public Key

// Get elements
const main = document.getElementById("main");
const createAcct = document.getElementById("create-acct");
const returnBtn = document.getElementById("return-btn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignupPasswordIn = document.getElementById("confirm-password-signup");
const createAcctBtn = document.getElementById("create-acct-btn");

const bookingForm = document.querySelector(".book-form form");
const bookingBtn = document.getElementById("book-now");

// Toggle between login and signup forms
signupButton.addEventListener("click", () => {
    main.style.display = "none";
    createAcct.style.display = "block";
});

returnBtn.addEventListener("click", () => {
    main.style.display = "block";
    createAcct.style.display = "none";
});

// Handle user registration
createAcctBtn.addEventListener("click", async () => {
    const signupEmail = signupEmailIn.value.trim();
    const confirmSignupEmail = confirmSignupEmailIn.value.trim();
    const signupPassword = signupPasswordIn.value;
    const confirmSignupPassword = confirmSignupPasswordIn.value;

    if (!signupEmail || !confirmSignupEmail || !signupPassword || !confirmSignupPassword) {
        alert("Please fill out all required fields.");
        return;
    }

    if (signupEmail !== confirmSignupEmail) {
        alert("Email fields do not match. Try again.");
        return;
    }

    if (signupPassword !== confirmSignupPassword) {
        alert("Password fields do not match. Try again.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
        const user = userCredential.user;
        alert("Success! Account created.");

        logEvent(analytics, "sign_up", { method: "Email" });
        window.location.href = "index.html";
    } catch (error) {
        console.error("Signup Error:", error.message);
        alert("Error occurred: " + error.message);
    }
});

// Handle user login
submitButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Success! Welcome back!");

        logEvent(analytics, "login", { method: "Email" });
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("Error occurred: " + error.message);
    }
});

// Handle user bookings (Send email instead of Firestore)
bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const user = auth.currentUser;
    if (!user) {
        alert("You need to be logged in to make a booking.");
        return;
    }

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;

    if (!name || !email || !phone || !date || !time || !guests) {
        alert("Please fill out all fields before booking.");
        return;
    }

    // EmailJS parameters
    const templateParams = {
        user_name: name,
        user_email: email,
        user_phone: phone,
        reservation_date: date,
        reservation_time: time,
        guest_count: guests
    };

    try {
        await emailjs.send("your_service_id", "your_template_id", templateParams);
        alert("Reservation request sent successfully! You will receive a confirmation email.");
        
        logEvent(analytics, "booking_made", { method: "Email" });

        bookingForm.reset();
    } catch (error) {
        console.error("Email sending error:", error);
        alert("Error occurred while sending your booking request. Please try again.");
    }
});
