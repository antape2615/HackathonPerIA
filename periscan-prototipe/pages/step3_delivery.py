# pages/step3_delivery.py
import streamlit as st
import os, json
from services.executive_parser import parse_parsed_output

st.title("3 — Presentación y entrega")

# obtener parsed de session o DB (se usa el parsed en memoria si existe)
parsed_raw = st.session_state.get("parsed") or {}
# parsed_raw puede ser dict o string
try:
    parsed_clean = parse_parsed_output(parsed_raw)
except Exception:
    # fallback simple: si es dict usarlo, si es string ponerlo en executive_summary
    if isinstance(parsed_raw, dict):
        parsed_clean = parsed_raw
    else:
        parsed_clean = {"executive_summary": str(parsed_raw)}

# Executive summary
exec_sum = parsed_clean.get("executive_summary","")
st.subheader("Executive Summary")
st.markdown(f"<div style='padding:12px;border-left:6px solid #2C8BFF;background:#fff;border-radius:8px'>{exec_sum}</div>", unsafe_allow_html=True)

# dolores + prioridades
c1, c2 = st.columns(2)
with c1:
    st.subheader("Principales Dolor / Pain Points")
    if parsed_clean.get("pain_points"):
        for p in parsed_clean.get("pain_points"):
            st.markdown(f"- {p}")
    else:
        st.info("No se detectaron pain points estructurados.")

    st.subheader("Prioridades estratégicas")
    if parsed_clean.get("strategic_priorities"):
        for p in parsed_clean.get("strategic_priorities"):
            st.markdown(f"- {p}")
    else:
        st.info("No hay prioridades estructuradas.")

with c2:
    st.subheader("Causas raíz")
    if parsed_clean.get("root_causes"):
        for r in parsed_clean.get("root_causes"):
            st.markdown(f"- {r}")
    else:
        st.info("No hay causas raíz estructuradas.")

    st.subheader("Tecnología recomendada")
    if parsed_clean.get("technology_recommendations"):
        for t in parsed_clean.get("technology_recommendations"):
            st.markdown(f"- {t}")
    else:
        st.info("No hay recomendaciones tecnológicas.")

# hoja de ruta 30/60/90
st.subheader("Roadmap Ejecutivo 30 / 60 / 90 días")
rd = parsed_clean.get("roadmap_30_60_90", {})
rd30 = rd.get("30_days", [])
rd60 = rd.get("60_days", [])
rd90 = rd.get("90_days", [])

st.markdown("<div style='background:#f7fbff;padding:12px;border-radius:8px'>", unsafe_allow_html=True)
st.markdown("**📅 30 días — Diagnóstico y Bases**")
if rd30:
    for it in rd30: st.markdown(f"- {it}")
else:
    st.markdown("- No hay items para 30 días.")

st.markdown("**🚀 60 días — Ejecución Inicial**")
if rd60:
    for it in rd60: st.markdown(f"- {it}")
else:
    st.markdown("- No hay items para 60 días.")

st.markdown("**🏆 90 días — Optimización y Aterrizaje**")
if rd90:
    for it in rd90: st.markdown(f"- {it}")
else:
    st.markdown("- No hay items para 90 días.")
st.markdown("</div>", unsafe_allow_html=True)

# riesgos y KPIs
st.subheader("Riesgos y mitigaciones")
if parsed_clean.get("risks_and_mitigations"):
    for r in parsed_clean.get("risks_and_mitigations"):
        if isinstance(r, dict):
            st.markdown(f"- **{r.get('risk')}** — {r.get('mitigation')}")
        else:
            st.markdown(f"- {r}")
else:
    st.info("No hay riesgos estructurados.")

st.subheader("KPIs sugeridos")
kpis = parsed_clean.get("kpis", [])
if kpis:
    # mostrar lista simple; si es dict mostrar name/target
    for k in kpis:
        if isinstance(k, dict):
            name = k.get("name") or k.get("key_performance_indicator") or str(k)
            target = k.get("target") or k.get("target_value") or ""
            st.markdown(f"- **{name}** — {target}")
        else:
            st.markdown(f"- {k}")
else:
    st.info("No hay KPIs estructurados.")

# PDF descarga, si existe
pdf_path = st.session_state.get("last_pdf")
if pdf_path and os.path.exists(pdf_path):
    with open(pdf_path, "rb") as f:
        st.download_button("📄 Descargar PDF final", f, file_name=os.path.basename(pdf_path))
else:
    st.info("Si marcaste 'Generar PDF' en paso 2, el PDF aparecerá aquí tras la ejecución.")
