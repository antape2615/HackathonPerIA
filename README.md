# 📘 **TestIA Backend**

TestIA Backend es un servicio construido con **Spring Boot 3**, **Java 17**, **MongoDB**, y **GROQ** para generar, asignar y evaluar pruebas técnicas de programación con IA.

Incluye:

* Autenticación JWT
* Generación de pruebas con IA
* Asignación por correo
* Entorno para candidatos
* Evaluación automática
* Dashboard para administradores

---

## 🚀 **Requisitos**

Antes de ejecutar el backend necesitas:

| Herramienta    | Versión recomendada |
| -------------- | ------------------- |
| Java           | **17**              |
| Maven          | **3.9+**            |
| MongoDB        | Local o Atlas       |
| GROQ API Key   | Gratuita / oficial  |
| IDE            | IntelliJ / VSCode   |

---

## 📦 **Instalación y ejecución**

### 1️⃣ **Clonar el repo**

```bash
git clone https://github.com/org(Change-this)/testia-backend.git
cd testia-backend
```

### 2️⃣ **Crear archivo `.env`**

Crea un archivo `.env` en la raíz:

```
GROQ_API_KEY=your_free_or_paid_key_here
JWT_SECRET=your_jwt_secret_here
```

> 🔥 **Hint => Sí, puedes usar claves gratuitas de OpenAI.**

### 3️⃣ **Configurar MongoDB (si usas local)**

Asegúrate de tener Mongo corriendo:

```
mongodb://localhost:27017/testia
```

Si usas Atlas, actualiza `application.properties`.

---

## ▶️ **Ejecutar en modo desarrollo**

### Con Maven:

```bash
mvn spring-boot:run
```

### Con Java:

```bash
./mvnw spring-boot:run
```

Servidor disponible en:

```
http://localhost:8080
```

---

## 🔐 **Autenticación (JWT)**

1. Registrarse:

```
POST /api/v1/auth/register
```

2. Hacer login:

```
POST /api/v1/auth/login
```

3. El backend retornará:

```json
{
  "token": "jwt_here"
}
```

Debes enviarlo en cada request:

```
Authorization: Bearer <jwt>
```

---

## 🧪 **Endpoints principales**

### Generar prueba con IA

```
POST /api/v1/tests/generate
```

### Asignar una prueba a un candidato

```
POST /api/v1/tests/assign
```

### Obtener test para candidato

```
GET /api/v1/candidate/test?id=UUID
```

### Enviar solución

```
POST /api/v1/candidate/test/submit?id=UUID
```

### Evaluar automáticamente

```
POST /api/v1/admin/evaluate/{assignmentId}
```

### Estadísticas

```
GET /api/v1/dashboard/stats
```

> Documentación completa disponible en `docs/API.md`.

---

## 🧩 **Variables de entorno**

Archivo: **`.env.example`**

```
# JWT
JWT_SECRET=changeme123

# OpenAI settings
GROQ_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.1

# MongoDB
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/testia
SPRING_DATA_MONGODB_DATABASE=testia
SPRING_DATA_MONGODB_UUID_REPRESENTATION=standard
```
Igual el .env lo subi a la solucion.
---

# ⚙️ **CI/CD — GitHub Actions**

Incluye un workflow sencillo para validar que el backend construye correctamente.

Archivo: **`.github/workflows/backend-ci.yml`**

```yaml
name: Backend CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
          restore-keys: |
            ${{ runner.os }}-m2

      - name: Build with Maven
        run: mvn -B -e -ntp package
```

✔️ Valida compilacion
✔️ Cachea dependencias
✔️ Compatible con Java 17

---

# 🧑‍💻 Desarrollo local

Si quieres ejecutar con modo debug:

```
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Para ver logs más detallados:

```
logging.level.com.testia=DEBUG
```

---

# 🛠 Estructura del proyecto

```
testia-backend/
 ├── src/main/java/com/testia/
 │   ├── application/
 │   ├── domain/
 │   ├── infrastructure/
 │   └── TestiaApiApplication.java
 ├── src/main/resources/
 │   ├── application.properties
 │   └── templates/email/
 ├── .env
 ├── pom.xml
 └── README.md
```

Arquitectura usada:
✔️ **Hexagonal (Ports & Adapters)**
✔️ **Services desacoplados**
✔️ **Repositorios por dominio**

---
