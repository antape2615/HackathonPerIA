import os
import json

def parse_json_safe(raw_text):
    try:
        return json.loads(raw_text)
    except Exception:
        start = raw_text.find('{')
        end = raw_text.rfind('}')
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(raw_text[start:end+1])
            except:
                cleaned = raw_text[start:end+1].replace("“", "\"").replace("”", "\"").replace("’", "'")
                try:
                    return json.loads(cleaned)
                except:
                    return None
        return None

def generate_diagnosis_openai(problem, client="", sector=""):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OpenAI API key not configured")
    raise NotImplementedError("Implementa la llamada a OpenAI si tienes clave")
