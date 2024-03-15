const { invoke } = window.__TAURI__.tauri;
const { open } = window.__TAURI__.dialog;
const { extname } = window.__TAURI__.path;

const fileInput = document.getElementById('file-input');
const dragContainerText = document.getElementById('drag-container-text');
const formatTo = document.getElementById('format-to');
const convertButton = document.getElementById('convertButton');
const cloudIcon = document.getElementById('cloudIcon');

var inputPath;

async function setConverterFilePath () {
    selected = open({
        multiple: false,
        filters: [{
            name: "Image",
            extensions: ["png", "jpg", "webp", "bmp"]
        }]
    });

    if (selected != null) {
        console.log(selected.then(function(result) {
            inputPath = result;
            console.log("Selected file: " + inputPath);

            convertButton.disabled = false;
            dragContainerText.textContent = "File Selected";
            dragContainerText.style.color = "#91ffa2";
            cloudIcon.style.color = "#91ffa2";
        }));
    } else {
        console.log("Select canceled")
    }
}

async function converterFormSubmit() {
    if (inputPath != null) {
        invoke("convertFile", {filePath: inputPath, formatTarget: formatTo.value})
            .then((message) => {
                dragContainerText.textContent = "Converted!";
            })
            .catch((error) => console.log(error));
    } else {
        console.log("No file selected");
    }
}