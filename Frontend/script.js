// ===============================
// COMMON ELEMENT REFERENCES
// ===============================
const fileInput = document.getElementById("file");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const resultBox = document.getElementById("result");
const typeSelect = document.getElementById("type");

// ===============================
// DRAG & DROP SUPPORT (IMAGE / VIDEO)
// ===============================
if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        dropZone.classList.add("drag-active");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-active");
    });

    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        dropZone.classList.remove("drag-active");
        fileInput.files = e.dataTransfer.files;
        showPreview();
    });
}

// ===============================
// FILE CHANGE → PREVIEW
// ===============================
if (fileInput) {
    fileInput.addEventListener("change", showPreview);
}

function showPreview() {
    if (!fileInput || !preview) return;

    const file = fileInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preview.innerHTML = "";

    // IMAGE PREVIEW
    if (file.type.startsWith("image/")) {
        preview.innerHTML = `
            <img src="${url}" style="width:100%; border-radius:12px;">
        `;
    }

    // VIDEO PREVIEW
    else if (file.type.startsWith("video/")) {
        preview.innerHTML = `
            <video controls style="width:100%; border-radius:12px;">
                <source src="${url}">
            </video>
        `;
    }

    // AUDIO PREVIEW
    else if (file.type.startsWith("audio/")) {
        preview.innerHTML = `
            <audio controls style="width:100%;">
                <source src="${url}">
            </audio>
        `;
    }

    // UNSUPPORTED FILE
    else {
        preview.innerHTML = `<p>Unsupported file type</p>`;
    }
}

// ===============================
// IMAGE / VIDEO DETECTION
// ===============================
async function detect() {
    const file = fileInput?.files[0];
    const type = typeSelect?.value;

    if (!file) {
        resultBox.innerText = "Please upload a file first.";
        resultBox.className = "result show uncertain";
        return;
    }

    loader.classList.remove("hidden");
    resultBox.className = "result";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`http://127.0.0.1:8000/detect/${type}`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        loader.classList.add("hidden");
        resultBox.innerText = data.result;
        resultBox.classList.add("show");

        if (data.result.includes("AI")) resultBox.classList.add("ai");
        else if (data.result.includes("Real")) resultBox.classList.add("real");
        else resultBox.classList.add("uncertain");

    } catch (error) {
        loader.classList.add("hidden");
        resultBox.innerText = "Server error!";
        resultBox.className = "result show uncertain";
    }
}

// ===============================
// AUDIO DETECTION
// ===============================
async function detectAudio() {
    const file = fileInput?.files[0];
    if (!file) return alert("Please upload an audio file");

    loader.classList.remove("hidden");
    resultBox.className = "result";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("http://127.0.0.1:8000/detect/audio", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        loader.classList.add("hidden");
        resultBox.innerText = data.result;
        resultBox.classList.add("show");

        if (data.result.includes("AI")) resultBox.classList.add("ai");
        else if (data.result.includes("Real")) resultBox.classList.add("real");
        else resultBox.classList.add("uncertain");

    } catch (error) {
        loader.classList.add("hidden");
        resultBox.innerText = "Server error!";
        resultBox.className = "result show uncertain";
    }
}
