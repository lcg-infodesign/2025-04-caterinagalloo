let data;
let volcanoes = [];
let hoveredRow = -1;
let padding = 50;
let minLat, maxLat, minLon, maxLon;

function preload() {
  data = loadTable("vulcani.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  noStroke();

  // Calcolo min e max
  let allLat = data.getColumn("Latitude").map(Number).filter(x => !isNaN(x));
  let allLon = data.getColumn("Longitude").map(Number).filter(x => !isNaN(x));
  minLat = min(allLat);
  maxLat = max(allLat);
  minLon = min(allLon);
  maxLon = max(allLon);

  for (let r = 0; r < data.getRowCount(); r++) {
    volcanoes.push(r);
  }
}

function draw() {
  background(15, 10, 40);
  hoveredRow = -1;

  // Titolo in alto a destra
  fill(255);
  textAlign(LEFT, TOP);
  textSize(36);
  textStyle(BOLD);
  text("Vulcani del mondo", 20, 20);
  textStyle(NORMAL);
  textSize(16);
  fill(200);
  text("Il colore è definito dalla legenda, la dimensione dall'altitudine", 20, 60);

  // Disegno triangoli 
  let mapTopPadding = 100; 
  for (let i = 0; i < volcanoes.length; i++) {
    let r = volcanoes[i];
    let lat = Number(data.getString(r, "Latitude"));
    let lon = Number(data.getString(r, "Longitude"));
    if (isNaN(lat) || isNaN(lon)) continue;

    let elev = Number(data.getString(r, "Elevation (m)")) || 0;
    let status = data.getString(r, "Status") || "";

    let x = map(lon, minLon, maxLon, padding, width - padding);
    let y = map(lat, minLat, maxLat, height - padding, mapTopPadding);
    let size = map(elev, 0, 6000, 6, 16);

    fill(getColorByStatus(status));
    noStroke();
    drawTriangle(x, y, size);

    if (dist(mouseX, mouseY, x, y) < size) hoveredRow = r;
  }
  
  drawLegend();
  // Tooltip
  if (hoveredRow !== -1) {
    showTooltip(hoveredRow);
  }

}

function drawTriangle(x, y, s) {
  triangle(x, y - s, x - s / 1.5, y + s / 1.5, x + s / 1.5, y + s / 1.5);
}

function showTooltip(r) {
  let vName = data.getString(r, "Volcano Name") || "Unknown";

  let boxW = 220;
  let boxH = 50;
  let x = constrain(mouseX + 15, 0, width - boxW - 10);
  let y = constrain(mouseY - boxH - 10, 10, height - boxH - 10);

  fill(255, 245);
  stroke(0, 80);
  rect(x, y, boxW, boxH, 10);

  noStroke();
  fill(20);
  textSize(14);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text(`🌋 ${vName}`, x + 10, y + 15);
  textStyle(NORMAL);
  text("Clicca per scoprire di più", x + 10, y + 35);
}

function getColorByStatus(status) {
  status = status.toLowerCase();
  if (status.includes("holocene")) return color(255, 0, 0);     // rosso
  if (status.includes("historical")) return color(255, 140, 0);     // arancione
  if (status.includes("uncertain")) return color(140, 140, 140);    // grigio
  return color(255, 215, 0);                                      // giallo = altro
}

function drawLegend() {
  push();
  // Legenda in alto a destra
  let w = 180;
let h = 140;
let padding = 12;
let x0 = width - w - 20;
let y0 = 20;

  fill(25, 20, 60, 200);
  stroke(255, 40);
  rect(x0, y0, w, h, 10);
  noStroke();

  fill(255);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Legenda", x0 + padding, y0 + padding);

  textSize(12);
  textStyle(NORMAL);

  let statusY = y0 + padding + 25;
  fill(255, 0, 0); triangle(x0 + padding, statusY, x0 + padding - 5, statusY + 10, x0 + padding + 5, statusY + 10);
  fill(255); text("Recentemente attivo", x0 + padding + 20, statusY - 2);

  fill(255, 140, 0); triangle(x0 + padding, statusY + 25, x0 + padding - 5, statusY + 35, x0 + padding + 5, statusY + 35);
  fill(255); text("Eruzioni documentate", x0 + padding + 20, statusY + 23);

  fill(255, 215, 0); triangle(x0 + padding, statusY + 50, x0 + padding - 5, statusY + 60, x0 + padding + 5, statusY + 60);
  fill(255); text("Altro", x0 + padding + 20, statusY + 48);

  fill(140); triangle(x0 + padding, statusY + 75, x0 + padding - 5, statusY + 85, x0 + padding + 5, statusY + 85);
  fill(255); text("Sconosciuto", x0 + padding + 20, statusY + 73);

  pop();
}

function drawGrid() {
  stroke(255, 25);
  strokeWeight(0.5);
  for (let lon = minLon; lon <= maxLon; lon += 60) {
    let x = map(lon, minLon, maxLon, padding, width - padding);
    line(x, 100, x, height - padding); // grid piÃ¹ basso
  }
  for (let lat = minLat; lat <= maxLat; lat += 30) {
    let y = map(lat, minLat, maxLat, height - padding, 100);
    line(padding, y, width - padding, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (hoveredRow !== -1) {
    let newURL = "page2/page2.html?row=" + hoveredRow;
    window.location.href = newURL; 
  }
}