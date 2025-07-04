#!/bin/bash

                    # === Auto-generado ===
                    REPO_URL="https://github.com/antape2615/HackathonPerIA.git"
                    RAMA="feature-Pruebapc13"

                    echo "🔧 Inicializando repositorio Git..."
                    git init || { echo "❌ Falló git init"; exit 1; }

                    echo "🌍 Agregando remoto 'origin'..."
                    git remote add origin "$REPO_URL" || { echo "❌ Falló agregar el remoto"; exit 1; }

                    echo "📥 Descargando ramas remotas..."
                    git fetch origin || { echo "❌ Falló git fetch"; exit 1; }

                    echo "🔀 Cambiando a rama '$RAMA'..."
                    git checkout "$RAMA" || git checkout -b "$RAMA" --track origin/"$RAMA" || { echo "❌ Falló cambiar a la rama remota"; exit 1; }

                    echo "✅ Repositorio inicializado y rama '$RAMA' lista para trabajar."
                    echo ""
                    echo "   git add ."
                    echo "   git commit -m 'Tu mensaje'"
                    echo "   git push"
                    