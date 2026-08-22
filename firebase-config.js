// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfF6M9DqtpEHJIC1EwxsIZhhRtgDn6hb4",
  authDomain: "new-horizon-case-manager-9c87e.firebaseapp.com",
  projectId: "new-horizon-case-manager-9c87e",
  storageBucket: "new-horizon-case-manager-9c87e.firebasestorage.app",
  messagingSenderId: "762722257187",
  appId: "1:762722257187:web:c244d24be11184adfc2496",
  measurementId: "G-RXCDHY5G68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
