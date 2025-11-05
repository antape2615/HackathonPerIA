# services/storage.py
import sqlite3, os
DB_PATH = "data/interactions.db"

def init_db():
    os.makedirs("data", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
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
        output TEXT,
        pdf_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    conn.close()

def fetch_interactions(limit=200):
    import pandas as pd
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql("SELECT id, client, sector, substr(problem,1,120) as problem_snippet, model_used, created_at FROM interactions ORDER BY created_at DESC LIMIT ?", conn, params=(limit,))
    conn.close()
    return df

def fetch_interaction_by_id(id_):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT * FROM interactions WHERE id = ?", (id_,))
    row = cur.fetchone()
    cols = [c[0] for c in cur.description]
    conn.close()
    if row:
        return dict(zip(cols, row))
    return {}
