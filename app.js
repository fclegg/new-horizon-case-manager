const testButton = document.getElementById("testButton");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { 
    firebaseConfig 
} from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

console.log("Firebase connected successfully.");
testButton.addEventListener("click", function () {
    status.textContent = "New Horizon Case Manager is working.";
});
