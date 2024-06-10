import Groq from 'groq-sdk';

const groq = new Groq({apiKey: import.meta.env.VITE_GROQ_KEY,dangerouslyAllowBrowser:true});

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "system",
        "content": "return JSON of hexadecimal color values that best compliment user color"
      },
      {
        "role": "user",
        "content": "#034Ghi"
      }
    ],
    "model": "mixtral-8x7b-32768",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "response_format": {
      "type": "json_object"
    },
    "stop": null
  });

   console.log(chatCompletion.choices[0].message.content);
}

//Output of colors to page element
const colorArray = document.querySelector("#color-array");

//array of colors example:testing
const colors = [];

//remove array index and delete box from dom
colorArray.addEventListener("click", (el) => {
  let target = el.target.id;
  let index = colors.indexOf(target);
  colors.splice(index, 1);
  colorArray.removeChild(el.target);
  console.log(colors);
});

//ColorWheel Container
let parent = document.getElementById("colorWheel-container");

createHslPicker(
  parent,
  (h, s, l) => {
    let sample = document.getElementById("sample"),
      text = document.getElementById("hsl-values");

    sample.style.background = `hsl(${h}, ${s}%, ${l}%)`;
  },
  50
);

function createHslPicker(parent, callback, initialHue = 50) {
  parent.innerHTML = getHtml();

  let canvas = document.getElementById("canvas-hue"),
    hsl = [initialHue, 100, 50];

  drawColorWheel();

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
    //check array size
    arraySize(hex);
  }

  function arraySize(hex) {
    if (colors.length < 9) {
      colors.push(hex);
      //init change on new hex
      genColorCube(hex);
      console.log(colors);
      return;
    } else {
      return alert("Color Array is Full, max of 9 colors permitted.");
    }
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

  function genColorCube(hex) {
    const newCard = document.createElement("div");
    newCard.className = "card colorCard btn-close";
    newCard.id = `${hex}`;
    newCard.style = `background-color: ${hex}`;
    colorArray.appendChild(newCard);
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
		  
                <div style="grid-area: saturation; padding-left: 20px;">
                    <input id="rg-saturation" style="display:none;">
                </div>
		  
                <div style="grid-area: lightness;padding-left: 20px;">
                    <input id="rg-lightness" style="display: none;">
                </div>
    </div>`;
  }
}

const recommendButton = document.querySelector("#recommendButton");
recommendButton.addEventListener("click", () => {
  console.log("Recommend button clicked");
  main();
});

const cancelButton = document.querySelector("#cancelButton");
cancelButton.addEventListener("click", () => {
  console.log("Cancel button clicked");
});

