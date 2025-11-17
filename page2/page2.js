let data;
let rowIndex = -1;
let maxElevation = 0;

function preload() {
  data = loadTable("../vulcani.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");

  const params = new URLSearchParams(window.location.search);
  rowIndex = int(params.get("row"));

  let elevations = data.getColumn("Elevation (m)").map(Number).filter(x => !isNaN(x));
  maxElevation = Math.max(...elevations);

  maxElevation = Math.floor(maxElevation / 1000) * 1000;
}

function draw() {
  background(15, 10, 40); 

  let name = data.getString(rowIndex, "Volcano Name");
  let country = data.getString(rowIndex, "Country");
  let type = data.getString(rowIndex, "Type");
  let status = data.getString(rowIndex, "Status");
  let elev = Number(data.getString(rowIndex, "Elevation (m)")) || 0;

  // Nome vulcano
  fill(255);
  textAlign(CENTER, TOP);
  textSize(44);
  text(`🌋 ${name}`, width / 2, 30);

  // Testo categorie + valori
  textAlign(LEFT, TOP);
  textSize(22);
  let labelX = 50;
  let valueX = 200;

  fill(255); textStyle(NORMAL); text(`Paese:`, labelX, 150);
  textStyle(BOLD); text(`${country}`, valueX, 150);

  textStyle(NORMAL); text(`Tipo:`, labelX, 190);
  textStyle(BOLD); text(`${type}`, valueX, 190);

  textStyle(NORMAL); text(`Altitudine:`, labelX, 230);
  textStyle(BOLD); text(`${elev} m`, valueX, 230);

  textStyle(NORMAL); text(`Stato:`, labelX, 270);
  textStyle(BOLD); text(`${status}`, valueX, 270);

  // Barra verticale altitudine
  let barX = width * 0.7 + 100;
  let barYBottom = height * 0.65 + 125;
  let barYTop = height * 0.65 - 125;
  drawAltitudeBar(barX, barYTop, barYBottom, elev);

  // Triangolo
  let triHeight = map(elev, 0, maxElevation, 0, barYBottom - barYTop);
  fill(getColorByStatus(status));
  drawTriangle(barX - 50, barYBottom, triHeight);

  // Torna alla mappa
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("⬅︎ Torna alla mappa", width / 2, height - 40);
}



function drawTriangle(x, yBottom, h) {
  triangle(x, yBottom - h, x - h / 3, yBottom, x + h / 3, yBottom);
}

function drawAltitudeBar(x, yTop, yBottom, vulcanoElev) {
  stroke(255);
  strokeWeight(3);
  line(x, yTop, x, yBottom);

  let step = 1000;
  textSize(14);
  textAlign(LEFT, CENTER);

  for (let m = 0; m <= maxElevation; m += step) {
    let yy = map(m, 0, maxElevation, yBottom, yTop);
    strokeWeight(1.5);
    line(x - 6, yy, x + 6, yy);

    noStroke();
    textStyle(BOLD);
    fill(255);
    text(`${m} m`, x + 12, yy - 7);
  }

  // Marcatore vulcano
  let markerY = map(vulcanoElev, 0, maxElevation, yBottom, yTop);
  fill(255, 50, 50);
  noStroke();
  circle(x, markerY, 12);
}

function getColorByStatus(status) {
  status = status.toLowerCase();
  if (status.includes("holocene")) return color(255, 0, 0);
  if (status.includes("historical")) return color(255, 140, 0);
  if (status.includes("uncertain")) return color(140, 140, 140);
  return color(255, 215, 0);
}

function mousePressed() {
  // Controllo su Torna alla mappa
  let txtX = width / 2;
  let txtY = height - 40;
  let txtW = 200; 
  let txtH = 30; 

  if (mouseX > txtX - txtW/2 && mouseX < txtX + txtW/2 &&
      mouseY > txtY - txtH/2 && mouseY < txtY + txtH/2) {
    window.location.href = "../index.html";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
