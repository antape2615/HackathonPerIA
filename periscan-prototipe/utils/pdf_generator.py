# utils/pdf_generator.py

from fpdf import FPDF
import textwrap

class PDFReport(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Periscan Insight Platform — Executive Diagnostic", ln=True, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Periferia IT Group — Periscan | Page {self.page_no()}", align="C")

def safe_text(text):
    if not text:
        return ""

    # normalizar guiones y caracteres unicode para el PDF
    text = (
        text.replace("—", "-")
            .replace("–", "-")
            .replace("•", "- ")
            .replace("●", "- ")
            .replace("·", "- ")
    )

    # eliminar caracteres incompatibles con latin-1 (limitación de FPDF)
    try:
        text.encode("latin-1")
    except UnicodeEncodeError:
        text = text.encode("latin-1", errors="replace").decode("latin-1")

    return text

def add_wrapped_text(pdf, text, font="Arial", size=10):
    pdf.set_font(font, size=size)
    for line in textwrap.wrap(text, width=95):
        pdf.cell(0, 5, safe_text(line), ln=True)

def generate_pdf_from_json(data, file_path):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Executive Summary", ln=True)
    pdf.set_font("Arial", size=11)
    add_wrapped_text(pdf, data.get("executive_summary", ""))

    pdf.ln(4)

    sections = [
        ("Problema identificado", "problem_analysis"),
        ("Principales Pain Points", "pain_points"),
        ("Causas Raíz", "root_causes"),
        ("Prioridades Estratégicas", "strategic_priorities"),
        ("KPIs Clave", "kpis"),
        ("Riesgos y Mitigaciones", "risks_and_mitigations"),
        ("Tecnologías Recomendadas", "technology_recommendations")
    ]

    for title, key in sections:
        pdf.ln(3)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 8, title, ln=True)

        values = data.get(key, [])
        if isinstance(values, list):
            for item in values:
                pdf.set_font("Arial", size=10)
                add_wrapped_text(pdf, f"- {item}")
        else:
            add_wrapped_text(pdf, values)

    # hoja de ruta 30/60/90
    pdf.ln(5)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "Roadmap Ejecutivo — 30 / 60 / 90 días", ln=True)

    roadmap = data.get("roadmap_30_60_90", {})

    for period, label in [("30_days", "30 días — Diagnóstico y Bases"),
                          ("60_days", "60 días — Ejecución Inicial"),
                          ("90_days", "90 días — Optimización y Aterrizaje")]:

        pdf.set_font("Arial", "B", 11)
        pdf.cell(0, 6, safe_text(label), ln=True)

        for item in roadmap.get(period, []):
            pdf.set_font("Arial", size=10)
            add_wrapped_text(pdf, f"• {item}")

    pdf.output(file_path)
    return file_path
