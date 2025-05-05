// main.js
import { initRoonNowPlaying } from './roon.js';
import { updateMarquee, initAllBanners, updateBannerText } from './banners.js'; // Import updateBannerText
import { initDeskStatus } from './desk-status-web.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded. Initializing site...');

  // Initialize all banners
  initAllBanners();

  // Start Firebase now-playing listener (only affects bottom banner)
  initRoonNowPlaying(updateMarquee);

  // Create a function that uses the imported updateBannerText function
  const updateRightBanner = (text) => {
    console.log("Updating right banner to:", text);
    updateBannerText('right', text); // Use the imported function directly
  };

  // Initialize desk status with the update function
  initDeskStatus(updateRightBanner);
});