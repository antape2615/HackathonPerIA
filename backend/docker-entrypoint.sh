#!/bin/sh
set -e

echo "🚀 Starting backend..."

echo "⏳ Waiting 15s for PostgreSQL..."
sleep 15

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🔄 Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seed failed"

echo "✅ Setup complete!"
echo "🚀 Starting NestJS application..."

# Verificar que el archivo existe
if [ ! -f "dist/src/main.js" ]; then
  echo "❌ dist/src/main.js not found!"
  echo "Files in dist:"
  ls -la dist/
  ls -la dist/src/ || echo "dist/src/ not found"
  exit 1
fi

exec node dist/src/main.js  # ← CAMBIAR aquí también