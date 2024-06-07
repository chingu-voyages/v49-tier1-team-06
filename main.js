//Output of colors to page element
const colorArray = document.querySelector("#color-array");
//console.log(colorArray);

//array of colors example:testing
const colors = [
  "#FF0000",
  "#008000",
  "#0000FF",
  "#FFFFFF",
  "#FFFFF0",
  "#000000",
  "#808080",
  "#C0C0C0",
];

//length of array
const arrayLength = colors.length;
console.log(arrayLength);

//iterate of color array
//create new div element with card and colorCard class
const iterate = colors.map((el) => {
  const newCard = document.createElement("div");
  newCard.className = "card colorCard btn-close";
  newCard.id = `${colors.indexOf(el)}`;
  newCard.style = `background-color: ${el}`;
  colorArray.appendChild(newCard);
});

///////////////CRUD

//delete box
colorArray.addEventListener('click',(el)=>{
    console.log(el.target);
    colorArray.removeChild(el.target);
});

//color wheel
let parent = document.getElementById("colorWheel-container");

createHslPicker(
  parent,
  (h, s, l) => {
    let sample = document.getElementById("sample"),
      text = document.getElementById("hsl-values");

    sample.style.background = `hsl(${h}, ${s}%, ${l}%)`;
    text.innerHTML = `Hue: <b>${h}</b>, Saturation: <b>${s}</b>%, Lightness: <b>${l}</b>%`;
  },
  50
);

/*
  Main function, creates the HSL picker inside a parent that you provide (such as a div).
  As the user picks different HSL values, you are notified via the callback.
  The HSL values are provided as arguments, and you can use them to update other parts of your UI.
  You can also pass an initial hue, via the thrid argument.
*/
function createHslPicker(parent, callback, initialHue = 0) {
  parent.innerHTML = getHtml();

  let canvas = document.getElementById("canvas-hue"),
    rgSat = document.getElementById("rg-saturation"),
    rgLight = document.getElementById("rg-lightness"),
    hsl = [initialHue, 100, 50];

  drawColorWheel();
  onHslChanged();

  let xCircle = canvas.width / 2,
    yCircle = canvas.height / 2,
    radius = canvas.width / 2;

  canvas.addEventListener("mousemove", (ev) => {
    let dist = Math.sqrt(
      Math.pow(ev.offsetX - xCircle, 2) + Math.pow(ev.offsetY - yCircle, 2)
    );
    canvas.style.cursor = dist <= radius ? "cell" : "default";
  });

  canvas.addEventListener("mousedown", (ev) => {
    if (ev.button != 0) {
      return;
    }

    let dist = Math.sqrt(
      Math.pow(ev.offsetX - xCircle, 2) + Math.pow(ev.offsetY - yCircle, 2)
    );

    if (radius < dist) {
      return;
    }

    let sine = (yCircle - ev.offsetY) / dist,
      radians = Math.atan2(yCircle - ev.offsetY, ev.offsetX - xCircle);

    if (radians < 0) {
      radians = 2 * Math.PI - Math.abs(radians);
    }

    let degrees = (radians * 180) / Math.PI,
      hue = Math.round(degrees);
    onHuePicked(hue);
  });

  function onHuePicked(h) {
    hsl[0] = h;
    //convert to hex
    let hex = hslToHex(hsl[0], 100, 50);
    console.log(hex);
    onHslChanged();
  }

  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function onHslChanged() {
    if (callback) {
      callback(...hsl);
    }
  }

  function drawColorWheel() {
    let ctx = canvas.getContext("2d"),
      radius = canvas.width / 2,
      x = canvas.width / 2,
      y = canvas.height / 2,
      [h, s, l] = hsl;

    for (let i = 0; i < 360; i++) {
      let color = `hsl(${i}, ${s}%, ${l}%)`;

      ctx.beginPath();

      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, (-(i + 1) * Math.PI) / 180, (-i * Math.PI) / 180);
      ctx.lineTo(x, y);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      ctx.fill();
      ctx.stroke();
    }
  }

  function getHtml() {
    return `<div>
                <div>
                <canvas id="canvas-hue" width="300" height="300"></canvas>
                </div>
		  
                <div style="grid-area: saturation; padding-top: 30px; padding-left: 20px;">
                    <input id="rg-saturation" style="display:none;">
                </div>
		  
                <div style="grid-area: lightness; padding-top: 30px; padding-left: 20px;">
                    <input id="rg-lightness" style="display: none;">
                </div>
    </div>`;
  }
}

