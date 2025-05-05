// desk-status-web.js
// Script to check if Noah is at his desk and update the right banner

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Function to initialize desk status monitoring
export function initDeskStatus(updateRightBanner) {
  console.log('🖥️ Initializing desk status monitoring...');

  // Firebase configuration - replace with your new project details
  const deskStatusConfig = {
    apiKey: "AIzaSyCbyZEmYo7mwYcMt6BLIRpj_898R0bG_Vo",
    authDomain: "am-i-at-desk.firebaseapp.com",
    databaseURL: "https://am-i-at-desk-default-rtdb.firebaseio.com",
    projectId: "am-i-at-desk",
    storageBucket: "am-i-at-desk.firebasestorage.app",
    messagingSenderId: "1086076394094",
    appId: "1:1086076394094:web:773a472c86ab2f363f647f"
  };

  // Initialize a separate Firebase app for desk status
  // Using a different app name to avoid conflicts with existing Firebase
  const deskStatusApp = initializeApp(deskStatusConfig, "deskStatus");
  const deskDatabase = getDatabase(deskStatusApp);
  const deskStatusRef = ref(deskDatabase, 'desk_status');

  // Listen for changes to desk status
  onValue(deskStatusRef, (snapshot) => {
    const data = snapshot.val();
    const now = new Date().toLocaleTimeString();
    console.log(`🖥️ Desk status update received at ${now}:`, data);

    if (data && data.status === "at_desk") {
      // Update the right banner with "at desk" message
      updateRightBanner(data.message || "Noah is currently at his desk!");
    } else {
      // Update with default or away message
      updateRightBanner("Noah is currently out in the world away from his desk.");
    }
  });
}