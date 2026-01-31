import cv2
import numpy as np

def detect_video(video_path):
    cap = cv2.VideoCapture(video_path)

    motion_scores = []
    sharpness_scores = []

    prev_gray = None
    frame_count = 0

    while cap.isOpened() and frame_count < 30:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Sharpness
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_scores.append(lap_var)

        # Motion
        if prev_gray is not None:
            diff = cv2.absdiff(prev_gray, gray)
            motion = np.mean(diff)
            motion_scores.append(motion)

        prev_gray = gray
        frame_count += 1
import cv2
import numpy as np

def detect_video(video_path):
    cap = cv2.VideoCapture(video_path)

    motion_scores = []
    sharpness_scores = []

    prev_gray = None
    frame_count = 0

    while cap.isOpened() and frame_count < 30:  # analyze first 30 frames
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Sharpness (edge clarity)
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_scores.append(lap_var)

        # Motion (difference between frames)
        if prev_gray is not None:
            diff = cv2.absdiff(prev_gray, gray)
            motion = np.mean(diff)
            motion_scores.append(motion)

        prev_gray = gray
        frame_count += 1

    cap.release()

    avg_sharpness = np.mean(sharpness_scores)
    avg_motion = np.mean(motion_scores) if motion_scores else 0

    # Decision logic
    if avg_sharpness < 120 and avg_motion < 5:
        return "AI Generated Video"
    elif avg_sharpness > 200 and avg_motion > 8:
        return "Real Video"
    else:
        return "Uncertain Video"

    cap.release()

    avg_sharpness = np.mean(sharpness_scores)
    avg_motion = np.mean(motion_scores) if motion_scores else 0

    if avg_sharpness < 120 and avg_motion < 5:
        return "AI Generated Video"
    elif avg_sharpness > 200 and avg_motion > 8:
        return "Real Video"
    else:
        return "Uncertain Video"
