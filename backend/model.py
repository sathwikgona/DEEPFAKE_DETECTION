from PIL import Image
import numpy as np
import io
import cv2

def detect_image(file):
    try:
        # Read uploaded file bytes
        image_bytes = file.file.read()

        # Convert bytes → PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Convert to NumPy array
        img = np.array(image)

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

        # Texture analysis using Laplacian
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # Simple threshold logic (your original idea)
        if laplacian_var < 100:
            return "Real Image"
        else:
            return "AI Generated Image"

    except Exception as e:
        return f"Image Detection Error: {str(e)}"

