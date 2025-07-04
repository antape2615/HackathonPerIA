#!/bin/bash

# === Auto-generado ===
USERNAME="Pruebapc10"
RAMA="feature-$USERNAME"

echo "📝 Agregando archivos..." | tee -a log.txt
git add . 2>&1 | tee -a log.txt || { echo "❌ Falló git add" | tee -a log.txt; exit 1; }

echo "💬 Haciendo commit..." | tee -a log.txt
git commit -m "Terminación de prueba - $USERNAME" --no-verify 2>&1 | tee -a log.txt || { echo "❌ Falló el commit (¿quizás no hay cambios?)" | tee -a log.txt; exit 1; }

echo "📝 Actualizando rama..." | tee -a log.txt
git pull --rebase origin "$RAMA" 2>&1 | tee -a log.txt || { echo "❌ Falló git pull" | tee -a log.txt; exit 1; }

echo "📤 Haciendo push a origin/$RAMA..." | tee -a log.txt
git push --set-upstream origin "$RAMA" --no-verify 2>&1 | tee -a log.txt || { echo "❌ Falló el push" | tee -a log.txt; exit 1; }

echo "✅ Cambios enviados correctamente." | tee -a log.txt
