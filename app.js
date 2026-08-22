import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ==========================================
// FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ==========================================
// PAGE ELEMENTS
// ==========================================

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const logoutButton = document.getElementById("logoutButton");
const userRole = document.getElementById("userRole");
const userTeam = document.getElementById("userTeam");

// ==========================================
// LOGIN
// ==========================================

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

        console.log(
            "Firebase login successful:",
            result.user
        );

    } catch (error) {

        console.error(
            "FIREBASE LOGIN ERROR:",
            error
        );

        loginError.textContent =
            error.code + ": " + error.message;

    }

});


// ==========================================
// AUTHENTICATION STATE
// ==========================================

function getUserPermissions(role) {

    const permissions = {

        Director: {
            viewAllCases: true,
            createCases: true,
            manageUsers: true,
            manageTeams: true,
            manageEvidence: true,
            analyzeEvidence: true,
            manageResearch: true
        },

        "Team Lead": {
            viewAllCases: false,
            createCases: true,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: true,
            analyzeEvidence: true,
            manageResearch: true
        },

        "Assistant Team Lead": {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: true,
            analyzeEvidence: true,
            manageResearch: true
        },

        Investigator: {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: true,
            analyzeEvidence: false,
            manageResearch: false
        },

        Researcher: {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: false,
            analyzeEvidence: false,
            manageResearch: true
        },

        Analyst: {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: true,
            analyzeEvidence: true,
            manageResearch: false
        },

        "Tech Specialist": {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: false,
            analyzeEvidence: false,
            manageResearch: false
        },

        "AV Specialist": {
            viewAllCases: false,
            createCases: false,
            manageUsers: false,
            manageTeams: false,
            manageEvidence: true,
            analyzeEvidence: true,
            manageResearch: false
        }

    };

    return permissions[role] || null;
}

onAuthStateChanged(auth, async function (user) {

    console.log("AUTH STATE CHANGED:", user);

    if (user) {

        console.log("USER IS LOGGED IN");
        console.log("User email:", user.email);
        console.log("User UID:", user.uid);

        loginScreen.classList.add("hidden");
        dashboardScreen.classList.remove("hidden");

        welcomeMessage.textContent =
            `Welcome, ${user.email}`;

        try {

            const userRef = doc(db, "users", user.uid);

            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {

                const userData = userSnapshot.data();

                console.log(
                    "NEW HORIZON PERSONNEL RECORD:",
                    userData
                );

                welcomeMessage.textContent =
                    `Welcome, ${userData.name}`;
                
                userRole.textContent =
                    `Role: ${userData.role}`;
                
                userTeam.textContent =
                    `Team: ${userData.team}`;

            } else {

                console.log(
                    "No New Horizon personnel record found."
                );

            }

        } catch (error) {

            console.error(
                "PERSONNEL LOOKUP ERROR:",
                error
            );

        }

    } else {

        console.log("NO USER IS LOGGED IN");

        loginScreen.classList.remove("hidden");
        dashboardScreen.classList.add("hidden");

    }

});


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener("click", async function () {

    console.log("Signing out...");

    try {

        await signOut(auth);

        console.log("Successfully signed out.");

    } catch (error) {

        console.error(
            "SIGN OUT ERROR:",
            error
        );

    }

});
