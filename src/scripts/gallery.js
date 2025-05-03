/**
 * Image Gallery Module
 * Creates a responsive image gallery for project pages
 * with thumbnails in multiple rows that maintain original aspect ratios
 */

export function createGallery(containerId, images) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create gallery structure
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';
    
    // Main image display
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'gallery-main-image';
    
    const mainImage = document.createElement('img');
    mainImage.src = images[0].src;
    mainImage.alt = images[0].caption || 'Gallery image';
    
    // Preload the image to get its natural dimensions
    const img = new Image();
    img.onload = function() {
      // Adjust main image container height based on aspect ratio
      const aspectRatio = this.naturalHeight / this.naturalWidth;
      const containerWidth = mainImageContainer.clientWidth;
      const idealHeight = containerWidth * aspectRatio;
      
      // Set appropriate height
      if (idealHeight > 600) {
        mainImageContainer.style.height = '600px';
      } else if (idealHeight < 300) {
        mainImageContainer.style.height = '300px';
      } else {
        mainImageContainer.style.height = idealHeight + 'px';
      }
    };
    img.src = images[0].src;
    
    mainImageContainer.appendChild(mainImage);
    
    // Caption area
    const captionElement = document.createElement('div');
    captionElement.className = 'gallery-caption';
    captionElement.textContent = images[0].caption || '';
    
    // Create horizontal photo strip with wrapping
    const stripContainer = document.createElement('div');
    stripContainer.className = 'gallery-strip';
    
    // Create thumbnails
    images.forEach((image, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = image.src;
      thumbnail.alt = `Thumbnail ${index + 1}`;
      thumbnail.className = 'gallery-thumbnail';
      if (index === 0) thumbnail.classList.add('active');
      
      thumbnail.addEventListener('click', () => {
        setActiveImage(index);
      });
      
      stripContainer.appendChild(thumbnail);
    });
    
    // Assemble the gallery
    galleryContainer.appendChild(mainImageContainer);
    galleryContainer.appendChild(captionElement);
    galleryContainer.appendChild(stripContainer);
    
    // Add to the container
    container.appendChild(galleryContainer);
    
    // Current state
    let currentIndex = 0;
    
    // Set active image
    function setActiveImage(index) {
      currentIndex = index;
      
      // Update main image
      mainImage.src = images[index].src;
      mainImage.alt = images[index].caption || 'Gallery image';
      
      // Adjust container height based on new image aspect ratio
      const newImg = new Image();
      newImg.onload = function() {
        // Calculate aspect ratio
        const aspectRatio = this.naturalHeight / this.naturalWidth;
        const containerWidth = mainImageContainer.clientWidth;
        const idealHeight = containerWidth * aspectRatio;
        
        // Set appropriate height with limits
        if (idealHeight > 600) {
          mainImageContainer.style.height = '600px';
        } else if (idealHeight < 300) {
          mainImageContainer.style.height = '300px';
        } else {
          mainImageContainer.style.height = idealHeight + 'px';
        }
      };
      newImg.src = images[index].src;
      
      // Update caption
      captionElement.textContent = images[index].caption || '';
      
      // Update thumbnails
      const thumbnails = stripContainer.querySelectorAll('.gallery-thumbnail');
      thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
          // Make sure the active thumbnail is visible by scrolling if necessary
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } else {
          thumb.classList.remove('active');
        }
      });
    }
    
    // Add window resize handler
    window.addEventListener('resize', () => {
      // Recalculate image container height on window resize
      const currentImg = new Image();
      currentImg.onload = function() {
        const aspectRatio = this.naturalHeight / this.naturalWidth;
        const containerWidth = mainImageContainer.clientWidth;
        const idealHeight = containerWidth * aspectRatio;
        
        if (idealHeight > 600) {
          mainImageContainer.style.height = '600px';
        } else if (idealHeight < 300) {
          mainImageContainer.style.height = '300px';
        } else {
          mainImageContainer.style.height = idealHeight + 'px';
        }
      };
      currentImg.src = images[currentIndex].src;
    });
    
    // Return control methods
    return {
      setActiveImage
    };
  }