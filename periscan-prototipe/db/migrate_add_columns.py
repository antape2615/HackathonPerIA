# db/migrate_add_columns.py
import sqlite3
import os
from shutil import copyfile

DB = "data/interactions.db"
BACKUP = "data/interactions_backup.db"

if not os.path.exists("data"):
    os.makedirs("data", exist_ok=True)

if not os.path.exists(DB):
    print("❌ No existe la DB. Ejecuta init_db.py primero.")
    raise SystemExit

# Backup de seguridad
copyfile(DB, BACKUP)
print(f"✅ Backup creado en {BACKUP}")

conn = sqlite3.connect(DB)
c = conn.cursor()

# Esquema final actualizado
new_schema = """
CREATE TABLE IF NOT EXISTS interactions_new (
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
)
"""
c.execute(new_schema)

# Obtener columnas existentes
old_columns = [r[1] for r in c.execute("PRAGMA table_info(interactions)").fetchall()]
print("📌 Columnas previas:", old_columns)

# Columnas destino
final_cols = [
    "id","client","sector","problem","summary","priorities","kpis",
    "roadmap","risks","recommendations","model_used","pdf_path","output","created_at"
]

# Construir listas de columnas coincidentes
common_cols = [col for col in final_cols if col in old_columns]

print("🔄 Copiando columnas:", common_cols)

select_stmt = f"INSERT INTO interactions_new ({','.join(common_cols)}) SELECT {','.join(common_cols)} FROM interactions"
c.execute(select_stmt)

conn.commit()

# Renombrar tablas
try:
    c.execute("ALTER TABLE interactions RENAME TO interactions_old")
except Exception as e:
    print("ℹ️ Tabla original ya estaba renombrada:", e)

c.execute("ALTER TABLE interactions_new RENAME TO interactions")
conn.commit()
conn.close()

print("✅ Migración completada — tabla actualizada sin perder datos")
print("📝 La tabla vieja quedó guardada como interactions_old (por seguridad)")
