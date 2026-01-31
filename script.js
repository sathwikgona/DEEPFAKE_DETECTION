let mode = "image";

const fileInput = document.getElementById("file");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const resultBox = document.getElementById("result");
const dropText = document.getElementById("dropText");


function setMode(m) {
    mode = m;
    fileInput.value = "";
    preview.innerHTML = "";
    resultBox.innerHTML = "";

   
    fileInput.accept = "image/*,video/*,audio/*";

    dropText.innerText = `Drop ${mode} file here or click to upload`;
}


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


fileInput.addEventListener("change", showPreview);


function showPreview() {
    const file = fileInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preview.innerHTML = "";

    if (file.type.startsWith("image/")) {
        preview.innerHTML = `<img src="${url}" class="media">`;
    }
    else if (file.type.startsWith("video/")) {
        preview.innerHTML = `<video src="${url}" controls class="media"></video>`;
    }
    else if (file.type.startsWith("audio/")) {
        preview.innerHTML = `
            <audio controls style="width:100%;">
                <source src="${url}" type="${file.type}">
            </audio>
        `;
    }
    else {
        preview.innerHTML = "<p>Unsupported file type</p>";
    }
}

async function analyze() {
    const file = fileInput.files[0];
    if (!file) return alert("Please upload a file");

    loader.classList.remove("hidden");
    resultBox.className = "result";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`http://127.0.0.1:8000/detect/${mode}`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        resultBox.innerText = data.result;
        resultBox.classList.add("show");

        if (data.result.includes("AI")) resultBox.classList.add("ai");
        else if (data.result.includes("Real")) resultBox.classList.add("real");
        else resultBox.classList.add("uncertain");

    } catch {
        resultBox.innerText = "Server error";
        resultBox.className = "result show uncertain";
    }

    loader.classList.add("hidden");
}

