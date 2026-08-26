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
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ==========================================
// FIREBASE
// ==========================================

const app =
    initializeApp(
        firebaseConfig
    );

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ==========================================
// LOGIN
// ==========================================

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginError =
    document.getElementById(
        "loginError"
    );


// ==========================================
// DASHBOARD
// ==========================================

const dashboardScreen =
    document.getElementById(
        "dashboardScreen"
    );

const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );

const userRole =
    document.getElementById(
        "userRole"
    );

const userTeam =
    document.getElementById(
        "userTeam"
    );

const topbarUserName =
    document.getElementById(
        "topbarUserName"
    );

const topbarUserRole =
    document.getElementById(
        "topbarUserRole"
    );


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// ==========================================
// DASHBOARD BUTTONS
// ==========================================

const casesButton =
    document.getElementById(
        "casesButton"
    );

const newCaseButton =
    document.getElementById(
        "newCaseButton"
    );

const personnelButton =
    document.getElementById(
        "personnelButton"
    );

const teamsButton =
    document.getElementById(
        "teamsButton"
    );

const evidenceButton =
    document.getElementById(
        "evidenceButton"
    );

const reportsButton =
    document.getElementById(
        "reportsButton"
    );


// ==========================================
// CASE DOCUMENT MANAGEMENT
// ==========================================

function getCaseDocumentsCollection(
    caseId
) {

    return collection(
        db,
        "cases",
        caseId,
        "documents"
    );

}


function formatDocumentDate(
    value
) {

    if (!value) {

        return "Unknown date";

    }


    if (
        typeof value.toDate ===
        "function"
    ) {

        return value
            .toDate()
            .toLocaleString();

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString();

}


async function canManageCaseDocuments() {

    const user =
        auth.currentUser;


    if (!user) {

        return false;

    }


    const snapshot =
        await getDoc(
            doc(
                db,
                "users",
                user.uid
            )
        );


    if (
        !snapshot.exists()
    ) {

        return false;

    }


    const userData =
        snapshot.data();


    const permissions =
        getUserPermissions(
            userData.role
        );


    return Boolean(
        permissions &&
        permissions.manageCaseDocuments
    );

}


// ==========================================
// OPEN NEW CASE DOCUMENT
// ==========================================

async function openNewCaseDocument() {

    if (
        !currentCaseId ||
        !caseDocumentModal
    ) {

        return;

    }


    currentCaseDocumentId =
        null;


    if (caseDocumentForm) {

        caseDocumentForm.reset();

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const user =
        auth.currentUser;


    let firstName = "";

    let lastName = "";


    if (user) {

        try {

            const userSnapshot =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );


            if (
                userSnapshot.exists()
            ) {

                const userData =
                    userSnapshot.data();


                const nameParts =
                    String(
                        userData.name ||
                        ""
                    )
                    .trim()
                    .split(/\s+/);


                firstName =
                    nameParts[0] ||
                    "";


                lastName =
                    nameParts
                        .slice(1)
                        .join(" ");

            }

        } catch (error) {

            console.error(
                "DOCUMENT USER PREFILL ERROR:",
                error
            );

        }

    }


    caseDocumentModalTitle.textContent =
        "New Case Document";


    caseDocumentError.textContent =
        "";


    caseDocumentModal.classList.remove(
        "hidden"
    );


    caseDocumentModal.style.display =
        "flex";


    renderCaseDocumentQuestionnaire(
        caseDocumentType.value,
        {
            firstName:
                firstName,

            lastName:
                lastName,

            todayDate:
                today
        }
    );


    caseDocumentType.focus();

}


// ==========================================
// CLOSE CASE DOCUMENT
// ==========================================

function closeCaseDocument() {

    if (
        caseDocumentModal
    ) {

        caseDocumentModal.classList.add(
            "hidden"
        );

        caseDocumentModal.style.display =
            "";

    }

}


// ==========================================
// LOAD CASE DOCUMENTS
// ==========================================

async function loadCaseDocuments() {

    if (
        !currentCaseId ||
        !caseDocumentsList
    ) {

        return;

    }


    caseDocumentsList.innerHTML = `
        <p class="loading-message">
            Loading case documents...
        </p>
    `;


    try {

        const snapshot =
            await getDocs(
                getCaseDocumentsCollection(
                    currentCaseId
                )
            );


        allCaseDocuments =
            [];


        snapshot.forEach(
            function (
                documentSnapshot
            ) {

                allCaseDocuments.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        allCaseDocuments.sort(
            function (
                a,
                b
            ) {

                return (
                    new Date(
                        b.updatedAt ||
                        b.createdAt ||
                        0
                    ) -
                    new Date(
                        a.updatedAt ||
                        a.createdAt ||
                        0
                    )
                );

            }
        );


        renderCaseDocuments();


    } catch (error) {

        console.error(
            "CASE DOCUMENT LOAD ERROR:",
            error
        );


        caseDocumentsList.innerHTML = `
            <div class="case-document-empty">
                Unable to load case documents.
            </div>
        `;

    }

}


// ==========================================
// RENDER CASE DOCUMENTS
// ==========================================

function renderCaseDocuments() {

    if (
        !caseDocumentsList
    ) {

        return;

    }


    caseDocumentsList.innerHTML =
        "";


    if (
        allCaseDocuments.length ===
        0
    ) {

        caseDocumentsList.innerHTML = `
            <div class="case-document-empty">
                <strong>
                    No case documents yet.
                </strong>

                <p>
                    Create an Investigation Report,
                    Witness Report,
                    Location History,
                    or IPO.
                </p>
            </div>
        `;

        return;

    }


    allCaseDocuments.forEach(
        function (
            documentData
        ) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "case-document-card";


            const preview =
                String(
                    documentData.content ||
                    ""
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


            card.innerHTML = `

                <span
                    class="case-document-type"
                >
                    ${
                        documentData.documentType ||
                        "DOCUMENT"
                    }
                </span>


                <h3>
                    ${
                        documentData.title ||
                        "Untitled Document"
                    }
                </h3>


                <p>

                    By
                    ${
                        documentData.authorName ||
                        "Unknown"
                    }

                    ·

                    ${
                        formatDocumentDate(
                            documentData.updatedAt ||
                            documentData.createdAt
                        )
                    }

                </p>


                <p
                    class="case-document-preview"
                >
                    ${
                        preview ||
                        "No content available."
                    }
                </p>

            `;


            card.addEventListener(
                "click",
                function () {

                    openCaseDocument(
                        documentData.id
                    );

                }
            );


            caseDocumentsList.appendChild(
                card
            );

        }
    );

}


// ==========================================
// FORMAT CASE DOCUMENT ANSWERS
// ==========================================

function formatCaseDocumentAnswers(
    documentData
) {

    const answers =
        documentData.answers ||
        {};


    const questions =
        CASE_DOCUMENT_QUESTIONS[
            documentData.documentType
        ] || [];


    if (
        questions.length ===
        0
    ) {

        return (
            documentData.content ||
            "No content available."
        );

    }


    const sections =
        [];


    questions.forEach(
        function (
            question
        ) {

            const value =
                answers[
                    question.id
                ];


            if (
                Array.isArray(
                    value
                )
            ) {

                sections.push(
                    `${
                        question.label
                    }: ${
                        value.length
                            ? value.join(
                                ", "
                            )
                            : "None"
                    }`
                );

            } else {

                sections.push(
                    `${
                        question.label
                    }: ${
                        value ||
                        "—"
                    }`
                );

            }

        }
    );


    return sections.join(
        "\n\n"
    );

}


// ==========================================
// OPEN CASE DOCUMENT
// ==========================================

async function openCaseDocument(
    documentId
) {

    const documentData =
        allCaseDocuments.find(
            function (
                item
            ) {

                return (
                    item.id ===
                    documentId
                );

            }
        );


    if (
        !documentData
    ) {

        return;

    }


    currentCaseDocumentId =
        documentId;


    caseDocumentReaderType.textContent =
        documentData.documentType ||
        "CASE DOCUMENT";


    caseDocumentReaderTitle.textContent =
        documentData.title ||
        "Untitled Document";


    caseDocumentReaderMeta.textContent =
        `Author: ${
            documentData.authorName ||
            "Unknown"
        } · Updated: ${
            formatDocumentDate(
                documentData.updatedAt ||
                documentData.createdAt
            )
        }`;


    caseDocumentReaderContent.textContent =
        formatCaseDocumentAnswers(
            documentData
        );


    const canManage =
        await canManageCaseDocuments();


    editCaseDocumentButton.style.display =
        canManage
            ? ""
            : "none";


    deleteCaseDocumentButton.style.display =
        canManage
            ? ""
            : "none";


    caseDocumentReaderModal.classList.remove(
        "hidden"
    );


    caseDocumentReaderModal.style.display =
        "flex";

}


// ==========================================
// CLOSE CASE DOCUMENT READER
// ==========================================

function closeCaseDocumentReaderWindow() {

    if (
        caseDocumentReaderModal
    ) {

        caseDocumentReaderModal.classList.add(
            "hidden"
        );

        caseDocumentReaderModal.style.display =
            "";

    }

}


// ==========================================
// COLLECT CASE DOCUMENT ANSWERS
// ==========================================

function collectCaseDocumentAnswers() {

    const documentType =
        caseDocumentType.value;


    const questions =
        CASE_DOCUMENT_QUESTIONS[
            documentType
        ];


    if (!questions) {

        return {};

    }


    const answers =
        {};


    questions.forEach(
        function (
            question
        ) {

            if (
                question.type ===
                "checkboxes"
            ) {

                const checked =
                    document.querySelectorAll(
                        `input[name="${question.id}"]:checked`
                    );


                answers[
                    question.id
                ] =
                    Array.from(
                        checked
                    ).map(
                        function (
                            checkbox
                        ) {

                            return checkbox.value;

                        }
                    );


                return;

            }


            const element =
                document.getElementById(
                    `caseDoc_${question.id}`
                );


            answers[
                question.id
            ] =
                element
                    ? element.value
                    : "";

        }
    );


    return answers;

}


// ==========================================
// SAVE CASE DOCUMENT
// ==========================================

async function saveCaseDocument() {

    if (
        !currentCaseId ||
        !caseDocumentForm
    ) {

        return;

    }


    if (
        !caseDocumentForm.checkValidity()
    ) {

        caseDocumentForm.reportValidity();

        return;

    }


    const user =
        auth.currentUser;


    if (!user) {

        caseDocumentError.textContent =
            "You must be signed in.";

        return;

    }


    saveCaseDocumentButton.disabled =
        true;


    saveCaseDocumentButton.textContent =
        "Saving...";


    try {

        const allowed =
            await canManageCaseDocuments();


        if (!allowed) {

            throw new Error(
                "You do not have permission to manage case documents."
            );

        }


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


        const answers =
            collectCaseDocumentAnswers();


        const locationName =
            answers.locationName ||
            "Unnamed Location";


        const generatedTitle =
            `${caseDocumentType.value} — ${locationName}`;


        const documentData = {

            documentType:
                caseDocumentType.value,

            title:
                caseDocumentTitle.value.trim() ||
                generatedTitle,

            answers:
                answers,

            authorId:
                user.uid,

            authorName:
                userData.name ||
                user.email ||
                "Unknown",

            status:
                "Completed",

            updatedAt:
                new Date().toISOString()

        };


        if (
            currentCaseDocumentId
        ) {

            await updateDoc(
                doc(
                    db,
                    "cases",
                    currentCaseId,
                    "documents",
                    currentCaseDocumentId
                ),
                documentData
            );

        } else {

            const documentReference =
                doc(
                    getCaseDocumentsCollection(
                        currentCaseId
                    )
                );


            await setDoc(
                documentReference,
                {

                    ...documentData,

                    createdAt:
                        new Date().toISOString()

                }
            );

        }


        closeCaseDocument();


        await loadCaseDocuments();


    } catch (error) {

        console.error(
            "CASE DOCUMENT SAVE ERROR:",
            error
        );


        caseDocumentError.textContent =
            error.message ||
            "Unable to save document.";


    } finally {

        saveCaseDocumentButton.disabled =
            false;


        saveCaseDocumentButton.textContent =
            "Save Document";

    }

}


// ==========================================
// EDIT CURRENT CASE DOCUMENT
// ==========================================

async function editCurrentCaseDocument() {

    const documentData =
        allCaseDocuments.find(
            function (
                item
            ) {

                return (
                    item.id ===
                    currentCaseDocumentId
                );

            }
        );


    if (
        !documentData
    ) {

        return;

    }


    if (
        !await canManageCaseDocuments()
    ) {

        return;

    }


    caseDocumentType.value =
        documentData.documentType ||
        "";


    caseDocumentTitle.value =
        documentData.title ||
        "";


    caseDocumentModalTitle.textContent =
        "Edit Case Document";


    caseDocumentError.textContent =
        "";


    renderCaseDocumentQuestionnaire(
        documentData.documentType ||
        "",
        documentData.answers ||
        {}
    );


    closeCaseDocumentReaderWindow();


    caseDocumentModal.classList.remove(
        "hidden"
    );


    caseDocumentModal.style.display =
        "flex";

}


// ==========================================
// DELETE CURRENT CASE DOCUMENT
// ==========================================

async function deleteCurrentCaseDocument() {

    if (
        !currentCaseId ||
        !currentCaseDocumentId
    ) {

        return;

    }


    if (
        !await canManageCaseDocuments()
    ) {

        alert(
            "You do not have permission to delete case documents."
        );

        return;

    }


    const confirmed =
        confirm(
            "Delete this document permanently?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "cases",
                currentCaseId,
                "documents",
                currentCaseDocumentId
            )
        );


        closeCaseDocumentReaderWindow();


        await loadCaseDocuments();


    } catch (error) {

        console.error(
            "CASE DOCUMENT DELETE ERROR:",
            error
        );


        alert(
            "Unable to delete the document."
        );

    }

}


// ==========================================
// CASE DOCUMENT ELEMENTS
// ==========================================

const newCaseDocumentButton =
    document.getElementById(
        "newCaseDocumentButton"
    );

const caseDocumentsList =
    document.getElementById(
        "caseDocumentsList"
    );

const caseDocumentModal =
    document.getElementById(
        "caseDocumentModal"
    );

const caseDocumentModalOverlay =
    document.getElementById(
        "caseDocumentModalOverlay"
    );

const caseDocumentForm =
    document.getElementById(
        "caseDocumentForm"
    );

const caseDocumentModalTitle =
    document.getElementById(
        "caseDocumentModalTitle"
    );

const caseDocumentType =
    document.getElementById(
        "caseDocumentType"
    );

const caseDocumentTitle =
    document.getElementById(
        "caseDocumentTitle"
    );

const caseDocumentContent =
    document.getElementById(
        "caseDocumentContent"
    );

const caseDocumentError =
    document.getElementById(
        "caseDocumentError"
    );

const closeCaseDocumentModal =
    document.getElementById(
        "closeCaseDocumentModal"
    );

const cancelCaseDocumentButton =
    document.getElementById(
        "cancelCaseDocumentButton"
    );

const saveCaseDocumentButton =
    document.getElementById(
        "saveCaseDocumentButton"
    );

const caseDocumentReaderModal =
    document.getElementById(
        "caseDocumentReaderModal"
    );

const caseDocumentReaderOverlay =
    document.getElementById(
        "caseDocumentReaderOverlay"
    );

const closeCaseDocumentReader =
    document.getElementById(
        "closeCaseDocumentReader"
    );

const closeCaseDocumentReaderButton =
    document.getElementById(
        "closeCaseDocumentReaderButton"
    );

const caseDocumentReaderType =
    document.getElementById(
        "caseDocumentReaderType"
    );

const caseDocumentReaderTitle =
    document.getElementById(
        "caseDocumentReaderTitle"
    );

const caseDocumentReaderMeta =
    document.getElementById(
        "caseDocumentReaderMeta"
    );

const caseDocumentReaderContent =
    document.getElementById(
        "caseDocumentReaderContent"
    );

const editCaseDocumentButton =
    document.getElementById(
        "editCaseDocumentButton"
    );

const deleteCaseDocumentButton =
    document.getElementById(
        "deleteCaseDocumentButton"
    );

let allCases = [];


// ==========================================
// CASE DOCUMENT EVENT HANDLERS
// ==========================================

function showCaseFile() {

    hideAllScreens();

    if (caseFileScreen) {

        caseFileScreen.classList.remove(
            "hidden"
        );

    }

}


if (
    newCaseDocumentButton
) {

    newCaseDocumentButton.addEventListener(
        "click",
        openNewCaseDocument
    );

}


if (
    closeCaseDocumentModal
) {

    closeCaseDocumentModal.addEventListener(
        "click",
        closeCaseDocument
    );

}


if (
    cancelCaseDocumentButton
) {

    cancelCaseDocumentButton.addEventListener(
        "click",
        closeCaseDocument
    );

}


if (
    caseDocumentModalOverlay
) {

    caseDocumentModalOverlay.addEventListener(
        "click",
        closeCaseDocument
    );

}


if (
    caseDocumentForm
) {

    caseDocumentForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();

            saveCaseDocument();

        }
    );

}


if (
    closeCaseDocumentReader
) {

    closeCaseDocumentReader.addEventListener(
        "click",
        closeCaseDocumentReaderWindow
    );

}


if (
    closeCaseDocumentReaderButton
) {

    closeCaseDocumentReaderButton.addEventListener(
        "click",
        closeCaseDocumentReaderWindow
    );

}


if (
    caseDocumentReaderOverlay
) {

    caseDocumentReaderOverlay.addEventListener(
        "click",
        closeCaseDocumentReaderWindow
    );

}


if (
    editCaseDocumentButton
) {

    editCaseDocumentButton.addEventListener(
        "click",
        editCurrentCaseDocument
    );

}


if (
    deleteCaseDocumentButton
) {

    deleteCaseDocumentButton.addEventListener(
        "click",
        deleteCurrentCaseDocument
    );

}


// ==========================================
// CASE MANAGEMENT
// ==========================================

const casesScreen =
    document.getElementById(
        "casesScreen"
    );

const caseFileScreen =
    document.getElementById(
        "caseFileScreen"
    );

const casesBackButton =
    document.getElementById(
        "casesBackButton"
    );

const caseFileBackButton =
    document.getElementById(
        "caseFileBackButton"
    );

const casesList =
    document.getElementById(
        "casesList"
    );

const caseSearch =
    document.getElementById(
        "caseSearch"
    );

const caseStatusFilter =
    document.getElementById(
        "caseStatusFilter"
    );

const caseTeamFilter =
    document.getElementById(
        "caseTeamFilter"
    );

const newCaseListButton =
    document.getElementById(
        "newCaseListButton"
    );

const editCaseButton =
    document.getElementById(
        "editCaseButton"
    );

const editCaseModal =
    document.getElementById(
        "editCaseModal"
    );

const editCaseForm =
    document.getElementById(
        "editCaseForm"
    );

const closeEditCaseModal =
    document.getElementById(
        "closeEditCaseModal"
    );

const cancelEditCaseButton =
    document.getElementById(
        "cancelEditCaseButton"
    );

const editCaseModalOverlay =
    document.getElementById(
        "editCaseModalOverlay"
    );

const editCaseError =
    document.getElementById(
        "editCaseError"
    );

const editCaseName =
    document.getElementById(
        "editCaseName"
    );

const editCaseType =
    document.getElementById(
        "editCaseType"
    );

const editCasePriority =
    document.getElementById(
        "editCasePriority"
    );

const editCaseStatus =
    document.getElementById(
        "editCaseStatus"
    );

const editCaseClient =
    document.getElementById(
        "editCaseClient"
    );

const editCaseLocation =
    document.getElementById(
        "editCaseLocation"
    );

const editCaseTeam =
    document.getElementById(
        "editCaseTeam"
    );

const editCaseInvestigationDate =
    document.getElementById(
        "editCaseInvestigationDate"
    );

const editCaseDescription =
    document.getElementById(
        "editCaseDescription"
    );

const activeCaseCount =
    document.getElementById(
        "activeCaseCount"
    );

const completedCaseCount =
    document.getElementById(
        "completedCaseCount"
    );

let currentCaseId =
    null;

let currentCaseDocumentId =
    null;

let allCaseDocuments =
    [];

// ==========================================
// PERSONNEL SCREEN
// ==========================================

const personnelScreen =
    document.getElementById(
        "personnelScreen"
    );

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

const addTeamButton =
    document.getElementById(
        "addTeamButton"
    );

const addTeamModal =
    document.getElementById(
        "addTeamModal"
    );

const addTeamForm =
    document.getElementById(
        "addTeamForm"
    );

const closeAddTeamModal =
    document.getElementById(
        "closeAddTeamModal"
    );

const cancelAddTeamButton =
    document.getElementById(
        "cancelAddTeamButton"
    );

const addTeamModalOverlay =
    document.getElementById(
        "addTeamModalOverlay"
    );

const addTeamError =
    document.getElementById(
        "addTeamError"
    );

const addTeamName =
    document.getElementById(
        "addTeamName"
    );

const addTeamType =
    document.getElementById(
        "addTeamType"
    );

const addTeamLead =
    document.getElementById(
        "addTeamLead"
    );

const addTeamDescription =
    document.getElementById(
        "addTeamDescription"
    );

const saveAddTeamButton =
    document.getElementById(
        "saveAddTeamButton"
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

let currentPersonnelId =
    null;

let currentTeamId =
    null;


// ==========================================
// ROLE PERMISSIONS
// ==========================================

function getUserPermissions(
    role
) {

    const permissions = {

        Director: {

            viewAllCases: true,

            createCases: true,

            manageUsers: true,

            manageTeams: true,

            manageEvidence: true,

            analyzeEvidence: true,

            manageResearch: true,

            manageCaseDocuments: true

        },


        "Team Lead": {

            viewAllCases: false,

            createCases: true,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: true,

            analyzeEvidence: true,

            manageResearch: true,

            manageCaseDocuments: true

        },


        "Assistant Team Lead": {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: true,

            analyzeEvidence: true,

            manageResearch: true,

            manageCaseDocuments: true

        },


        Investigator: {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: true,

            analyzeEvidence: false,

            manageResearch: false,

            manageCaseDocuments: true

        },


        Researcher: {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: false,

            analyzeEvidence: false,

            manageResearch: true,

            manageCaseDocuments: true

        },


        Analyst: {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: true,

            analyzeEvidence: true,

            manageResearch: false,

            manageCaseDocuments: true

        },


        "Tech Specialist": {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: false,

            analyzeEvidence: false,

            manageResearch: false,

            manageCaseDocuments: true

        },


        "AV Specialist": {

            viewAllCases: false,

            createCases: false,

            manageUsers: false,

            manageTeams: false,

            manageEvidence: true,

            analyzeEvidence: true,

            manageResearch: false,

            manageCaseDocuments: true

        }

    };


    return (
        permissions[role] ||
        null
    );

}


// ==========================================
// SCREEN NAVIGATION
// ==========================================

function hideAllScreens() {

    if (loginScreen) {

        loginScreen.classList.add(
            "hidden"
        );

    }


    if (dashboardScreen) {

        dashboardScreen.classList.add(
            "hidden"
        );

    }


    if (personnelScreen) {

        personnelScreen.classList.add(
            "hidden"
        );

    }


    if (personnelFileScreen) {

        personnelFileScreen.classList.add(
            "hidden"
        );

    }


    if (teamsScreen) {

        teamsScreen.classList.add(
            "hidden"
        );

    }


    if (teamFileScreen) {

        teamFileScreen.classList.add(
            "hidden"
        );

    }


    if (casesScreen) {

        casesScreen.classList.add(
            "hidden"
        );

    }


    if (caseFileScreen) {

        caseFileScreen.classList.add(
            "hidden"
        );

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

    if (
        !teamsScreen ||
        !teamsList
    ) {

        console.warn(
            "Teams screen is not available."
        );

        return;

    }


    hideAllScreens();


    teamsScreen.classList.remove(
        "hidden"
    );

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

    if (
        !casesScreen ||
        !casesList
    ) {

        console.warn(
            "Cases screen is not available."
        );

        return;

    }


    hideAllScreens();


    casesScreen.classList.remove(
        "hidden"
    );


    loadCaseTeamOptions();

    loadCases();

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

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "email"
                );


            const passwordInput =
                document.getElementById(
                    "password"
                );


            const email =
                emailInput
                    ? emailInput.value
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (loginError) {

                loginError.textContent =
                    "";

            }


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


                if (loginError) {

                    loginError.textContent =
                        error.code +
                        ": " +
                        error.message;

                }

            }

        }
    );

}


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    async function (
        user
    ) {

        if (!user) {

            showLogin();

            return;

        }


        showDashboard();


        if (welcomeMessage) {

            welcomeMessage.textContent =
                `Welcome, ${user.email}`;

        }


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


                if (addTeamButton) {

                    addTeamButton.style.display =
                        permissions?.manageTeams
                            ? ""
                            : "none";

                }


                if (editCaseButton) {

                    editCaseButton.style.display =
                        permissions?.createCases ||
                        permissions?.viewAllCases
                            ? ""
                            : "none";

                }


                if (welcomeMessage) {

                    welcomeMessage.textContent =
                        `Welcome, ${
                            userData.name ||
                            user.email
                        }`;

                }


                if (userRole) {

                    userRole.textContent =
                        `Role: ${
                            userData.role ||
                            "Unassigned"
                        }`;

                }


                if (userTeam) {

                    userTeam.textContent =
                        `Team: ${
                            getTeamDisplayName(
                                userData.team
                            )
                        }`;

                }


                if (topbarUserName) {

                    topbarUserName.textContent =
                        userData.name ||
                        user.email;

                }


                if (topbarUserRole) {

                    topbarUserRole.textContent =
                        userData.role ||
                        "Unassigned";

                }

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

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(
                    auth
                );

            } catch (error) {

                console.error(
                    "SIGN OUT ERROR:",
                    error
                );

            }

        }
    );

}


// ==========================================
// LOAD PERSONNEL
// ==========================================

async function loadPersonnel() {

    if (!personnelList) {

        return;

    }


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


        personnelList.innerHTML =
            "";


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
            function (
                userDocument
            ) {

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
                            ${
                                person.name ||
                                "Unnamed"
                            }
                        </div>

                        <div class="personnel-email">
                            ${
                                person.email ||
                                ""
                            }
                        </div>

                    </div>

                    <div class="personnel-role">
                        ${
                            person.role ||
                            "Unassigned"
                        }
                    </div>

                    <div class="personnel-team">
                        ${
                            getTeamDisplayName(
                                person.team
                            )
                        }
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
        teamId ===
        "administration"
    ) {

        return "Administration";

    }


    if (
        teamId ===
        "okc-alpha"
    ) {

        return "OKC Alpha Team";

    }


    return (
        teamId ||
        "Unassigned"
    );

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


        if (profileName) {

            profileName.textContent =
                person.name ||
                "Unnamed";

        }


        if (profileRole) {

            profileRole.textContent =
                person.role ||
                "Unassigned";

        }


        if (profileEmail) {

            profileEmail.textContent =
                person.email ||
                "—";

        }


        if (profileRoleField) {

            profileRoleField.textContent =
                person.role ||
                "Unassigned";

        }


        if (profileTeam) {

            profileTeam.textContent =
                getTeamDisplayName(
                    person.team
                );

        }


        if (profileStatus) {

            profileStatus.textContent =
                person.active
                    ? "ACTIVE"
                    : "INACTIVE";

        }


        if (profileAccountStatus) {

            profileAccountStatus.textContent =
                person.accountStatus ||
                "Unknown";

        }


        if (profileJoined) {

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

        }


        if (
            disablePersonnelButton
        ) {

            const strong =
                disablePersonnelButton
                    .querySelector(
                        "strong"
                    );


            if (strong) {

                strong.textContent =
                    person.active
                        ? "Disable Personnel"
                        : "Reactivate Personnel";

            }

        }


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

if (personnelSearch) {

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
                function (
                    row
                ) {

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

}


// ==========================================
// DASHBOARD NAVIGATION
// ==========================================

if (personnelButton) {

    personnelButton.addEventListener(
        "click",
        function () {

            showPersonnel();

            loadPersonnel();

        }
    );

}


if (teamsButton) {

    teamsButton.addEventListener(
        "click",
        function () {

            if (
                !teamsScreen ||
                !teamsList
            ) {

                console.warn(
                    "Teams screen is not available."
                );

                return;

            }


            showTeams();

            loadTeams();

        }
    );

}


if (personnelBackButton) {

    personnelBackButton.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );

}


if (personnelFileBackButton) {

    personnelFileBackButton.addEventListener(
        "click",
        function () {

            showPersonnel();

        }
    );

}


if (teamsBackButton) {

    teamsBackButton.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );

}


if (teamFileBackButton) {

    teamFileBackButton.addEventListener(
        "click",
        function () {

            showTeams();

        }
    );

}

// ==========================================
// LOAD TEAMS
// ==========================================

async function loadTeams() {

    if (!teamsList) {

        return;

    }


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


        teamsList.innerHTML =
            "";


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


        snapshot.forEach(
            function (
                teamDocument
            ) {

                const team =
                    teamDocument.data();


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "team-row";


                row.dataset.teamId =
                    teamDocument.id;


                row.innerHTML = `

                    <div>

                        <div class="team-name">
                            ${
                                team.name ||
                                "Unnamed Team"
                            }
                        </div>

                        <div class="team-description">
                            ${
                                team.description ||
                                ""
                            }
                        </div>

                    </div>

                    <div class="team-type">
                        ${
                            team.type ||
                            "Unassigned"
                        }
                    </div>

                    <div class="team-lead">
                        ${
                            team.leadName ||
                            team.lead ||
                            "Unassigned"
                        }
                    </div>

                    <div class="team-status">
                        ${
                            team.active === false
                                ? "INACTIVE"
                                : "ACTIVE"
                        }
                    </div>

                `;


                row.addEventListener(
                    "click",
                    function () {

                        openTeamFile(
                            teamDocument.id
                        );

                    }
                );


                teamsList.appendChild(
                    row
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
// LOAD TEAM MEMBERS
// ==========================================

async function loadTeamMembers(
    teamId
) {

    if (
        !teamMembersList
    ) {

        return;

    }


    teamMembersList.innerHTML = `
        <p class="loading-message">
            Loading team members...
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


        teamMembersList.innerHTML =
            "";


        let memberCount =
            0;


        snapshot.forEach(
            function (
                userDocument
            ) {

                const person =
                    userDocument.data();


                if (
                    person.team !==
                    teamId
                ) {

                    return;

                }


                memberCount++;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "team-member-row";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${
                                person.name ||
                                "Unnamed"
                            }
                        </strong>

                        <span>
                            ${
                                person.email ||
                                ""
                            }
                        </span>

                    </div>

                    <div>
                        ${
                            person.role ||
                            "Unassigned"
                        }
                    </div>

                    <div>
                        ${
                            person.active
                                ? "ACTIVE"
                                : "INACTIVE"
                        }
                    </div>

                `;


                row.addEventListener(
                    "click",
                    function () {

                        openPersonnelFile(
                            userDocument.id
                        );

                    }
                );


                teamMembersList.appendChild(
                    row
                );

            }
        );


        if (
            memberCount ===
            0
        ) {

            teamMembersList.innerHTML = `
                <p class="loading-message">
                    No personnel are assigned
                    to this team.
                </p>
            `;

        }


        if (
            teamProfileMemberCount
        ) {

            teamProfileMemberCount.textContent =
                memberCount;

        }


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

            return;

        }


        const team =
            snapshot.data();


        if (
            teamProfileName
        ) {

            teamProfileName.textContent =
                team.name ||
                "Unnamed Team";

        }


        if (
            teamProfileType
        ) {

            teamProfileType.textContent =
                team.type ||
                "Unassigned";

        }


        if (
            teamProfileStatus
        ) {

            teamProfileStatus.textContent =
                team.active === false
                    ? "INACTIVE"
                    : "ACTIVE";

        }


        if (
            teamProfileLead
        ) {

            teamProfileLead.textContent =
                team.leadName ||
                team.lead ||
                "Unassigned";

        }


        if (
            teamProfileDescription
        ) {

            teamProfileDescription.textContent =
                team.description ||
                "No description provided.";

        }


        if (
            teamProfileCreated
        ) {

            teamProfileCreated.textContent =
                formatDocumentDate(
                    team.createdAt
                );

        }


        if (
            teamStatusButton
        ) {

            const strong =
                teamStatusButton.querySelector(
                    "strong"
                );


            if (strong) {

                strong.textContent =
                    team.active === false
                        ? "Activate Team"
                        : "Deactivate Team";

            }

        }


        await loadTeamMembers(
            teamId
        );


        showTeamFile();


    } catch (error) {

        console.error(
            "TEAM FILE ERROR:",
            error
        );

    }

}


// ==========================================
// ADD TEAM MODAL
// ==========================================

function openAddTeamModal() {

    if (
        !addTeamModal
    ) {

        return;

    }


    if (
        addTeamForm
    ) {

        addTeamForm.reset();

    }


    if (
        addTeamError
    ) {

        addTeamError.textContent =
            "";

    }


    addTeamModal.classList.remove(
        "hidden"
    );


    addTeamModal.style.display =
        "flex";

}


function closeAddTeamModalWindow() {

    if (
        addTeamModal
    ) {

        addTeamModal.classList.add(
            "hidden"
        );

        addTeamModal.style.display =
            "";

    }

}


// ==========================================
// SAVE TEAM
// ==========================================

async function saveNewTeam(
    event
) {

    event.preventDefault();


    if (
        !addTeamForm
    ) {

        return;

    }


    if (
        !addTeamForm.checkValidity()
    ) {

        addTeamForm.reportValidity();

        return;

    }


    const user =
        auth.currentUser;


    if (!user) {

        return;

    }


    if (
        addTeamError
    ) {

        addTeamError.textContent =
            "";

    }


    if (
        saveAddTeamButton
    ) {

        saveAddTeamButton.disabled =
            true;

        saveAddTeamButton.textContent =
            "Saving...";

    }


    try {

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
                "Your personnel record was not found."
            );

        }


        const currentUser =
            userSnapshot.data();


        const permissions =
            getUserPermissions(
                currentUser.role
            );


        if (
            !permissions ||
            !permissions.manageTeams
        ) {

            throw new Error(
                "You do not have permission to create teams."
            );

        }


        const teamName =
            addTeamName.value.trim();


        const teamType =
            addTeamType.value.trim();


        const teamLead =
            addTeamLead.value.trim();


        const teamDescription =
            addTeamDescription.value.trim();


        const teamId =
            teamName
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );


        if (!teamId) {

            throw new Error(
                "Please enter a valid team name."
            );

        }


        await setDoc(
            doc(
                db,
                "teams",
                teamId
            ),
            {

                name:
                    teamName,

                type:
                    teamType,

                lead:
                    teamLead,

                leadName:
                    teamLead,

                description:
                    teamDescription,

                active:
                    true,

                createdBy:
                    user.uid,

                createdAt:
                    new Date().toISOString()

            }
        );


        closeAddTeamModalWindow();


        await loadTeams();


    } catch (error) {

        console.error(
            "ADD TEAM ERROR:",
            error
        );


        if (
            addTeamError
        ) {

            addTeamError.textContent =
                error.message ||
                "Unable to create team.";

        }

    } finally {

        if (
            saveAddTeamButton
        ) {

            saveAddTeamButton.disabled =
                false;

            saveAddTeamButton.textContent =
                "Save Team";

        }

    }

}


// ==========================================
// ADD TEAM EVENT HANDLERS
// ==========================================

if (
    addTeamButton
) {

    addTeamButton.addEventListener(
        "click",
        openAddTeamModal
    );

}


if (
    closeAddTeamModal
) {

    closeAddTeamModal.addEventListener(
        "click",
        closeAddTeamModalWindow
    );

}


if (
    cancelAddTeamButton
) {

    cancelAddTeamButton.addEventListener(
        "click",
        closeAddTeamModalWindow
    );

}


if (
    addTeamModalOverlay
) {

    addTeamModalOverlay.addEventListener(
        "click",
        closeAddTeamModalWindow
    );

}


if (
    addTeamForm
) {

    addTeamForm.addEventListener(
        "submit",
        saveNewTeam
    );

}


// ==========================================
// EDIT TEAM
// ==========================================

function openEditTeamModal() {

    if (
        !currentTeamId ||
        !editTeamModal
    ) {

        return;

    }


    getDoc(
        doc(
            db,
            "teams",
            currentTeamId
        )
    )
    .then(
        function (
            snapshot
        ) {

            if (
                !snapshot.exists()
            ) {

                return;

            }


            const team =
                snapshot.data();


            if (
                editTeamName
            ) {

                editTeamName.value =
                    team.name ||
                    "";

            }


            if (
                editTeamType
            ) {

                editTeamType.value =
                    team.type ||
                    "";

            }


            if (
                editTeamLead
            ) {

                editTeamLead.value =
                    team.leadName ||
                    team.lead ||
                    "";

            }


            if (
                editTeamDescription
            ) {

                editTeamDescription.value =
                    team.description ||
                    "";

            }


            if (
                editTeamError
            ) {

                editTeamError.textContent =
                    "";

            }


            editTeamModal.classList.remove(
                "hidden"
            );


            editTeamModal.style.display =
                "flex";

        }
    )
    .catch(
        function (
            error
        ) {

            console.error(
                "EDIT TEAM LOAD ERROR:",
                error
            );

        }
    );

}


function closeEditTeamModalWindow() {

    if (
        editTeamModal
    ) {

        editTeamModal.classList.add(
            "hidden"
        );

        editTeamModal.style.display =
            "";

    }

}


async function saveEditedTeam(
    event
) {

    event.preventDefault();


    if (
        !currentTeamId ||
        !editTeamForm
    ) {

        return;

    }


    if (
        !editTeamForm.checkValidity()
    ) {

        editTeamForm.reportValidity();

        return;

    }


    try {

        const user =
            auth.currentUser;


        if (!user) {

            throw new Error(
                "You must be signed in."
            );

        }


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
                "Your personnel record was not found."
            );

        }


        const currentUser =
            userSnapshot.data();


        const permissions =
            getUserPermissions(
                currentUser.role
            );


        if (
            !permissions ||
            !permissions.manageTeams
        ) {

            throw new Error(
                "You do not have permission to edit teams."
            );

        }


        await updateDoc(
            doc(
                db,
                "teams",
                currentTeamId
            ),
            {

                name:
                    editTeamName.value.trim(),

                type:
                    editTeamType.value.trim(),

                lead:
                    editTeamLead.value.trim(),

                leadName:
                    editTeamLead.value.trim(),

                description:
                    editTeamDescription.value.trim(),

                updatedAt:
                    new Date().toISOString()

            }
        );


        closeEditTeamModalWindow();


        await loadTeams();


        await openTeamFile(
            currentTeamId
        );


    } catch (error) {

        console.error(
            "EDIT TEAM ERROR:",
            error
        );


        if (
            editTeamError
        ) {

            editTeamError.textContent =
                error.message ||
                "Unable to save team.";

        }

    }

}


if (
    editTeamButton
) {

    editTeamButton.addEventListener(
        "click",
        openEditTeamModal
    );

}


if (
    closeEditTeamModal
) {

    closeEditTeamModal.addEventListener(
        "click",
        closeEditTeamModalWindow
    );

}


if (
    cancelEditTeamButton
) {

    cancelEditTeamButton.addEventListener(
        "click",
        closeEditTeamModalWindow
    );

}


if (
    editTeamModalOverlay
) {

    editTeamModalOverlay.addEventListener(
        "click",
        closeEditTeamModalWindow
    );

}


if (
    editTeamForm
) {

    editTeamForm.addEventListener(
        "submit",
        saveEditedTeam
    );

}


// ==========================================
// TEAM STATUS
// ==========================================

if (
    teamStatusButton
) {

    teamStatusButton.addEventListener(
        "click",
        async function () {

            if (
                !currentTeamId
            ) {

                return;

            }


            try {

                const user =
                    auth.currentUser;


                if (!user) {

                    return;

                }


                const userSnapshot =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                const currentUser =
                    userSnapshot.data();


                const permissions =
                    getUserPermissions(
                        currentUser.role
                    );


                if (
                    !permissions ||
                    !permissions.manageTeams
                ) {

                    alert(
                        "You do not have permission to change team status."
                    );

                    return;

                }


                const teamSnapshot =
                    await getDoc(
                        doc(
                            db,
                            "teams",
                            currentTeamId
                        )
                    );


                if (
                    !teamSnapshot.exists()
                ) {

                    return;

                }


                const team =
                    teamSnapshot.data();


                await updateDoc(
                    doc(
                        db,
                        "teams",
                        currentTeamId
                    ),
                    {

                        active:
                            team.active === false,

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
                    "TEAM STATUS ERROR:",
                    error
                );

            }

        }
    );

}


// ==========================================
// PERSONNEL ADD / EDIT
// ==========================================

async function canManagePersonnel() {

    const user =
        auth.currentUser;


    if (!user) {

        return false;

    }


    const snapshot =
        await getDoc(
            doc(
                db,
                "users",
                user.uid
            )
        );


    if (
        !snapshot.exists()
    ) {

        return false;

    }


    const userData =
        snapshot.data();


    const permissions =
        getUserPermissions(
            userData.role
        );


    return Boolean(
        permissions &&
        permissions.manageUsers
    );

}


function openAddPersonnelModal() {

    if (
        !addPersonnelModal
    ) {

        return;

    }


    if (
        addPersonnelForm
    ) {

        addPersonnelForm.reset();

    }


    if (
        addPersonnelError
    ) {

        addPersonnelError.textContent =
            "";

    }


    addPersonnelModal.classList.remove(
        "hidden"
    );


    addPersonnelModal.style.display =
        "flex";

}


function closeAddPersonnelModal() {

    if (
        addPersonnelModal
    ) {

        addPersonnelModal.classList.add(
            "hidden"
        );

        addPersonnelModal.style.display =
            "";

    }

}


if (
    addPersonnelButton
) {

    addPersonnelButton.addEventListener(
        "click",
        openAddPersonnelModal
    );

}


if (
    closePersonnelModal
) {

    closePersonnelModal.addEventListener(
        "click",
        closeAddPersonnelModal
    );

}


if (
    cancelPersonnelButton
) {

    cancelPersonnelButton.addEventListener(
        "click",
        closeAddPersonnelModal
    );

}


if (
    modalOverlay
) {

    modalOverlay.addEventListener(
        "click",
        closeAddPersonnelModal
    );

}

// ==========================================
// SAVE NEW PERSONNEL
// ==========================================

if (
    addPersonnelForm
) {

    addPersonnelForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            if (
                !addPersonnelForm.checkValidity()
            ) {

                addPersonnelForm.reportValidity();

                return;

            }


            if (
                addPersonnelError
            ) {

                addPersonnelError.textContent =
                    "";

            }


            try {

                const allowed =
                    await canManagePersonnel();


                if (!allowed) {

                    throw new Error(
                        "You do not have permission to add personnel."
                    );

                }


                const nameInput =
                    document.getElementById(
                        "personName"
                    );


                const emailInput =
                    document.getElementById(
                        "personEmail"
                    );


                const roleInput =
                    document.getElementById(
                        "personRole"
                    );


                const teamInput =
                    document.getElementById(
                        "personTeam"
                    );


                const uidInput =
                    document.getElementById(
                        "personUid"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const role =
                    roleInput
                        ? roleInput.value
                        : "";


                const team =
                    teamInput
                        ? teamInput.value
                        : "";


                const uid =
                    uidInput
                        ? uidInput.value.trim()
                        : "";


                if (!uid) {

                    throw new Error(
                        "A Firebase Authentication UID is required."
                    );

                }


                await setDoc(
                    doc(
                        db,
                        "users",
                        uid
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

                        active:
                            true,

                        accountStatus:
                            "Active",

                        createdAt:
                            new Date().toISOString()

                    },
                    {
                        merge: true
                    }
                );


                closeAddPersonnelModal();


                await loadPersonnel();


            } catch (error) {

                console.error(
                    "ADD PERSONNEL ERROR:",
                    error
                );


                if (
                    addPersonnelError
                ) {

                    addPersonnelError.textContent =
                        error.message ||
                        "Unable to create personnel record.";

                }

            }

        }
    );

}


// ==========================================
// OPEN EDIT PERSONNEL
// ==========================================

async function openEditPersonnel() {

    if (
        !currentPersonnelId ||
        !editPersonnelModal
    ) {

        return;

    }


    try {

        const allowed =
            await canManagePersonnel();


        if (!allowed) {

            alert(
                "You do not have permission to edit personnel."
            );

            return;

        }


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


        if (
            editPersonName
        ) {

            editPersonName.value =
                person.name ||
                "";

        }


        if (
            editPersonEmail
        ) {

            editPersonEmail.value =
                person.email ||
                "";

        }


        if (
            editPersonRole
        ) {

            editPersonRole.value =
                person.role ||
                "";

        }


        if (
            editPersonTeam
        ) {

            editPersonTeam.value =
                person.team ||
                "";

        }


        if (
            editPersonnelError
        ) {

            editPersonnelError.textContent =
                "";

        }


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


// ==========================================
// CLOSE EDIT PERSONNEL
// ==========================================

function closeEditPersonnelModalWindow() {

    if (
        editPersonnelModal
    ) {

        editPersonnelModal.classList.add(
            "hidden"
        );


        editPersonnelModal.style.display =
            "";

    }

}


// ==========================================
// SAVE EDITED PERSONNEL
// ==========================================

if (
    editPersonnelForm
) {

    editPersonnelForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            if (
                !currentPersonnelId
            ) {

                return;

            }


            if (
                !editPersonnelForm.checkValidity()
            ) {

                editPersonnelForm.reportValidity();

                return;

            }


            if (
                editPersonnelError
            ) {

                editPersonnelError.textContent =
                    "";

            }


            try {

                const allowed =
                    await canManagePersonnel();


                if (!allowed) {

                    throw new Error(
                        "You do not have permission to edit personnel."
                    );

                }


                await updateDoc(
                    doc(
                        db,
                        "users",
                        currentPersonnelId
                    ),
                    {

                        name:
                            editPersonName.value.trim(),

                        email:
                            editPersonEmail.value.trim(),

                        role:
                            editPersonRole.value,

                        team:
                            editPersonTeam.value,

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
                    "EDIT PERSONNEL SAVE ERROR:",
                    error
                );


                if (
                    editPersonnelError
                ) {

                    editPersonnelError.textContent =
                        error.message ||
                        "Unable to update personnel.";

                }

            }

        }
    );

}


// ==========================================
// EDIT PERSONNEL BUTTONS
// ==========================================

if (
    editPersonnelButton
) {

    editPersonnelButton.addEventListener(
        "click",
        openEditPersonnel
    );

}


if (
    closeEditPersonnelModal
) {

    closeEditPersonnelModal.addEventListener(
        "click",
        closeEditPersonnelModalWindow
    );

}


if (
    cancelEditPersonnelButton
) {

    cancelEditPersonnelButton.addEventListener(
        "click",
        closeEditPersonnelModalWindow
    );

}


if (
    editModalOverlay
) {

    editModalOverlay.addEventListener(
        "click",
        closeEditPersonnelModalWindow
    );

}


// ==========================================
// ENABLE / DISABLE PERSONNEL
// ==========================================

if (
    disablePersonnelButton
) {

    disablePersonnelButton.addEventListener(
        "click",
        async function () {

            if (
                !currentPersonnelId
            ) {

                return;

            }


            try {

                const allowed =
                    await canManagePersonnel();


                if (!allowed) {

                    alert(
                        "You do not have permission to change personnel status."
                    );

                    return;

                }


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


                const newStatus =
                    !Boolean(
                        person.active
                    );


                await updateDoc(
                    doc(
                        db,
                        "users",
                        currentPersonnelId
                    ),
                    {

                        active:
                            newStatus,

                        accountStatus:
                            newStatus
                                ? "Active"
                                : "Disabled",

                        updatedAt:
                            new Date().toISOString()

                    }
                );


                await openPersonnelFile(
                    currentPersonnelId
                );


                await loadPersonnel();


            } catch (error) {

                console.error(
                    "PERSONNEL STATUS ERROR:",
                    error
                );

            }

        }
    );

}


// ==========================================
// DASHBOARD PLACEHOLDER BUTTONS
// ==========================================

if (
    evidenceButton
) {

    evidenceButton.addEventListener(
        "click",
        function () {

            alert(
                "Evidence Management will be built in a later phase."
            );

        }
    );

}


if (
    reportsButton
) {

    reportsButton.addEventListener(
        "click",
        function () {

            alert(
                "Reports will be available through individual case files."
            );

        }
    );

}


// ==========================================
// CASE DOCUMENT QUESTION DEFINITIONS
// ==========================================

const CASE_DOCUMENT_QUESTIONS = {

    "Investigation Report": [

        {
            id:
                "caseNumber",

            label:
                "Case Number",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "locationName",

            label:
                "Location",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "investigationDate",

            label:
                "Investigation Date",

            type:
                "date",

            required:
                true
        },


        {
            id:
                "team",

            label:
                "Investigating Team",

            type:
                "team",

            required:
                true
        },


        {
            id:
                "investigators",

            label:
                "Investigators",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "clientReport",

            label:
                "Client Report / Initial Claims",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "environmentalConditions",

            label:
                "Environmental Conditions",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "equipmentUsed",

            label:
                "Equipment Used",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "observations",

            label:
                "Investigator Observations",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "evidenceSummary",

            label:
                "Evidence Summary",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "conclusion",

            label:
                "Conclusion",

            type:
                "textarea",

            required:
                true
        }

    ],


    "Witness Report": [

        {
            id:
                "witnessName",

            label:
                "Witness Name",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "witnessContact",

            label:
                "Witness Contact Information",

            type:
                "text",

            required:
                false
        },


        {
            id:
                "locationName",

            label:
                "Location",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "incidentDate",

            label:
                "Date of Incident",

            type:
                "date",

            required:
                true
        },


        {
            id:
                "incidentTime",

            label:
                "Approximate Time",

            type:
                "time",

            required:
                false
        },


        {
            id:
                "witnessAccount",

            label:
                "Witness Account",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "peoplePresent",

            label:
                "Other People Present",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "physicalEffects",

            label:
                "Physical Effects / Environmental Changes",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "additionalInformation",

            label:
                "Additional Information",

            type:
                "textarea",

            required:
                false
        }

    ],


    "Location History": [

        {
            id:
                "locationName",

            label:
                "Location Name",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "address",

            label:
                "Address",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "dateOpened",

            label:
                "Date / Year Established",

            type:
                "text",

            required:
                false
        },


        {
            id:
                "originalPurpose",

            label:
                "Original Purpose",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "ownershipHistory",

            label:
                "Ownership / Occupancy History",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "knownEvents",

            label:
                "Known Historical Events",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "reportedDeaths",

            label:
                "Reported Deaths",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "reportedCrimes",

            label:
                "Reported Crimes / Incidents",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "reportedHauntings",

            label:
                "Reported Paranormal Activity",

            type:
                "textarea",

            required:
                false
        },


        {
            id:
                "sources",

            label:
                "Sources / References",

            type:
                "textarea",

            required:
                false
        }

    ],


    "IPO": [

        {
            id:
                "caseNumber",

            label:
                "Case Number",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "locationName",

            label:
                "Location",

            type:
                "text",

            required:
                true
        },


        {
            id:
                "investigationDate",

            label:
                "Investigation Date",

            type:
                "date",

            required:
                true
        },


        {
            id:
                "team",

            label:
                "Investigating Team",

            type:
                "team",

            required:
                true
        },


        {
            id:
                "incidentSummary",

            label:
                "Incident Summary",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "phenomenaObserved",

            label:
                "Phenomena Observed",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "evidenceCollected",

            label:
                "Evidence Collected",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "analysis",

            label:
                "Analysis",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "alternativeExplanations",

            label:
                "Alternative Explanations Considered",

            type:
                "textarea",

            required:
                true
        },


        {
            id:
                "investigatorConclusion",

            label:
                "Investigator Conclusion",

            type:
                "textarea",

            required:
                true
        }

    ]

};


// ==========================================
// RENDER CASE DOCUMENT QUESTIONNAIRE
// ==========================================

function renderCaseDocumentQuestionnaire(
    documentType,
    existingAnswers = {}
) {

    const questionnaire =
        document.getElementById(
            "caseDocumentQuestionnaire"
        );


    if (
        !questionnaire
    ) {

        return;

    }


    questionnaire.innerHTML =
        "";


    const questions =
        CASE_DOCUMENT_QUESTIONS[
            documentType
        ] || [];


    questions.forEach(
        function (
            question
        ) {

            const group =
                document.createElement(
                    "div"
                );


            group.className =
                "form-group";


            const label =
                document.createElement(
                    "label"
                );


            label.textContent =
                question.label;


            group.appendChild(
                label
            );


            // ==================================
            // CHECKBOXES
            // ==================================

            if (
                question.type ===
                "checkboxes"
            ) {

                const checkboxContainer =
                    document.createElement(
                        "div"
                    );


                checkboxContainer.className =
                    "case-document-checkboxes";


                const savedValues =
                    Array.isArray(
                        existingAnswers[
                            question.id
                        ]
                    )
                        ? existingAnswers[
                            question.id
                        ]
                        : [];


                question.options.forEach(
                    function (
                        option
                    ) {

                        const wrapper =
                            document.createElement(
                                "label"
                            );


                        wrapper.className =
                            "case-document-checkbox";


                        const checkbox =
                            document.createElement(
                                "input"
                            );


                        checkbox.type =
                            "checkbox";


                        checkbox.name =
                            question.id;


                        checkbox.value =
                            option;


                        checkbox.checked =
                            savedValues.includes(
                                option
                            );


                        wrapper.appendChild(
                            checkbox
                        );


                        wrapper.appendChild(
                            document.createTextNode(
                                ` ${option}`
                            )
                        );


                        checkboxContainer.appendChild(
                            wrapper
                        );

                    }
                );


                group.appendChild(
                    checkboxContainer
                );


                questionnaire.appendChild(
                    group
                );


                return;

            }


            // ==================================
            // TEAM SELECT
            // ==================================

            if (
                question.type ===
                "team"
            ) {

                const select =
                    document.createElement(
                        "select"
                    );


                select.id =
                    `caseDoc_${question.id}`;


                select.required =
                    Boolean(
                        question.required
                    );


                select.innerHTML = `
                    <option value="">
                        Select Team
                    </option>
                `;


                questionnaire.appendChild(
                    group
                );


                group.appendChild(
                    select
                );


                loadCaseDocumentTeams(
                    select,
                    existingAnswers[
                        question.id
                    ] || ""
                );


                return;

            }


            // ==================================
            // NORMAL INPUT
            // ==================================

            let input;


            if (
                question.type ===
                "textarea"
            ) {

                input =
                    document.createElement(
                        "textarea"
                    );


                input.rows =
                    6;

            } else {

                input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    question.type;

            }


            input.id =
                `caseDoc_${question.id}`;


            input.required =
                Boolean(
                    question.required
                );


            input.value =
                existingAnswers[
                    question.id
                ] || "";


            group.appendChild(
                input
            );


            questionnaire.appendChild(
                group
            );

        }
    );

}

// ==========================================
// CASE MANAGEMENT — LOAD CASES
// ==========================================

async function loadCases() {

    if (
        !casesList
    ) {

        return;

    }


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


        allCases =
            [];


        snapshot.forEach(
            function (
                caseDocument
            ) {

                allCases.push({

                    id:
                        caseDocument.id,

                    ...caseDocument.data()

                });

            }
        );


        allCases.sort(
            function (
                a,
                b
            ) {

                return (
                    new Date(
                        b.updatedAt ||
                        b.createdAt ||
                        0
                    ) -
                    new Date(
                        a.updatedAt ||
                        a.createdAt ||
                        0
                    )
                );

            }
        );


        renderCases();


        updateCaseStatistics();


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


// ==========================================
// RENDER CASES
// ==========================================

function renderCases() {

    if (
        !casesList
    ) {

        return;

    }


    casesList.innerHTML =
        "";


    const searchTerm =
        caseSearch
            ? caseSearch.value
                .toLowerCase()
                .trim()
            : "";


    const statusFilter =
        caseStatusFilter
            ? caseStatusFilter.value
            : "all";


    const teamFilter =
        caseTeamFilter
            ? caseTeamFilter.value
            : "all";


    const filteredCases =
        allCases.filter(
            function (
                caseData
            ) {

                const searchableText =
                    `
                        ${
                            caseData.caseNumber ||
                            ""
                        }

                        ${
                            caseData.name ||
                            ""
                        }

                        ${
                            caseData.location ||
                            ""
                        }

                        ${
                            caseData.client ||
                            ""
                        }
                    `
                    .toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    searchableText.includes(
                        searchTerm
                    );


                const matchesStatus =
                    statusFilter ===
                    "all" ||
                    caseData.status ===
                    statusFilter;


                const matchesTeam =
                    teamFilter ===
                    "all" ||
                    caseData.team ===
                    teamFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesTeam
                );

            }
        );


    if (
        filteredCases.length ===
        0
    ) {

        casesList.innerHTML = `
            <p class="loading-message">
                No cases match your search.
            </p>
        `;

        return;

    }


    filteredCases.forEach(
        function (
            caseData
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "case-row";


            row.dataset.caseId =
                caseData.id;


            const statusClass =
                String(
                    caseData.status ||
                    ""
                )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


            row.innerHTML = `

                <div>

                    <div class="case-name">
                        ${
                            caseData.name ||
                            "Untitled Case"
                        }
                    </div>

                    <div class="case-number">
                        ${
                            caseData.caseNumber ||
                            caseData.id
                        }
                    </div>

                </div>


                <div class="case-location">
                    ${
                        caseData.location ||
                        "Unknown Location"
                    }
                </div>


                <div class="case-team">
                    ${
                        getTeamDisplayName(
                            caseData.team
                        )
                    }
                </div>


                <div
                    class="case-status ${statusClass}"
                >
                    ${
                        caseData.status ||
                        "Unknown"
                    }
                </div>

            `;


            row.addEventListener(
                "click",
                function () {

                    openCaseFile(
                        caseData.id
                    );

                }
            );


            casesList.appendChild(
                row
            );

        }
    );

}


// ==========================================
// CASE STATISTICS
// ==========================================

function updateCaseStatistics() {

    const activeCount =
        allCases.filter(
            function (
                caseData
            ) {

                return (
                    caseData.status ===
                    "Active"
                );

            }
        ).length;


    const completedCount =
        allCases.filter(
            function (
                caseData
            ) {

                return (
                    caseData.status ===
                    "Completed"
                );

            }
        ).length;


    if (
        activeCaseCount
    ) {

        activeCaseCount.textContent =
            activeCount;

    }


    if (
        completedCaseCount
    ) {

        completedCaseCount.textContent =
            completedCount;

    }

}


// ==========================================
// CASE SEARCH / FILTERS
// ==========================================

if (
    caseSearch
) {

    caseSearch.addEventListener(
        "input",
        renderCases
    );

}


if (
    caseStatusFilter
) {

    caseStatusFilter.addEventListener(
        "change",
        renderCases
    );

}


if (
    caseTeamFilter
) {

    caseTeamFilter.addEventListener(
        "change",
        renderCases
    );

}


// ==========================================
// LOAD TEAM FILTER OPTIONS
// ==========================================

async function loadCaseTeamOptions() {

    if (
        !caseTeamFilter
    ) {

        return;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "teams"
                )
            );


        const currentValue =
            caseTeamFilter.value;


        caseTeamFilter.innerHTML = `
            <option value="all">
                All Teams
            </option>
        `;


        snapshot.forEach(
            function (
                teamDocument
            ) {

                const team =
                    teamDocument.data();


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teamDocument.id;


                option.textContent =
                    team.name ||
                    teamDocument.id;


                caseTeamFilter.appendChild(
                    option
                );

            }
        );


        if (
            currentValue
        ) {

            caseTeamFilter.value =
                currentValue;

        }


    } catch (error) {

        console.error(
            "CASE TEAM FILTER ERROR:",
            error
        );

    }

}


// ==========================================
// OPEN CASE FILE
// ==========================================

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

            alert(
                "Case could not be found."
            );

            return;

        }


        const caseData =
            snapshot.data();


        const caseFileName =
            document.getElementById(
                "caseFileName"
            );


        const caseFileNumber =
            document.getElementById(
                "caseFileNumber"
            );


        const caseFileStatus =
            document.getElementById(
                "caseFileStatus"
            );


        const caseFileLocation =
            document.getElementById(
                "caseFileLocation"
            );


        const caseFileTeam =
            document.getElementById(
                "caseFileTeam"
            );


        const caseFileClient =
            document.getElementById(
                "caseFileClient"
            );


        const caseFileDescription =
            document.getElementById(
                "caseFileDescription"
            );


        const caseFileDate =
            document.getElementById(
                "caseFileDate"
            );


        if (
            caseFileName
        ) {

            caseFileName.textContent =
                caseData.name ||
                "Untitled Case";

        }


        if (
            caseFileNumber
        ) {

            caseFileNumber.textContent =
                caseData.caseNumber ||
                caseId;

        }


        if (
            caseFileStatus
        ) {

            caseFileStatus.textContent =
                caseData.status ||
                "Unknown";

        }


        if (
            caseFileLocation
        ) {

            caseFileLocation.textContent =
                caseData.location ||
                "Unknown Location";

        }


        if (
            caseFileTeam
        ) {

            caseFileTeam.textContent =
                getTeamDisplayName(
                    caseData.team
                );

        }


        if (
            caseFileClient
        ) {

            caseFileClient.textContent =
                caseData.client ||
                "Not provided";

        }


        if (
            caseFileDescription
        ) {

            caseFileDescription.textContent =
                caseData.description ||
                "No description provided.";

        }


        if (
            caseFileDate
        ) {

            caseFileDate.textContent =
                caseData.investigationDate ||
                "Not scheduled";

        }


        showCaseFile();


        await loadCaseDocuments();


    } catch (error) {

        console.error(
            "CASE FILE ERROR:",
            error
        );


        alert(
            "Unable to open case."
        );

    }

}


// ==========================================
// CASE NAVIGATION
// ==========================================

if (
    casesButton
) {

    casesButton.addEventListener(
        "click",
        function () {

            showCases();

        }
    );

}


if (
    casesBackButton
) {

    casesBackButton.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );

}


if (
    caseFileBackButton
) {

    caseFileBackButton.addEventListener(
        "click",
        function () {

            showCases();

        }
    );

}


// ==========================================
// NEW CASE PLACEHOLDER
// ==========================================

if (
    newCaseButton
) {

    newCaseButton.addEventListener(
        "click",
        function () {

            showCases();

        }
    );

}


if (
    newCaseListButton
) {

    newCaseListButton.addEventListener(
        "click",
        function () {

            alert(
                "New Case creation is handled through the case management system."
            );

        }
    );

}


// ==========================================
// EDIT CASE
// ==========================================

async function openEditCaseModal() {

    if (
        !currentCaseId ||
        !editCaseModal
    ) {

        return;

    }


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "cases",
                    currentCaseId
                )
            );


        if (
            !snapshot.exists()
        ) {

            return;

        }


        const caseData =
            snapshot.data();


        if (
            editCaseName
        ) {

            editCaseName.value =
                caseData.name ||
                "";

        }


        if (
            editCaseType
        ) {

            editCaseType.value =
                caseData.type ||
                "";

        }


        if (
            editCasePriority
        ) {

            editCasePriority.value =
                caseData.priority ||
                "";

        }


        if (
            editCaseStatus
        ) {

            editCaseStatus.value =
                caseData.status ||
                "";

        }


        if (
            editCaseClient
        ) {

            editCaseClient.value =
                caseData.client ||
                "";

        }


        if (
            editCaseLocation
        ) {

            editCaseLocation.value =
                caseData.location ||
                "";

        }


        if (
            editCaseTeam
        ) {

            editCaseTeam.value =
                caseData.team ||
                "";

        }


        if (
            editCaseInvestigationDate
        ) {

            editCaseInvestigationDate.value =
                caseData.investigationDate ||
                "";

        }


        if (
            editCaseDescription
        ) {

            editCaseDescription.value =
                caseData.description ||
                "";

        }


        if (
            editCaseError
        ) {

            editCaseError.textContent =
                "";

        }


        editCaseModal.classList.remove(
            "hidden"
        );


        editCaseModal.style.display =
            "flex";


    } catch (error) {

        console.error(
            "EDIT CASE LOAD ERROR:",
            error
        );

    }

}


// ==========================================
// CLOSE EDIT CASE
// ==========================================

function closeEditCaseModalWindow() {

    if (
        editCaseModal
    ) {

        editCaseModal.classList.add(
            "hidden"
        );


        editCaseModal.style.display =
            "";

    }

}


// ==========================================
// SAVE EDITED CASE
// ==========================================

if (
    editCaseForm
) {

    editCaseForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            if (
                !currentCaseId
            ) {

                return;

            }


            if (
                !editCaseForm.checkValidity()
            ) {

                editCaseForm.reportValidity();

                return;

            }


            try {

                const user =
                    auth.currentUser;


                if (!user) {

                    throw new Error(
                        "You must be signed in."
                    );

                }


                const userSnapshot =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


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
                        "You do not have permission to edit cases."
                    );

                }


                await updateDoc(
                    doc(
                        db,
                        "cases",
                        currentCaseId
                    ),
                    {

                        name:
                            editCaseName.value.trim(),

                        type:
                            editCaseType.value,

                        priority:
                            editCasePriority.value,

                        status:
                            editCaseStatus.value,

                        client:
                            editCaseClient.value.trim(),

                        location:
                            editCaseLocation.value.trim(),

                        team:
                            editCaseTeam.value,

                        investigationDate:
                            editCaseInvestigationDate.value,

                        description:
                            editCaseDescription.value.trim(),

                        updatedAt:
                            new Date().toISOString()

                    }
                );


                closeEditCaseModalWindow();


                await loadCases();


                await openCaseFile(
                    currentCaseId
                );


            } catch (error) {

                console.error(
                    "EDIT CASE SAVE ERROR:",
                    error
                );


                if (
                    editCaseError
                ) {

                    editCaseError.textContent =
                        error.message ||
                        "Unable to update case.";

                }

            }

        }
    );

}


if (
    editCaseButton
) {

    editCaseButton.addEventListener(
        "click",
        openEditCaseModal
    );

}


if (
    closeEditCaseModal
) {

    closeEditCaseModal.addEventListener(
        "click",
        closeEditCaseModalWindow
    );

}


if (
    cancelEditCaseButton
) {

    cancelEditCaseButton.addEventListener(
        "click",
        closeEditCaseModalWindow
    );

}


if (
    editCaseModalOverlay
) {

    editCaseModalOverlay.addEventListener(
        "click",
        closeEditCaseModalWindow
    );

}


// ==========================================
// CASE DOCUMENT TYPE CHANGE
// ==========================================

if (
    caseDocumentType
) {

    caseDocumentType.addEventListener(
        "change",
        function () {

            renderCaseDocumentQuestionnaire(
                caseDocumentType.value
            );

        }
    );

}


// ==========================================
// CASE DOCUMENT TEAMS
// ==========================================

async function loadCaseDocumentTeams(
    select,
    selectedValue = ""
) {

    if (
        !select
    ) {

        return;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "teams"
                )
            );


        select.innerHTML = `
            <option value="">
                Select Team
            </option>
        `;


        snapshot.forEach(
            function (
                teamDocument
            ) {

                const team =
                    teamDocument.data();


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teamDocument.id;


                option.textContent =
                    team.name ||
                    teamDocument.id;


                if (
                    selectedValue ===
                    teamDocument.id
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "CASE DOCUMENT TEAM LOAD ERROR:",
            error
        );

    }

}

// ==========================================
// DASHBOARD BUTTONS — SAFE FALLBACKS
// ==========================================

if (
    teamsButton &&
    !teamsButton.dataset.bound
) {

    teamsButton.dataset.bound =
        "true";

}


if (
    personnelButton &&
    !personnelButton.dataset.bound
) {

    personnelButton.dataset.bound =
        "true";

}


// ==========================================
// CASE DOCUMENT INITIALIZATION
// ==========================================

// Make sure the questionnaire is empty
// when the application first loads.

if (
    caseDocumentType
) {

    renderCaseDocumentQuestionnaire(
        caseDocumentType.value || ""
    );

}


// ==========================================
// ESCAPE KEY — CLOSE MODALS
// ==========================================

document.addEventListener(
    "keydown",
    function (
        event
    ) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            caseDocumentModal &&
            !caseDocumentModal.classList.contains(
                "hidden"
            )
        ) {

            closeCaseDocument();

            return;

        }


        if (
            caseDocumentReaderModal &&
            !caseDocumentReaderModal.classList.contains(
                "hidden"
            )
        ) {

            closeCaseDocumentReaderWindow();

            return;

        }


        if (
            editPersonnelModal &&
            !editPersonnelModal.classList.contains(
                "hidden"
            )
        ) {

            closeEditPersonnelModalWindow();

            return;

        }


        if (
            addPersonnelModal &&
            !addPersonnelModal.classList.contains(
                "hidden"
            )
        ) {

            closeAddPersonnelModal();

            return;

        }


        if (
            editTeamModal &&
            !editTeamModal.classList.contains(
                "hidden"
            )
        ) {

            closeEditTeamModalWindow();

            return;

        }


        if (
            addTeamModal &&
            !addTeamModal.classList.contains(
                "hidden"
            )
        ) {

            closeAddTeamModalWindow();

            return;

        }


        if (
            editCaseModal &&
            !editCaseModal.classList.contains(
                "hidden"
            )
        ) {

            closeEditCaseModalWindow();

        }

    }
);


// ==========================================
// INITIAL SCREEN
// ==========================================

hideAllScreens();


if (
    loginScreen
) {

    loginScreen.classList.remove(
        "hidden"
    );

}

// ==========================================
// LOAD CASE DOCUMENT TEAMS
// ==========================================

async function loadCaseDocumentTeams(
    selectElement,
    selectedTeam = ""
) {

    if (
        !selectElement
    ) {

        return;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "teams"
                )
            );


        selectElement.innerHTML = `
            <option value="">
                Select Team
            </option>
        `;


        snapshot.forEach(
            function (
                teamDocument
            ) {

                const team =
                    teamDocument.data();


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teamDocument.id;


                option.textContent =
                    team.name ||
                    teamDocument.id;


                if (
                    selectedTeam ===
                    teamDocument.id
                ) {

                    option.selected =
                        true;

                }


                selectElement.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "CASE DOCUMENT TEAM LOAD ERROR:",
            error
        );


        selectElement.innerHTML = `
            <option value="">
                Unable to load teams
            </option>
        `;


        if (
            selectedTeam
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                selectedTeam;


            option.textContent =
                selectedTeam;


            option.selected =
                true;


            selectElement.appendChild(
                option
            );

        }

    }

}

// ==========================================
// APPLICATION READY
// ==========================================

console.log(
    "New Horizon Case Manager initialized."
);
