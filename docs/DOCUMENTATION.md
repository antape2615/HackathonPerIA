# DOCUMENTACIÓN TÉCNICA - TECH BATTLE LATAM 2025

## Plataforma de Evaluación Técnica con Inteligencia Artificial

---

## Índice

1. [Introducción](#1-introducción)
2. [Módulos del Sistema](#2-módulos-del-sistema)
3. [Arquitectura](#3-arquitectura)
4. [Uso de Inteligencia Artificial](#4-uso-de-inteligencia-artificial)
5. [Consideraciones Técnicas](#5-consideraciones-técnicas)

---

## 1. Introducción

### 1.1 Descripción General

**Tech Battle Latam 2025** es una plataforma de evaluación técnica que revoluciona el proceso de selección de desarrolladores mediante el uso de inteligencia artificial. La plataforma permite a evaluadores crear tests de programación personalizados y a candidatos resolverlos, recibiendo feedback automático y detallado generado por modelos de lenguaje avanzados.

### 1.2 Objetivos del Sistema

- **Automatización**: Eliminar la evaluación manual de código mediante IA
- **Objetividad**: Proporcionar criterios uniformes de evaluación
- **Escalabilidad**: Evaluar múltiples candidatos simultáneamente
- **Aprendizaje**: Ofrecer feedback constructivo para mejorar habilidades

### 1.3 Stack Tecnológico

#### Backend

- **NestJS 10** (Framework Node.js)
- **TypeScript**
- **PostgreSQL 15**
- **Prisma 5** (ORM)
- **JWT** (Autenticación)
- **Groq API** con **LLaMA 3.3 70B** (IA)

#### Frontend

- **React 18** + TypeScript
- **Vite**
- **Monaco Editor**
- **Tailwind CSS**
- **Axios**

#### Infraestructura

- **Docker** & **Docker Compose**
- **Nginx**
- **PostgreSQL** en contenedor

---

## 2. Módulos del Sistema

### 2.1 Auth Module

**Responsabilidad**: Gestión de autenticación y autorización

#### Componentes

- `auth.controller.ts`: Endpoints HTTP
- `auth.service.ts`: Lógica de negocio
- `jwt.strategy.ts`: Estrategia JWT
- `jwt-auth.guard.ts`: Guard de rutas

#### Funcionalidades

1. **Registro**: Validación, hash bcrypt, asignación de roles, generación JWT
2. **Login**: Verificación, generación token (24h duración)
3. **Protección**: JWT Guard, verificación de roles

#### Flujo de autenticación

```
Usuario → POST /auth/login → Verificación bcrypt → Generación JWT →
Cliente almacena en localStorage → Requests con Authorization: Bearer <token>
```

#### Endpoints

| Endpoint | Descripción | Acceso |
|----------|-------------|--------|
| `POST /auth/register` | Registro | Público |
| `POST /auth/login` | Login | Público |
| `POST /auth/logout` | Logout | Autenticado |
| `GET /auth/me` | Usuario actual | Autenticado |

---

### 2.2 Tests Module

**Responsabilidad**: CRUD de tests y preguntas

#### Modelo de datos

- **Test**: `id`, `title`, `description`, `language`, `framework`, `difficulty`, `duration`, `isActive`, `createdById`, `questions[]`
- **Question**: `id`, `testId`, `title`, `description`, `starterCode`, `points`, `order`, `testCases[]`
- **TestCase**: `id`, `questionId`, `input`, `expectedOutput`, `isHidden`, `order`

#### Funcionalidades

- Creación de tests (solo EVALUATOR)
- Gestión de preguntas múltiples
- Test cases públicos y ocultos
- Control de visibilidad (`isActive`)

#### Endpoints

| Endpoint | Descripción | Roles |
|----------|-------------|-------|
| `GET /tests` | Listar tests | CANDIDATE, EVALUATOR |
| `GET /tests/:id` | Detalle | CANDIDATE, EVALUATOR |
| `POST /tests` | Crear | EVALUATOR |
| `PUT /tests/:id` | Actualizar | EVALUATOR |
| `DELETE /tests/:id` | Eliminar | EVALUATOR |

---

### 2.3 Evaluations Module

**Responsabilidad**: Sesiones, respuestas y evaluación con IA

#### Modelo de datos

- **TestSession**: `id`, `testId`, `candidateId`, `status` (IN_PROGRESS/COMPLETED/EXPIRED), `startedAt`, `completedAt`, `expiresAt`, `answers[]`, `evaluation`
- **Answer**: `id`, `sessionId`, `questionId`, `code`, `createdAt`, `updatedAt`
- **Evaluation**: `id`, `sessionId`, `totalScore`, `totalPoints`, `passedTestCases`, `totalTestCases`, `codeQualityScore`, `bestPracticesScore`, `efficiencyScore`, `score`, `aiFeedback`, `strengths[]`, `weaknesses[]`, `recommendations[]`, `detailedAnalysis`

#### Proceso de evaluación

1. **startTest**: Crear sesión, calcular expiración, cargar preguntas
2. **submitAnswer**: Guardar/actualizar código
3. **finishTest**:
   - Ejecutar test cases por pregunta
   - Llamar `AIService.evaluateCode()`
   - Calcular score: 60% test cases + 40% IA
   - Agregar métricas globales
   - Crear Evaluation
   - Actualizar sesión a COMPLETED

#### Fórmula scoring

```typescript
scoreQuestion = (testCasesScore × 0.6) + (aiQualityScore × 0.4)
testCasesScore = (passed/total) × questionPoints
aiQualityScore = ((codeQuality + bestPractices + efficiency) / 300) × questionPoints × 0.4
finalScore = (totalEarned / totalPossible) × 100
```

#### Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `POST /evaluations/start/:testId` | Iniciar test |
| `GET /evaluations/session/:sessionId` | Obtener sesión |
| `POST /evaluations/submit-answer` | Guardar respuesta |
| `POST /evaluations/finish/:sessionId` | Finalizar y evaluar |
| `GET /evaluations/results/:sessionId` | Ver resultados |
| `GET /evaluations/my-sessions` | Listar sesiones |

---

### 2.4 AI Module

**Responsabilidad**: Integración con Groq API

#### Método principal

```typescript
evaluateCode(
  code: string,
  language: string,
  question: string,
  testCasesPassed: number,
  totalTestCases: number
): Promise<AIEvaluation>
```

#### Prompt engineering

**System**:
```
"Eres un evaluador técnico experto. Analiza código y proporciona feedback constructivo en JSON."
```

**User**:
```
"Evalúa este código: [pregunta, código, resultados tests].
Responde JSON con: codeQuality, bestPractices, efficiency, feedback,
strengths[], weaknesses[], recommendations[]"
```

#### Parámetros Groq

- **model**: `llama-3.3-70b-versatile`
- **temperature**: `0.3` (determinista)
- **max_tokens**: `1000`
- **response_format**: `json_object`

#### Manejo de errores

```typescript
try {
  // evaluación IA
} catch {
  // fallback: solo test cases
}
```

---

### 2.5 Prisma Module

**Responsabilidad**: Conexión a base de datos

**Implementa**: `OnModuleInit`, `OnModuleDestroy`

**Métodos**: `$connect()`, `$disconnect()`

#### Schema principal

- **User**: `id`, `email`, `password` (bcrypt), `firstName`, `lastName`, `role`, `createdTests[]`, `testSessions[]`
- **Test**: `id`, `title`, `description`, `language`, `framework`, `difficulty`, `duration`, `isActive`, `questions[]`, `sessions[]`

---

## 3. Arquitectura

### 3.1 Arquitectura General

#### Capas

1. **PRESENTACIÓN** (React): Auth Pages, Tests List, Monaco Editor, Results AI
2. **APLICACIÓN** (NestJS): Auth Module, Tests Module, Evaluation Module, AI Module
3. **PERSISTENCIA** (PostgreSQL): Users, Tests, Questions, Evaluations
4. **EXTERNOS**: Groq API (LLaMA 3.3 70B)

#### Comunicación

```
Frontend ↔ HTTP/REST API ↔ Backend ↔ Prisma ORM ↔ PostgreSQL
```

---

### 3.2 Patrones Arquitectónicos

1. **Arquitectura en Capas**: Presentación → Aplicación → Dominio → Persistencia
2. **Module Pattern**: Controllers, Services, DTOs, Entities
3. **Dependency Injection**: NestJS automático
4. **Repository Pattern**: Prisma como capa de abstracción

---

### 3.3 Flujo de Datos Completo

**Ejemplo: Usuario completa test**

1. **INICIO**: `POST /evaluations/start/:testId` → Verificar JWT → Crear TestSession → Cargar test + preguntas
2. **ESCRIBIR**: Monaco Editor → State local
3. **GUARDAR**: `POST /evaluations/submit-answer` → Upsert Answer
4. **FINALIZAR**: `POST /evaluations/finish/:sessionId` → Ejecutar tests → Llamar IA → Calcular scores → Guardar Evaluation
5. **RESULTADOS**: `GET /evaluations/results/:sessionId` → Mostrar métricas

---

### 3.4 Seguridad

- **Autenticación**: JWT 24h, bcrypt (10 rounds), localStorage
- **Autorización**: RBAC, Guards NestJS, ownership verification
- **Validación**: Class Validator, Prisma constraints, TypeScript
- **Protección**: Variables entorno, HTTPS, CORS

---

### 3.5 Escalabilidad

#### Horizontal
Backend stateless, load balancer, connection pooling

#### Vertical
Índices BD, caché Redis (futuro), CDN

#### Optimizaciones
Lazy loading, paginación, gzip

---

## 4. Uso de Inteligencia Artificial

### 4.1 Selección de Tecnología

#### Groq - Plataforma de inferencia ultrarrápida

- **Velocidad**: 10x más rápido (LPU - Language Processing Unit)
- **Costo**: API gratuita desarrollo
- **Modelos**: Open-source (LLaMA, Mixtral, Gemma)
- **JSON**: Soporte nativo

#### Modelo: LLaMA 3.3 70B Versatile

- 70B parámetros
- Entrenado en código técnico
- Optimizado para tareas variadas
- JSON mode

---

### 4.2 Proceso de Evaluación

#### Flujo

1. Usuario finaliza test
2. Backend: obtener código, ejecutar test cases
3. Construir prompt Groq
4. `POST api.groq.com/openai/v1/chat/completions`
5. Groq procesa con LLaMA 3.3: analiza estructura, nomenclatura, errores, complejidad, prácticas
6. Respuesta JSON: `codeQuality`, `bestPractices`, `efficiency`, `feedback`, `strengths[]`, `weaknesses[]`, `recommendations[]`
7. Calcular score combinado: 60% tests + 40% IA
8. Guardar en BD
9. Mostrar resultados

---

### 4.3 Criterios de Evaluación

#### 1. Code Quality (0-100)

- Nomenclatura descriptiva
- Estructura organizada
- Legibilidad
- Estilo convencional
- Comentarios apropiados

**Ejemplo:**

✅ **Bueno (90)**:
```javascript
function calculateSum(numbers) {
  let total = 0;
  for (const num of numbers) total += num;
  return total;
}
```

❌ **Malo (40)**:
```javascript
function f(a) {
  let x = 0;
  for (let i = 0; i < a.length; i++) x = x + a[i];
  return x;
}
```

---

#### 2. Best Practices (0-100)

- Validación de entrada
- Manejo de errores (try-catch)
- Edge cases (arrays vacíos, null)
- Seguridad
- Patrones de diseño

**Ejemplo:**

✅ **Excelente (95)**: Valida `Array.isArray()`, maneja `length === 0`, verifica `typeof number`

⚠️ **Regular (60)**: Solo reduce sin validaciones

---

#### 3. Efficiency (0-100)

- Complejidad temporal (Big O)
- Complejidad espacial
- Evitar operaciones innecesarias
- Algoritmo apropiado

**Ejemplo:**

✅ **Óptimo O(n) (100)**: Iterar una vez

❌ **Ineficiente O(n log n) (60)**: Sort innecesario

---

### 4.4 Fórmula de Scoring

**Ejemplo pregunta 10 puntos:**

- Tests: 5/5 (100%)
- Quality: 85, Practices: 75, Efficiency: 90

```
scoreTestCases = (5/5) × 10 × 0.6 = 6
scoreAI = ((85+75+90)/300) × 10 × 0.4 = 3.33
scoreQuestion = 6 + 3.33 = 9.33
```

**Score final test:**

- P1: 9.33/10
- P2: 7.50/10
- P3: 8.00/10

**Total**: 24.83/30 = **82.77%**

---

### 4.5 Configuración Técnica

#### Parámetros optimizados

- **temperature**: `0.3` (consistencia vs creatividad)
- **max_tokens**: `1000` (suficiente, controla costo)
- **response_format**: `json_object` (garantiza estructura)

---

### 4.6 Ventajas de usar IA

1. **Objetividad**: Mismos criterios, sin sesgos
2. **Escalabilidad**: 100 candidatos simultáneos, resultados en segundos
3. **Feedback educativo**: Recomendaciones específicas
4. **Ahorro**: Automatización 24/7
5. **Análisis profundo**: Calidad más allá de funcionalidad

---

### 4.7 Limitaciones

#### Técnicas

- Dependencia API externa
- Posibles alucinaciones (por eso 60% tests)
- Costo en producción (~$0.10 por 1M tokens)

#### Mitigación

```typescript
try-catch con fallback a solo test cases
```

#### Éticas

- Transparencia con candidatos
- IA + tests automáticos
- Evaluadores pueden revisar
- Código privado

---

## 5. Consideraciones Técnicas

### 5.1 Deployment

#### Docker Compose

- **postgres**: PostgreSQL 15 Alpine
- **backend**: Depende de postgres (`service_healthy`)
- **frontend**: Nginx puerto 3000

#### Inicialización

```bash
docker-entrypoint.sh → Espera PostgreSQL → Migraciones → Seed
```

---

### 5.2 Variables de Entorno

```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/techbattle
JWT_SECRET=super-secret-key-change-in-production
GROQ_API_KEY=
VITE_API_URL=http://localhost:4000/api
```

---

### 5.3 Optimizaciones

#### Backend
Connection pooling, lazy loading, índices, paginación

#### Frontend
Code splitting, lazy routes, debouncing, Monaco separado

#### BD
Índices en `isActive`, `candidateId`, `status`

---

### 5.4 Monitoreo

```typescript
Logger.log('Test started', { testId, candidateId })
Logger.error('AI evaluation failed', { error, questionId })
```

```bash
docker compose logs -f backend
docker compose logs -f postgres
```

---

### Impacto

- **90% reducción** en tiempo de evaluación
- **Objetividad** en selección
- Mejor experiencia del candidato
- Facilitación del reclutamiento técnico

---

**Repositorio**: GitHub - Tech Battle Latam 2025
**Contacto**: kevin.garzon@example.com
**Hackathon**: Tech Battle Latam 2025
**Fecha**: Noviembre 2025

---

*Fin del documento técnico*
