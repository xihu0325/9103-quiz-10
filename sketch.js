let sound
let button
let fft, waveform
let stars = []
function preload() {
  sound = loadSound("sample-visualisation.mp3")
}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB)
  button = createButton('playMusic');
  button.position(width / 2 - 30, height * 0.9);
  button.mousePressed(playSound);

  fft = new p5.FFT()
  waveform = fft.waveform()
  console.log(waveform)
}

function draw() {
  background(0);
  orbitControl()
  waveform = fft.waveform()
  rotateX(PI / 5)
  translate(0, height * 0.1)

  let r = width * 1
  for (let a = 0; a < 2 * PI; a += PI / 16) {
    let index = int(map(a, 0, 2 * PI, 0, 12))
    let curH = abs(100 * waveform[index])
    let x = r * cos(a)
    let y = r * sin(a)
    push()
    translate(x, y, curH / 2)
    rotateX(PI / 2)
    let c1 = color(40, 160, 100)
    let c2 = color(200, 100, 160)
    let rate = map(a, 0, 2 * PI, 0, 0.5)
    let col = lerpColor(c1, c2, rate)
    stroke(col)
    fill(col)
    cylinder(50, 15 + curH)
    pop()

    for (let k = 0; k < 10; k++) {
      if (random(0.03, 1) < waveform[index]) {
        stars.push(new star(x, y, 5 + curH, col));
      }
    }
  }
  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].show();
    if (stars[i].z > 900) {
      stars.splice(i, 5)
    }
  }
}
function star(x, y, z, col) {
  this.x = x + random(-8, 8);
  this.y = y + random(-8, 8);
  this.z = z;
  this.col = col;
  this.life = 15;
  this.speedX = random(-2, 2);
  this.speedY = random(-2, 2);
  this.speedZ = 15 + (z - 15) / 15;

  this.move = function () {
    this.z += this.speedZ;
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
  };
  this.show = function () {
    push()
    let a = map(this.life, 0, 15, 0, 1);
    stroke(hue(this.col), saturation(this.col), brightness(this.col))

    strokeWeight(10);
    point(this.x, this.y, this.z);
    pop();
  };
}
function playSound() {
  if (!sound.isPlaying()) {
    sound.play()
  }
}
