const { invoke } = window.__TAURI__.tauri;
const { writeBinaryFile, BaseDirectory } = window.__TAURI__.fs;

const fileInput = document.getElementById('file-input');
const dragContainerText = document.getElementById('drag-container-text');
const formatTo = document.getElementById('format-to');

function getFileExtension(filename) {
    return filename.split('.').pop();
}

async function converterFormSubmit() {
    if (fileInput.files.length < 1) {
        return false
    }
    var reader = new FileReader();
    var handledFile = fileInput.files[0];
    //reader.onload = () => console.log(reader.result)
    var res = reader.readAsArrayBuffer(handledFile);

    var uintarr = new Uint8Array(res, 0, 64);
    console.log(uintarr)
    await writeBinaryFile({ path: `${handledFile.name}`, contents: uintarr }, { dir: BaseDirectory.Download });
}