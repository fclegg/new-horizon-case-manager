console.log("APP.JS IS WORKING");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

console.log("FIREBASE IS CONNECTED");
