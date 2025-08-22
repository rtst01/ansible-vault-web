#!/bin/bash

# Скрипт для развертывания в Kubernetes
set -e

echo "🚀 Начинаем развертывание в Kubernetes..."

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

# Проверяем наличие kubectl
if ! command -v kubectl &> /dev/null; then
    error "kubectl не установлен. Установите kubectl и попробуйте снова."
fi

# Проверяем подключение к кластеру
if ! kubectl cluster-info &> /dev/null; then
    error "Не удается подключиться к Kubernetes кластеру. Проверьте конфигурацию."
fi

# Проверяем наличие namespace
NAMESPACE="ansible-vault"
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    log "📦 Создаем namespace $NAMESPACE..."
    kubectl apply -f k8s/namespace.yaml
else
    log "✅ Namespace $NAMESPACE уже существует"
fi

# Применяем ConfigMap и Secret
log "🔧 Применяем ConfigMap и Secret..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Применяем Deployments
log "🚀 Развертываем backend..."
kubectl apply -f k8s/backend-deployment.yaml

log "🚀 Развертываем frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

# Применяем Services
log "🔌 Создаем Services..."
kubectl apply -f k8s/services.yaml

# Применяем Ingress (если настроен)
if [ -f "k8s/ingress.yaml" ]; then
    log "🌐 Настраиваем Ingress..."
    kubectl apply -f k8s/ingress.yaml
fi

# Ждем готовности подов
log "⏳ Ожидаем готовности подов..."
kubectl wait --for=condition=ready pod -l app=ansible-vault-backend -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=ansible-vault-frontend -n $NAMESPACE --timeout=300s

# Проверяем статус
log "📊 Статус развертывания:"
kubectl get all -n $NAMESPACE

log "🎉 Развертывание завершено успешно!"
log "Для проверки логов используйте: kubectl logs -f deployment/ansible-vault-backend -n $NAMESPACE"
