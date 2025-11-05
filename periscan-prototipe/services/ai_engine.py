# services/ai_engine.py
import inspect
import json
import traceback

try:
    from processor.local_consulting import generate_local_diagnosis as _generate_local_diagnosis
except Exception:
    _generate_local_diagnosis = None

try:
    from processor import ai_handler as _ai_handler
except Exception:
    _ai_handler = None

try:
    from processor.local_llm import local_llm_query as _local_llm_query
except Exception:
    _local_llm_query = None

def _safe_call(func, *args, **kwargs):
    """
    Llama a func intentando varias combinaciones de argumentos para adaptarse
    a distintas firmas que pueda tener la función original.
    Retorna (ok, result) donde ok=True si la llamada fue exitosa.
    """
    if func is None:
        return (False, f"Function not available: {func}")

    # 1) intentar llamada directa con exatamente los args/kwargs dados
    try:
        return (True, func(*args, **kwargs))
    except TypeError:
        pass
    except Exception as e:
        # Si la función lanza otra excepción, devolverla (llamador la manejará)
        return (False, f"Function raised exception: {e}\n{traceback.format_exc()}")

    # 2) intentar con sólo el primer argumento (texto)
    try:
        if len(args) >= 1:
            return (True, func(args[0]))
    except TypeError:
        pass
    except Exception as e:
        return (False, f"Function raised exception: {e}\n{traceback.format_exc()}")

    # 3) intentar con kwargs comunes
    try:
        alt_kwargs = {}
        if len(args) >= 1:
            alt_kwargs['text'] = args[0]
            alt_kwargs['prompt'] = args[0]
            alt_kwargs['description'] = args[0]
        if len(args) >= 2:
            alt_kwargs['client_name'] = args[1]
            alt_kwargs['client'] = args[1]
        if len(args) >= 3:
            alt_kwargs['sector'] = args[2]
        # probar varias combinaciones simples
        for k in [{'text': alt_kwargs.get('text')},
                  {'prompt': alt_kwargs.get('prompt')},
                  {'text': alt_kwargs.get('text'), 'client_name': alt_kwargs.get('client_name')},
                  {'text': alt_kwargs.get('text'), 'client': alt_kwargs.get('client_name')},
                  {'text': alt_kwargs.get('text'), 'client_name': alt_kwargs.get('client_name'), 'sector': alt_kwargs.get('sector')},
                  {'description': alt_kwargs.get('text')}]:
            # limpiar None
            call_kwargs = {kk:vv for kk,vv in k.items() if vv is not None}
            try:
                return (True, func(**call_kwargs))
            except TypeError:
                continue
            except Exception as e:
                return (False, f"Function raised exception: {e}\n{traceback.format_exc()}")
    except Exception:
        pass

    # 4) Fallo
    return (False, "Could not call function with adaptive attempts (signature mismatch).")

def run_consulting_model(problem_text, client_name="", sector="", use_openai=False):
    """
    Función principal que llama al motor IA. Intenta:
    - Si use_openai True y existe ai_handler con generate_diagnosis_openai -> intentar
    - Sino -> llamar a processor.local_consulting.generate_local_diagnosis con firmas adaptativas
    Retorna un dict o string con el resultado. Nunca lanza TypeError por firma.
    """
    # 1) Intentar OpenAI vía ai_handler si el usuario pidió y si está disponible
    if use_openai and _ai_handler is not None:
        try:
            if hasattr(_ai_handler, "generate_diagnosis_openai"):
                try:
                    # la función puede requerir distintos argumentos; solo intentamos una llamada simple
                    return _ai_handler.generate_diagnosis_openai(problem_text, client_name, sector)
                except TypeError:
                    try:
                        return _ai_handler.generate_diagnosis_openai(problem_text)
                    except Exception as e:
                        return f"Error calling generate_diagnosis_openai: {e}"
        except Exception as e:
            return f"OpenAI handler error: {e}"

    # 2) Usar motor local: adaptativo
    if _generate_local_diagnosis is None:
        return "No local generate_local_diagnosis available."

    ok, result = _safe_call(_generate_local_diagnosis, problem_text, client_name, sector)
    if ok:
        return result
    else:
        # devolver texto con el motivo (no lanzar)
        return f"(LLM call failed) {result}"

def local_llm_proxy(prompt_text):
    """
    Proxy para el LLM local de chat rápido. Se adapta a varias firmas posibles.
    """
    if _local_llm_query is None:
        # si no existe, intentar usar ai_handler.llm_query si existe
        if _ai_handler and hasattr(_ai_handler, "local_llm_query"):
            try:
                return _ai_handler.local_llm_query(prompt_text)
            except Exception as e:
                return f"(LLM proxy error: {e})"
        return "(local LLM not available)"
    ok, result = _safe_call(_local_llm_query, prompt_text)
    if ok:
        return result
    else:
        return f"(LLM proxy failed) {result}"
