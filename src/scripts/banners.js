/**
 * Updates a single banner with the provided text
 * @param {string} bannerId - The ID of the marquee track element
 * @param {string} text - The text to display
 * @param {string} direction - The scrolling direction ('horizontal' or 'vertical')
 */
function updateSingleMarquee(bannerId, text, direction = 'horizontal') {
    const track = document.getElementById(bannerId);
    if (!track) return;
  
    // Clear old content
    track.innerHTML = '';
  
    // Create wrapper to hold duplicated content
    const wrapper = document.createElement('div');
    wrapper.className = 'marquee-wrapper';
    
    // Special handling for top banner to create true infinite scroll
    if (bannerId === 'topMarqueeTrack') {
      // For infinite scrolling, we need to duplicate the content exactly once
      // Create the first set of content items
      const contentGroup = document.createElement('div');
      contentGroup.className = 'content-group';
      contentGroup.style.display = 'flex';
      
      // Create enough copies to fill more than the screen width
      const screenWidth = window.innerWidth;
      const charWidth = 20; // Estimated width per character
      const estimatedItemWidth = text.length * charWidth;
      const copiesNeeded = Math.ceil((screenWidth * 2) / estimatedItemWidth) + 2;
      
      for (let i = 0; i < copiesNeeded; i++) {
        const contentItem = document.createElement('div');
        contentItem.className = 'marquee-content';
        contentItem.textContent = text;
        contentItem.style.paddingRight = '4rem';
        contentGroup.appendChild(contentItem);
      }
      
      // Add the first group to the wrapper
      wrapper.appendChild(contentGroup);
      
      // Clone the content for the second half (needed for seamless loop)
      const contentGroupClone = contentGroup.cloneNode(true);
      wrapper.appendChild(contentGroupClone);
      
    } else {
      // For other banners, continue with the original approach
      // Calculate how many duplicates we need based on screen dimensions
      const screenDimension = direction === 'horizontal' ? window.innerWidth : window.innerHeight;
      const charWidth = direction === 'horizontal' ? 12 : 16; 
      const estimatedItemLength = text.length * charWidth;
      const copiesNeeded = Math.ceil((screenDimension * 2) / estimatedItemLength) + 1;
      
      // Create multiple copies of the content to ensure no gaps
      for (let i = 0; i < copiesNeeded; i++) {
        const contentItem = document.createElement('div');
        contentItem.className = 'marquee-content';
        contentItem.textContent = text;
        wrapper.appendChild(contentItem);
      }
    }
    
    track.appendChild(wrapper);
  
    // Wait for DOM to paint, then set animation distance
    requestAnimationFrame(() => {
      if (bannerId !== 'topMarqueeTrack') {
        // Only set marquee distance for non-top banners
        const contentItem = track.querySelector('.marquee-content');
        const contentSize = direction === 'horizontal' 
          ? contentItem.offsetWidth 
          : contentItem.offsetHeight;
        
        track.style.setProperty('--marquee-distance', `${contentSize}px`);
        
        // IMPORTANT: Do NOT set animation duration here
        // This ensures CSS hardcoded animation durations take precedence
      }
    });
  }
  
  /**
   * Update the bottom marquee (legacy function for compatibility)
   */
  export function updateMarquee(text) {
    updateSingleMarquee('bottomMarqueeTrack', text, 'horizontal');
  }
  
  /**
   * Initialize all banners with their default text
   */
  export function initAllBanners() {
    // Top banner - horizontal scroll right to left
    updateSingleMarquee('topMarqueeTrack', 'Noah Dorazio', 'horizontal');
    
    // Right banner - vertical scroll from bottom to top
    updateSingleMarquee('rightMarqueeTrack', 'Welcome to my website', 'vertical');
    
    // Bottom banner - horizontal scroll right to left
    updateMarquee('Now Playing: Waiting for song info...');
    
    // Left banner - vertical scroll from top to bottom
    updateSingleMarquee('leftMarqueeTrack', 'Web Developer & Designer', 'vertical');
    
    // Set up resize handler
    window.addEventListener('resize', () => {
      // Reinitialize all banners on resize to adjust for new screen dimensions
      updateSingleMarquee('topMarqueeTrack', 'Noah Dorazio', 'horizontal');
      updateSingleMarquee('rightMarqueeTrack', 'Welcome to my website', 'vertical');
      
      const currentBottomText = document.querySelector('#bottomMarqueeTrack .marquee-content')?.textContent || '';
      if (currentBottomText) {
        updateMarquee(currentBottomText);
      }
      
      updateSingleMarquee('leftMarqueeTrack', 'Web Developer & Designer', 'vertical');
    });
  }