#!/bin/bash

# Verificar si git ya está inicializado
if [ -d ".git" ]; then
    echo "Git ya está inicializado."
else
    echo "Inicializando Git..."
    git init
    echo "Git inicializado."
fi

# Agregar todos los archivos
echo "Agregando archivos..."
git add .

# Realizar el commit inicial si hay cambios
if git diff-index --quiet HEAD --; then
    echo "No hay cambios para commitear."
else
    echo "Realizando commit inicial..."
    git commit -m "Initial commit"
fi

# Renombrar la rama a main
echo "Renombrando rama a main..."
git branch -M main

echo "Listo! Git ha sido inicializado y se ha realizado el primer commit."
