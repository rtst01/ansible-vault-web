.PHONY: help up down build logs ps dev-backend dev-frontend k8s-deploy k8s-delete k8s-status k8s-logs clean

NAMESPACE ?= ansible-vault

help: ## Справка
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Docker Compose
up: ## Запустить контейнеры
	docker compose up -d

down: ## Остановить контейнеры
	docker compose down

build: ## Пересобрать и запустить
	docker compose up -d --build

logs: ## Логи (follow)
	docker compose logs -f

ps: ## Статус контейнеров
	docker compose ps

# Разработка
dev-backend: ## Backend dev-сервер
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Frontend dev-сервер
	cd frontend && npm start

# Kubernetes
k8s-deploy: ## Задеплоить в k8s
	kubectl apply -f k8s/

k8s-delete: ## Удалить из k8s
	kubectl delete namespace $(NAMESPACE)

k8s-status: ## Статус в k8s
	kubectl get all -n $(NAMESPACE)

k8s-logs: ## Логи backend в k8s
	kubectl logs -f deployment/ansible-vault-backend -n $(NAMESPACE)

# Утилиты
clean: ## Почистить docker-мусор
	docker system prune -f
