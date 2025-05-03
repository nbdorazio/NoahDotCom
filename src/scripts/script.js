// script.js - Main application logic

// Import the banner and Roon functionality
import { initRoonNowPlaying } from './roon.js';
import { updateMarquee, initAllBanners } from './banners.js';
// Import the gallery module
import { createGallery } from './gallery.js';

// Project data - you can expand this with your actual projects
const projects = [
  {
    id: 1,
    title: "Remote Control Sphere Robot",
    description: "An innovative robotics project featuring a spherical design with remote control capabilities.",
    image: "src/images/Harby1.jpg",
    gallery: [
      { src: "src/images/HarbyFinals/538A9139.jpg", caption: "Sphere Bot with blocks" },
      { src: "src/images/Harby2.jpg", caption: "Robotic sphere in action" },
      { src: "/api/placeholder/800/600?text=Robot+View+3", caption: "Close-up of control mechanism" },
      { src: "/api/placeholder/800/600?text=Technical+Diagram", caption: "Technical schematic of robot design" }
    ],
    content: `
      <div class="project-container">
        <h1>Remote Control Sphere Robot</h1>
        <p>An innovative robotics project featuring a spherical design with remote control capabilities.</p>
        
        <!-- Gallery placeholder -->
        <div class="gallery-container-placeholder"></div>
        
        <div class="project-details">
          <h2>About this project</h2>
          <p>This spherical robot uses an innovative propulsion system that allows for smooth movement across various surfaces. The design incorporates balance mechanisms that enable precise control and stability.</p>
          
          <h2>Technologies used</h2>
          <ul>
            <li>Arduino microcontroller</li>
            <li>Custom PCB design</li>
            <li>3D printed chassis components</li>
            <li>Wireless communication module</li>
            <li>Gyroscopic stabilization</li>
          </ul>
        </div>
        <button class="back-button">Back to projects</button>
      </div>
    `,
    script: null
  },
  {
    id: 2,
    title: "Music Integration",
    description: "Integration with Roon music API to display currently playing tracks.",
    image: "/api/placeholder/600/400", // Placeholder image - replace with your actual image path
    gallery: [
      { src: "/api/placeholder/800/600?text=Roon+Integration", caption: "Firebase integration with Roon API" },
      { src: "/api/placeholder/800/600?text=Now+Playing", caption: "Example of now playing status" },
      { src: "/api/placeholder/800/600?text=Firebase+Console", caption: "Database configuration" },
      { src: "/api/placeholder/800/600?text=Code+Sample+1", caption: "Real-time database listeners" },
      { src: "/api/placeholder/800/600?text=Code+Sample+2", caption: "Marquee update function" }
    ],
    content: `
      <div class="project-container">
        <h1>Music Integration</h1>
        <p>Real-time music tracking integration with Roon API.</p>
        
        <!-- Gallery placeholder -->
        <div class="gallery-container-placeholder"></div>
        
        <div class="project-details">
          <h2>About this project</h2>
          <p>This project connects to a Firebase database that receives updates from Roon, a high-fidelity music system. The currently playing track is displayed in the bottom banner of the website.</p>
          <h2>Technologies used</h2>
          <ul>
            <li>Firebase</li>
            <li>JavaScript</li>
            <li>Roon API</li>
          </ul>
        </div>
        <button class="back-button">Back to projects</button>
      </div>
    `,
    script: null
  },
  // Add more projects as needed for the other cells
  {
    id: 3,
    title: "Responsive Design",
    description: "A responsive web design showcase with dynamic layout changes.",
    image: "/api/placeholder/600/400", // Placeholder image - replace with your actual image path
    gallery: [
      { src: "/api/placeholder/800/600?text=Desktop+View", caption: "Desktop layout with full grid" },
      { src: "/api/placeholder/800/600?text=Tablet+View", caption: "Tablet view with adjusted columns" },
      { src: "/api/placeholder/800/600?text=Mobile+View", caption: "Mobile view with single column" },
      { src: "/api/placeholder/800/600?text=Ultrawide+View", caption: "Ultrawide screen adaptation" }
    ],
    content: `
      <div class="project-container">
        <h1>Responsive Design</h1>
        <p>Adaptive layouts for various screen sizes and orientations.</p>
        
        <!-- Gallery placeholder -->
        <div class="gallery-container-placeholder"></div>
        
        <div class="project-details">
          <h2>About this project</h2>
          <p>This project demonstrates responsive web design principles, with layouts that adapt to different screen sizes from mobile to ultra-wide displays.</p>
          <h2>Technologies used</h2>
          <ul>
            <li>CSS Grid</li>
            <li>CSS Media Queries</li>
            <li>Responsive Typography</li>
          </ul>
        </div>
        <button class="back-button">Back to projects</button>
      </div>
    `,
    script: null
  },
  // Add more project templates for cells 4-10
];

// Create remaining project templates with placeholder content
for (let i = 4; i <= 10; i++) {
  if (!projects.some(p => p.id === i)) {
    projects.push({
      id: i,
      title: `Project ${i}`,
      description: `Description for Project ${i}`,
      image: `/api/placeholder/600/400?text=Project+${i}`, // Placeholder with project number
      gallery: [
        { src: `/api/placeholder/800/600?text=Project+${i}+Image+1`, caption: `First image for Project ${i}` },
        { src: `/api/placeholder/800/600?text=Project+${i}+Image+2`, caption: `Second image for Project ${i}` },
        { src: `/api/placeholder/800/600?text=Project+${i}+Image+3`, caption: `Third image for Project ${i}` }
      ],
      content: `
        <div class="project-container">
          <h1>Project ${i}</h1>
          <p>This is a placeholder for Project ${i}.</p>
          
          <!-- Gallery placeholder -->
          <div class="gallery-container-placeholder"></div>
          
          <div class="project-details">
            <h2>About this project</h2>
            <p>Project details will go here.</p>
          </div>
          <button class="back-button">Back to projects</button>
        </div>
      `,
      script: null
    });
  }
}

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded. Initializing site...');

  // Initialize all banners
  initAllBanners();

  // Start Firebase now-playing listener (only affects bottom banner)
  initRoonNowPlaying(updateMarquee);

  // Initialize the grid cells
  initializeGrid();
});

// Set up the grid cells with click handlers
function initializeGrid() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
      // Add project images to cells
      const projectId = index + 1;
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        // Clear any existing content
        cell.innerHTML = '';
        
        // Create image element
        const imgContainer = document.createElement('div');
        imgContainer.className = 'cell-image-container';
        
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.className = 'cell-image';
        
        imgContainer.appendChild(img);
        
        // Add image to cell
        cell.appendChild(imgContainer);
        
        // Make cell clickable
        cell.setAttribute('data-project-id', projectId);
        cell.classList.add('clickable');
        
        // Add click event listener
        cell.addEventListener('click', () => {
          openProject(projectId);
        });
      }
    });
    
    // Set up event delegation for back buttons
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-button')) {
        showMainGrid();
      }
    });
  }
  
  // Set up event delegation for back buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      showMainGrid();
    }
  });


// Display a specific project
function openProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  
  // Get the grid container and content
  const gridContainer = document.querySelector('.grid-container');
  const content = document.querySelector('.content');
  const footer = document.querySelector('.footer');
  
  // Save the current view for going back
  gridContainer.setAttribute('data-previous-view', 'main-grid');
  
  // Hide the grid content and footer
  content.style.display = 'none';
  footer.style.display = 'none';
  
  // Create and insert project content
  const projectContentEl = document.createElement('div');
  projectContentEl.className = 'project-view';
  projectContentEl.innerHTML = project.content;
  gridContainer.appendChild(projectContentEl);
  
  // Initialize gallery if the project has gallery images
  if (project.gallery && project.gallery.length > 0) {
    // Find the gallery container in the project content
    const galleryContainer = projectContentEl.querySelector('.gallery-container-placeholder');
    if (galleryContainer) {
      galleryContainer.id = `gallery-${projectId}`;
      // Create the gallery with the specified images
      createGallery(`gallery-${projectId}`, project.gallery);
    }
  }
  
  // Run project-specific script if specified
  if (project.script && typeof window[project.script] === 'function') {
    window[project.script]();
  }
}

// Return to the main grid view
function showMainGrid() {
  const gridContainer = document.querySelector('.grid-container');
  const content = document.querySelector('.content');
  const footer = document.querySelector('.footer');
  const projectView = document.querySelector('.project-view');
  
  if (projectView) {
    projectView.remove();
  }
  
  // Show the main grid and footer
  content.style.display = 'grid';
  footer.style.display = 'grid';
  
  // Clear the previous view attribute
  gridContainer.removeAttribute('data-previous-view');
}

// Function to load the P5.js sketch for project 1
window.loadSketch = function() {
  // Get the container element
  const container = document.getElementById('p5-container');
  if (!container) return;
  
  // Create a canvas that fits the container
  const canvas = document.createElement('canvas');
  canvas.id = 'p5-canvas';
  container.appendChild(canvas);
  
  // Variables for the sketch
  let color1, color2;
  let shift = 0;
  
  // Initialize P5 instance mode
  new p5((p) => {
    p.setup = function() {
      const width = container.clientWidth;
      const height = Math.min(container.clientWidth, 400); // Set a reasonable height
      
      p.createCanvas(width, height);
      color1 = p.color(255);
      color2 = p.color(255);
    };
    
    p.draw = function() {
      p.background(0, 2);
      
      let t = p.frameCount / 400;
      
      let variation = p.map(p.noise(shift), 0, 1, -0.1, 0.1);
      
      let x1 = p.width / 2 + (p.width / 4) * p.cos(t + variation) * p.cos((3 + variation) * t);
      let y1 = p.height / 2 + (p.height / 4) * p.sin(t + variation) * p.cos((3 + variation) * t);
      
      let x2 = p.width / 2 + (p.width / 4) * p.cos(t + p.PI + variation) * p.cos((3 + variation) * t);
      let y2 = p.height / 2 + (p.height / 4) * p.sin(t + p.PI + variation) * p.cos((3 + variation) * t);
      
      shift += 0.10;
      
      let d = p.dist(x1, y1, x2, y2);
      if (d < 5) {
        color1 = p.color(p.random(255), p.random(255), p.random(255), 150);
        color2 = p.color(p.random(255), p.random(255), p.random(255), 150);
      }
      
      p.noStroke();
      p.fill(color1);
      p.ellipse(x1, y1, 6, 6);
      p.fill(color2);
      p.ellipse(x2, y2, 6, 6);
    };
    
    p.windowResized = function() {
      const width = container.clientWidth;
      const height = Math.min(container.clientWidth, 400);
      p.resizeCanvas(width, height);
    };
  }, canvas.id);
};