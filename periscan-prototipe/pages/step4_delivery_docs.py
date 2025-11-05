# pages/step4_delivery_docs.py
import streamlit as st
from fpdf import FPDF
import os, datetime

# PDF UTF-8 usando DejaVu (sin sobrescrituras)

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        # Registrar fuentes DejaVu (regular + negrita)
        self.add_font("DejaVu", "", os.path.join("assets", "DejaVuSans.ttf"), uni=True)
        # Si existe el archivo en negrita, registrarlo; de lo contrario, usar regular como respaldo
        bold_path = os.path.join("assets", "DejaVuSans-Bold.ttf")
        if os.path.exists(bold_path):
            self.add_font("DejaVu", "B", bold_path, uni=True)
        else:
            # respaldo: usar regular para el estilo "B" si no hay negrita
            self.add_font("DejaVu", "B", os.path.join("assets", "DejaVuSans.ttf"), uni=True)
        # establecer fuente por defecto
        self.set_font("DejaVu", "", 11)

# Limpiar pero sin volver a codificar
def clean(text: str) -> str:
    if text is None:
        return ""
    t = str(text)
    # normalizar caracteres que a veces generan los LLMs
    t = t.replace("\u2014", "-").replace("\u2013", "-") 
    t = t.replace("“", '"').replace("”", '"').replace("’", "'")
    # eliminar caracteres invisibles extraños
    t = t.replace("\u00A0", " ")
    return t

# rutas
OUTPUT_DIR = "docs"
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "periferia_entrega.pdf")

st.set_page_config(page_title="Entrega Periferia", layout="wide")
st.title("📄 Documento Oficial — Periferia IT Group")
st.write("Llena los campos y genera el documento final para evaluación.")

st.divider()

# Formulario
c1, c2 = st.columns(2)

with c1:
    nombre_proyecto = st.text_input("Nombre del Proyecto", "Periscan — Diagnóstico Estratégico Automatizado")
    objetivo = st.text_area("Objetivo", "Automatizar diagnósticos estratégicos empresariales usando IA local.")
    arquitectura = st.text_area("Arquitectura",
"""
- Streamlit UI
- Motor IA local (phi-3-mini)
- Parser JSON estructurado
- Generador PDF (local)
- SQLite DB
""")
    modulos = st.text_area("Módulos",
"""
- Captura información
- Generación diagnóstico
- Parser estructurado
- Generador de PDF
- Histórico y exportes
""")

with c2:
    diferenciadores = st.text_area("Diferenciadores",
"""
- IA local sin dependencia de nube
- Enfoque consultoría (McKinsey/Accenture)
- PDF ejecutivo automático
- Pipeline reproducible
""")
    uso_ia = st.text_area("Uso de IA",
"Modelo LLM procesa contexto y genera diagnóstico estructurado en JSON.")
    roadmap = st.text_area("Roadmap",
"""
- Integración CRM
- BI Dashboard
- RAG documental
- Multi-tenant
- Modelos open-weights mayores
""")
    instrucciones = st.text_area("Instrucciones",
"""
1) Activar entorno
2) streamlit run app.py
3) Abrir localhost:8501
4) Ingresar empresa y contexto
5) Generar diagnóstico
""")

st.divider()

# Construcción del PDF
def section(pdf: PDF, title: str, body: str):
    pdf.set_font("DejaVu", "B", 12)
    pdf.multi_cell(0, 6, clean(title))
    pdf.set_font("DejaVu", "", 11)
    for line in str(body).splitlines():
        pdf.multi_cell(0, 6, clean(line))
    pdf.ln(2)

def generate_pdf():
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()

    # Título
    pdf.set_font("DejaVu", "B", 16)
    pdf.multi_cell(0, 8, clean(nombre_proyecto))
    pdf.ln(2)

    today = datetime.date.today().strftime("%Y-%m-%d")
    section(pdf, "Fecha", today)
    section(pdf, "Objetivo", objetivo)
    section(pdf, "Arquitectura y Componentes", arquitectura)
    section(pdf, "Módulos", modulos)
    section(pdf, "Diferenciadores", diferenciadores)
    section(pdf, "Uso de IA", uso_ia)
    section(pdf, "Roadmap Futuro", roadmap)
    section(pdf, "Instrucciones de Ejecución", instrucciones)

    # Guardar
    pdf.output(OUTPUT_FILE)

# accion del boton
if st.button("✅ Generar Documento Oficial", use_container_width=True):
    # eliminar archivo previo
    try:
        if os.path.exists(OUTPUT_FILE):
            os.remove(OUTPUT_FILE)
    except Exception:
        pass

    # generar y descargar
    try:
        generate_pdf()
        st.success("Documento generado correctamente ✅")
        with open(OUTPUT_FILE, "rb") as f:
            st.download_button("⬇️ Descargar PDF", f, file_name="periferia_entrega.pdf")
    except Exception as e:
        st.error("Error generando PDF: " + str(e))
        st.exception(e)
