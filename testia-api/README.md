# 📘 **TestIA Backen**
---

# 🔐 **Authentication API**

## **POST /api/v1/auth/register**

**Summary:** Registrar un nuevo usuario
**Tags:** Auth

### Request Body

```json
{
  "email": "user@test.com",
  "password": "123456",
  "fullName": "Test User"
}
```

### Response — **201 Created**

```json
{ "message": "User registered" }
```

---

## **POST /api/v1/auth/login**

**Summary:** Login y obtención de JWT
**Tags:** Auth

### Request Body

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

### Response — **200 OK**

```json
{
  "token": "jwt_here"
}
```

---

# 🤖 **AI Test Generation API**

## **POST /api/v1/tests/generate**

**Summary:** Genera una prueba técnica usando IA
**Tags:** Test Generation
**Authorization:** Required (Admin/Recruiter)

### Request Body

```json
{
  "language": "java",
  "level": "junior"
}
```

### Response

```json
{
  "id": "UUID",
  "language": "java",
  "level": "junior",
  "problemStatement": "...",
  "starterCode": "...",
  "testCases": [
    {
      "input": "1 2",
      "expectedOutput": "3",
      "type": "inputOutput"
    }
  ],
  "difficultyTags": ["junior"],
  "generatedAt": "2025-11-19T12:46:36Z"
}
```

---

# 📤 **Assignment API**

## **POST /api/v1/tests/assign**

**Summary:** Asigna un test generado a un candidato
**Tags:** Assignment
**Authorization:** Admin/Recruiter

### Request Body

```json
{
  "candidateEmail": "candidate@test.com",
  "test": {
    "id": "UUID",
    "language": "java",
    "level": "junior",
    "problemStatement": "...",
    "starterCode": "...",
    "testCases": [
      { "input": "hello world", "expectedOutput": "world hello", "type": "inputOutput" }
    ],
    "difficultyTags": ["junior"],
    "generatedAt": "2025-11-19T12:46:36Z"
  }
}
```

### Response — **200 OK**

```json
{
  "id": "ASSIGNMENT_UUID",
  "candidateEmail": "candidate@test.com",
  "status": "SENT"
}
```

📌 **El link enviado al candidato debe ser:**

```
https://frontend-url/take-test/{assignmentId}
```

---

## **GET /api/v1/tests/{id}**

**Summary:** Obtiene un test generado por IA
**Tags:** Tests
**Authorization:** Admin/Recruiter

### Response

```json
{
  "id": "UUID",
  "language": "java",
  "level": "junior",
  "problemStatement": "...",
  "starterCode": "...",
  "testCases": [...],
  "difficultyTags": ["junior"]
}
```

---

# 👤 **Candidate API**

## **GET /api/v1/candidate/tests**

**Summary:** Lista tests asignados al candidato autenticado
**Tags:** Candidate

### Response

```json
[
  {
    "id": "ASSIGNMENT_UUID",
    "testId": "UUID",
    "candidateEmail": "candidate@test.com",
    "status": "SENT"
  }
]
```

---

## **GET /api/v1/candidate/test?id={assignmentId}**

**Summary:** Obtiene la prueba completa para resolver
**Tags:** Candidate

### Response

```json
{
  "assignmentId": "UUID",
  "testId": "UUID",
  "language": "java",
  "level": "junior",
  "problemStatement": "...",
  "starterCode": "...",
  "testCases": [...]
}
```

---

## **POST /api/v1/candidate/test/submit?id={assignmentId}**

**Summary:** El candidato envía su solución
**Tags:** Candidate

### Request Body

```json
{
  "code": "public class Solution {...}"
}
```

### Response

```json
{ "message": "Solution submitted!" }
```

---

# 🧠 **AI Evaluation API**

## **POST /api/v1/admin/evaluate/{assignmentId}**

**Summary:** Ejecuta evaluación automática con IA
**Tags:** Evaluation
**Authorization:** Admin/Recruiter

### Response

```json
{
  "overallScore": 92,
  "bucketScores": [
    { "bucketName": "Corrección", "score": 100 },
    { "bucketName": "Performance", "score": 80 }
  ],
  "bigOTime": "O(n)",
  "bigOSpace": "O(1)",
  "lineCount": 45,
  "edgeCaseCoverage": ["empty", "symbols"],
  "securityNotes": [],
  "globalSummary": "La solución es eficiente y correcta.",
  "evaluatedAt": "2025-11-19T12:46:36Z"
}
```

---

# 📊 **Dashboard API**

## **GET /api/v1/dashboard/stats**

**Summary:** KPIs principales para admin
**Tags:** Dashboard

### Response

```json
{
  "total": 12,
  "sent": 7,
  "submitted": 5,
  "completionRate": 42
}
```

---

## **GET /api/v1/dashboard/assignments**

**Summary:** Lista simple paginada
**Tags:** Dashboard

### Query Params

| Name | Type | Default |
| ---- | ---- | ------- |
| page | int  | 0       |
| size | int  | 10      |

### Response

```json
[
  {
    "assignmentId": "UUID",
    "candidateEmail": "candidate@test.com",
    "status": "SENT",
    "submittedAt": null
  }
]
```

---

# 🧩 **Dashboard Extended API**

## **GET /api/v1/dashboard/submission/{assignmentId}**

**Summary:** Solo submission
**Tags:** Dashboard Extended

### Response

```json
{
  "assignmentId": "UUID",
  "submittedCode": "public class Solution {...}",
  "submittedAt": "2025-11-19T00:14:08Z"
}
```

---

## **GET /api/v1/dashboard/evaluation/{assignmentId}**

**Summary:** Solo evaluación IA
**Tags:** Dashboard Extended

### Response

```json
{
  "overallScore": 90,
  "bucketScores": [...],
  "bigOTime": "O(n)",
  "bigOSpace": "O(1)",
  "globalSummary": "Análisis de calidad del código..."
}
```

---

# 📦 **Schemas**

## `GeneratedTest`

```json
{
  "id": "UUID",
  "language": "string",
  "level": "string",
  "problemStatement": "string",
  "starterCode": "string",
  "testCases": [
    { "input": "string", "expectedOutput": "string", "type": "inputOutput" }
  ],
  "difficultyTags": ["string"],
  "generatedAt": "datetime"
}
```

---

## `CandidateSubmission`

```json
{
  "assignmentId": "UUID",
  "testId": "UUID",
  "submittedCode": "string",
  "submittedAt": "datetime"
}
```

---

## `EvaluationResult`

```json
{
  "assignmentId": "UUID",
  "overallScore": "number",
  "bucketScores": [],
  "bigOTime": "string",
  "bigOSpace": "string",
  "lineCount": "number",
  "edgeCaseCoverage": [],
  "securityNotes": [],
  "globalSummary": "string",
  "evaluatedAt": "datetime"
}
```

---
Datos Usados para realizar el workflow de la aplicacion.

<img width="986" height="663" alt="image" src="https://github.com/user-attachments/assets/60b76044-6f98-4e76-b2d1-1560f1cab463" />
