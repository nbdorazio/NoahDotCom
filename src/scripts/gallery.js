/**
 * Enhanced Gallery Module with Video and 3D Model Support
 * Creates a responsive gallery that handles images, videos, and 3D models
 */

export function createGallery(containerId, media) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create gallery structure
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';
    
    // Main media display
    const mainMediaContainer = document.createElement('div');
    mainMediaContainer.className = 'gallery-main-media';
    
    // Initial media is the first item in the array
    const firstItem = media[0];
    let mainContent;
    
    // Create appropriate element based on media type
    if (firstItem.type === 'video') {
      mainContent = createVideoElement(firstItem);
    } else if (firstItem.type === '3d-model') {
      mainContent = create3DModelPlaceholder(firstItem);
    } else {
      // Default to image if type is not specified or is 'image'
      mainContent = createImageElement(firstItem);
    }
    
    mainMediaContainer.appendChild(mainContent);
    
    // Caption area
    const captionElement = document.createElement('div');
    captionElement.className = 'gallery-caption';
    captionElement.textContent = firstItem.caption || '';
    
    // Create thumbnail strip with wrapping
    const stripContainer = document.createElement('div');
    stripContainer.className = 'gallery-strip';
    
    // Create thumbnails for all media items
    media.forEach((item, index) => {
      // Create thumbnail container
      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.className = 'gallery-thumbnail-container';
      if (index === 0) thumbnailContainer.classList.add('active');
      
      // Create thumbnail image (even for videos and 3D models we use an image thumbnail)
      const thumbnail = document.createElement('img');
      thumbnail.src = item.thumbnail || item.src; // Use thumbnail if provided, otherwise use src
      thumbnail.alt = `Thumbnail ${index + 1}`;
      thumbnail.className = 'gallery-thumbnail';
      
      // Add indicator based on item type
      if (item.type === 'video') {
        const videoIndicator = document.createElement('div');
        videoIndicator.className = 'gallery-video-indicator';
        videoIndicator.innerHTML = '▶'; // Play icon
        thumbnailContainer.appendChild(videoIndicator);
      } else if (item.type === '3d-model') {
        const modelIndicator = document.createElement('div');
        modelIndicator.className = 'gallery-model-indicator';
        modelIndicator.innerHTML = '3D'; // 3D indicator
        modelIndicator.style.backgroundColor = '#000000'; // Changed from #4287f5 (blue) to black
        thumbnailContainer.appendChild(modelIndicator);
      }
      
      thumbnailContainer.appendChild(thumbnail);
      
      // Add click event
      thumbnailContainer.addEventListener('click', () => {
        setActiveMedia(index);
      });
      
      stripContainer.appendChild(thumbnailContainer);
    });
    
    // Assemble the gallery
    galleryContainer.appendChild(mainMediaContainer);
    galleryContainer.appendChild(captionElement);
    galleryContainer.appendChild(stripContainer);
    
    // Add to the container
    container.appendChild(galleryContainer);
    
    // Current state
    let currentIndex = 0;
    let currentModelViewer = null;
    
    // Helper function to create video element
    function createVideoElement(item) {
      const videoElement = document.createElement('video');
      
      // Set attributes
      videoElement.controls = true;
      videoElement.preload = 'metadata';
      if (item.poster) videoElement.poster = item.poster;
      
      // Add optional attributes
      if (item.autoplay) videoElement.autoplay = true;
      if (item.muted) videoElement.muted = true;
      if (item.loop) videoElement.loop = true;
      
      // Add source
      const source = document.createElement('source');
      source.src = item.src;
      source.type = item.videoType || 'video/mp4'; // Default to mp4 if not specified
      
      videoElement.appendChild(source);
      
      // Add fallback text
      videoElement.innerHTML += 'Your browser does not support the video tag.';
      
      return videoElement;
    }
    
    // Helper function to create image element
    function createImageElement(item) {
      const imgElement = document.createElement('img');
      imgElement.src = item.src;
      imgElement.alt = item.caption || 'Gallery image';
      
      // Preload image to adjust container height
      const img = new Image();
      img.onload = function() {
        // Calculate aspect ratio and adjust container height
        adjustContainerHeight(this.naturalWidth, this.naturalHeight);
      };
      img.src = item.src;
      
      return imgElement;
    }
    
    // Helper function to create 3D model placeholder with view button
    function create3DModelPlaceholder(item) {
      const containerElement = document.createElement('div');
      containerElement.className = '3d-model-container';
      containerElement.style.position = 'relative';
      containerElement.style.width = '100%';
      containerElement.style.height = '100%';
      containerElement.style.backgroundColor = '#111';
      
      // Load the 3D model directly without showing loading text
      setTimeout(() => {
        // Use setTimeout to allow the container to be added to DOM first
        loadSTLModel(containerElement, item);
      }, 10);
      
      return containerElement;
    }
    
    // Function to create fullscreen 3D model viewer
    function createFullscreenModelViewer(item) {
      // Early exit if Three.js is not available
      if (!window.THREE) {
        console.error('THREE.js not loaded. Make sure to include Three.js in your HTML.');
        alert('3D viewer requires Three.js which is not loaded.');
        return;
      }
      
      // Create fullscreen container
      const fullscreenView = document.createElement('div');
      fullscreenView.className = 'fullscreen-model-view';
      fullscreenView.style.position = 'fixed';
      fullscreenView.style.top = '0';
      fullscreenView.style.left = '0';
      fullscreenView.style.width = '100%';
      fullscreenView.style.height = '100%';
      fullscreenView.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      fullscreenView.style.zIndex = '9999';
      fullscreenView.style.display = 'flex';
      fullscreenView.style.justifyContent = 'center';
      fullscreenView.style.alignItems = 'center';
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.className = 'fullscreen-close-button';
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.fontSize = '30px';
      closeButton.style.color = 'white';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.cursor = 'pointer';
      closeButton.style.zIndex = '10000';
      
      // Create caption element
      const captionDiv = document.createElement('div');
      captionDiv.className = 'fullscreen-model-caption';
      captionDiv.textContent = item.caption || '';
      captionDiv.style.position = 'absolute';
      captionDiv.style.bottom = '20px';
      captionDiv.style.left = '0';
      captionDiv.style.width = '100%';
      captionDiv.style.textAlign = 'center';
      captionDiv.style.color = 'white';
      captionDiv.style.padding = '10px';
      captionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      
      // Create model container
      const modelContainer = document.createElement('div');
      modelContainer.className = 'fullscreen-model-container';
      modelContainer.style.width = '80%';
      modelContainer.style.height = '80%';
      modelContainer.style.backgroundColor = '#111';
      modelContainer.style.borderRadius = '4px';
      
      // Add elements to fullscreen view
      fullscreenView.appendChild(closeButton);
      fullscreenView.appendChild(modelContainer);
      fullscreenView.appendChild(captionDiv);
      
      // Add to body
      document.body.appendChild(fullscreenView);
      
      // Add close event
      closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        document.body.removeChild(fullscreenView);
      });
      
      // Initialize 3D model
      loadSTLModel(modelContainer, item);
    }
    
    // Function to load and display an STL model
    function loadSTLModel(container, modelData) {
      // Create scene, camera, renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000); // Changed from 0x111111 to 0x000000 (pure black)
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      
      // Add orbit controls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;

      // Disable panning to prevent moving the model around
      controls.enablePan = false;

      // Optional: Restrict rotation to horizontal only (uncomment if desired)
      // controls.minPolarAngle = Math.PI/2;
      // controls.maxPolarAngle = Math.PI/2;

      // Auto rotation if enabled
      if (modelData.autoRotate) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
      }
      
      // Load STL model
      const loader = new THREE.STLLoader();
      let mesh;
      
      loader.load(
        modelData.modelPath,
        function (geometry) {
          // Force the color using a completely new material
          const material = new THREE.MeshStandardMaterial({
            color: 0xE0E0E0,  // Force light grey/whitish
            roughness: 0.7,
            metalness: 0.2
          });
          
          // Log this information to confirm material properties
          console.log("Applied material color:", material.color);
          
          // Create mesh
          mesh = new THREE.Mesh(geometry, material);
          
          // Center the model
          geometry.computeBoundingBox();
          const boundingBox = geometry.boundingBox;
          
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          mesh.position.set(-center.x, -center.y, -center.z);
          
          // Scale model to fit in view
          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 3 / maxDim;
          mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
          
          // Add to scene
          scene.add(mesh);
          
          // Adjust camera position based on model size
          camera.position.z = maxDim * 1.5;
          controls.update();
        },
        // Progress callback - can remove or keep empty
        function (xhr) {
          // Remove progress tracking
        },
        // Error callback
        function (error) {
          console.error(`Error loading STL file:`, error);
          
          // Still show error message
          const errorMessage = document.createElement('div');
          errorMessage.style.position = 'absolute';
          errorMessage.style.top = '50%';
          errorMessage.style.left = '50%';
          errorMessage.style.transform = 'translate(-50%, -50%)';
          errorMessage.style.color = 'red';
          errorMessage.style.textAlign = 'center';
          errorMessage.style.padding = '20px';
          errorMessage.innerHTML = 'Error loading 3D model<br>Please check the console for details';
          container.appendChild(errorMessage);
        }
      );
      
      // Handle window resize
      const onWindowResize = function() {
        if (!container.isConnected) {
          // Clean up when container is removed from DOM
          window.removeEventListener('resize', onWindowResize);
          return;
        }
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', onWindowResize);
      
      // Animation loop
      function animate() {
        if (!container.isConnected) {
          // Stop animation when container is removed from DOM
          return;
        }
        
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      
      // Start animation
      animate();
      
      // Save the current model viewer for potential cleanup
      currentModelViewer = { controls, scene, camera, renderer };
      
      // Return controls to allow external control
      return currentModelViewer;
    }
    
    // Function to adjust container height based on aspect ratio
    function adjustContainerHeight(width, height) {
      // Calculate aspect ratio
      const aspectRatio = height / width;
      const containerWidth = mainMediaContainer.clientWidth;
      const idealHeight = containerWidth * aspectRatio;
      
      // Set appropriate height with limits
      if (idealHeight > 600) {
        mainMediaContainer.style.height = '600px';
      } else if (idealHeight < 300) {
        mainMediaContainer.style.height = '300px';
      } else {
        mainMediaContainer.style.height = idealHeight + 'px';
      }
    }
    
    // Set active media item
    function setActiveMedia(index) {
      if (index === currentIndex) return; // No change needed
      
      currentIndex = index;
      const item = media[index];
      
      // Clean up previous 3D model if it exists
      if (currentModelViewer) {
        // Dispose of Three.js resources
        if (currentModelViewer.renderer) {
          currentModelViewer.renderer.dispose();
        }
        if (currentModelViewer.scene) {
          currentModelViewer.scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }
        currentModelViewer = null;
      }
      
      // Clear current content
      while (mainMediaContainer.firstChild) {
        mainMediaContainer.firstChild.remove();
      }
      
      // Create new content based on type
      let newContent;
      if (item.type === 'video') {
        newContent = createVideoElement(item);
        
        // For videos, we use a standard 16:9 aspect ratio if not specified
        if (!item.aspectRatio) {
          mainMediaContainer.style.height = (mainMediaContainer.clientWidth * 9 / 16) + 'px';
        } else {
          // If aspect ratio is specified, use it
          const [width, height] = item.aspectRatio.split(':').map(Number);
          adjustContainerHeight(width, height);
        }
      } else if (item.type === '3d-model') {
        newContent = create3DModelPlaceholder(item);
        // Set a standard aspect ratio for 3D model placeholder
        mainMediaContainer.style.height = (mainMediaContainer.clientWidth * 9 / 16) + 'px';
      } else {
        newContent = createImageElement(item);
        // The image's onload event will adjust the height
      }
      
      // Add the new content
      mainMediaContainer.appendChild(newContent);
      
      // Update caption
      captionElement.textContent = item.caption || '';
      
      // Update thumbnails
      const thumbnails = stripContainer.querySelectorAll('.gallery-thumbnail-container');
      thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } else {
          thumb.classList.remove('active');
        }
      });
    }
    
    // Add window resize handler
    window.addEventListener('resize', () => {
      const item = media[currentIndex];
      
      if (item.type === 'video') {
        // For videos, maintain aspect ratio based on specified ratio or default 16:9
        if (item.aspectRatio) {
          const [width, height] = item.aspectRatio.split(':').map(Number);
          adjustContainerHeight(width, height);
        } else {
          mainMediaContainer.style.height = (mainMediaContainer.clientWidth * 9 / 16) + 'px';
        }
      } else if (item.type === '3d-model') {
        // For 3D models, maintain a standard aspect ratio
        mainMediaContainer.style.height = (mainMediaContainer.clientWidth * 9 / 16) + 'px';
      } else {
        // For images, reload to calculate aspect ratio
        const img = new Image();
        img.onload = function() {
          adjustContainerHeight(this.naturalWidth, this.naturalHeight);
        };
        img.src = item.src;
      }
    });
    
    // Return control methods
    return {
      setActiveMedia
    };
}

// Add CSS styles for 3D model indicators and buttons
const styleElement = document.createElement('style');
styleElement.textContent = `
.gallery-model-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color:rgb(0, 0, 0);
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
}

.view-3d-model-button:hover {
  background-color:rgb(0, 0, 0);
}
`;
document.head.appendChild(styleElement);