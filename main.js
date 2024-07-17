const myKey = import.meta.env.VITE_GROQ_KEY;

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: myKey, dangerouslyAllowBrowser: true });

//Array of colors example:testing
const colors = [];

//ColorWheel Container
let parent = document.getElementById("colorWheel-container");

//Output of colors to page element
const colorArray = document.querySelector("#color-array");

//Recommendations output
const recOutput = document.querySelector("#cardList");

async function main() {
  //get end user colors array make sure it has a minimum of 1 color in array.
  if (colors.length == 0) {
    alert("Please select a color to evaluate.");
    return;
  } else {
    //loading();
    const input_color = colors.join(",");
    console.log(input_color);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Given a list of RGB or hex color codes, analyze the provided colors and return a JSON object containing the hex color values that best complement each color. Also add some text details to each compliment.",
        },
        {
          role: "user",
          content: input_color,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });
    //const colorRecom = JSON.parse(chatCompletion.choices[0].message.content);
    const colorRecom = JSON.parse(chatCompletion.choices[0].message.content);

    //send this output for rendering function
    // console.log(colorRecom);
    renderOutput(colorRecom, input_color);
  }
}

//Render output
function renderOutput(data, input) {
  console.log(Object.keys(data));
  console.log(Object.values(data));

  Object.keys(data).filter((color) => {
    if (color.includes(input)) {
          const recommend = document.createElement('li');
          recommend.className = 'list-group-item';
          recommend.innerHTML = `
                     <div class="row">
                      <div class="col" style="max-width: 50px">
                        <div class="card-body">
                            <div class="colorCard2" style='background-color: ${color};'></div>
                        </div>
                      </div>
                      <div class="col text-start">
                        <div class="card-body text-start">
                            <p class="card-text text-start"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                        </div>
                      </div>
                    </div>
          `
          recOutput.appendChild(recommend);
    }
  });

  // for(let item in data){
  //   if(data.hasOwnProperty(item) === input){
  //     const recommend = document.createElement('li');
  //     recommend.className = 'list-group-item';
  //     recommend.innerHTML = `
  //                <div class="row">
  //                 <div class="col" style="max-width: 50px">
  //                   <div class="card-body">
  //                       <div class="colorCard2" style='background-color: ${item};'></div>
  //                   </div>
  //                 </div>
  //                 <div class="col text-start">
  //                   <div class="card-body text-start">
  //                       <p class="card-text text-start"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
  //                   </div>
  //                 </div>
  //               </div>
  //     `
  //     recOutput.appendChild(recommend);
  //   };
  // };
}

//On Page Load Generate ColorWheel Element
createHslPicker(
  parent,
  (h, s, l) => {
    let sample = document.getElementById("sample"),
      text = document.getElementById("hsl-values");

    sample.style.background = `hsl(${h}, ${s}%, ${l}%)`;
  },
  50
);

//ColorWheel Picker Main Function
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

//Remove array index and delete box from dom
colorArray.addEventListener("click", (el) => {
  let target = el.target.id;
  let index = colors.indexOf(target);
  colors.splice(index, 1);
  colorArray.removeChild(el.target);
  console.log(colors);
});

//Display Loading Spinner
const loading = () => {
  const spinner = document.createElement("div");
  spinner.className = "spinner-border";
  spinner.role = "status";
  recOutput.appendChild(spinner);
};

//Recommend button
const recommendButton = document.querySelector("#recommendButton");
recommendButton.addEventListener("click", () => {
  console.log("Recommend button clicked");
  main();
});

//Cancel button
const cancelButton = document.querySelector("#cancelButton");
cancelButton.addEventListener("click", () => {
  console.log("Cancel button clicked");
  renderOutput();
});
