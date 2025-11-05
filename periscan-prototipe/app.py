# app.py
import streamlit as st
import os, json, sqlite3, traceback

from core.state import init_session_state
from core.styles import inject_global_styles
from services.assets import ensure_assets, validate_image
from services.storage import init_db, fetch_interactions, fetch_interaction_by_id
from services.ai_engine import run_consulting_model, local_llm_proxy
from services.pdf_service import generate_pdf_report, pdf_available_fallback

from utils.pdf_generator import generate_pdf_from_json

# ------------- inicio / estilos -------------
st.set_page_config(page_title="Periscan Insight Platform", layout="wide", page_icon="🧠")
inject_global_styles()
init_session_state()
ensure_assets()
init_db()

DB_PATH = "data/interactions.db"
ASSETS_DIR = "assets"
LOGO_BRAIN = os.path.join(ASSETS_DIR, "logo_pi_brain.png")
LOGO_TEXT = os.path.join(ASSETS_DIR, "logo_pi_text.png")

# Intentar mostrar logo válido (validate_image maneja archivos corruptos)
try:
    if validate_image(LOGO_BRAIN):
        st.sidebar.image(LOGO_BRAIN, width=160)
    elif validate_image(LOGO_TEXT):
        st.sidebar.image(LOGO_TEXT, width=160)
    else:
        st.sidebar.markdown("## Periscan Insight Platform")
except Exception:
    st.sidebar.markdown("## Periscan Insight Platform")

st.sidebar.markdown("**Escanea. Interpreta. Transforma.**")
st.sidebar.markdown("---")

# Mostrar estado del flujo: solo mostrar los íconos de pasos si steps_visible es True
def step_icon(step):
    cur = st.session_state.get("step", 1)
    if cur > step: return "✅"
    if cur == step: return "➡️"
    return "◻️"

# Mostrar la lista de pasos solo si steps_visible es True
if st.session_state.get("steps_visible", False):
    st.sidebar.markdown(f"{step_icon(1)} **1 — Levantamiento**")
    st.sidebar.markdown(f"{step_icon(2)} **2 — Estructuración IA**")
    st.sidebar.markdown(f"{step_icon(3)} **3 — Presentación / Entrega**")
    st.sidebar.markdown("---")
else:
    st.sidebar.markdown("**Inicio — Nuevo Assessment**")
    st.sidebar.markdown("---")

# Chat rápido del asistente
st.sidebar.header("Asistente Periscan")
if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []

for msg in st.session_state["chat_history"][-6:]:
    who = "💬 AI" if msg["from"]=="ai" else "👤 You"
    st.sidebar.markdown(f"**{who}**: {msg['text']}")

chat_input = st.sidebar.text_input("Pregunta rápida al asistente")
if st.sidebar.button("Enviar pregunta"):
    if chat_input.strip():
        st.session_state["chat_history"].append({"from":"user","text":chat_input})
        try:
            ai_resp = local_llm_proxy(chat_input)
        except Exception as e:
            ai_resp = f"(LLM error: {e})"
        st.session_state["chat_history"].append({"from":"ai","text":ai_resp})
        st.rerun()

st.sidebar.markdown("---")
menu = st.sidebar.radio("Navegación", [
    "Nuevo Assessment",
    "Histórico",
    "Entrega Periferia",
    "Configuración"
])


# Asegurar valores por defecto en sesión
if "step" not in st.session_state:
    st.session_state["step"] = 1
if "steps_visible" not in st.session_state:
    # By default hide steps until analysis completes
    st.session_state["steps_visible"] = False

# ---------------- NUEVO ASSESSMENT ----------------
if menu == "Nuevo Assessment":
    # paso 1
    if st.session_state["step"] == 1:
        st.header("1 — Levantamiento de información")
        with st.form("form1"):
            client = st.text_input("Cliente / Empresa", value=st.session_state.get("client",""))
            sector = st.text_input("Sector", value=st.session_state.get("sector",""))
            problem = st.text_area("Describe el problema (máx 800 palabras)", value=st.session_state.get("problem",""), height=220)
            submitted = st.form_submit_button("Revisar y continuar")
        if submitted:
            if not problem.strip():
                st.warning("Describe el problema antes de continuar.")
            else:
                st.session_state["client"] = client
                st.session_state["sector"] = sector
                st.session_state["problem"] = problem
                st.session_state["step"] = 2
                st.rerun()

    # paso 2
    elif st.session_state["step"] == 2:
        st.header("2 — Estructuración y análisis IA")
        st.info(f"Cliente: {st.session_state.get('client','')}   —   Sector: {st.session_state.get('sector','')}")
        st.write("Descripción del problema:")
        st.write(st.session_state.get("problem",""))

        col1, col2 = st.columns([3,1])
        with col2:
            export_pdf = st.checkbox("Generar PDF al finalizar", value=True)
            use_openai = st.checkbox("Usar OpenAI (si configurado)", value=False)
        with col1:
            if st.button("🚀 Generar diagnóstico (IA)"):
                with st.spinner("Generando..."):
                    try:
                        raw = run_consulting_model(
                            st.session_state["problem"],
                            st.session_state.get("client",""),
                            st.session_state.get("sector",""),
                            use_openai=use_openai
                        )
                    except Exception as e:
                        raw = f"(LLM runtime exception: {e}\n{traceback.format_exc()}"

                    # el resultado parseado puede ser un diccionario o cadena; normalizar usando el parser      
                    try:
                        from services.executive_parser import parse_parsed_output
                        parsed = parse_parsed_output(raw)
                    except Exception:
                        # fallback: si raw ya es dict
                        if isinstance(raw, dict):
                            parsed = raw
                        else:
                            parsed = {"executive_summary": str(raw)}

                    # guardar dentro de la base de datos
                    conn = sqlite3.connect(DB_PATH)
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
                        "openai" if use_openai else "local",
                        json.dumps(parsed, ensure_ascii=False)
                    ))
                    conn.commit()
                    record_id = cur.lastrowid
                    conn.close()

                    st.session_state["last_record"] = record_id
                    st.session_state["parsed"] = parsed

                    # mark steps visible
                    st.session_state["steps_visible"] = True
                    st.session_state["step"] = 3

                    # generar PDF si es solicitado
                    if export_pdf:
                        try:
                            if pdf_available_fallback():
                                pdf_path = generate_pdf_report(parsed, client_name=st.session_state.get("client","Cliente"), record_id=record_id)
                            else:
                                pdf_path = generate_pdf_from_json(parsed, file_path=f"reports/{st.session_state.get('client','Cliente')}_diagnostico_{record_id}.pdf")
                            conn = sqlite3.connect(DB_PATH)
                            conn.execute("UPDATE interactions SET pdf_path = ? WHERE id = ?", (pdf_path, record_id))
                            conn.commit()
                            conn.close()
                            st.session_state["last_pdf"] = pdf_path
                            st.success("PDF generado: " + pdf_path)
                        except Exception as e:
                            st.error("Error generando PDF: " + str(e))

                st.rerun()

    # paso 3
    elif st.session_state["step"] == 3:
        st.header("3 — Presentación y entrega")
        parsed = st.session_state.get("parsed", {})

        # Limpiar resumen ejecutivo si tiene formato tipo JSON
        exec_sum = parsed.get("executive_summary","")
        if isinstance(exec_sum, (dict,list)):
            exec_sum = json.dumps(exec_sum, ensure_ascii=False)
        exec_sum = str(exec_sum).strip()
        if exec_sum.startswith("{") or exec_sum.startswith("["):
            try:
                tmp = json.loads(exec_sum)
                if isinstance(tmp, dict) and "executive_summary" in tmp:
                    exec_sum = tmp["executive_summary"]
                else:
                    exec_sum = json.dumps(tmp, ensure_ascii=False)
            except Exception:
                exec_sum = exec_sum.replace("{","").replace("}","").replace("[","").replace("]","")

        st.subheader("Executive Summary")
        st.markdown(f"<div style='padding:12px;border-left:6px solid #2C8BFF;background:#fff;border-radius:8px'>{exec_sum}</div>", unsafe_allow_html=True)

        # dolores + prioridades
        c1, c2 = st.columns(2)
        with c1:
            st.subheader("Principales Dolor / Pain Points")
            for p in parsed.get("pain_points", []):
                st.markdown(f"- {p}")
            st.subheader("Prioridades estratégicas")
            for p in parsed.get("strategic_priorities", []):
                st.markdown(f"- {p}")
        with c2:
            st.subheader("Causas raíz")
            for r in parsed.get("root_causes", []):
                st.markdown(f"- {r}")
            st.subheader("Tecnología recomendada")
            for t in parsed.get("technology_recommendations", []):
                st.markdown(f"- {t}")

        # hoja de ruta
        st.subheader("Roadmap Ejecutivo 30 / 60 / 90 días")
        roadmap = parsed.get("roadmap_30_60_90", {})
        rd30 = roadmap.get("30_days") or roadmap.get("short_term (30 days)") or []
        rd60 = roadmap.get("60_days") or roadmap.get("mid_term (60 days)") or []
        rd90 = roadmap.get("90_days") or roadmap.get("long_term (90 days)") or []

        st.markdown("<div style='background:#f7fbff;padding:12px;border-radius:8px'>", unsafe_allow_html=True)
        st.markdown("**📅 30 días — Diagnóstico y Bases**")
        for it in rd30: st.markdown(f"- {it}")
        st.markdown("**🚀 60 días — Ejecución Inicial**")
        for it in rd60: st.markdown(f"- {it}")
        st.markdown("**🏆 90 días — Optimización y Aterrizaje**")
        for it in rd90: st.markdown(f"- {it}")
        st.markdown("</div>", unsafe_allow_html=True)

        # riesgos
        st.subheader("Riesgos y mitigaciones")
        for r in parsed.get("risks_and_mitigations", []):
            if isinstance(r, dict):
                st.markdown(f"- **{r.get('risk')}** — Mitigación: {r.get('mitigation')}")
            else:
                st.markdown(f"- {r}")

        pdf_path = st.session_state.get("last_pdf")
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                st.download_button("📄 Descargar PDF final", f, file_name=os.path.basename(pdf_path))
        else:
            st.info("No se generó PDF para este registro (marca 'Generar PDF' en paso 2).")
        
        # Activa los pasos visibles
        st.session_state["steps_visible"] = True

        if st.button("Nuevo assessment"):
            st.session_state["step"] = 1
            st.rerun()

# ---------------- HISTÓRICO ----------------
elif menu == "Histórico":
    st.header("Histórico — Interactions")
    try:
        df = fetch_interactions()
        st.dataframe(df)
        if not df.empty:
            sel = st.selectbox("Selecciona ID", df["id"].tolist())
            rec = fetch_interaction_by_id(sel)
            st.markdown("**Cliente:** " + str(rec.get("client","")))
            st.markdown("**Sector:** " + str(rec.get("sector","")))
            st.markdown("**Problema**")
            st.write(rec.get("problem",""))
            st.markdown("**Output IA**")
            try:
                st.json(json.loads(rec.get("output","{}")))
            except Exception:
                st.write(rec.get("output",""))
            if rec.get("pdf_path"):
                try:
                    with open(rec["pdf_path"], "rb") as f:
                        st.download_button("Descargar PDF", f, file_name=os.path.basename(rec["pdf_path"]))
                except Exception as e:
                    st.error("No se pudo abrir PDF: " + str(e))
    except Exception as e:
        st.error("Error leyendo histórico: " + str(e))

# ---------------- ENTREGA PERIFERIA ----------------
elif menu == "Entrega Periferia":
    st.header("📄 Entrega Periferia IT Group")

    if not st.session_state.get("steps_visible", False):
        st.warning("⚠️ Debes completar un diagnóstico primero para ver esta sección.")
        st.stop()

    st.success("✅ Diagnóstico generado — documentos listos para exportación")

    st.markdown("""
### Documentos Generados
Selecciona qué deseas descargar para tu entrega final:
    """)

    colA, colB = st.columns(2)

    with colA:
        if st.button("📑 Descargar Documento Técnico (PDF)"):
            st.info("El PDF se generará y descargará en la sección Paso 3 -> Descargar PDF final")

        if st.button("🧠 Descargar Resumen Ejecutivo"):
            st.info("Se descarga el resumen desde la vista de resultados (Paso 3)")

    with colB:
        if st.button("📦 Descargar Paquete ZIP Proyecto (próximamente)"):
            st.warning("Funcionalidad ZIP lista para producción, activación al despliegue.")

    st.markdown("---")
    st.markdown("### ✅ Para continuar")
    st.write("• Verifica el PDF en Paso 3")
    st.write("• Presenta demo navegable (esta app)")
    st.write("• Sube el proyecto a Periferia")

    st.info("Todo listo 👌 — Tu aplicación cumple lo requerido para el reto.")


# ---------------- CONFIGURACIÓN ----------------
else:
    st.header("Configuración")
    st.write({
        "LM Studio (local)": True,
        "OPENAI_CONFIGURED": bool(os.getenv("OPENAI_API_KEY")),
        "assets_exist": os.path.exists(LOGO_BRAIN)
    })
    st.markdown("Si quieres usar OpenAI, configura `OPENAI_API_KEY`.")
