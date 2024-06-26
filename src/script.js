const { invoke } = window.__TAURI__.tauri;
const { open } = window.__TAURI__.dialog;
const { extname, basename, dirname } = window.__TAURI__.path;
const { listen } = window.__TAURI__.event;


const fileInput = document.getElementById('file-input');
const dragContainerText = document.getElementById('drag-container-text');
const formatTo = document.getElementById('format-to');
const convertButton = document.getElementById('convertButton');
const cloudIcon = document.getElementById('cloudIcon');
const queueBlock = document.getElementById('queue');

// Event Listeners

listen('tauri://file-drop', (e) => {
    addFile(e.payload);
})

// Data Variables

var currentFiles = [];

// Functions

async function addFile(result) {
    for (var i = 0; i < result.length; i++) {
        currentFiles.push(result[i]);
        console.log("Added file " + result[i]);

        var fileBasename = await basename(result[i]);
        var fileLabel;
        if ( fileBasename.length > 25 ) {
            fileLabel = fileBasename.slice(0, 25);
            fileLabel += "...";
        } else {
            fileLabel = fileBasename;
        }

        console.log(fileLabel);

        queueBlock.innerHTML += `
            <div class="file" id="file-${currentFiles.length}">
                <p class="filename">${fileLabel}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass status-icon" viewBox="0 0 16 16" id="icon-queue-${currentFiles.length}" name="icon-queue">
                    <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x close-icon" viewBox="0 0 16 16" id="delete-${currentFiles.length}" onclick="removeCurrentFile(${currentFiles.length})">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </div>
        `
    }

    convertButton.disabled = false;
    dragContainerText.textContent = "File Selected";
    dragContainerText.style.color = "#91ffa2";
    cloudIcon.style.color = "#91ffa2";

    setTimeout(() => {
        dragContainerText.textContent = "Click to upload";
        dragContainerText.style.color = "#ffffff";
        cloudIcon.style.color = "#ffffff";
    }, 3000)
}

async function setConverterFilePath () {
    selected = open({
        multiple: true,
        filters: [{
            name: "Image",
            extensions: ["png", "jpg", "webp", "bmp", "mp4", "gif", "tiff", "svg", "ico", "mp3", "mov", "mkv", "avi", "wmv", "flv", "mpg", "mpeg", "ogg"]
        }]
    });

    if (Array.isArray(selected)) {
        // nothing here
    } else {
        selected.then(async function(result) {
            
            if (result != null) {
                addFile(result);
            } else {
                console.log("Select canceled");
            }
        });
    }
}

async function converterFormSubmit() {
    if ( currentFiles.length > 0 ) {
        for ( var i = 0; i < currentFiles.length; i++ ) {
            var currentBasename = await basename( currentFiles[i] );
            var currentExtname = await extname( currentFiles[i] );
            var currentOutputDir = await dirname( currentFiles[i] );

            document.getElementsByName(`icon-queue`).forEach(function(ele, idx) {
                ele.outerHTML = `
                    <progress value="0" max="100" id="progress-${ele.id}" class="status-icon"></progress>
                `;
                var progressInterval = setInterval(progressHandler(ele), 100);
                // FIXME: Progress bar fulfilling in moment
            });

            function progressHandler(progressBarElement) {
                if (progressBarElement.value >= 80) {
                    clearInterval(progressInterval);
                } else {
                    progressBarElement.value++;
                }
            }

            await invoke("convertFile", {
                filePath: currentFiles[i],
                formatTarget: formatTo.value,
                outputDir: currentOutputDir,
                formatName: currentBasename.replace( currentExtname, "" ),
                iterIndex: i
            })
            .then((message) => {
                var cursor = parseInt(message) + 1;
                var progressBar = document.getElementById(`progress-icon-queue-${cursor}`);
                var progressBarParent = progressBar.parentElement;
                
                progressBar.value = 100;

                setTimeout(() => {
                    progressBar.remove();
                    progressBarParent.innerHTML += `
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-hourglass status-icon" viewBox="0 0 16 16" id="icon-queue-${currentFiles.length}" name="icon-queue" style="bottom: 8px;">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                    `;
                }, 1500);
                
            })
            .catch((error) => console.log(error));
        }

        currentFiles = [];
    } else {
        console.log("No file selected");
    }
}

function removeCurrentFile(number) {
    document.getElementById(`file-${number}`).remove();
    currentFiles.pop(number-1);
}