# Makefile для Ansible Vault Web Service
.PHONY: help build build-backend build-frontend clean test docker-build docker-run docker-stop k8s-deploy k8s-delete

# Переменные
VERSION ?= latest
REGISTRY ?= localhost:5000
NAMESPACE ?= ansible-vault

# Цвета для вывода
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Показать справку
	@echo "$(GREEN)Доступные команды:$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Сборка
build: ## Собрать все компоненты
	@echo "$(GREEN)🔧 Собираем все компоненты...$(NC)"
	@chmod +x scripts/build.sh
	@./scripts/build.sh $(VERSION) $(REGISTRY)

build-backend: ## Собрать только backend
	@echo "$(GREEN)🔧 Собираем backend...$(NC)"
	docker build -t ansible-vault-backend:$(VERSION) .

build-frontend: ## Собрать только frontend
	@echo "$(GREEN)🔧 Собираем frontend...$(NC)"
	docker build -t ansible-vault-frontend:$(VERSION) ./frontend

# Очистка
clean: ## Очистить Docker образы и контейнеры
	@echo "$(GREEN)🧹 Очищаем Docker...$(NC)"
	docker system prune -f
	docker image prune -f

# Тестирование
test: ## Запустить тесты
	@echo "$(GREEN)🧪 Запускаем тесты...$(NC)"
	cd app && python -m pytest tests/ -v

# Docker
docker-build: ## Собрать Docker образы
	@echo "$(GREEN)🐳 Собираем Docker образы...$(NC)"
	@chmod +x scripts/build.sh
	@./scripts/build.sh $(VERSION) $(REGISTRY)

docker-run: ## Запустить с Docker Compose
	@echo "$(GREEN)🚀 Запускаем с Docker Compose...$(NC)"
	docker-compose up -d

docker-stop: ## Остановить Docker Compose
	@echo "$(GREEN)⏹️ Останавливаем Docker Compose...$(NC)"
	docker-compose down

# Kubernetes
k8s-deploy: ## Развернуть в Kubernetes
	@echo "$(GREEN)🚀 Развертываем в Kubernetes...$(NC)"
	@chmod +x scripts/deploy-k8s.sh
	@./scripts/deploy-k8s.sh

k8s-delete: ## Удалить из Kubernetes
	@echo "$(GREEN)🗑️ Удаляем из Kubernetes...$(NC)"
	kubectl delete namespace $(NAMESPACE)

k8s-logs: ## Показать логи Kubernetes
	@echo "$(GREEN)📋 Показываем логи...$(NC)"
	kubectl logs -f deployment/ansible-vault-backend -n $(NAMESPACE)

k8s-status: ## Показать статус Kubernetes
	@echo "$(GREEN)📊 Статус развертывания...$(NC)"
	kubectl get all -n $(NAMESPACE)

# Разработка
dev-backend: ## Запустить backend в режиме разработки
	@echo "$(GREEN)🔧 Запускаем backend в режиме разработки...$(NC)"
	cd app && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Запустить frontend в режиме разработки
	@echo "$(GREEN)🔧 Запускаем frontend в режиме разработки...$(NC)"
	cd frontend && npm start

# Утилиты
logs: ## Показать логи Docker Compose
	@echo "$(GREEN)📋 Показываем логи...$(NC)"
	docker-compose logs -f

ps: ## Показать статус Docker Compose
	@echo "$(GREEN)📊 Статус сервисов...$(NC)"
	docker-compose ps

# Продакшн
prod-build: ## Сборка для продакшна
	@echo "$(GREEN)🏭 Сборка для продакшна...$(NC)"
	VERSION=$(VERSION) make build
	@echo "$(GREEN)✅ Сборка завершена!$(NC)"

prod-deploy: ## Развертывание в продакшн
	@echo "$(GREEN)🚀 Развертывание в продакшн...$(NC)"
	make k8s-deploy
	@echo "$(GREEN)✅ Развертывание завершено!$(NC)"
