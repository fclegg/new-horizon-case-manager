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
    setDoc,
    updateDoc
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

// ==========================================
// LOGIN
// ==========================================

const loginScreen =
    document.getElementById("loginScreen");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");


// ==========================================
// DASHBOARD
// ==========================================

const dashboardScreen =
    document.getElementById("dashboardScreen");

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
// PERSONNEL SCREEN
// ==========================================

const personnelScreen =
    document.getElementById("personnelScreen");

const personnelBackButton =
    document.getElementById(
        "personnelBackButton"
    );

const addPersonnelButton =
    document.getElementById(
        "addPersonnelButton"
    );

const personnelSearch =
    document.getElementById(
        "personnelSearch"
    );

const personnelList =
    document.getElementById(
        "personnelList"
    );


// ==========================================
// ADD PERSONNEL MODAL
// ==========================================

const addPersonnelModal =
    document.getElementById(
        "addPersonnelModal"
    );

const addPersonnelForm =
    document.getElementById(
        "addPersonnelForm"
    );

const closePersonnelModal =
    document.getElementById(
        "closePersonnelModal"
    );

const cancelPersonnelButton =
    document.getElementById(
        "cancelPersonnelButton"
    );

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );

const addPersonnelError =
    document.getElementById(
        "addPersonnelError"
    );


// ==========================================
// PERSONNEL FILE
// ==========================================

const personnelFileScreen =
    document.getElementById(
        "personnelFileScreen"
    );

const personnelFileBackButton =
    document.getElementById(
        "personnelFileBackButton"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profileRole =
    document.getElementById(
        "profileRole"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profileRoleField =
    document.getElementById(
        "profileRoleField"
    );

const profileTeam =
    document.getElementById(
        "profileTeam"
    );

const profileStatus =
    document.getElementById(
        "profileStatus"
    );

const profileAccountStatus =
    document.getElementById(
        "profileAccountStatus"
    );

const profileJoined =
    document.getElementById(
        "profileJoined"
    );

const editPersonnelButton =
    document.getElementById(
        "editPersonnelButton"
    );

const disablePersonnelButton =
    document.getElementById(
        "disablePersonnelButton"
    );

// ==========================================
// EDIT PERSONNEL MODAL
// ==========================================

const editPersonnelModal =
    document.getElementById(
        "editPersonnelModal"
    );

const editPersonnelForm =
    document.getElementById(
        "editPersonnelForm"
    );

const closeEditPersonnelModal =
    document.getElementById(
        "closeEditPersonnelModal"
    );

const cancelEditPersonnelButton =
    document.getElementById(
        "cancelEditPersonnelButton"
    );

const editModalOverlay =
    document.getElementById(
        "editModalOverlay"
    );

const editPersonnelError =
    document.getElementById(
        "editPersonnelError"
    );

const editPersonName =
    document.getElementById(
        "editPersonName"
    );

const editPersonEmail =
    document.getElementById(
        "editPersonEmail"
    );

const editPersonRole =
    document.getElementById(
        "editPersonRole"
    );

const editPersonTeam =
    document.getElementById(
        "editPersonTeam"
    );

let currentPersonnelId = null;

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
// SCREEN NAVIGATION
// ==========================================

function showDashboard() {

    loginScreen.classList.add("hidden");
    personnelScreen.classList.add("hidden");
    personnelFileScreen.classList.add("hidden");

    dashboardScreen.classList.remove("hidden");

    // Clear any inline display overrides
    loginScreen.style.display = "";
    personnelScreen.style.display = "";
    personnelFileScreen.style.display = "";

    dashboardScreen.style.display = "block";
}


function showPersonnel() {

    dashboardScreen.classList.add("hidden");
    personnelFileScreen.classList.add("hidden");
    loginScreen.classList.add("hidden");

    personnelScreen.classList.remove("hidden");

    // Explicit display control
    dashboardScreen.style.display = "none";
    personnelFileScreen.style.display = "none";
    loginScreen.style.display = "none";

    personnelScreen.style.display = "block";
}


function showPersonnelFile() {

    dashboardScreen.classList.add("hidden");
    personnelScreen.classList.add("hidden");
    loginScreen.classList.add("hidden");

    personnelFileScreen.classList.remove("hidden");

    // Explicit display control
    dashboardScreen.style.display = "none";
    personnelScreen.style.display = "none";
    loginScreen.style.display = "none";

    personnelFileScreen.style.display = "block";

    console.log(
        "PERSONNEL FILE SCREEN IS NOW:",
        getComputedStyle(
            personnelFileScreen
        ).display
    );
}


function showLogin() {

    dashboardScreen.classList.add("hidden");
    personnelScreen.classList.add("hidden");
    personnelFileScreen.classList.add("hidden");

    loginScreen.classList.remove("hidden");

    // Explicit display control
    dashboardScreen.style.display = "none";
    personnelScreen.style.display = "none";
    personnelFileScreen.style.display = "none";

    loginScreen.style.display = "block";
}


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        console.log(
            "LOGIN BUTTON WORKED"
        );

        const email =
            document.getElementById(
                "email"
            ).value;

        const password =
            document.getElementById(
                "password"
            ).value;

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
        // USER LOGGED IN
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


            // ==================================
            // SHOW DASHBOARD
            // ==================================

            showDashboard();


            // ==================================
            // TEMPORARY FALLBACK
            // ==================================

            welcomeMessage.textContent =
                `Welcome, ${user.email}`;


            try {

                // ==================================
                // GET USER PERSONNEL RECORD
                // ==================================

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );

                const userSnapshot =
                    await getDoc(
                        userRef
                    );


                // ==================================
                // PERSONNEL RECORD EXISTS
                // ==================================

                if (
                    userSnapshot.exists()
                ) {

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
                    // UPDATE DASHBOARD
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

            showLogin();

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

            await signOut(
                auth
            );

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


        console.log(
            "PERSONNEL DOCUMENT COUNT:",
            snapshot.size
        );


        personnelList.innerHTML = "";


        if (
            snapshot.empty
        ) {

            personnelList.innerHTML = `
                <p class="loading-message">
                    No personnel records found.
                </p>
            `;

            return;
        }


        snapshot.forEach(
            function (userDocument) {

                const person =
                    userDocument.data();


                console.log(
                    "PERSONNEL RECORD:",
                    person
                );


                // ==================================
                // CREATE ROW
                // ==================================

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "personnel-row";


                row.dataset.userId =
                    userDocument.id;


                // ==================================
                // STATUS
                // ==================================

                const statusClass =
                    person.active
                        ? "status-active"
                        : "status-inactive";


                const statusText =
                    person.active
                        ? "ACTIVE"
                        : "INACTIVE";


                // ==================================
                // ROW CONTENT
                // ==================================

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


                // ==================================
                // CLICK → PERSONNEL FILE
                // ==================================

                row.addEventListener(
                    "click",
                    function () {

                        openPersonnelFile(
                            userDocument.id
                        );

                    }
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
// OPEN PERSONNEL FILE
// ==========================================

async function openPersonnelFile(
    userId
) {

    currentPersonnelId = userId;

    console.log(
        "OPENING PERSONNEL FILE:",
        userId
    );


    try {

        // ==================================
        // GET PERSONNEL DOCUMENT
        // ==================================

        const userRef =
            doc(
                db,
                "users",
                userId
            );


        const userSnapshot =
            await getDoc(
                userRef
            );


        if (
            !userSnapshot.exists()
        ) {

            console.error(
                "PERSONNEL RECORD NOT FOUND:",
                userId
            );

            return;
        }


        const person =
            userSnapshot.data();


        console.log(
            "PERSONNEL FILE:",
            person
        );


        // ==================================
        // POPULATE PROFILE
        // ==================================

        profileName.textContent =
            person.name ||
            "Unnamed";


        profileRole.textContent =
            person.role ||
            "Unassigned";


        profileEmail.textContent =
            person.email ||
            "—";


        profileRoleField.textContent =
            person.role ||
            "Unassigned";


        profileTeam.textContent =
            person.team ||
            "Unassigned";


        profileStatus.textContent =
            person.active
                ? "ACTIVE"
                : "INACTIVE";


        profileAccountStatus.textContent =
            person.accountStatus ||
            "Unknown";


        // ==================================
        // JOIN DATE
        // ==================================

        if (
            person.createdAt
        ) {

            const date =
                new Date(
                    person.createdAt
                );


            if (
                !isNaN(
                    date.getTime()
                )
            ) {

                profileJoined.textContent =
                    date.toLocaleDateString();

            } else {

                profileJoined.textContent =
                    "Unknown";

            }

        } else {

            profileJoined.textContent =
                "Unknown";

        }


        // ==================================
        // SHOW PERSONNEL FILE
        // ==================================

        showPersonnelFile();


        // ==================================
        // DIAGNOSTIC
        // ==================================

        console.log(
            "PERSONNEL FILE SCREEN DISPLAY:",
            getComputedStyle(
                personnelFileScreen
            ).display
        );

        console.log(
            "PERSONNEL FILE SCREEN CLASSES:",
            personnelFileScreen.className
        );

        console.log(
            "PERSONNEL FILE SCREEN:",
            personnelFileScreen
        );

    } catch (error) {

        console.error(
            "PERSONNEL FILE ERROR:",
            error
        );

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
                    text.includes(
                        searchTerm
                    )
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

        showPersonnel();

        loadPersonnel();

    }
);


// ==========================================
// PERSONNEL → DASHBOARD
// ==========================================

personnelBackButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);


// ==========================================
// PERSONNEL FILE → PERSONNEL
// ==========================================

personnelFileBackButton.addEventListener(
    "click",
    function () {

        showPersonnel();

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

        addPersonnelError.textContent =
            "";


        addPersonnelForm.reset();


        addPersonnelModal.classList.remove(
            "hidden"
        );


        addPersonnelModal.style.display =
            "flex";

    }
);


// ==========================================
// CLOSE ADD PERSONNEL MODAL
// ==========================================

function closeAddPersonnelModal() {

    addPersonnelModal.classList.add(
        "hidden"
    );


    addPersonnelModal.style.display =
        "";


    addPersonnelForm.reset();


    addPersonnelError.textContent =
        "";

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


        addPersonnelError.textContent =
            "";


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
            ).value
                .trim()
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
        // VALIDATION
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
            // CREATE DOCUMENT REFERENCE
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

                name:
                    name,

                email:
                    email,

                role:
                    role,

                team:
                    team,

                active:
                    true,

                accountStatus:
                    "Pending",

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
            // REFRESH LIST
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


// ==========================================
// OPEN EDIT PERSONNEL MODAL
// ==========================================

editPersonnelButton.addEventListener(
    "click",
    async function () {

        if (!currentPersonnelId) {

            console.error(
                "No personnel record selected."
            );

            return;

        }


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    currentPersonnelId
                );


            const snapshot =
                await getDoc(
                    userRef
                );


            if (!snapshot.exists()) {

                console.error(
                    "Personnel record no longer exists."
                );

                return;

            }


            const person =
                snapshot.data();


            // Fill form

            editPersonName.value =
                person.name || "";


            editPersonEmail.value =
                person.email || "";


            editPersonRole.value =
                person.role || "";


            editPersonTeam.value =
                person.team || "";


            editPersonnelError.textContent =
                "";


            editPersonnelModal.classList.remove(
                "hidden"
            );


            editPersonnelModal.style.display =
                "flex";


        } catch (error) {

            console.error(
                "EDIT PERSONNEL LOAD ERROR:",
                error
            );

        }

    }
);


// ==========================================
// DISABLE PERSONNEL
// ==========================================

disablePersonnelButton.addEventListener(
    "click",
    function () {

        alert(
            "Personnel status management will be built in the next step."
        );

    }
);
