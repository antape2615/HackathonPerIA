#!/bin/bash

# Script para crear todos los módulos del backend

echo "🚀 Creando módulos..."

# Auth Module
nest g module modules/auth
nest g service modules/auth
nest g controller modules/auth

# Users Module
nest g module modules/users
nest g service modules/users
nest g controller modules/users

# Tests Module
nest g module modules/tests
nest g service modules/tests
nest g controller modules/tests

# Evaluations Module
nest g module modules/evaluations
nest g service modules/evaluations
nest g controller modules/evaluations

# AI Module
nest g module modules/ai
nest g service modules/ai

# Code Execution Module
nest g module modules/code-execution
nest g service modules/code-execution

# Analytics Module
nest g module modules/analytics
nest g service modules/analytics
nest g controller modules/analytics

echo "✅ Módulos creados exitosamente!"