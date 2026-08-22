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
    getDoc,
    collection,
    getDocs,
    setDoc
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


// ==========================================
// DASHBOARD USER INFORMATION
// ==========================================

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


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// DASHBOARD BUTTONS
// ==========================================

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
// PERSONNEL PAGE
// ==========================================

const personnelBackButton =
    document.getElementById("personnelBackButton");

const addPersonnelModal =
    document.getElementById("addPersonnelModal");

const addPersonnelForm =
    document.getElementById("addPersonnelForm");

const closePersonnelModal =
    document.getElementById("closePersonnelModal");

const cancelPersonnelButton =
    document.getElementById("cancelPersonnelButton");

const modalOverlay =
    document.getElementById("modalOverlay");

const addPersonnelError =
    document.getElementById("addPersonnelError");

const addPersonnelButton =
    document.getElementById("addPersonnelButton");

const personnelSearch =
    document.getElementById("personnelSearch");

const personnelList =
    document.getElementById("personnelList");


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

            personnelScreen.classList.add(
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
// LOAD PERSONNEL
// ==========================================

async function loadPersonnel() {

    // ==================================
    // DIAGNOSTIC #1
    // ==================================

    console.log(
        "LOAD PERSONNEL STARTED"
    );

    console.log(
        "Personnel list element:",
        personnelList
    );


    personnelList.innerHTML = `
        <p class="loading-message">
            Loading personnel...
        </p>
    `;


    try {

        const usersCollection =
            collection(
                db,
                "users"
            );


        const snapshot =
            await getDocs(
                usersCollection
            );


        // ==================================
        // DIAGNOSTIC #2
        // ==================================

        console.log(
            "PERSONNEL DOCUMENT COUNT:",
            snapshot.size
        );


        personnelList.innerHTML = "";


        if (snapshot.empty) {

            personnelList.innerHTML = `
                <p class="loading-message">
                    No personnel records found.
                </p>
            `;

            return;
        }


        snapshot.forEach(
            function (userDocument) {

                // ==================================
                // DIAGNOSTIC #3
                // ==================================

                console.log(
                    "PERSONNEL RECORD:",
                    userDocument.data()
                );


                const person =
                    userDocument.data();


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "personnel-row";


                const statusClass =
                    person.active
                        ? "status-active"
                        : "status-inactive";


                const statusText =
                    person.active
                        ? "ACTIVE"
                        : "INACTIVE";


                row.innerHTML = `

                    <div>

                        <div class="personnel-name">
                            ${person.name || "Unnamed"}
                        </div>

                        <div class="personnel-email">
                            ${person.email || ""}
                        </div>

                    </div>

                    <div class="personnel-role">
                        ${person.role || "Unassigned"}
                    </div>

                    <div class="personnel-team">
                        ${person.team || "Unassigned"}
                    </div>

                    <div class="personnel-status ${statusClass}">
                        ${statusText}
                    </div>

                `;


                personnelList.appendChild(
                    row
                );
               
                console.log(
                    "PERSONNEL ROW ADDED:",
                    row
                );

                console.log(
                    "PERSONNEL LIST HTML:",
                    personnelList.innerHTML
                );

            }
        );


    } catch (error) {

        console.error(
            "PERSONNEL LOAD ERROR:",
            error
        );


        personnelList.innerHTML = `
            <p class="loading-message">
                Unable to load personnel.
            </p>
        `;

    }

}


// ==========================================
// PERSONNEL SEARCH
// ==========================================

personnelSearch.addEventListener(
    "input",
    function () {

        const searchTerm =
            personnelSearch.value
                .toLowerCase()
                .trim();


        const rows =
            document.querySelectorAll(
                ".personnel-row"
            );


        rows.forEach(
            function (row) {

                const text =
                    row.textContent
                        .toLowerCase();


                if (
                    text.includes(searchTerm)
                ) {

                    row.style.display =
                        "grid";

                } else {

                    row.style.display =
                        "none";

                }

            }
        );

    }
);


// ==========================================
// DASHBOARD → CASES
// ==========================================

casesButton.addEventListener(
    "click",
    function () {

        alert(
            "Case Management will be built in Phase 2."
        );

    }
);


// ==========================================
// DASHBOARD → NEW CASE
// ==========================================

newCaseButton.addEventListener(
    "click",
    function () {

        alert(
            "New Case creation will be built in Phase 2."
        );

    }
);


// ==========================================
// DASHBOARD → PERSONNEL
// ==========================================

personnelButton.addEventListener(
    "click",
    function () {

        dashboardScreen.classList.add(
            "hidden"
        );

        personnelScreen.classList.remove(
            "hidden"
        );

        loadPersonnel();

    }
);


// ==========================================
// PERSONNEL → DASHBOARD
// ==========================================

personnelBackButton.addEventListener(
    "click",
    function () {

        personnelScreen.classList.add(
            "hidden"
        );

        dashboardScreen.classList.remove(
            "hidden"
        );

    }
);


// ==========================================
// DASHBOARD → TEAMS
// ==========================================

teamsButton.addEventListener(
    "click",
    function () {

        alert(
            "Team Management will be built next."
        );

    }
);


// ==========================================
// DASHBOARD → EVIDENCE
// ==========================================

evidenceButton.addEventListener(
    "click",
    function () {

        alert(
            "Evidence Management will be built in Phase 3."
        );

    }
);


// ==========================================
// DASHBOARD → REPORTS
// ==========================================

reportsButton.addEventListener(
    "click",
    function () {

        alert(
            "Reports will be built in a later phase."
        );

    }
);

// ==========================================
// OPEN ADD PERSONNEL MODAL
// ==========================================

addPersonnelButton.addEventListener(
    "click",
    function () {

        addPersonnelError.textContent = "";

        addPersonnelForm.reset();

        addPersonnelModal.classList.remove(
            "hidden"
        );

    }
);

// ==========================================
// CLOSE ADD PERSONNEL MODAL
// ==========================================

function closeAddPersonnelModal() {

    addPersonnelModal.classList.add(
        "hidden"
    );

    addPersonnelForm.reset();

    addPersonnelError.textContent = "";

}


closePersonnelModal.addEventListener(
    "click",
    closeAddPersonnelModal
);


cancelPersonnelButton.addEventListener(
    "click",
    closeAddPersonnelModal
);


modalOverlay.addEventListener(
    "click",
    closeAddPersonnelModal
);

// ==========================================
// ADD PERSONNEL
// ==========================================

addPersonnelForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        addPersonnelError.textContent = "";


        // ==================================
        // GET FORM VALUES
        // ==================================

        const name =
            document.getElementById(
                "personName"
            ).value.trim();


        const email =
            document.getElementById(
                "personEmail"
            ).value.trim()
                .toLowerCase();


        const role =
            document.getElementById(
                "personRole"
            ).value;


        const team =
            document.getElementById(
                "personTeam"
            ).value.trim();


        // ==================================
        // BASIC VALIDATION
        // ==================================

        if (
            !name ||
            !email ||
            !role ||
            !team
        ) {

            addPersonnelError.textContent =
                "Please complete all fields.";

            return;

        }


        try {

            console.log(
                "Creating personnel record..."
            );


            // ==================================
            // CREATE A FIRESTORE DOCUMENT ID
            // ==================================

            const personnelRef =
                doc(
                    collection(
                        db,
                        "users"
                    )
                );


            // ==================================
            // PERSONNEL DATA
            // ==================================

            const personnelData = {

                name: name,

                email: email,

                role: role,

                team: team,

                active: true,

                accountStatus: "Pending",

                createdAt:
                    new Date().toISOString()

            };


            // ==================================
            // SAVE TO FIRESTORE
            // ==================================

            await setDoc(
                personnelRef,
                personnelData
            );


            console.log(
                "PERSONNEL CREATED:",
                personnelRef.id
            );


            // ==================================
            // CLOSE MODAL
            // ==================================

            closeAddPersonnelModal();


            // ==================================
            // REFRESH PERSONNEL LIST
            // ==================================

            await loadPersonnel();


            console.log(
                "Personnel list refreshed."
            );


        } catch (error) {

            console.error(
                "ADD PERSONNEL ERROR:",
                error
            );


            addPersonnelError.textContent =
                "Unable to create personnel record.";

        }

    }
);
