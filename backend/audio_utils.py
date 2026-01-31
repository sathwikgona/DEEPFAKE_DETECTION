def detect_audio(file):
    try:
        size_kb = len(file.file.read()) / 1024

        if size_kb < 200:
            return "Real Audio"
        else:
            return "AI Generated Audio"

    except Exception as e:
        return f"Audio error: {str(e)}"
