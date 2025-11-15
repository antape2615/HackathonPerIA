#!/bin/bash

# Script para generar los módulos del backend con NestJS CLI
# Ejecutar desde el directorio backend/

echo "🚀 Generando módulos del backend..."

# Instalar NestJS CLI si no está instalado
npm list -g @nestjs/cli || npm install -g @nestjs/cli

echo "📦 Generando módulo de Auth..."
nest g module modules/auth --no-spec
nest g controller modules/auth --no-spec
nest g service modules/auth --no-spec

echo "📦 Generando módulo de Users..."
nest g module modules/users --no-spec
nest g controller modules/users --no-spec
nest g service modules/users --no-spec

echo "📦 Generando módulo de Tests..."
nest g module modules/tests --no-spec
nest g controller modules/tests --no-spec
nest g service modules/tests --no-spec

echo "📦 Generando módulo de Evaluations..."
nest g module modules/evaluations --no-spec
nest g controller modules/evaluations --no-spec
nest g service modules/evaluations --no-spec

echo "📦 Generando módulo de AI..."
nest g module modules/ai --no-spec
nest g service modules/ai --no-spec

echo "📦 Generando módulo de Code Execution..."
nest g module modules/code-execution --no-spec
nest g service modules/code-execution --no-spec

echo "📦 Generando módulo de Analytics..."
nest g module modules/analytics --no-spec
nest g controller modules/analytics --no-spec
nest g service modules/analytics --no-spec

echo "✅ Módulos generados exitosamente!"
echo "📝 Ahora puedes implementar la lógica de negocio en cada servicio y controlador"
