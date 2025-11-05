# processor/local_llm.py
import requests

def local_llm_query(prompt, model="phi-3-mini-4k-instruct", stream=False):
    url = "http://localhost:1234/v1/chat/completions"
    
    payload = {
        "model": model,
        "messages":[
            {"role":"system","content":"You are a helpful AI assistant."},
            {"role":"user","content": prompt}
        ],
        "temperature": 0.25,
        "max_tokens": 1800,
        "stream": stream
    }

    try:
        response = requests.post(url, json=payload, timeout=180)
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"LLM error: {e}"
