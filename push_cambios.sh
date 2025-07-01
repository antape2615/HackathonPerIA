#!/bin/bash

# === Auto-generado ===
USERNAME="AngieTatiana"
RAMA="feature-$USERNAME"

echo "📝 Agregando archivos..."
git add . || { echo "❌ Falló git add"; exit 1; }

echo "💬 Haciendo commit..."
git commit -m "Terminación de prueba - $USERNAME" || { echo "❌ Falló el commit (¿quizás no hay cambios?)"; exit 1; }

echo "📤 Haciendo push a origin/$RAMA..."
git push --set-upstream origin "$RAMA" || { echo "❌ Falló el push"; exit 1; }

echo "✅ Cambios enviados correctamente."
