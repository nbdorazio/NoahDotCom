export function updateMarquee(text) {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
  
    // Clear old content
    track.innerHTML = '';
  
    // Create wrapper to hold duplicated content
    const wrapper = document.createElement('div');
    wrapper.className = 'marquee-wrapper';
    wrapper.style.display = 'flex';
    
    // Calculate how many duplicates we need based on screen width
    const screenWidth = window.innerWidth;
    // We'll make enough copies to fill the screen width at least twice
    const estimatedItemWidth = text.length * 12; // rough estimate of text width
    const copiesNeeded = Math.ceil((screenWidth * 2) / estimatedItemWidth) + 1;
    
    // Create multiple copies of the content to ensure no gaps
    for (let i = 0; i < copiesNeeded; i++) {
      const contentItem = document.createElement('div');
      contentItem.className = 'marquee-content';
      contentItem.textContent = `⟶ ${text}`;
      wrapper.appendChild(contentItem);
    }
    
    track.appendChild(wrapper);
  
    // Wait for DOM to paint, then set exact animation distance
    requestAnimationFrame(() => {
      // Measure the width of a single content item
      const contentWidth = track.querySelector('.marquee-content').offsetWidth;
      
      // Set animation distance to the width of one content item
      // This creates a perfect loop with multiple copies
      track.style.setProperty('--marquee-distance', `${contentWidth}px`);
      
      // Adjust the animation duration based on content length
      // Longer text should scroll a bit slower for readability
      const baseDuration = 20; // seconds
      const adjustedDuration = Math.max(baseDuration, text.length / 5);
      track.style.animationDuration = `${adjustedDuration}s`;
    });
  }
  