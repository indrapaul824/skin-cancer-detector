let model;
async function loadModel() {
  console.log("model loading..");
  loader = document.getElementById("progress-box");
  load_button = document.getElementById("load-button");
  loader.style.display = "block";
  modelName = "mobilenet";
  model = undefined;
  model = await tf.loadLayersModel(
    "./sc_detector/artifacts/tfjs/mobilen_model/model.json"
  );
  loader.style.display = "none";
  load_button.disabled = true;
  load_button.innerHTML = "Loaded Model";
  console.log("model loaded..");
}

async function loadFile() {
  console.log("image is in loadfile..");
  document.getElementById("select-file-box").style.display = "table-cell";
  document.getElementById("predict-box").style.display = "table-cell";
  document.getElementById("prediction").innerHTML =
    "Click predict to find the type of Skin Cancer!";
  var fileInputElement = document.getElementById("select-file-image");
  console.log(fileInputElement.files[0]);
  renderImage(fileInputElement.files[0]);
}

function renderImage(file) {
  var reader = new FileReader();
  console.log("image is here..");
  reader.onload = function (event) {
    img_url = event.target.result;
    console.log("image is here2..");
    document.getElementById("test-image").src = img_url;
  };
  reader.readAsDataURL(file);
}

var chart = "";
var firstTime = 0;
function loadChart(label, data) {
  var ctx = document.getElementById("chart-box").getContext("2d");
  chart = new Chart(ctx, {
    //type of chart
    type: "bar",

    //data for Chart
    data: {
      labels: label,
      datasets: [
        {
          label: "Probability Chart",
          backgroundColor: "rgb(82, 196, 211)",
          borderColor: "rgb(82, 196, 211)",
          color: "white",
          tickColor: "white",
          data: data,
        },
      ],
    },
    //config options
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white",
            font: {
              size: 18,
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "white",
            font: {
              size: 15,
            },
          },
        },
        x: {
          ticks: {
            color: "white",
            font: {
              size: 15,
            },
          },
        },
      },
    },
  });
}

async function predButton() {
  console.log("model loading..");

  if (model == undefined) {
    alert("Please load the model first..");
  }
  if (document.getElementById("predict-box").style.display == "none") {
    alert("Please load an image using 'Demo Image' or 'Upload Image' button..");
  }
  console.log(model);
  let image = document.getElementById("test-image");
  let tensor = preprocessImage(image, modelName);

  let predictions = await model.predict(tensor).data();
  let results_all = Array.from(predictions)
    .map(function (p, i) {
      return {
        probability: p,
        className: TARGET_CLASSES[i],
        index: i,
      };
    })
    .sort(function (a, b) {
      return b.probability - a.probability;
    });

  let results = results_all.slice(0, 3);

  document.getElementById("predict-box").style.display = "block";
  document.getElementById("prediction").innerHTML =
    "The predicted type of Skin Cancer is: <br><b>" +
    results[0].className +
    "</b>";

  var ul = document.getElementById("predict-list");
  ul.innerHTML = "";
  results.forEach(function (p) {
    console.log(
      p.className + "(" + p.index + ")" + " " + p.probability.toFixed(6)
    );
    var li = document.createElement("LI");
    li.innerHTML =
      p.className + "(" + p.index + ")" + " " + p.probability.toFixed(6);
    ul.appendChild(li);
  });

  // label = ["0", "1", "2", "3", "4", "5", "6"];
  label = [
    "0: akiec",
    "1: bcc",
    "2: bkl",
    "3: df",
    "4: mel",
    "5: nv",
    "6: vasc",
  ];
  if (firstTime == 0) {
    loadChart(label, predictions);
    firstTime = 1;
  } else {
    chart.destroy();
    loadChart(label, predictions);
  }

  document.getElementById("chart-box").style.display = "block";
}

function preprocessImage(image, modelName) {
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat();

  if (modelName === undefined) {
    return tensor.expandDims();
  } else if (modelName === "mobilenet") {
    let offset = tf.scalar(127.5);
    return tensor.sub(offset).div(offset).expandDims();
  } else {
    alert("Unknown model name..");
  }
}

function loadDemoImage() {
  document.getElementById("predict-box").style.display = "table-cell";
  document.getElementById("prediction").innerHTML =
    "Click predict to find the type of Skin Cancer!";
  document.getElementById("select-file-box").style.display = "table-cell";
  document.getElementById("predict-list").innerHTML = "";

  base_path = "./assets/nv_samplepic.jpg";
  // maximum = 4;
  // minimum = 1;
  // var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  // img_path = base_path + randomnumber + ".jpeg"
  img_path = base_path;
  document.getElementById("test-image").src = img_path;
}
