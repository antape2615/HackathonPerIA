#!/bin/bash

# === Auto-generado ===
REPO_URL="https://github.com/antape2615/HackathonPerIA.git"
RAMA="feature-AngieTatiana"

echo "🔧 Inicializando repositorio Git..."
git init || { echo "❌ Falló git init"; exit 1; }

echo "🔀 Cambiando a rama '$RAMA'..."
git checkout -b "$RAMA" || { echo "❌ Falló crear la rama"; exit 1; }

echo "🌍 Agregando remoto 'origin'..."
git remote add origin "$REPO_URL" || { echo "❌ Falló agregar el remoto"; exit 1; }

echo "✅ Listo. Puedes hacer push con:"
echo ""
echo "   git add ."
echo "   git commit -m 'Tu mensaje'"
echo "   git push --set-upstream origin $RAMA"
