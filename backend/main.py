from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from model import detect_image
from video_utils import detect_video
from audio_utils import detect_audio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect/image")
async def detect_image_api(file: UploadFile = File(...)):
    return {"result": detect_image(file)}

@app.post("/detect/video")
async def detect_video_api(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Run detection
    result = detect_video(file_path)

    # Delete the temporary file
    if os.path.exists(file_path):
        os.remove(file_path)

    return {"result": result}


@app.post("/detect/audio")
async def detect_audio_api(file: UploadFile = File(...)):
    return {"result": detect_audio(file)}
