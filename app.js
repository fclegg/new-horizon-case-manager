import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";


// -----------------------------
// FIREBASE
// -----------------------------

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// -----------------------------
// ELEMENTS
// -----------------------------

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");


// -----------------------------
// LOGIN
// -----------------------------

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();
    console.log("LOGIN BUTTON WORKED");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginError.textContent = "";

    try {

    console.log("Starting Firebase login...");

    const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    console.log("Firebase login successful:", result.user);

} catch (error) {

    console.error("FIREBASE LOGIN ERROR:", error);

    loginError.textContent =
        error.code + ": " + error.message;

}
});


// -----------------------------
// AUTH STATE
// -----------------------------

onAuthStateChanged(auth, function (user) {

    if (user) {

        loginScreen.classList.add("hidden");
        dashboardScreen.classList.remove("hidden");

        welcomeMessage.textContent =
            `Welcome, ${user.email}`;

    } else {

        loginScreen.classList.remove("hidden");
        dashboardScreen.classList.add("hidden");

    }

});


// -----------------------------
// LOGOUT
// -----------------------------

logoutButton.addEventListener("click", async function () {

    await signOut(auth);

});
