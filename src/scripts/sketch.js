let color1, color2;//initiating the variables for random color change
let shift = 0;  //initiating the shifting value for noise later. T

function setup() {
  createCanvas(windowWidth, windowHeight);
  color1 = color(255);
  color2 = color(255);
}

function draw() {
  background(0, 2);
  
  let t = frameCount / 400;//speed of animation 
  
  // uses the same seed of noise in each parablic equation to had a small shift in variation to the animation 
  let variation = map(noise(shift), 0, 1, -0.1, 0.1);
  
  let x1 = width / 2 + (width / 4) * cos(t + variation) * cos((3 + variation) * t);
  let y1 = height / 2 + (height / 4) * sin(t + variation) * cos((3 + variation) * t);
  
  let x2 = width / 2 + (width / 4) * cos(t + PI + variation) * cos((3 + variation) * t);
  let y2 = height / 2 + (height / 4) * sin(t + PI + variation) * cos((3 + variation) * t);
  
  shift += 0.10;//shfiting incrementally, so theres a smooth transitition between the previous paths 
  // checking when the two ellipses are close enough to each other to randomly change color
  let d = dist(x1, y1, x2, y2);
  if (d < 5) {
    color1 = color(random(255), random(255), random(255), 150);
    color2 = color(random(255), random(255), random(255), 150);
  }
  
  noStroke();
  fill(color1);
  ellipse(x1, y1, 6, 6);
  fill(color2);
  ellipse(x2, y2, 6, 6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}