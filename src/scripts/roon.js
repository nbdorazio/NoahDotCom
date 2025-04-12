// roon.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

export function initRoonNowPlaying(updateMarquee) {
  console.log('🚀 Initializing Firebase...');

  const firebaseConfig = {
    apiKey: "AIzaSyBc6RYIx3XVPZbIWr4XwKd8Brj5nIW04oQ",
    authDomain: "roon-now-listening.firebaseapp.com",
    databaseURL: "https://roon-now-listening-default-rtdb.firebaseio.com",
    projectId: "roon-now-listening",
    storageBucket: "roon-now-listening.appspot.com",
    messagingSenderId: "1050960956581",
    appId: "1:1050960956581:web:89dd473ff17e816fdad14c"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const nowPlayingRef = ref(database, 'now_playing');

  let resetTimer;

  function resetBanner() {
    updateMarquee("Noah isn't listening to anything right now.");
    console.log('⏰ Banner reset after 20 minutes.');
  }

  onValue(nowPlayingRef, (snapshot) => {
    const data = snapshot.val();
    const now = new Date().toLocaleTimeString();
    console.log(`🔥 Firebase update received at ${now}:`, data);

    clearTimeout(resetTimer);

    let message;
    if (data && data.state && data.state.toLowerCase() === 'playing') {
      message = `Now Playing: ${data.artist} - ${data.title} [Album: ${data.album}]`;
    } else if (data && data.state && data.state.toLowerCase() === 'paused') {
      message = `Paused: ${data.artist} - ${data.title} [Album: ${data.album}]`;
    } else {
      message = "Noah isn't listening to anything right now.";
    }

    updateMarquee(message);
    resetTimer = setTimeout(resetBanner, 1200000); // 20 minutes
  });
}
