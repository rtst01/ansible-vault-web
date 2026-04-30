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

## Сборка образов и push в registry

Для деплоя в k8s нужно собрать образы и залить в свой container registry.

```bash
# Переменные
REGISTRY=registry.mycompany.com   # или ghcr.io/username, docker.io/username
TAG=v1.0.0

# Backend
docker build -t $REGISTRY/ansible-vault-backend:$TAG .
docker push $REGISTRY/ansible-vault-backend:$TAG

# Frontend
docker build -t $REGISTRY/ansible-vault-frontend:$TAG ./frontend
docker push $REGISTRY/ansible-vault-frontend:$TAG
```

Если registry приватный, создайте secret в k8s:

```bash
kubectl create secret docker-registry registry-secret \
  --docker-server=$REGISTRY \
  --docker-username=USER \
  --docker-password=PASSWORD
```

И укажите при установке helm:

```bash
helm install vault ./helm/ansible-vault \
  --set backend.image.repository=$REGISTRY/ansible-vault-backend \
  --set backend.image.tag=$TAG \
  --set frontend.image.repository=$REGISTRY/ansible-vault-frontend \
  --set frontend.image.tag=$TAG \
  --set imagePullSecrets[0].name=registry-secret
```

## Kubernetes (Helm)

В `helm/ansible-vault/` лежит Helm-чарт. Установка:

```bash
helm install vault ./helm/ansible-vault \
  --set ingress.host=vault.mycompany.com \
  --set backend.image.repository=registry.mycompany.com/ansible-vault-backend \
  --set frontend.image.repository=registry.mycompany.com/ansible-vault-frontend
```

Без TLS:
```bash
helm install vault ./helm/ansible-vault \
  --set ingress.host=vault.local \
  --set ingress.tls.enabled=false
```

Обновление:
```bash
helm upgrade vault ./helm/ansible-vault --set backend.image.tag=v1.1.0
```

Основные параметры (`values.yaml`):

| Параметр | По умолчанию | Описание |
|---|---|---|
| `backend.replicas` | 2 | Реплики backend |
| `frontend.replicas` | 2 | Реплики frontend |
| `ingress.host` | `ansible-vault.example.com` | Домен |
| `ingress.tls.enabled` | true | TLS через cert-manager |
| `ingress.tls.clusterIssuer` | `letsencrypt-prod` | ClusterIssuer |
| `backend.env.LOG_LEVEL` | WARNING | Уровень логов |

CORS `ALLOWED_ORIGINS` генерируется автоматически из `ingress.host`.

### Без Helm (plain manifests)

Старые манифесты остались в `k8s/`:

```bash
kubectl apply -f k8s/
```

Но Helm удобнее — параметризация, upgrade, rollback.

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
