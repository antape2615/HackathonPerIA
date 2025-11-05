# pages/step2_analysis.py
import streamlit as st
import sqlite3, json, os, traceback
from services.ai_engine import run_consulting_model
from services.executive_parser import parse_parsed_output
from utils.pdf_generator import generate_pdf_from_json

DB = "data/interactions.db"
os.makedirs("reports", exist_ok=True)

st.title("2 — Estructuración y análisis (vista)")

st.info(f"Cliente: {st.session_state.get('client','')}  —  Sector: {st.session_state.get('sector','')}")
st.write("**Descripción (input)**")
st.write(st.session_state.get("problem",""))

# opción de respaldo: mantener el botón de ejecución manual como solicitaste (opción 1)
auto_run_enabled = st.session_state.get("auto_run_enabled", True)
if st.checkbox("Ejecutar IA automáticamente (si falla usar botón manual)", value=True, key="auto_run_checkbox"):
    st.session_state["auto_run_enabled"] = True
else:
    st.session_state["auto_run_enabled"] = False

# si ya tenemos el resultado parseado en sesión, simplemente mostrarlo
if "parsed" in st.session_state and st.session_state.get("parsed"):
    parsed = st.session_state["parsed"]
    st.success("Resultado (ya generado en memoria).")
    st.json(parsed if isinstance(parsed, dict) else json.loads(parsed) if isinstance(parsed,str) and parsed.strip().startswith("{") else parsed)
else:
    # activar IA si auto_run_enabled está habilitado
    if st.session_state.get("auto_run_enabled", True):
        with st.spinner("Generando diagnóstico con IA..."):
            try:
                raw = run_consulting_model(st.session_state.get("problem",""), st.session_state.get("client",""), st.session_state.get("sector",""), use_openai=False)
            except Exception as e:
                raw = f"(LLM runtime exception: {e}\n{traceback.format_exc()}"

            # el resultado parseado puede ser un diccionario o cadena; normalizar usando el parser
            try:
                parsed = parse_parsed_output(raw)
            except Exception as e:
                parsed = {"executive_summary": str(raw)}
            # guardar en sesión
            st.session_state["parsed"] = parsed

            # guardar en la base de datos
            try:
                conn = sqlite3.connect(DB)
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO interactions (client, sector, problem, summary, priorities, kpis, roadmap, risks, recommendations, model_used, output)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    st.session_state.get("client",""),
                    st.session_state.get("sector",""),
                    st.session_state.get("problem",""),
                    parsed.get("executive_summary",""),
                    json.dumps(parsed.get("strategic_priorities", []), ensure_ascii=False),
                    json.dumps(parsed.get("kpis", []), ensure_ascii=False),
                    json.dumps(parsed.get("roadmap_30_60_90", {}), ensure_ascii=False),
                    json.dumps(parsed.get("risks_and_mitigations", []), ensure_ascii=False),
                    json.dumps(parsed.get("technology_recommendations", []), ensure_ascii=False),
                    "local",
                    json.dumps(parsed, ensure_ascii=False)
                ))
                conn.commit()
                rid = cur.lastrowid
                conn.close()
                st.session_state["last_record"] = rid
            except Exception as e:
                st.error("Error guardando en DB: " + str(e))

            # intentar generar PDF (sin bloquear la ejecución)
            if st.session_state.get("auto_run_enabled", True):
                try:
                    pdf_path = generate_pdf_from_json(parsed, file_path=f"reports/{st.session_state.get('client','cliente')}_{st.session_state.get('last_record','x')}.pdf")
                    st.session_state["last_pdf"] = pdf_path
                    st.success("PDF generado: " + str(pdf_path))
                except Exception as e:
                    st.warning("No se pudo generar PDF automáticamente: " + str(e))

            st.experimental_rerun()

    # botón de respaldo manual
    if st.button("Ejecutar IA manualmente"):
        st.session_state["auto_run_enabled"] = False
        st.experimental_rerun()
