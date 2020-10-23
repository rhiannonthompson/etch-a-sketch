// GLOBAL VARIABLES

const colorBtn = document.querySelector(".color-btn");
const grayBtn = document.querySelector(".gray-btn");
const gridContainer = document.querySelector(".grid-container");
const resetButton = document.querySelector(".reset-btn");
const slider = document.querySelector("input[type='range']");
const output = document.querySelector("output");

const defaultGray = "rgba(0, 0, 0, 0.10)";
let controlVal;
let useColor = false;

// COLOR CONTROLS

function getRandomColour() {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

function changeAlpha(rgbaString, amount = 0.1) {
  let colorArray = rgbaString.split(",");

  if (colorArray.length < 4) {
    return rgbaString;
  }

  let last = colorArray[3];
  let alpha = +last.slice(1, last.indexOf(")"));
  colorArray.pop();
  alpha += amount;

  if (alpha >= 1) {
    alpha = 1.0;
  } else if (alpha < 0) {
    alpha = 0.0;
  }

  colorArray.push(` ${alpha})`);
  let updatedColor = colorArray.join(",");
  return updatedColor;
}

// GRID FUNCTIONS

function makeGrid(rows = 16, cols = 16) {
  gridContainer.style.setProperty("--grid-rows", rows);
  gridContainer.style.setProperty("--grid-cols", cols);

  for (c = 0; c < rows * cols; c++) {
    let cell = document.createElement("div");
    gridContainer.appendChild(cell).className = "grid-item";
    gridContainer.lastChild.style.border = "0.15px dashed black";
    gridContainer.lastChild.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
}

function setUseColor(e) {
  e.target.style.backgroundColor = getRandomColour();
}

function setUseGray(e) {
  let currentColor = e.target.style.backgroundColor;
  e.target.style.backgroundColor = changeAlpha(currentColor, 0.1);
}

function setUseColorPicker(e) {
  e.target.style.backgroundColor = document.querySelector("#colorWell").value;
}

function initGrid(useColor) {
  const squares = document.querySelectorAll(".grid-item");

  squares.forEach((square) => {
    if (useColor) {
      square.removeEventListener("mouseover", setUseGray);
      square.addEventListener("mouseover", setUseColor);
    } else if (!useColor) {
      square.removeEventListener("mouseover", setUseColorPicker);
      square.removeEventListener("mouseover", setUseColor);
      square.addEventListener("mouseover", setUseGray);
    }
  });
}

function clearGrid() {
  const squares = document.querySelectorAll(".grid-item");
  squares.forEach((square) => {
    square.style.backgroundColor = "rgba(0, 0, 0, 0)";
  });
}

function deleteGrid() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.lastChild);
  }
}

// EVENT LISTNERS

resetButton.addEventListener("click", clearGrid);

grayBtn.addEventListener("click", () => {
  useColor = false;
  initGrid(useColor);
});

colorBtn.addEventListener("click", () => {
  useColor = true;
  initGrid(useColor);
});

// SLIDER CONTROLS

slider.addEventListener("input", () => {
  let controlMin = slider.min;
  let controlMax = slider.max;
  controlVal = slider.value;
  let controlThumbWidth = slider.dataset.thumbwidth;
  let range = controlMax - controlMin;

  let position = ((controlVal - controlMin) / range) * 100;
  let positionOffset =
    Math.round((controlThumbWidth * position) / 100) - controlThumbWidth / 2;

  output.textContent = controlVal;
  output.style.left = `calc(${position}% - ${positionOffset}px)`;
});

slider.addEventListener("mouseup", () => {
  deleteGrid();
  makeGrid(controlVal, controlVal);
  initGrid();
  colorBtn.textContent = "Switch to Colour";
});

// DISPLAY GRID

makeGrid();
initGrid(useColor);

// COLOR PICKER

let colorWell;
let defaultColor = "#474955";

window.addEventListener("load", startup, false);

function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = defaultColor;
  colorWell.addEventListener("input", updateColor, false);
  colorWell.select();
}

function updateColor() {
  const squares = document.querySelectorAll(".grid-item");
  squares.forEach((square) => {
    if (square) {
      square.addEventListener("mouseover", setUseColorPicker);
    }
  });
}
