# db/init_db.py
import sqlite3
import os

DB_PATH = "data/interactions.db"

def init_db():
    os.makedirs("data", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client TEXT,
        sector TEXT,
        problem TEXT,
        summary TEXT,
        priorities TEXT,
        kpis TEXT,
        roadmap TEXT,
        risks TEXT,
        recommendations TEXT,
        model_used TEXT,
        pdf_path TEXT,
        output TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("✅ DB inicializada.")

