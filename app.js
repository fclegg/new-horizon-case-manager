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


// ==========================================
// CURRENT PERSONNEL
// ==========================================

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

    dashboardScreen.style.display = "none";
    personnelScreen.style.display = "none";
    loginScreen.style.display = "none";

    personnelFileScreen.style.display = "block";
}


function showLogin() {

    dashboardScreen.classList.add("hidden");
    personnelScreen.classList.add("hidden");
    personnelFileScreen.classList.add("hidden");

    loginScreen.classList.remove("hidden");

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

            await signInWithEmailAndPassword(
                auth,
                email,
                password
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
// AUTHENTICATION
// ==========================================

onAuthStateChanged(
    auth,
    async function (user) {

        if (user) {

            showDashboard();

            welcomeMessage.textContent =
                `Welcome, ${user.email}`;


            try {

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


                if (
                    userSnapshot.exists()
                ) {

                    const userData =
                        userSnapshot.data();


                    const permissions =
                        getUserPermissions(
                            userData.role
                        );


                    console.log(
                        "USER PERMISSIONS:",
                        permissions
                    );


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

                } else {

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


        } else {

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

        try {

            await signOut(auth);

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


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "personnel-row";


                row.dataset.userId =
                    userDocument.id;


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

    currentPersonnelId =
        userId;


    try {

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


        // ==================================
        // PROFILE
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
        // UPDATE STATUS BUTTON
        // ==================================

        updatePersonnelStatusButton(
            person.active
        );


        showPersonnelFile();


    } catch (error) {

        console.error(
            "PERSONNEL FILE ERROR:",
            error
        );

    }

}


// ==========================================
// UPDATE STATUS BUTTON
// ==========================================

function updatePersonnelStatusButton(
    isActive
) {

    if (
        isActive
    ) {

        disablePersonnelButton.textContent =
            "Disable Personnel";

    } else {

        disablePersonnelButton.textContent =
            "Reactivate Personnel";

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
// DASHBOARD BUTTONS
// ==========================================

casesButton.addEventListener(
    "click",
    function () {

        alert(
            "Case Management will be built in Phase 2."
        );

    }
);


newCaseButton.addEventListener(
    "click",
    function () {

        alert(
            "New Case creation will be built in Phase 2."
        );

    }
);


personnelButton.addEventListener(
    "click",
    function () {

        showPersonnel();

        loadPersonnel();

    }
);


personnelBackButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);


personnelFileBackButton.addEventListener(
    "click",
    function () {

        showPersonnel();

    }
);


teamsButton.addEventListener(
    "click",
    function () {

        alert(
            "Team Management will be built next."
        );

    }
);


evidenceButton.addEventListener(
    "click",
    function () {

        alert(
            "Evidence Management will be built in Phase 3."
        );

    }
);


reportsButton.addEventListener(
    "click",
    function () {

        alert(
            "Reports will be built in a later phase."
        );

    }
);


// ==========================================
// ADD PERSONNEL MODAL
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

            const personnelRef =
                doc(
                    collection(
                        db,
                        "users"
                    )
                );


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


            await setDoc(
                personnelRef,
                personnelData
            );


            closeAddPersonnelModal();

            await loadPersonnel();


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
// EDIT PERSONNEL
// ==========================================


// OPEN EDIT MODAL

editPersonnelButton.addEventListener(
    "click",
    async function () {

        if (
            !currentPersonnelId
        ) {

            console.error(
                "NO PERSONNEL RECORD SELECTED"
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


            if (
                !snapshot.exists()
            ) {

                console.error(
                    "PERSONNEL RECORD NO LONGER EXISTS"
                );

                return;
            }


            const person =
                snapshot.data();


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
// CLOSE EDIT MODAL
// ==========================================

function closeEditPersonnelModalWindow() {

    editPersonnelModal.classList.add(
        "hidden"
    );

    editPersonnelModal.style.display =
        "";

    editPersonnelForm.reset();

    editPersonnelError.textContent =
        "";

}


closeEditPersonnelModal.addEventListener(
    "click",
    closeEditPersonnelModalWindow
);


cancelEditPersonnelButton.addEventListener(
    "click",
    closeEditPersonnelModalWindow
);


editModalOverlay.addEventListener(
    "click",
    closeEditPersonnelModalWindow
);


// ==========================================
// SAVE PERSONNEL CHANGES
// ==========================================

editPersonnelForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        editPersonnelError.textContent =
            "";


        if (
            !currentPersonnelId
        ) {

            editPersonnelError.textContent =
                "No personnel record selected.";

            return;
        }


        const name =
            editPersonName.value.trim();


        const email =
            editPersonEmail.value
                .trim()
                .toLowerCase();


        const role =
            editPersonRole.value;


        const team =
            editPersonTeam.value.trim();


        if (
            !name ||
            !email ||
            !role ||
            !team
        ) {

            editPersonnelError.textContent =
                "Please complete all fields.";

            return;
        }


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    currentPersonnelId
                );


            await updateDoc(
                userRef,
                {

                    name:
                        name,

                    email:
                        email,

                    role:
                        role,

                    team:
                        team,

                    updatedAt:
                        new Date().toISOString()

                }
            );


            closeEditPersonnelModalWindow();


            await openPersonnelFile(
                currentPersonnelId
            );


            await loadPersonnel();


        } catch (error) {

            console.error(
                "UPDATE PERSONNEL ERROR:",
                error
            );


            editPersonnelError.textContent =
                "Unable to save personnel changes.";

        }

    }
);


// ==========================================
// DISABLE / REACTIVATE PERSONNEL
// ==========================================

disablePersonnelButton.addEventListener(
    "click",
    async function () {

        // ==================================
        // MAKE SURE A PERSON IS SELECTED
        // ==================================

        if (
            !currentPersonnelId
        ) {

            console.error(
                "NO PERSONNEL RECORD SELECTED"
            );

            return;
        }


        try {

            // ==================================
            // GET CURRENT RECORD
            // ==================================

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


            if (
                !snapshot.exists()
            ) {

                console.error(
                    "PERSONNEL RECORD NOT FOUND"
                );

                return;
            }


            const person =
                snapshot.data();


            const currentlyActive =
                person.active === true;


            // ==================================
            // CONFIRM ACTION
            // ==================================

            const action =
                currentlyActive
                    ? "disable"
                    : "reactivate";


            const confirmation =
                confirm(
                    currentlyActive
                        ? `Are you sure you want to disable ${person.name}?`
                        : `Are you sure you want to reactivate ${person.name}?`
                );


            if (
                !confirmation
            ) {

                return;

            }


            // ==================================
            // UPDATE FIRESTORE
            // ==================================

            await updateDoc(
                userRef,
                {

                    active:
                        !currentlyActive,

                    accountStatus:
                        currentlyActive
                            ? "Disabled"
                            : "Active",

                    statusUpdatedAt:
                        new Date().toISOString()

                }
            );


            console.log(
                `PERSONNEL ${action.toUpperCase()}D:`,
                currentPersonnelId
            );


            // ==================================
            // REFRESH PERSONNEL FILE
            // ==================================

            await openPersonnelFile(
                currentPersonnelId
            );


            // ==================================
            // REFRESH PERSONNEL LIST
            // ==================================

            await loadPersonnel();


        } catch (error) {

            console.error(
                "PERSONNEL STATUS UPDATE ERROR:",
                error
            );

            alert(
                "Unable to update personnel status."
            );

        }

    }
);
