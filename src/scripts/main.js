// main.js
import { initRoonNowPlaying } from './roon.js';
import { updateMarquee, initAllBanners } from './banners.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded. Initializing site...');

  // Initialize all banners
  initAllBanners();

  // Start Firebase now-playing listener (only affects bottom banner)
  initRoonNowPlaying(updateMarquee);
});