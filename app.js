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

// Login
const loginScreen =
    document.getElementById("loginScreen");

const dashboardScreen =
    document.getElementById("dashboardScreen");

const personnelScreen =
    document.getElementById("personnelScreen");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");


// Dashboard user information
const welcomeMessage =
    document.getElementById("welcomeMessage");

const userRole =
    document.getElementById("userRole");

const userTeam =
    document.getElementById("userTeam");

const topbarUserName =
    document.getElementById("topbarUserName");

const topbarUserRole =
    document.getElementById("topbarUserRole");


// Logout
const logoutButton =
    document.getElementById("logoutButton");

const personnelButton =
    document.getElementById("personnelButton");

const personnelBackButton =
    document.getElementById("personnelBackButton");

const addPersonnelButton =
    document.getElementById("addPersonnelButton");

const personnelSearch =
    document.getElementById("personnelSearch");

const personnelList =
    document.getElementById("personnelList");


// Dashboard buttons
const casesButton =
    document.getElementById("casesButton");

const newCaseButton =
    document.getElementById("newCaseButton");

const personnelButton =
    document.getElementById("personnelButton");

const teamsButton =
    document.getElementById("teamsButton");

const evidenceButton =
    document.getElementById("evidenceButton");

const reportsButton =
    document.getElementById("reportsButton");


// ==========================================
// ROLE PERMISSIONS
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


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        console.log("LOGIN BUTTON WORKED");

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        loginError.textContent = "";

        try {

            console.log(
                "Starting Firebase login..."
            );

            const result =
                await signInWithEmailAndPassword(
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
                error.code +
                ": " +
                error.message;

        }

    }
);


// ==========================================
// AUTHENTICATION STATE
// ==========================================

onAuthStateChanged(
    auth,
    async function (user) {

        console.log(
            "AUTH STATE CHANGED:",
            user
        );


        // ==================================
        // USER IS LOGGED IN
        // ==================================

        if (user) {

            console.log(
                "USER IS LOGGED IN"
            );

            console.log(
                "User email:",
                user.email
            );

            console.log(
                "User UID:",
                user.uid
            );


            // Show dashboard
            loginScreen.classList.add(
                "hidden"
            );

            dashboardScreen.classList.remove(
                "hidden"
            );


            // Temporary fallback
            welcomeMessage.textContent =
                `Welcome, ${user.email}`;


            try {

                // ==================================
                // GET PERSONNEL RECORD
                // ==================================

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );

                const userSnapshot =
                    await getDoc(userRef);


                // ==================================
                // PERSONNEL RECORD EXISTS
                // ==================================

                if (userSnapshot.exists()) {

                    const userData =
                        userSnapshot.data();


                    console.log(
                        "NEW HORIZON PERSONNEL RECORD:",
                        userData
                    );


                    // ==================================
                    // GET ROLE PERMISSIONS
                    // ==================================

                    const permissions =
                        getUserPermissions(
                            userData.role
                        );


                    console.log(
                        "USER PERMISSIONS:",
                        permissions
                    );


                    // ==================================
                    // UPDATE USER INFORMATION
                    // ==================================

                    welcomeMessage.textContent =
                        `Welcome, ${userData.name}`;

                    userRole.textContent =
                        `Role: ${userData.role}`;

                    userTeam.textContent =
                        `Team: ${userData.team}`;

                    topbarUserName.textContent =
                        userData.name;

                    topbarUserRole.textContent =
                        userData.role;


                    // ==================================
                    // FUTURE PERMISSION CONTROL
                    // ==================================

                    // We will use the permissions object
                    // to control which dashboard features
                    // each role can access.

                    console.log(
                        "Permission system initialized."
                    );


                } else {

                    console.log(
                        "No New Horizon personnel record found."
                    );


                    welcomeMessage.textContent =
                        "Welcome";


                    userRole.textContent =
                        "Role: Not Assigned";


                    userTeam.textContent =
                        "Team: Not Assigned";


                    topbarUserName.textContent =
                        user.email;


                    topbarUserRole.textContent =
                        "Unassigned";

                }


            } catch (error) {

                console.error(
                    "PERSONNEL LOOKUP ERROR:",
                    error
                );

            }


        }


        // ==================================
        // NO USER LOGGED IN
        // ==================================

        else {

            console.log(
                "NO USER IS LOGGED IN"
            );


            loginScreen.classList.remove(
                "hidden"
            );

            dashboardScreen.classList.add(
                "hidden"
            );

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    async function () {

        console.log(
            "Signing out..."
        );

        try {

            await signOut(auth);

            console.log(
                "Successfully signed out."
            );

        } catch (error) {

            console.error(
                "SIGN OUT ERROR:",
                error
            );

        }

    }
);


// ==========================================
// DASHBOARD BUTTONS
// ==========================================

// CASES

casesButton.addEventListener(
    "click",
    function () {

        alert(
            "Case Management will be built in Phase 2."
        );

    }
);


// NEW CASE

newCaseButton.addEventListener(
    "click",
    function () {

        alert(
            "New Case creation will be built in Phase 2."
        );

    }
);


// PERSONNEL

personnelButton.addEventListener(
    "click",
    function () {

        alert(
            "Personnel Management is coming next."
        );

    }
);


// TEAMS

teamsButton.addEventListener(
    "click",
    function () {

        alert(
            "Team Management will be built next."
        );

    }
);


// EVIDENCE

evidenceButton.addEventListener(
    "click",
    function () {

        alert(
            "Evidence Management will be built in Phase 3."
        );

    }
);


// REPORTS

reportsButton.addEventListener(
    "click",
    function () {

        alert(
            "Reports will be built in a later phase."
        );

    }
);

personnelButton.addEventListener("click", function () {

    dashboardScreen.classList.add("hidden");

    personnelScreen.classList.remove("hidden");

    loadPersonnel();

});

personnelBackButton.addEventListener(
    "click",
    function () {

        personnelScreen.classList.add("hidden");

        dashboardScreen.classList.remove("hidden");

    }
);
