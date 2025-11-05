# services/executive_parser.py
"""
Parser robusto para salidas de LLM (texto libre o JSON roto).
Provee: parse_parsed_output(raw) -> dict normalizado con llaves:
  executive_summary, problem_analysis, pain_points (list),
  root_causes (list), strategic_priorities (list),
  technology_recommendations (list),
  roadmap_30_60_90 (dict with 30_days,60_days,90_days lists),
  risks_and_mitigations (list), kpis (list of dicts or strings)
"""

import json, re

# utilidades
def _normalize_text(t):
    if not isinstance(t, str):
        return t
    return (
        t.replace("“", "\"")
         .replace("”", "\"")
         .replace("’", "'")
         .replace("—", "-")
         .replace("–", "-")
         .strip()
    )

def _to_list(value):
    """Convierte varios formatos a lista limpia"""
    if value is None:
        return []
    if isinstance(value, list):
        return [v for v in value if v is not None]
    if isinstance(value, dict):
        # dict -> representarlo como JSON en una lista
        try:
            return [json.dumps(value, ensure_ascii=False)]
        except:
            return [str(value)]
    s = _normalize_text(str(value))
    # separar por saltos, bullets, puntos y comas o comas seguidas de mayúscula
    parts = re.split(r'\n|•|- |\* |;|,\s(?=[A-ZÁÉÍÓÚÑ])|,', s)
    items = [p.strip(" \t\n\r\"'•-:·") for p in parts if p and len(p.strip())>0]
    return items

def _try_load_json(raw):
    """Intentar cargar JSON directamente o extraer primer objeto JSON del texto"""
    if isinstance(raw, dict):
        return raw
    if not isinstance(raw, str):
        return None
    s = _normalize_text(raw)
    # intento 1: json.loads directo
    try:
        return json.loads(s)
    except:
        pass
    # intento 2: extraer primer objeto {...}
    m = re.search(r'(\{(?:[^{}]|(?R))*\})', s, flags=re.DOTALL)
    if m:
        cand = m.group(1)
        try:
            return json.loads(cand)
        except:
            # intentar reemplazar comillas tipográficas
            cand2 = cand.replace("“", "\"").replace("”", "\"").replace("’","'")
            try:
                return json.loads(cand2)
            except:
                return None
    return None

def _extract_field_from_text(raw_text, key):
    """
    Intenta extraer la parte textual asociada a una llave en raw_text.
    Busca patrones tipo "key": ...  o key: ...
    Retorna el contenido bruto (string) o "" si no se encuentra.
    """
    if not isinstance(raw_text, str):
        return ""
    s = raw_text
    # buscar "key": [ ... ]  o 'key': ...
    # patrón tolerante: key puede contener espacios, guiones bajos o mayúsculas
    key_pat = re.escape(key)
    # capturar listas
    pat_list = rf'["\']?{key_pat}["\']?\s*:\s*(\[[^\]]*\])'
    m = re.search(pat_list, s, flags=re.IGNORECASE|re.DOTALL)
    if m:
        return m.group(1)

    # capturar string "..."
    pat_str = rf'["\']?{key_pat}["\']?\s*:\s*(".*?"|\'.*?\'|[^,}}\n]+)'
    m = re.search(pat_str, s, flags=re.IGNORECASE|re.DOTALL)
    if m:
        return m.group(1).strip()

    return ""

# función principal expuesta
def parse_parsed_output(raw):
    """
    raw: puede ser dict (ideal) o texto libre que incluye claves o simplemente texto.
    Devuelve dict normalizado con las llaves mencionadas arriba.
    """
    # intento JSON parseado
    parsed = _try_load_json(raw)
    # preparar estructura vacía
    result = {
        "executive_summary": "",
        "problem_analysis": "",
        "pain_points": [],
        "root_causes": [],
        "strategic_priorities": [],
        "technology_recommendations": [],
        "roadmap_30_60_90": {"30_days": [], "60_days": [], "90_days": []},
        "risks_and_mitigations": [],
        "kpis": []
    }

    if parsed and isinstance(parsed, dict):
        # extraer con seguridad
        result["executive_summary"] = parsed.get("executive_summary") or parsed.get("summary") or parsed.get("resumen") or ""
        result["problem_analysis"] = parsed.get("problem_analysis") or parsed.get("analysis") or parsed.get("problem_analysis", "") or parsed.get("problem") or ""
        result["pain_points"] = _to_list(parsed.get("pain_points") or parsed.get("pain") or parsed.get("top_pain_points"))
        result["root_causes"] = _to_list(parsed.get("root_causes") or parsed.get("causas") or parsed.get("root_causes"))
        result["strategic_priorities"] = _to_list(parsed.get("strategic_priorities") or parsed.get("priorities") or parsed.get("strategic_priorities"))
        result["technology_recommendations"] = _to_list(parsed.get("technology_recommendations") or parsed.get("technology") or parsed.get("tech"))
        # kpis: pueden venir como lista de dicts o string
        result["kpis"] = parsed.get("kpis") or parsed.get("KPIs") or parsed.get("kpi") or []
        if isinstance(result["kpis"], str):
            result["kpis"] = _to_list(result["kpis"])

        # hoja de ruta: intentar varios formatos
        rr = parsed.get("roadmap_30_60_90") or parsed.get("roadmap") or parsed.get("roadmap_30/60/90") or {}
        if isinstance(rr, dict):
            result["roadmap_30_60_90"]["30_days"] = _to_list(rr.get("30_days") or rr.get("30 days") or rr.get("short_term") or rr.get("short_term (30 days)"))
            result["roadmap_30_60_90"]["60_days"] = _to_list(rr.get("60_days") or rr.get("60 days") or rr.get("mid_term") or rr.get("mid_term (60 days)"))
            result["roadmap_30_60_90"]["90_days"] = _to_list(rr.get("90_days") or rr.get("90 days") or rr.get("long_term") or rr.get("long_term (90 days)"))
        else:
            # rr puede ser string: intentar extraer bloques "30", "60", "90" por texto
            rr_text = rr if isinstance(rr, str) else ""
            if rr_text:
                # dividir por 30/60/90 markers
                parts = re.split(r'30\s*days|30\s*días|60\s*days|60\s*días|90\s*days|90\s*días', rr_text, flags=re.IGNORECASE)
                # heuristica: asignar por orden
                items = _to_list(rr_text)
                result["roadmap_30_60_90"]["30_days"] = items[:3]
                result["roadmap_30_60_90"]["60_days"] = items[3:6]
                result["roadmap_30_60_90"]["90_days"] = items[6:9]

        result["risks_and_mitigations"] = _to_list(parsed.get("risks_and_mitigations") or parsed.get("risks") or parsed.get("risk_and_mitigation") or parsed.get("risks_and_mitigation"))
        return result

    # Si no es dict (texto libre), aplicamos heurísticas por claves en texto
    text = _normalize_text(raw if isinstance(raw, str) else str(raw))

    # executive summary: si existe "executive_summary": "..."
    es = _extract_field_from_text(text, "executive_summary") or _extract_field_from_text(text, "summary") or ""
    if es:
        es = es.strip().strip('"').strip("'")
        result["executive_summary"] = es
    else:
        # fallback: tomar primeras 300 caracteres como summary
        result["executive_summary"] = (text[:800] + "...") if len(text) > 800 else text

    # dolores
    pp_raw = _extract_field_from_text(text, "pain_points") or _extract_field_from_text(text, "pain") or ""
    if pp_raw:
        # limpiar corchetes si vienen
        pp_clean = pp_raw.strip().strip("[]")
        result["pain_points"] = _to_list(pp_clean)

    # causas
    rc_raw = _extract_field_from_text(text, "root_causes") or _extract_field_from_text(text, "root causes") or ""
    if rc_raw:
        rc_clean = rc_raw.strip().strip("[]")
        result["root_causes"] = _to_list(rc_clean)

    # prioridades estratégicas
    sp_raw = _extract_field_from_text(text, "strategic_priorities") or _extract_field_from_text(text, "priorities") or ""
    if sp_raw:
        result["strategic_priorities"] = _to_list(sp_raw.strip().strip("[]"))

    # recomendaciones tecnologicas
    tr_raw = _extract_field_from_text(text, "technology_recommendations") or _extract_field_from_text(text, "technology_recommend") or _extract_field_from_text(text, "technology")
    if tr_raw:
        result["technology_recommendations"] = _to_list(tr_raw.strip().strip("[]"))

    # kpis
    kpi_raw = _extract_field_from_text(text, "kpis") or _extract_field_from_text(text, "KPIs") or ""
    if kpi_raw:
        result["kpis"] = _to_list(kpi_raw.strip().strip("[]"))

    # hoja de ruta
    rd_raw = _extract_field_from_text(text, "roadmap_30_60_90") or _extract_field_from_text(text, "roadmap") or ""
    if rd_raw:
        rd_txt = rd_raw.strip().strip("[]")
        # intentar separar por "30", "60", "90"
        parts30 = re.search(r'30[^:]*[:\-]?\s*(.*?)(?=(60\s*days|60\s*días|90\s*days|$))', rd_txt, flags=re.IGNORECASE|re.DOTALL)
        if parts30:
            result["roadmap_30_60_90"]["30_days"] = _to_list(parts30.group(1))
        parts60 = re.search(r'60[^:]*[:\-]?\s*(.*?)(?=(90\s*days|$))', rd_txt, flags=re.IGNORECASE|re.DOTALL)
        if parts60:
            result["roadmap_30_60_90"]["60_days"] = _to_list(parts60.group(1))
        parts90 = re.search(r'90[^:]*[:\-]?\s*(.*)', rd_txt, flags=re.IGNORECASE|re.DOTALL)
        if parts90:
            result["roadmap_30_60_90"]["90_days"] = _to_list(parts90.group(1))
        # fallback
        if not any([result["roadmap_30_60_90"]["30_days"], result["roadmap_30_60_90"]["60_days"], result["roadmap_30_60_90"]["90_days"]]):
            items = _to_list(rd_txt)
            result["roadmap_30_60_90"]["30_days"] = items[:3]
            result["roadmap_30_60_90"]["60_days"] = items[3:6]
            result["roadmap_30_60_90"]["90_days"] = items[6:9]

    # riesgos y mitigaciones
    if not result["risks_and_mitigations"]:
        r_raw = _extract_field_from_text(text, "risks_and_mitigations") or _extract_field_from_text(text, "risks") or ""
        if r_raw:
            result["risks_and_mitigations"] = _to_list(r_raw.strip().strip("[]"))
    if not result["technology_recommendations"]:
        t_raw = _extract_field_from_text(text, "technology_recommendations") or _extract_field_from_text(text, "technology")
        if t_raw:
            result["technology_recommendations"] = _to_list(t_raw.strip().strip("[]"))

    return result
