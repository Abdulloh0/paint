const canvas = document.querySelector(".canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .row__list-item");
const colorPicker = document.querySelector("#color-picker");
const clearCanvasBtn = document.querySelector(".clear-canvas");
const saveImageBtn = document.querySelector(".save-img");

let ctx = canvas.getContext("2d");
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = "#000";
let prevMouseX;
let prevMouseY;
let snapshot;

const setCannvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCannvasBackground()
});

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawRectangle = (e) => {
  !fillColor.checked
    ? ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      )
    : ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
};

const drawCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  // if(selectedTool == "brush" || selectedTool == "eraser") {
  //   ctx.strokeStyle = selectedTool === "eraser" ? '#fff' : selectedColor
  //   ctx.lineTo(e.offsetX, e.offsetY)
  //   ctx.stroke();
  // }

  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    default:
      break;
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".row__list .row__list-item--active")
      .classList.remove("row__list-item--active");
    btn.classList.add("row__list-item--active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".row__list .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCannvasBackground()
});

saveImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Abdulloh-paint${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

const stopDraw = () => (isDrawing = false);

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
