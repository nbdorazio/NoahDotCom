import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM fully loaded and parsed.');

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBc6RYIx3XVPZbIWr4XwKd8Brj5nIW04oQ",
        authDomain: "roon-now-listening.firebaseapp.com",
        databaseURL: "https://roon-now-listening-default-rtdb.firebaseio.com",
        projectId: "roon-now-listening",
        storageBucket: "roon-now-listening.firebasestorage.app",
        messagingSenderId: "1050960956581",
        appId: "1:1050960956581:web:89dd473ff17e816fdad14c"
    };

    // Initialize Firebase
    console.log('🚀 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    console.log('✅ Firebase initialized.');

    // Get the bottom banner element
    const banner = document.getElementById('bottom-banner');
    console.log('🎯 Bottom banner element found.');

    // Firebase reference
    const nowPlayingRef = ref(database, 'now_playing');
    console.log('👂 Listening for Firebase updates...');

    // 20-minute reset timer
    let resetTimer;

    // Function to reset the banner when idle too long
    function resetBanner() {
        banner.textContent = 'Noah isn\'t listening to anything right now.';
        console.log('⏰ Banner reset after 20 minutes.');
    }

    // Firebase listener
    onValue(nowPlayingRef, (snapshot) => {
        const data = JSON.parse(JSON.stringify(snapshot.val())); // Clean clone of the data
        const now = new Date().toLocaleTimeString();
        console.log(`🔥 Firebase update received at ${now}:`, data);

        // Clear previous timer
        clearTimeout(resetTimer);

        // Update banner with latest info
        if (data && data.state && data.state.toLowerCase() === 'playing') {
            banner.textContent = `Now Playing: ${data.artist} - ${data.title} [Album: ${data.album}]`;
        } else if (data && data.state && data.state.toLowerCase() === 'paused') {
            banner.textContent = `Paused: ${data.artist} - ${data.title} [Album: ${data.album}]`;
        } else {
            banner.textContent = 'Noah isn\'t listening to anything right now.';
        }

        // Start a new 20-minute timer
        resetTimer = setTimeout(resetBanner, 1200000); // 20 minutes
    });
});
