# 🧠 Periscan AI

Una plataforma de assessment empresarial inteligente que utiliza Inteligencia Artificial para identificar dolores críticos de negocio y generar propuestas estratégicas en tiempo real.

## 🚀 Características Principales

- **Assessment Express**: Reduce el tiempo de diagnóstico empresarial de 6 semanas a minutos
- **IA Conversacional**: Interfaz de chat inteligente para recopilar información empresarial
- **Análisis Inteligente**: Identificación automática de puntos de dolor críticos
- **Propuestas Estratégicas**: Recomendaciones para corto, mediano y largo plazo
- **Reportes Automáticos**: Generación de informes detallados con insights accionables
- **Interfaz Moderna**: Diseño responsive y experiencia de usuario optimizada

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **IA**: Groq SDK para procesamiento de lenguaje natural
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Tema**: next-themes (modo oscuro/claro)
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- pnpm (recomendado) o npm/yarn

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd periscan-ai
   ```

2. **Instala las dependencias**
   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # API Keys para IA
   GROQ_API_KEY=tu_groq_api_key_aqui
   
   # Configuración de la aplicación
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Ejecuta el servidor de desarrollo**
   ```bash
   pnpm dev
   ```

5. **Abre tu navegador**
   
   Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Construcción
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción

# Calidad de código
pnpm lint         # Ejecuta ESLint para revisar el código
```

## 🏗️ Estructura del Proyecto

```
periscan-ai/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── analyze/       # Endpoint de análisis IA
│   │   ├── chat/          # Endpoint de chat conversacional
│   │   └── generate-report/ # Endpoint de generación de reportes
│   ├── assessment/        # Página de assessment
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   ├── assessment-flow.tsx # Flujo de assessment
│   ├── assessment-results.tsx # Resultados del assessment
│   └── theme-provider.tsx # Provider de temas
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
└── styles/               # Archivos de estilos adicionales
```

## 🎯 Funcionalidades

### Assessment Empresarial
- **Flujo Conversacional**: Interfaz de chat que guía al usuario através de preguntas estratégicas
- **Análisis en Tiempo Real**: Procesamiento inteligente de respuestas usando IA
- **Identificación de Dolores**: Detección automática de puntos críticos del negocio

### Análisis y Reportes
- **Análisis Inteligente**: Evaluación profunda de la información proporcionada
- **Propuestas Estratégicas**: Recomendaciones categorizadas por plazo (corto, mediano, largo)
- **Reportes Detallados**: Documentos comprensivos con insights accionables

### Experiencia de Usuario
- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Modo Oscuro/Claro**: Soporte completo para preferencias de tema
- **Navegación Intuitiva**: Flujo de usuario simplificado y eficiente

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Otras Plataformas
La aplicación es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `GROQ_API_KEY` | API Key para el servicio de IA Groq | Sí |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | No |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/periscan-ai/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/tu-usuario/periscan-ai/wiki)

## 🎯 Roadmap

- [ ] Integración con más modelos de IA
- [ ] Dashboard de analytics
- [ ] Exportación de reportes en PDF
- [ ] API pública para integraciones
- [ ] Plantillas de assessment personalizables
- [ ] Análisis histórico y comparativo

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella en GitHub!**