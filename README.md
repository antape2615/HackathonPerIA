# 🚀 Periscan Insight Platform  
**Escanea. Interpreta. Transforma.**  
Autor: **Cristian Castillo**

---

## 🧠 Descripción General

Periscan Insight Platform es una herramienta de diagnóstico estratégico impulsada por IA para análisis empresarial estilo McKinsey/BCG/Accenture.  
Escanea un problema, aplica estructura consultiva y genera:

- Executive Summary
- Problem Analysis
- Pain Points
- Root Causes
- Strategic Priorities
- KPIs medibles
- Roadmap 30 / 60 / 90 días
- Riesgos y mitigaciones
- Recomendación final
- PDF ejecutivo corporativo
- Histórico de diagnósticos

Diseñada para funcionar **100% local y segura**.  
Compatible con laptops (**16GB RAM - Intel**) usando **LM Studio + phi-3-mini-4k-instruct**.

---

## 🎯 Objetivos del Proyecto

- IA local (no envia datos a internet)
- Flujo consultivo profesional
- JSON estructurado con validación/auto-fix
- PDF estilo consultoría
- Base SQLite historial
- UI limpia, pasos guiados
- Cumplimiento reto Periferia

---

## 📂 Estructura del Proyecto

```
periscan-prototipe
│ app.py
│ README.md
│ requirements.txt
│ Dockerfile
│ inicializar_git.sh
│
├─assets/
├─core/
├─processor/            # prompts + LLM logic
├─services/             # parser + PDF + storage
├─utils/
├─data/                 # SQLite DB
└─pages/                # Step1-2-3 (ocultos hasta análisis)
```

---

## 🧠 Motor de IA

| Componente | Valor |
|---|---|
LLM | phi-3-mini-4k-instruct (local)  
Servidor | LM Studio  
Conexión | http://localhost:1234  
Modo | CPU offline  

---

## ⚙️ Instalación

### 1️⃣ Crear entorno

```bash
conda create -n periscan python=3.10 -y
conda activate periscan
```

### 2️⃣ Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3️⃣ Configurar LM Studio

1. Abrir LM Studio
2. Descargar modelo: `phi-3-mini-4k-instruct`
3. Activar `Server Mode`
4. Puerto: `1234`

---

## ▶️ Ejecutar aplicación

```bash
streamlit run app.py
```

---

## 🧪 Flujo del Usuario

1. Ingresar problema empresarial
2. IA genera diagnóstico estructurado
3. Mostrar dashboards + PDF
4. Guardar en SQLite
5. Consultar historial

> Páginas Step1-2-3 permanecen ocultas hasta que IA termina.

---

## 📦 Funcionalidades

| Función | Estado |
|---|---|
Diagnóstico IA | ✅  
Parser JSON | ✅  
PDF ejecutivo | ✅  
Histórico SQLite | ✅  
UI modo consultor | ✅  
Modo offline | ✅  
Bot asistente | ✅  

---

## 🔒 Seguridad

| Protección | Estado |
|---|---|
Datos locales | ✅  
LLM offline | ✅  
Sin API externa | ✅  

---

## 📁 Evidencias

Reportes e imágenes en:

```
/reports/
```

---

## ✅ Checklist Reto Periferia

| Requisito | Cumple |
|---|---|
App funcional | ✅  
Modelo IA local | ✅  
Evidencias | ✅  
Documentación completa | ✅  
Persistencia | ✅  
Entrega PDF | ✅  
Automatización pasos | ✅  

---

## 🏁 Conclusión

Periscan Insight Platform permite construir diagnósticos empresariales automáticos con estándares de consultoría global, ejecutados completamente en local, integrando IA, UI de negocio y entregables ejecutivos.

### © 2025 — Periscan Insight Platform
Desarrollado para evaluación técnica Periferia IT Group.
