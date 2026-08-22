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
    updateDoc,
    serverTimestamp
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
// CASE MANAGEMENT
// ==========================================

const casesScreen =
    document.getElementById("casesScreen");

const caseFileScreen =
    document.getElementById("caseFileScreen");

const casesBackButton =
    document.getElementById("casesBackButton");

const caseFileBackButton =
    document.getElementById("caseFileBackButton");

const casesList =
    document.getElementById("casesList");

const caseSearch =
    document.getElementById("caseSearch");

const caseStatusFilter =
    document.getElementById("caseStatusFilter");

const caseTeamFilter =
    document.getElementById("caseTeamFilter");

const newCaseListButton =
    document.getElementById("newCaseListButton");

const activeCaseCount =
    document.getElementById("activeCaseCount");

const completedCaseCount =
    document.getElementById("completedCaseCount");

let currentCaseId = null;

let allCases = [];

function showCases() {

    hideAllScreens();

    casesScreen.classList.remove("hidden");

    loadCases();

}


function showCaseFile() {

    hideAllScreens();

    caseFileScreen.classList.remove("hidden");

}

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
// TEAMS
// ==========================================

const teamsScreen =
    document.getElementById(
        "teamsScreen"
    );

const teamsBackButton =
    document.getElementById(
        "teamsBackButton"
    );

const teamsList =
    document.getElementById(
        "teamsList"
    );


// ==========================================
// TEAM FILE
// ==========================================

const teamFileScreen =
    document.getElementById(
        "teamFileScreen"
    );

const teamFileBackButton =
    document.getElementById(
        "teamFileBackButton"
    );

const teamProfileName =
    document.getElementById(
        "teamProfileName"
    );

const teamProfileType =
    document.getElementById(
        "teamProfileType"
    );

const teamProfileTypeField =
    document.getElementById(
        "teamProfileTypeField"
    );

const teamProfileStatus =
    document.getElementById(
        "teamProfileStatus"
    );

const teamProfileLead =
    document.getElementById(
        "teamProfileLead"
    );

const teamProfileMemberCount =
    document.getElementById(
        "teamProfileMemberCount"
    );

const teamProfileCreated =
    document.getElementById(
        "teamProfileCreated"
    );

const teamProfileDescription =
    document.getElementById(
        "teamProfileDescription"
    );

const teamMembersList =
    document.getElementById(
        "teamMembersList"
    );

const editTeamButton =
    document.getElementById(
        "editTeamButton"
    );

const teamStatusButton =
    document.getElementById(
        "teamStatusButton"
    );


// ==========================================
// EDIT TEAM MODAL
// ==========================================

const editTeamModal =
    document.getElementById(
        "editTeamModal"
    );

const editTeamForm =
    document.getElementById(
        "editTeamForm"
    );

const closeEditTeamModal =
    document.getElementById(
        "closeEditTeamModal"
    );

const cancelEditTeamButton =
    document.getElementById(
        "cancelEditTeamButton"
    );

const editTeamModalOverlay =
    document.getElementById(
        "editTeamModalOverlay"
    );

const editTeamError =
    document.getElementById(
        "editTeamError"
    );

const editTeamName =
    document.getElementById(
        "editTeamName"
    );

const editTeamType =
    document.getElementById(
        "editTeamType"
    );

const editTeamLead =
    document.getElementById(
        "editTeamLead"
    );

const editTeamDescription =
    document.getElementById(
        "editTeamDescription"
    );


// ==========================================
// CURRENT RECORDS
// ==========================================

let currentPersonnelId = null;

let currentTeamId = null;


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

function hideAllScreens() {

    if (loginScreen) {
        loginScreen.classList.add("hidden");
    }

    if (dashboardScreen) {
        dashboardScreen.classList.add("hidden");
    }

    if (personnelScreen) {
        personnelScreen.classList.add("hidden");
    }

    if (personnelFileScreen) {
        personnelFileScreen.classList.add("hidden");
    }

    if (teamsScreen) {
        teamsScreen.classList.add("hidden");
    }

    if (teamFileScreen) {
        teamFileScreen.classList.add("hidden");
    }

    if (casesScreen) {
        casesScreen.classList.add("hidden");
    }

    if (caseFileScreen) {
        caseFileScreen.classList.add("hidden");
    }

}

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function hideAllScreens() {

    if (loginScreen) {
        loginScreen.classList.add("hidden");
    }

    if (dashboardScreen) {
        dashboardScreen.classList.add("hidden");
    }

    if (personnelScreen) {
        personnelScreen.classList.add("hidden");
    }

    if (personnelFileScreen) {
        personnelFileScreen.classList.add("hidden");
    }

    if (teamsScreen) {
        teamsScreen.classList.add("hidden");
    }

    if (teamFileScreen) {
        teamFileScreen.classList.add("hidden");
    }

    if (casesScreen) {
        casesScreen.classList.add("hidden");
    }

    if (caseFileScreen) {
        caseFileScreen.classList.add("hidden");
    }

}


function showDashboard() {

    hideAllScreens();

    if (dashboardScreen) {

        dashboardScreen.classList.remove(
            "hidden"
        );

    }

}


function showPersonnel() {

    hideAllScreens();

    if (personnelScreen) {

        personnelScreen.classList.remove(
            "hidden"
        );

    }

}


function showPersonnelFile() {

    hideAllScreens();

    if (personnelFileScreen) {

        personnelFileScreen.classList.remove(
            "hidden"
        );

    }

}


function showTeams() {

    hideAllScreens();

    if (teamsScreen) {

        teamsScreen.classList.remove(
            "hidden"
        );

    }

}


function showTeamFile() {

    hideAllScreens();

    if (teamFileScreen) {

        teamFileScreen.classList.remove(
            "hidden"
        );

    }

}


function showCases() {

    hideAllScreens();

    if (casesScreen) {

        casesScreen.classList.remove(
            "hidden"
        );

        loadCases();

    } else {

        console.error(
            "CASES SCREEN NOT FOUND: #casesScreen"
        );

    }

}


function showCaseFile() {

    hideAllScreens();

    if (caseFileScreen) {

        caseFileScreen.classList.remove(
            "hidden"
        );

    } else {

        console.error(
            "CASE FILE SCREEN NOT FOUND: #caseFileScreen"
        );

    }

}


function showLogin() {

    hideAllScreens();

    if (loginScreen) {

        loginScreen.classList.remove(
            "hidden"
        );

    }

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
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            showLogin();

            return;

        }


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


            const snapshot =
                await getDoc(
                    userRef
                );


            if (
                snapshot.exists()
            ) {

                const userData =
                    snapshot.data();


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
                    `Team: ${userData.team || "Unassigned"}`;


                topbarUserName.textContent =
                    userData.name;


                topbarUserRole.textContent =
                    userData.role;

            }

        } catch (error) {

            console.error(
                "PERSONNEL LOOKUP ERROR:",
                error
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

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
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
                        ${getTeamDisplayName(person.team)}
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
// TEAM DISPLAY NAME
// ==========================================

function getTeamDisplayName(
    teamId
) {

    if (
        teamId === "administration"
    ) {

        return "Administration";

    }


    if (
        teamId === "okc-alpha"
    ) {

        return "OKC Alpha Team";

    }


    return teamId ||
        "Unassigned";

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

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "users",
                    userId
                )
            );


        if (
            !snapshot.exists()
        ) {

            return;

        }


        const person =
            snapshot.data();


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
            getTeamDisplayName(
                person.team
            );


        profileStatus.textContent =
            person.active
                ? "ACTIVE"
                : "INACTIVE";


        profileAccountStatus.textContent =
            person.accountStatus ||
            "Unknown";


        if (
            person.createdAt
        ) {

            const date =
                new Date(
                    person.createdAt
                );


            profileJoined.textContent =
                isNaN(
                    date.getTime()
                )
                    ? "Unknown"
                    : date.toLocaleDateString();

        } else {

            profileJoined.textContent =
                "Unknown";

        }


        disablePersonnelButton
            .querySelector("strong")
            .textContent =
                person.active
                    ? "Disable Personnel"
                    : "Reactivate Personnel";


        showPersonnelFile();


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


                row.style.display =
                    text.includes(
                        searchTerm
                    )
                        ? "grid"
                        : "none";

            }
        );

    }
);


// ==========================================
// DASHBOARD NAVIGATION
// ==========================================

personnelButton.addEventListener(
    "click",
    function () {

        showPersonnel();

        loadPersonnel();

    }
);


teamsButton.addEventListener(
    "click",
    function () {

        showTeams();

        loadTeams();

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


teamsBackButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);


teamFileBackButton.addEventListener(
    "click",
    function () {

        showTeams();

    }
);


// ==========================================
// OTHER DASHBOARD BUTTONS
// ==========================================

casesButton.addEventListener(
    "click",
    function () {

        showCases();

    }
);


// ==========================================
// NEW CASE CREATION
// ==========================================

const newCaseModal =
    document.getElementById(
        "newCaseModal"
    );

const newCaseForm =
    document.getElementById(
        "newCaseForm"
    );

const closeNewCaseModal =
    document.getElementById(
        "closeNewCaseModal"
    );

const cancelNewCaseButton =
    document.getElementById(
        "cancelNewCaseButton"
    );

const newCaseModalOverlay =
    document.getElementById(
        "newCaseModalOverlay"
    );

const newCaseError =
    document.getElementById(
        "newCaseError"
    );

const saveNewCaseButton =
    document.getElementById(
        "saveNewCaseButton"
    );

const newCaseName =
    document.getElementById(
        "newCaseName"
    );

const newCaseType =
    document.getElementById(
        "newCaseType"
    );

const newCasePriority =
    document.getElementById(
        "newCasePriority"
    );

const newCaseClient =
    document.getElementById(
        "newCaseClient"
    );

const newCaseLocation =
    document.getElementById(
        "newCaseLocation"
    );

const newCaseTeam =
    document.getElementById(
        "newCaseTeam"
    );

const newCaseInvestigationDate =
    document.getElementById(
        "newCaseInvestigationDate"
    );

const newCaseDescription =
    document.getElementById(
        "newCaseDescription"
    );


function openNewCaseModal() {

    if (!newCaseModal) {

        console.error(
            "NEW CASE MODAL NOT FOUND"
        );

        return;

    }

    if (newCaseForm) {

        newCaseForm.reset();

    }

    if (newCasePriority) {

        newCasePriority.value =
            "Normal";

    }

    if (newCaseError) {

        newCaseError.textContent =
            "";

    }

    newCaseModal.classList.remove(
        "hidden"
    );

    newCaseModal.style.display =
        "flex";

    if (newCaseName) {

        newCaseName.focus();

    }

}


function closeNewCaseModalFunction() {

    if (newCaseModal) {

        newCaseModal.classList.add(
            "hidden"
        );

        newCaseModal.style.display =
            "";

    }

    if (newCaseError) {

        newCaseError.textContent =
            "";

    }

}


if (closeNewCaseModal) {

    closeNewCaseModal.addEventListener(
        "click",
        closeNewCaseModalFunction
    );

}


if (cancelNewCaseButton) {

    cancelNewCaseButton.addEventListener(
        "click",
        closeNewCaseModalFunction
    );

}


if (newCaseModalOverlay) {

    newCaseModalOverlay.addEventListener(
        "click",
        closeNewCaseModalFunction
    );

}


// ==========================================
// CASE NAVIGATION
// ==========================================

if (casesButton) {

    casesButton.addEventListener(
        "click",
        function () {

            showCases();

        }
    );

}


if (newCaseButton) {

    newCaseButton.addEventListener(
        "click",
        function () {

            showCases();

            openNewCaseModal();

        }
    );

}


if (newCaseListButton) {

    newCaseListButton.addEventListener(
        "click",
        function () {

            openNewCaseModal();

        }
    );

}


if (casesBackButton) {

    casesBackButton.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );

}


if (caseFileBackButton) {

    caseFileBackButton.addEventListener(
        "click",
        function () {

            showCases();

        }
    );

}


async function generateNextCaseNumber() {

    const year =
        new Date().getFullYear();

    const prefix =
        `NH-${year}-`;

    const snapshot =
        await getDocs(
            collection(
                db,
                "cases"
            )
        );

    let highestNumber =
        0;

    snapshot.forEach(
        function (caseDocument) {

            const caseData =
                caseDocument.data();

            const caseNumber =
                String(
                    caseData.caseNumber || ""
                );

            if (
                caseNumber.startsWith(
                    prefix
                )
            ) {

                const number =
                    parseInt(
                        caseNumber.substring(
                            prefix.length
                        ),
                        10
                    );

                if (
                    !isNaN(number) &&
                    number > highestNumber
                ) {

                    highestNumber =
                        number;

                }

            }

        }
    );

    return (
        prefix +
        String(
            highestNumber + 1
        ).padStart(
            3,
            "0"
        )
    );

}


async function createNewCase() {

    if (!newCaseForm) {

        return;

    }

    if (
        !newCaseForm.checkValidity()
    ) {

        newCaseForm.reportValidity();

        return;

    }

    if (newCaseError) {

        newCaseError.textContent =
            "";

    }

    saveNewCaseButton.disabled =
        true;

    saveNewCaseButton.textContent =
        "Creating Case...";


    try {

        const user =
            auth.currentUser;


        if (!user) {

            throw new Error(
                "You must be signed in to create a case."
            );

        }


        // ==================================
        // GET CREATOR
        // ==================================

        const userSnapshot =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );


        if (
            !userSnapshot.exists()
        ) {

            throw new Error(
                "Your personnel record could not be found."
            );

        }


        const userData =
            userSnapshot.data();


        const permissions =
            getUserPermissions(
                userData.role
            );


        if (
            !permissions ||
            !permissions.createCases
        ) {

            throw new Error(
                "You do not have permission to create cases."
            );

        }


        // ==================================
        // GENERATE CASE NUMBER
        // ==================================

        const caseNumber =
            await generateNextCaseNumber();


        // ==================================
        // CREATE CASE DOCUMENT
        // ==================================

        const caseReference =
            doc(
                collection(
                    db,
                    "cases"
                )
            );


        await setDoc(
            caseReference,
            {

                caseNumber:
                    caseNumber,

                caseName:
                    newCaseName.value.trim(),

                caseType:
                    newCaseType.value,

                priority:
                    newCasePriority.value,

                status:
                    "Active",

                client:
                    newCaseClient.value.trim(),

                location:
                    newCaseLocation.value.trim(),

                assignedTeamId:
                    newCaseTeam.value,

                investigationDate:
                    newCaseInvestigationDate.value,

                description:
                    newCaseDescription.value.trim(),

                createdBy:
                    user.uid,

                createdByName:
                    userData.name ||
                    user.email,

                createdByRole:
                    userData.role,

                dateOpened:
                    new Date().toISOString(),

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }
        );


        console.log(
            "CASE CREATED:",
            caseNumber
        );


        closeNewCaseModalFunction();


        await loadCases();


        openCaseFile(
            caseReference.id
        );


    } catch (error) {

        console.error(
            "NEW CASE CREATION ERROR:",
            error
        );


        if (newCaseError) {

            newCaseError.textContent =
                error.message ||
                "Unable to create case.";

        }

    } finally {

        saveNewCaseButton.disabled =
            false;

        saveNewCaseButton.textContent =
            "Create Case";

    }

}


if (newCaseForm) {

    newCaseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await createNewCase();

        }
    );

}


evidenceButton.addEventListener(
    "click",
    function () {

        alert(
            "Evidence Management will be built in Phase 3."
        );

    }
);

casesBackButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);


caseFileBackButton.addEventListener(
    "click",
    function () {

        showCases();

    }
);


reportsButton.addEventListener(
    "click",
    function () {

        alert(
            "Reports will be built later."
        );

    }
);

async function loadCases() {

    casesList.innerHTML = `
        <p class="loading-message">
            Loading cases...
        </p>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "cases"
                )
            );


        allCases = [];


        snapshot.forEach(
            function (caseDocument) {

                allCases.push({

                    id:
                        caseDocument.id,

                    ...caseDocument.data()

                });

            }
        );


        updateCaseStatistics();

        renderCases();


    } catch (error) {

        console.error(
            "CASES LOAD ERROR:",
            error
        );


        casesList.innerHTML = `
            <p class="loading-message">
                Unable to load cases.
            </p>
        `;

    }

}

function renderCases() {

    const searchTerm =
        caseSearch.value
            .toLowerCase()
            .trim();


    const status =
        caseStatusFilter.value;


    const team =
        caseTeamFilter.value;


    const filteredCases =
        allCases.filter(
            function (caseData) {

                const matchesSearch =

                    !searchTerm ||

                    (
                        String(
                            caseData.caseNumber || ""
                        )
                        .toLowerCase()
                        .includes(searchTerm)
                    ) ||

                    (
                        String(
                            caseData.caseName || ""
                        )
                        .toLowerCase()
                        .includes(searchTerm)
                    ) ||

                    (
                        String(
                            caseData.client || ""
                        )
                        .toLowerCase()
                        .includes(searchTerm)
                    ) ||

                    (
                        String(
                            caseData.location || ""
                        )
                        .toLowerCase()
                        .includes(searchTerm)
                    );


                const matchesStatus =
                    status === "all" ||
                    caseData.status === status;


                const matchesTeam =
                    team === "all" ||
                    caseData.assignedTeamId === team;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesTeam
                );

            }
        );


    casesList.innerHTML = "";


    if (
        filteredCases.length === 0
    ) {

        casesList.innerHTML = `
            <p class="loading-message">
                No cases found.
            </p>
        `;

        return;

    }


    filteredCases.forEach(
        function (caseData) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "personnel-row";


            row.style.gridTemplateColumns =
                "1fr 2fr 1.2fr 1.2fr 1.2fr";


            row.innerHTML = `

                <div>

                    <div class="personnel-name">
                        ${caseData.caseNumber || "—"}
                    </div>

                </div>


                <div>

                    <div class="personnel-name">
                        ${caseData.caseName || "Unnamed Case"}
                    </div>

                    <div class="personnel-email">
                        ${caseData.client || "No client listed"}
                    </div>

                </div>


                <div class="personnel-status">

                    ${caseData.status || "Unknown"}

                </div>


                <div class="personnel-team">

                    ${getTeamDisplayName(
                        caseData.assignedTeamId
                    )}

                </div>


                <div class="personnel-team">

                    ${formatDate(
                        caseData.investigationDate
                    )}

                </div>

            `;


            casesList.appendChild(
                row
            );


            row.addEventListener(
                "click",
                function () {

                    openCaseFile(
                        caseData.id
                    );

                }
            );

        }
    );

}

function updateCaseStatistics() {

    const active =
        allCases.filter(
            caseData =>
                caseData.status === "Active"
        ).length;


    const completed =
        allCases.filter(
            caseData =>
                caseData.status === "Completed"
        ).length;


    activeCaseCount.textContent =
        active;


    completedCaseCount.textContent =
        completed;

}

caseSearch.addEventListener(
    "input",
    renderCases
);


caseStatusFilter.addEventListener(
    "change",
    renderCases
);


caseTeamFilter.addEventListener(
    "change",
    renderCases
);

async function openCaseFile(
    caseId
) {

    currentCaseId =
        caseId;


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "cases",
                    caseId
                )
            );


        if (
            !snapshot.exists()
        ) {

            console.error(
                "CASE NOT FOUND:",
                caseId
            );

            return;

        }


        const caseData =
            snapshot.data();


        document.getElementById(
            "caseProfileNumber"
        ).textContent =
            caseData.caseNumber ||
            "CASE";


        document.getElementById(
            "caseProfileName"
        ).textContent =
            caseData.caseName ||
            "Investigation";


        document.getElementById(
            "caseFieldNumber"
        ).textContent =
            caseData.caseNumber ||
            "—";


        document.getElementById(
            "caseFieldStatus"
        ).textContent =
            caseData.status ||
            "—";


        document.getElementById(
            "caseFieldPriority"
        ).textContent =
            caseData.priority ||
            "—";


        document.getElementById(
            "caseFieldType"
        ).textContent =
            caseData.caseType ||
            "—";


        document.getElementById(
            "caseFieldClient"
        ).textContent =
            caseData.client ||
            "—";


        document.getElementById(
            "caseFieldLocation"
        ).textContent =
            caseData.location ||
            "—";


        document.getElementById(
            "caseFieldTeam"
        ).textContent =
            getTeamDisplayName(
                caseData.assignedTeamId
            );


        document.getElementById(
            "caseFieldInvestigationDate"
        ).textContent =
            formatDate(
                caseData.investigationDate
            );


        document.getElementById(
            "caseFieldOpened"
        ).textContent =
            formatDate(
                caseData.dateOpened
            );


        document.getElementById(
            "caseFieldCreatedBy"
        ).textContent =
            caseData.createdByName ||
            caseData.createdBy ||
            "—";


        document.getElementById(
            "caseFieldDescription"
        ).textContent =
            caseData.description ||
            "No description provided.";


        showCaseFile();


    } catch (error) {

        console.error(
            "CASE FILE ERROR:",
            error
        );

    }

}

function formatDate(
    value
) {

    if (!value) {

        return "—";

    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString();

}

// ==========================================
// ADD PERSONNEL
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


addPersonnelForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


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
            ).value;


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


            await setDoc(
                personnelRef,
                {

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

                }
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

editPersonnelButton.addEventListener(
    "click",
    async function () {

        if (
            !currentPersonnelId
        ) {

            return;

        }


        try {

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        "users",
                        currentPersonnelId
                    )
                );


            if (
                !snapshot.exists()
            ) {

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


editPersonnelForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            editPersonName.value.trim();


        const email =
            editPersonEmail.value
                .trim()
                .toLowerCase();


        const role =
            editPersonRole.value;


        const team =
            editPersonTeam.value;


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

            await updateDoc(
                doc(
                    db,
                    "users",
                    currentPersonnelId
                ),
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

        if (
            !currentPersonnelId
        ) {

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

                return;

            }


            const person =
                snapshot.data();


            const isActive =
                person.active === true;


            const confirmed =
                confirm(
                    isActive
                        ? `Are you sure you want to disable ${person.name}?`
                        : `Are you sure you want to reactivate ${person.name}?`
                );


            if (
                !confirmed
            ) {

                return;

            }


            await updateDoc(
                userRef,
                {

                    active:
                        !isActive,

                    accountStatus:
                        isActive
                            ? "Disabled"
                            : "Active",

                    statusUpdatedAt:
                        new Date().toISOString()

                }
            );


            await openPersonnelFile(
                currentPersonnelId
            );


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


// ==========================================
// LOAD TEAMS
// ==========================================

async function loadTeams() {

    teamsList.innerHTML = `
        <p class="loading-message">
            Loading teams...
        </p>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "teams"
                )
            );


        teamsList.innerHTML = "";


        if (
            snapshot.empty
        ) {

            teamsList.innerHTML = `
                <p class="loading-message">
                    No teams found.
                </p>
            `;

            return;

        }


        const personnelSnapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        const personnel =
            [];


        personnelSnapshot.forEach(
            function (document) {

                personnel.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        snapshot.forEach(
            function (teamDocument) {

                const team =
                    teamDocument.data();


                const lead =
                    personnel.find(
                        person =>
                            person.id ===
                            team.teamLeadId
                    );


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "personnel-row";


                row.innerHTML = `

                    <div>

                        <div class="personnel-name">
                            ${team.name || "Unnamed Team"}
                        </div>

                    </div>

                    <div class="personnel-role">
                        ${team.teamType || "Unknown"}
                    </div>

                    <div class="personnel-team">
                        ${lead
                            ? lead.name
                            : "Unassigned"}
                    </div>

                    <div class="personnel-status ${
                        team.active
                            ? "status-active"
                            : "status-inactive"
                    }">

                        ${
                            team.active
                                ? "ACTIVE"
                                : "INACTIVE"
                        }

                    </div>

                `;


                teamsList.appendChild(
                    row
                );


                row.addEventListener(
                    "click",
                    function () {

                        openTeamFile(
                            teamDocument.id
                        );

                    }
                );

            }
        );


    } catch (error) {

        console.error(
            "TEAMS LOAD ERROR:",
            error
        );


        teamsList.innerHTML = `
            <p class="loading-message">
                Unable to load teams.
            </p>
        `;

    }

}


// ==========================================
// OPEN TEAM FILE
// ==========================================

async function openTeamFile(
    teamId
) {

    currentTeamId =
        teamId;


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "teams",
                    teamId
                )
            );


        if (
            !snapshot.exists()
        ) {

            console.error(
                "TEAM NOT FOUND:",
                teamId
            );

            return;

        }


        const team =
            snapshot.data();


        teamProfileName.textContent =
            team.name ||
            "Unnamed Team";


        teamProfileType.textContent =
            team.teamType ||
            "Team";


        teamProfileTypeField.textContent =
            team.teamType ||
            "Unknown";


        teamProfileStatus.textContent =
            team.active
                ? "ACTIVE"
                : "INACTIVE";


        teamProfileDescription.textContent =
            team.description ||
            "No description provided.";


        if (
            team.createdAt
        ) {

            const date =
                new Date(
                    team.createdAt
                );


            teamProfileCreated.textContent =
                isNaN(
                    date.getTime()
                )
                    ? "Unknown"
                    : date.toLocaleDateString();

        } else {

            teamProfileCreated.textContent =
                "Unknown";

        }


        await loadTeamMembers(
            team
        );


        await loadTeamLead(
            team
        );


        teamStatusButton
            .querySelector("strong")
            .textContent =
                team.active
                    ? "Disable Team"
                    : "Reactivate Team";


        showTeamFile();


    } catch (error) {

        console.error(
            "TEAM FILE ERROR:",
            error
        );

    }

}


// ==========================================
// LOAD TEAM LEAD
// ==========================================

async function loadTeamLead(
    team
) {

    if (
        !team.teamLeadId
    ) {

        teamProfileLead.textContent =
            "Unassigned";

        return;

    }


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "users",
                    team.teamLeadId
                )
            );


        if (
            snapshot.exists()
        ) {

            const person =
                snapshot.data();


            teamProfileLead.textContent =
                person.name ||
                "Unknown";

        } else {

            teamProfileLead.textContent =
                "Unassigned";

        }

    } catch (error) {

        console.error(
            "TEAM LEAD LOAD ERROR:",
            error
        );

        teamProfileLead.textContent =
            "Unknown";

    }

}


// ==========================================
// LOAD TEAM MEMBERS
// ==========================================

async function loadTeamMembers(
    team
) {

    teamMembersList.innerHTML = `
        <p class="loading-message">
            Loading members...
        </p>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        const members =
            [];


        snapshot.forEach(
            function (document) {

                const person =
                    document.data();


                if (
                    person.team ===
                    currentTeamId
                ) {

                    members.push({

                        id:
                            document.id,

                        ...person

                    });

                }

            }
        );


        teamProfileMemberCount.textContent =
            members.length;


        teamMembersList.innerHTML = "";


        if (
            members.length === 0
        ) {

            teamMembersList.innerHTML = `
                <p class="loading-message">
                    No personnel assigned to this team.
                </p>
            `;

            return;

        }


        members.forEach(
            function (person) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "personnel-row";


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
                        ${person.active
                            ? "ACTIVE"
                            : "INACTIVE"}
                    </div>

                    <div class="personnel-status">
                        ${person.id === teamLeadIdSafe(team)
                            ? "TEAM LEAD"
                            : ""}
                    </div>

                `;


                teamMembersList.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "TEAM MEMBERS LOAD ERROR:",
            error
        );


        teamMembersList.innerHTML = `
            <p class="loading-message">
                Unable to load team members.
            </p>
        `;

    }

}


// ==========================================
// TEAM LEAD HELPER
// ==========================================

function teamLeadIdSafe(
    team
) {

    return team.teamLeadId ||
        null;

}


// ==========================================
// EDIT TEAM
// ==========================================

editTeamButton.addEventListener(
    "click",
    async function () {

        if (
            !currentTeamId
        ) {

            return;

        }


        try {

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        "teams",
                        currentTeamId
                    )
                );


            if (
                !snapshot.exists()
            ) {

                return;

            }


            const team =
                snapshot.data();


            editTeamName.value =
                team.name ||
                "";


            editTeamType.value =
                team.teamType ||
                "Investigation";


            editTeamDescription.value =
                team.description ||
                "";


            await loadTeamLeadOptions(
                team.teamLeadId
            );


            editTeamError.textContent =
                "";


            editTeamModal.classList.remove(
                "hidden"
            );


            editTeamModal.style.display =
                "flex";


        } catch (error) {

            console.error(
                "EDIT TEAM LOAD ERROR:",
                error
            );

        }

    }
);


// ==========================================
// LOAD TEAM LEAD OPTIONS
// ==========================================

async function loadTeamLeadOptions(
    selectedId
) {

    editTeamLead.innerHTML = `

        <option value="">
            Select Team Lead
        </option>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        snapshot.forEach(
            function (document) {

                const person =
                    document.data();


                if (
                    !person.active
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    document.id;


                option.textContent =
                    `${person.name} — ${person.role}`;


                if (
                    document.id ===
                    selectedId
                ) {

                    option.selected =
                        true;

                }


                editTeamLead.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "TEAM LEAD OPTIONS ERROR:",
            error
        );

    }

}


// ==========================================
// CLOSE EDIT TEAM
// ==========================================

function closeEditTeamModalWindow() {

    editTeamModal.classList.add(
        "hidden"
    );

    editTeamModal.style.display =
        "";

    editTeamForm.reset();

    editTeamError.textContent =
        "";

}


closeEditTeamModal.addEventListener(
    "click",
    closeEditTeamModalWindow
);


cancelEditTeamButton.addEventListener(
    "click",
    closeEditTeamModalWindow
);


editTeamModalOverlay.addEventListener(
    "click",
    closeEditTeamModalWindow
);


// ==========================================
// SAVE TEAM
// ==========================================

editTeamForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            editTeamName.value.trim();


        const teamType =
            editTeamType.value;


        const teamLeadId =
            editTeamLead.value ||
            null;


        const description =
            editTeamDescription.value.trim();


        if (
            !name ||
            !teamType
        ) {

            editTeamError.textContent =
                "Please complete all required fields.";

            return;

        }


        try {

            await updateDoc(
                doc(
                    db,
                    "teams",
                    currentTeamId
                ),
                {

                    name:
                        name,

                    teamType:
                        teamType,

                    teamLeadId:
                        teamLeadId,

                    description:
                        description,

                    updatedAt:
                        new Date().toISOString()

                }
            );


            closeEditTeamModalWindow();


            await openTeamFile(
                currentTeamId
            );


            await loadTeams();


        } catch (error) {

            console.error(
                "UPDATE TEAM ERROR:",
                error
            );


            editTeamError.textContent =
                "Unable to save team changes.";

        }

    }
);


// ==========================================
// DISABLE / REACTIVATE TEAM
// ==========================================

teamStatusButton.addEventListener(
    "click",
    async function () {

        if (
            !currentTeamId
        ) {

            return;

        }


        try {

            const teamRef =
                doc(
                    db,
                    "teams",
                    currentTeamId
                );


            const snapshot =
                await getDoc(
                    teamRef
                );


            if (
                !snapshot.exists()
            ) {

                return;

            }


            const team =
                snapshot.data();


            const isActive =
                team.active === true;


            const confirmed =
                confirm(
                    isActive
                        ? `Are you sure you want to disable ${team.name}?`
                        : `Are you sure you want to reactivate ${team.name}?`
                );


            if (
                !confirmed
            ) {

                return;

            }


            await updateDoc(
                teamRef,
                {

                    active:
                        !isActive,

                    updatedAt:
                        new Date().toISOString()

                }
            );


            await openTeamFile(
                currentTeamId
            );


            await loadTeams();


        } catch (error) {

            console.error(
                "TEAM STATUS UPDATE ERROR:",
                error
            );


            alert(
                "Unable to update team status."
            );

        }

    }
);
