# services/pdf_service.py
import os, json
from datetime import datetime

_try_reportlab = True
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    import matplotlib.pyplot as plt
except Exception:
    _try_reportlab = False

from utils.pdf_generator import generate_pdf_from_json

OUTPUT_DIR = "reports"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def pdf_available_fallback():
    """Return True if reportlab-based generator is available; False otherwise."""
    return _try_reportlab

def generate_pdf_report(parsed, client_name="Cliente", record_id=None):
    if not isinstance(parsed, dict):
        try:
            parsed = json.loads(parsed)
        except Exception:
            parsed = {"executive_summary": str(parsed)}

    if not pdf_available_fallback():
        file_path = os.path.join(OUTPUT_DIR, f"{client_name}_diagnostico_{record_id or 'x'}.pdf")
        return generate_pdf_from_json(parsed, file_path=file_path, client_name=client_name)

    fname = f"{client_name}_diagnostico_{record_id or 'x'}.pdf"
    file_path = os.path.join(OUTPUT_DIR, fname)
    doc = SimpleDocTemplate(file_path, pagesize=A4, rightMargin=30,leftMargin=30, topMargin=30,bottomMargin=18)
    styles = getSampleStyleSheet()
    normal = styles["Normal"]
    heading = ParagraphStyle("Heading", parent=styles["Heading1"], alignment=0, textColor=colors.HexColor("#0A2342"))
    flow = []

    flow.append(Paragraph("Periscan Insight Platform — Diagnóstico Ejecutivo", heading))
    flow.append(Spacer(1,12))
    flow.append(Paragraph(f"<b>Cliente:</b> {client_name}", normal))
    flow.append(Paragraph(f"<b>Fecha:</b> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC", normal))
    flow.append(Spacer(1,18))

    flow.append(Paragraph("<b>Executive Summary</b>", styles["Heading2"]))
    flow.append(Paragraph(parsed.get("executive_summary",""), normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Problem Analysis</b>", styles["Heading2"]))
    flow.append(Paragraph(parsed.get("problem_analysis",""), normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Puntos de dolor</b>", styles["Heading2"]))
    for p in parsed.get("pain_points", []):
        flow.append(Paragraph(f"• {p}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Causas raíz</b>", styles["Heading2"]))
    for r in parsed.get("root_causes", []):
        flow.append(Paragraph(f"• {r}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Prioridades estratégicas</b>", styles["Heading2"]))
    for p in parsed.get("strategic_priorities", []):
        flow.append(Paragraph(f"• {p}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Roadmap 30/60/90</b>", styles["Heading2"]))
    rr = parsed.get("roadmap_30_60_90", {})
    for label, title in [("30_days","30 días"),("60_days","60 días"),("90_days","90 días")]:
        items = rr.get(label, [])
        flow.append(Paragraph(f"<b>{title}</b>", styles["Heading3"]))
        for it in items:
            flow.append(Paragraph(f"• {it}", normal))
        flow.append(Spacer(1,6))

    flow.append(Paragraph("<b>Riesgos y mitigaciones</b>", styles["Heading2"]))
    for r in parsed.get("risks_and_mitigations", []):
        if isinstance(r, dict):
            flow.append(Paragraph(f"• <b>{r.get('risk')}</b> — Mitigación: {r.get('mitigation')}", normal))
        else:
            flow.append(Paragraph(f"• {r}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Tecnología recomendada</b>", styles["Heading2"]))
    for t in parsed.get("technology_recommendations", []):
        flow.append(Paragraph(f"• {t}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>KPIs sugeridos</b>", styles["Heading2"]))
    for k in parsed.get("kpis", []):
        if isinstance(k, dict):
            flow.append(Paragraph(f"• {k.get('name')} — Objetivo: {k.get('target')}", normal))
        else:
            flow.append(Paragraph(f"• {k}", normal))
    flow.append(Spacer(1,12))

    flow.append(Paragraph("<b>Recomendación final</b>", styles["Heading2"]))
    flow.append(Paragraph(parsed.get("final_recommendation",""), normal))
    flow.append(Spacer(1,12))

    doc.build(flow)
    return file_path

