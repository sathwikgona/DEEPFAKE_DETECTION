import sqlite3

conn = sqlite3.connect("detections.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    file_type TEXT,
    result TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

def save_detection(filename, file_type, result):
    cursor.execute(
        "INSERT INTO detections (filename, file_type, result) VALUES (?, ?, ?)",
        (filename, file_type, result)
    )
    conn.commit()

def get_history():
    cursor.execute("SELECT * FROM detections ORDER BY id DESC")
    return cursor.fetchall()
