#!/bin/bash

# Скрипт для сборки Docker образов
set -e

echo "🚀 Начинаем сборку Docker образов..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    error "Docker не установлен. Установите Docker и попробуйте снова."
fi

# Проверяем, что Docker daemon запущен
if ! docker info &> /dev/null; then
    error "Docker daemon не запущен. Запустите Docker и попробуйте снова."
fi

# Версия для тегов
VERSION=${1:-latest}
REGISTRY=${2:-localhost:5000}

log "Сборка версии: $VERSION"
log "Registry: $REGISTRY"

# Сборка backend
log "🔧 Собираем backend образ..."
docker build -t ansible-vault-backend:$VERSION .
if [ $? -eq 0 ]; then
    log "✅ Backend образ собран успешно"
else
    error "❌ Ошибка сборки backend образа"
fi

# Сборка frontend
log "🔧 Собираем frontend образ..."
docker build -t ansible-vault-frontend:$VERSION ./frontend
if [ $? -eq 0 ]; then
    log "✅ Frontend образ собран успешно"
else
    error "❌ Ошибка сборки frontend образа"
fi

# Тегирование для registry (если указан)
if [ "$REGISTRY" != "localhost:5000" ]; then
    log "🏷️ Тегируем образы для registry..."
    docker tag ansible-vault-backend:$VERSION $REGISTRY/ansible-vault-backend:$VERSION
    docker tag ansible-vault-frontend:$VERSION $REGISTRY/ansible-vault-frontend:$VERSION
fi

# Вывод информации о собранных образах
log "📋 Собранные образы:"
docker images | grep ansible-vault

log "🎉 Сборка завершена успешно!"
log "Для запуска используйте: docker-compose up -d"
