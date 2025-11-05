# docs_generator/generate_consulting_pdf.py
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import os, datetime, json

def build_pdf(parsed, screenshots=None, client="Cliente"):
    output_dir = "docs_output"
    os.makedirs(output_dir, exist_ok=True)
    file_name = f"{output_dir}/PERISCAN_Reporte_{client.replace(' ','_')}.pdf"

    doc = SimpleDocTemplate(file_name, pagesize=(8.5*inch, 11*inch), topMargin=40, leftMargin=40, rightMargin=40)
    styles = getSampleStyleSheet()

    title = ParagraphStyle(
        'title',
        parent=styles['Heading1'],
        fontSize=26,
        textColor=colors.HexColor("#0047B3"),
        spaceAfter=20
    )

    header = ParagraphStyle(
        'header',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=colors.HexColor("#0047B3"),
        spaceAfter=10
    )

    normal = ParagraphStyle(
        'normal',
        parent=styles['Normal'],
        fontSize=11,
        leading=16
    )

    flow = []

    # Portada
    flow.append(Paragraph("PERISCAN INSIGHT PLATFORM", title))
    flow.append(Paragraph(f"Reporte Ejecutivo para {client}", header))
    flow.append(Spacer(1, 30))
    flow.append(Paragraph(f"Fecha: {datetime.date.today()}", normal))
    flow.append(Spacer(1, 200))
    flow.append(Paragraph("Accenture-AWS Inspired AI Consulting Report", normal))
    flow.append(PageBreak())

    # Resumen ejecutivo
    flow.append(Paragraph("🔷 Executive Summary", header))
    flow.append(Paragraph(parsed.get("executive_summary",""), normal))
    flow.append(Spacer(1,14))

    # Dolores y causas raíces
    table_data = [
        ["Pain Points","Root Causes"]
    ]
    pp = parsed.get("pain_points",[])
    rc = parsed.get("root_causes",[])
    for i in range(max(len(pp),len(rc))):
        table_data.append([
            pp[i] if i<len(pp) else "",
            rc[i] if i<len(rc) else ""
        ])
    t = Table(table_data, colWidths=[250,250])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0), colors.HexColor("#A9D1FF")),
        ('BOX',(0,0),(-1,-1),1,colors.black),
        ('GRID',(0,0),(-1,-1),0.5,colors.gray),
        ('FONT',(0,0),(-1,0),'Helvetica-Bold'),
        ('ALIGN',(0,0),(-1,-1),'LEFT')
    ]))
    flow.append(t)
    flow.append(PageBreak())

    # Hoja de ruta
    flow.append(Paragraph("🗺️ Roadmap 30/60/90", header))
    for label,key in [("30 Days","30_days"),("60 Days","60_days"),("90 Days","90_days")]:
        flow.append(Paragraph(f"<b>{label}</b>", normal))
        for item in parsed.get("roadmap_30_60_90",{}).get(key,[]):
            flow.append(Paragraph(f"• {item}", normal))
        flow.append(Spacer(1,10))

    flow.append(PageBreak())

    # Riesgos
    flow.append(Paragraph("⚠️ Riesgos y Mitigaciones", header))
    for r in parsed.get("risks_and_mitigations",[]):
        if isinstance(r,dict):
            flow.append(Paragraph(f"• <b>{r.get('risk')}</b>: {r.get('mitigation')}", normal))
    flow.append(PageBreak())

    # Evidencias
    if screenshots:
        flow.append(Paragraph("📸 Evidencias / Screenshots", header))
        for img in screenshots:
            if os.path.exists(img):
                flow.append(Image(img, width=500, height=300))
                flow.append(Spacer(1,20))

    doc.build(flow)
    return file_name
