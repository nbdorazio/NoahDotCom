// main.js
import { initRoonNowPlaying } from './roon.js';
import { updateMarquee } from './banners.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded. Initializing site...');

  // Initialize the bottom banner with placeholder
  updateMarquee('Now Playing: Waiting for song info...');

  // Start Firebase now-playing listener
  initRoonNowPlaying(updateMarquee);
});

window.addEventListener('resize', () => {
    const currentText = document.querySelector('.marquee-content')?.textContent?.replace(/^⟶ /, '') || '';
    if (currentText) {
      updateMarquee(currentText);
    }
  });