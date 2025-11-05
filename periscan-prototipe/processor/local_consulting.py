import json
from processor.local_llm import local_llm_query

def generate_local_diagnosis(problem, client="", sector=""):
    # 1. Construcción del prompt con refuerzo en executive_summary
    system_prompt = f"""
Eres un consultor senior de estrategia digital (McKinsey / BCG / Accenture).
Tarea: analizar un problema empresarial y entregar una respuesta estructurada ejecutiva.

📌 **Reglas obligatorias**
- Responde **únicamente** con JSON válido.
- No escribas texto fuera del JSON.
- No resumas toda la información dentro de "executive_summary".
- Usa listas siempre en los campos que lo requieren.
- Cada sección debe ser clara, sin mezclar conceptos.
- No uses saltos no deseados, emojis ni comillas indebidas.
- Si alguna sección no aplica, igual devuélvela con []. Nunca omitas campos.
- Revisa tu JSON antes de enviarlo.

🎯 **Objetivo del análisis**
Entregar un diagnóstico estratégico con:
- análisis del problema
- dolores principales
- causas raíz
- prioridades estratégicas
- KPIs medibles
- Roadmap 30/60/90 días accionable
- Riesgos y mitigaciones
- Recomendación final breve y ejecutiva

📂 **Formato de salida obligatorio**
{{
  "executive_summary": "Resumen ejecutivo obligatorio. Sintetiza el diagnóstico completo en 3–5 líneas. No lo dejes vacío.",
  "problem_analysis": "",
  "pain_points": ["", ""],
  "root_causes": ["", ""],
  "strategic_priorities": ["", ""],
  "kpis": [
    {{"name":"", "target":""}},
    {{"name":"", "target":""}}
  ],
  "roadmap_30_60_90": {{
    "30_days": ["", ""],
    "60_days": ["", ""],
    "90_days": ["", ""]
  }},
  "risks_and_mitigations": [
    {{"risk":"", "mitigation":""}}
  ],
  "technology_recommendations": ["", ""],
  "final_recommendation": ""
}}

📎 **Contexto del caso**
Cliente: {client}
Sector: {sector}

📍 **Problema a analizar**
{problem}

✅ **Antes de responder:**
- valida que tu JSON sea estructuralmente correcto
- no incluyas comentario o explicaciones
"""

    # 2. Llamada al modelo
    try:
        raw_response = local_llm_query(system_prompt, model="phi-3-mini-4k-instruct")

        # Intentar parsear si es string
        if isinstance(raw_response, str):
            parsed = json.loads(raw_response)
        elif isinstance(raw_response, dict):
            parsed = raw_response
        else:
            return {
                "executive_summary": "Respuesta no estructurada — tipo inesperado de salida del modelo."
            }

        # 3. Validación postprocesada del executive_summary
        if not parsed.get("executive_summary"):
            parsed["executive_summary"] = (
                "Diagnóstico estratégico generado. Se identificaron dolores clave, causas raíz, prioridades "
                "y un roadmap ejecutivo 30/60/90 días con riesgos y recomendaciones tecnológicas."
            )

        return parsed

    except json.JSONDecodeError:
        # Manejo seguro si raw_response es string malformado
        if isinstance(raw_response, str):
            return {
                "executive_summary": f"No estructurado — respuesta no parseable.\n\n{raw_response.strip()}"
            }
        else:
            return {
                "executive_summary": "No estructurado — tipo inesperado de respuesta tras fallo de parseo."
            }

    except Exception as e:
        return {
            "executive_summary": f"Error al generar diagnóstico: {str(e)}"
        }
