<div align="center">
<img src="./components/image/logo.png" alt="Tech Battle Logo" width="300" />
</div>

# Tech Battle Latam Evaluation Platform

Plataforma de evaluación técnica automatizada impulsada por Inteligencia Artificial. Este sistema permite gestionar pruebas de programación, asignarlas a candidatos y evaluar sus respuestas de forma autónoma utilizando agentes de IA.

## Características

- **Dashboard de Evaluador**: Gestión de pruebas y candidatos.
- **Agente Orquestador**: Automatización del flujo de evaluación.
- **Agente Arquitecto**: Generación automática de pruebas personalizadas.
- **Agente Evaluador (Avalia)**: Corrección automática de código y feedback detallado.
- **Entorno de Candidato**: Interfaz limpia para realizar las pruebas.

## Configuración y Ejecución

### 1. Prerrequisitos
- **Node.js** (versión 18 o superior)
- **NPM** (incluido con Node.js)

### 2. Instalación
Clona el repositorio e instala las dependencias:

```bash
npm install
```

### 3. Configuración de API Keys (Inteligencia Artificial)
El sistema requiere acceso a modelos de IA (Gemini o GPT-4) para funcionar. Tienes dos opciones para configurarlas:

**Opción A: Archivo de Entorno (Recomendado para desarrollo)**
Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega tu clave:

```env
GEMINI_API_KEY=tu_clave_api_aqui
OPENAI_API_KEY=tu_clave_openai_aqui
ANTHROPIC_API_KEY=tu_clave_anthropic_aqui
```
*(El sistema tomará estas claves automáticamente al iniciar).*

**Opción B: Interfaz de Usuario (Sin reiniciar)**
1. Inicia la aplicación.
2. En la pantalla de Login, haz clic en el icono de **Engranaje** (⚙️) en la esquina superior derecha.
3. Ingresa tus claves (Gemini, OpenAI o Anthropic) y guarda. Estas se almacenarán en tu navegador (LocalStorage).

### 4. Ejecutar la Aplicación
Inicia el servidor de desarrollo local:

```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:3000`

## Documentación

Para más detalles sobre el funcionamiento del sistema, consulta la carpeta `DOCS/`:
- [Módulos del Sistema](./DOCS/Módulos.md)
- [Arquitectura Técnica](./DOCS/Arquitectura.md)
- [Uso de IA y Agentes](./DOCS/Uso_de_IA.md)
