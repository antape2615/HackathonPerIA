# 🏆 Tech Battle Latam 2025
## Plataforma de Evaluación Técnica con IA

Plataforma que permite crear y resolver tests de programación con evaluación automática mediante inteligencia artificial (Groq - LLaMA 3.3 70B).

## 🚀 Quick Start
```bash
# Clonar repositorio
git clone <repo-url>
cd HackathonPerIA

crear el .env de el archivo env.example en la raiz y en la carpeta backend con las variables necesarias y en el frontend tambien
# Dar permisos
chmod +x backend/docker-entrypoint.sh

# Iniciar
docker compose up --build
```

**Acceso:**
- Frontend: http://localhost:3001
- Backend: http://localhost:4000/api

**Credenciales:**
- Candidato: `candidate@techbattle.com` / `password123`
- Evaluador: `evaluator@techbattle.com` / `password123`

## 📚 Documentación Completa

Ver [DOCUMENTATION.md](./docs/DOCUMENTATION.md) para:
- Arquitectura del sistema
- Descripción de módulos
- Integración con IA (Groq)
- Deployment con Docker

## 🛠️ Stack

**Backend:** NestJS, TypeScript, PostgreSQL, Prisma, Groq API  
**Frontend:** React, TypeScript, Vite, Monaco Editor, Tailwind  
**Infra:** Docker, Docker Compose, Nginx

## ✨ Características

- ✅ Autenticación JWT con roles
- ✅ Editor Monaco integrado
- ✅ Evaluación con IA (calidad, prácticas, eficiencia)
- ✅ Feedback automático detallado
- ✅ Dashboard con métricas

## 👥 Autor

Kevin Garzón - Full Stack Developer

---

*Proyecto para Tech Battle Latam 2025 Hackathon*