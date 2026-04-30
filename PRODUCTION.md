# Деплой

## Docker Compose

Самый простой способ — все поднимается одной командой:

```bash
docker compose up -d
```

Будет два контейнера:
- `ansible-vault-frontend` — nginx на порту 80, отдает SPA и проксирует `/api/` на backend
- `ansible-vault-backend` — uvicorn на порту 8000 (наружу не проброшен)

Логи backend пишутся в `./logs/`.

### Пересборка после изменений

```bash
docker compose up -d --build
```

### Посмотреть логи

```bash
docker compose logs -f
docker compose logs backend
```

### Healthcheck

Backend: `GET /health` — возвращает `{"status": "healthy"}`.
Frontend: nginx отдает SPA на `/`.

Оба контейнера имеют healthcheck в docker-compose.yml.

## Kubernetes

В `k8s/` лежат готовые манифесты:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

Перед деплоем обновите `k8s/secret.yaml` и `k8s/configmap.yaml` под свое окружение.
Для ingress нужен nginx-ingress-controller.

## Конфигурация

Через переменные окружения backend-контейнера:

- `ENVIRONMENT=production` — отключает Swagger UI
- `LOG_LEVEL=WARNING` — уровень логов
- `ALLOWED_ORIGINS=http://yourdomain.com` — разрешенные origins для CORS

## Nginx

Конфиг frontend-контейнера — `frontend/nginx.conf`. Там настроены:
- Проксирование `/api/` на `http://backend:8000`
- Gzip-сжатие
- Кеширование статики (1 год для js/css/img)
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- SPA fallback (`try_files ... /index.html`)
