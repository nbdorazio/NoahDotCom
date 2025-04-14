/**
 * Improved Infinite Scrolling Banners with Centered Text
 * This script creates infinite marquees for all four sides of the screen
 * with properly centered text in each banner.
 */

// Banner configuration
const bannerConfig = {
  top: {
    id: 'topMarqueeTrack',
    text: "Noah Dorazio",
    direction: "left-to-right",
    speed: 80,
    isVertical: false
  },
  right: {
    id: 'rightMarqueeTrack',
    text: "there will be lots of stuff about my life, live",
    direction: "bottom-to-top", 
    speed: 80,
    isVertical: true
  },
  bottom: {
    id: 'bottomMarqueeTrack',
    text: "Now Playing: Waiting for song info...",
    direction: "right-to-left",
    speed: 80,
    isVertical: false
  },
  left: {
    id: 'leftMarqueeTrack',
    text: "facts about me eventually, use your imagination pls",
    direction: "top-to-bottom",
    speed: 80,
    isVertical: true
  }
};

/**
 * Creates the marquee content with centered text and seamless infinite scrolling
 * @param {string} bannerId - The ID of the marquee track
 * @param {string} text - The text content to display
 * @param {string} direction - Scroll direction
 * @param {number} speed - Animation duration in seconds
 * @param {boolean} isVertical - Whether this is a vertical banner
 */
function createMarqueeContent(bannerId, text, direction, speed, isVertical) {
  const track = document.getElementById(bannerId);
  if (!track) return;
  
  // Clear existing content
  track.innerHTML = '';
  
  // Add direction class to the parent banner
  const banner = track.closest('.scrolling-banner');
  if (banner) {
    // Remove existing direction classes
    banner.classList.remove('left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'vertical');
    // Add new classes
    banner.classList.add(direction);
    if (isVertical) {
      banner.classList.add('vertical');
    }
  }
  
  // Create wrapper for content
  const wrapper = document.createElement('div');
  wrapper.className = 'marquee-wrapper';
  wrapper.style.setProperty('--scroll-duration', `${speed}s`);
  
  // Get screen dimensions
  const screenSize = isVertical ? window.innerHeight : window.innerWidth;
  
  // First, create one content element to measure its size
  const sampleContent = document.createElement('div');
  sampleContent.className = 'marquee-content';
  
  if (isVertical) {
    sampleContent.classList.add('vertical-text');
    if (bannerId === 'leftMarqueeTrack') {
      sampleContent.classList.add('left-banner-text');
    }
  }
  
  sampleContent.textContent = text;
  
  // Temporarily add to the DOM to measure
  wrapper.appendChild(sampleContent);
  track.appendChild(wrapper);
  
  // Measure the size of one content element
  const contentSize = isVertical ? sampleContent.offsetHeight : sampleContent.offsetWidth;
  
  // Calculate how many copies needed to fill at least twice the screen
  // This ensures seamless looping and no gaps
  const copiesNeeded = Math.max(10, Math.ceil((screenSize * 2) / contentSize) + 4);
  
  // Remove the sample content - we'll recreate everything
  track.innerHTML = '';
  wrapper.innerHTML = '';
  
  // Create all content elements
  for (let i = 0; i < copiesNeeded; i++) {
    const content = document.createElement('div');
    content.className = 'marquee-content';
    
    if (isVertical) {
      content.classList.add('vertical-text');
      if (bannerId === 'leftMarqueeTrack') {
        content.classList.add('left-banner-text');
      }
    }
    
    content.textContent = text;
    wrapper.appendChild(content);
  }
  
  // Create duplicate set for seamless looping
  const contentElements = Array.from(wrapper.children);
  contentElements.forEach(element => {
    const clone = element.cloneNode(true);
    wrapper.appendChild(clone);
  });
  
  // Add to DOM
  track.appendChild(wrapper);
}

/**
 * Updates a single banner with new text
 * @param {string} position - 'top', 'right', 'bottom', or 'left'
 * @param {string} text - New text content
 */
function updateBannerText(position, text) {
  const config = bannerConfig[position];
  if (!config) return;
  
  // Update config
  config.text = text;
  
  // Recreate the banner content
  createMarqueeContent(
    config.id,
    text,
    config.direction,
    config.speed,
    config.isVertical
  );
}

/**
 * Legacy function to update bottom marquee for compatibility
 * @param {string} text - New text content for bottom banner
 */
export function updateMarquee(text) {
  updateBannerText('bottom', text);
}

/**
 * Initialize all banners
 */
export function initAllBanners() {
  // Initialize each banner
  Object.entries(bannerConfig).forEach(([position, config]) => {
    createMarqueeContent(
      config.id,
      config.text,
      config.direction,
      config.speed,
      config.isVertical
    );
  });
  
  // Set up window resize handler with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reinitialize all banners on resize
      Object.entries(bannerConfig).forEach(([position, config]) => {
        createMarqueeContent(
          config.id,
          config.text,
          config.direction,
          config.speed,
          config.isVertical
        );
      });
    }, 200); // Wait 200ms after resize ends before reinitializing
  });
}