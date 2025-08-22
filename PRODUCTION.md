# 🚀 Продакшн развертывание Ansible Vault Web Service

## 📋 Обзор

Этот документ описывает процесс развертывания Ansible Vault Web Service в продакшн среде с использованием Docker и Kubernetes.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Nginx)       │◄──►│   (FastAPI)     │
│   Port 80       │    │   Port 8000     │
└─────────────────┘    └─────────────────┘
```

## 🐳 Docker развертывание

### Быстрый старт

```bash
# Сборка образов
make docker-build

# Запуск сервисов
make docker-run

# Проверка статуса
make ps

# Просмотр логов
make logs
```

### Ручная сборка

```bash
# Backend
docker build -t ansible-vault-backend:latest .

# Frontend
docker build -t ansible-vault-frontend:latest ./frontend

# Запуск
docker-compose up -d
```

## ☸️ Kubernetes развертывание

### Предварительные требования

- Kubernetes кластер (1.20+)
- kubectl настроен
- nginx-ingress-controller
- cert-manager (для SSL)

### Развертывание

```bash
# Автоматическое развертывание
make k8s-deploy

# Ручное развертывание
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

### Проверка статуса

```bash
# Статус развертывания
make k8s-status

# Логи backend
make k8s-logs

# Удаление
make k8s-delete
```

## 🔧 Конфигурация

### Environment Variables

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `ENVIRONMENT` | Окружение | `production` |
| `LOG_LEVEL` | Уровень логирования | `INFO` |
| `CORS_ORIGINS` | CORS origins | `*` |
| `MAX_FILE_SIZE` | Максимальный размер файла | `10485760` (10MB) |
| `RATE_LIMIT` | Лимит запросов | `100` |
| `RATE_LIMIT_WINDOW` | Окно лимита (сек) | `3600` |

### Secrets

Обновите `k8s/secret.yaml` с реальными значениями:

```bash
# Генерация секретов
echo -n "your-secret-key" | base64
echo -n "your-jwt-secret" | base64
```

## 📊 Мониторинг

### Health Checks

- **Backend**: `GET /health`
- **Frontend**: `GET /`

### Метрики

```bash
# Проверка готовности
kubectl get pods -n ansible-vault

# Логи
kubectl logs -f deployment/ansible-vault-backend -n ansible-vault
```

## 🔒 Безопасность

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ansible-vault-network-policy
  namespace: ansible-vault
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8000
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 53
```

### RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ServiceAccount
metadata:
  name: ansible-vault-sa
  namespace: ansible-vault
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ansible-vault-role
  namespace: ansible-vault
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
```

## 🚀 CI/CD

### GitHub Actions

```yaml
name: Deploy to Production
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build and push
      run: |
        make prod-build VERSION=${{ github.ref_name }}
    - name: Deploy to K8s
      run: |
        make prod-deploy
```

## 📝 Логирование

### Структурированные логи

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "ansible-vault-backend",
  "message": "Request processed",
  "request_id": "uuid",
  "user_id": "user123",
  "duration_ms": 150
}
```

### Централизованное логирование

```yaml
# Fluentd/Fluent Bit конфигурация
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: ansible-vault
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
    </source>
```

## 🔄 Обновления

### Rolling Update

```bash
# Обновление backend
kubectl set image deployment/ansible-vault-backend \
  backend=ansible-vault-backend:v2.0.0 \
  -n ansible-vault

# Проверка статуса
kubectl rollout status deployment/ansible-vault-backend -n ansible-vault
```

### Blue-Green Deployment

```bash
# Создание нового deployment
kubectl apply -f k8s/backend-deployment-v2.yaml

# Переключение трафика
kubectl patch service ansible-vault-backend-service \
  -p '{"spec":{"selector":{"version":"v2"}}}'
```

## 🆘 Troubleshooting

### Частые проблемы

1. **Поды не запускаются**
   ```bash
   kubectl describe pod <pod-name> -n ansible-vault
   kubectl logs <pod-name> -n ansible-vault
   ```

2. **Сервис недоступен**
   ```bash
   kubectl get endpoints -n ansible-vault
   kubectl describe service <service-name> -n ansible-vault
   ```

3. **Ingress не работает**
   ```bash
   kubectl get ingress -n ansible-vault
   kubectl describe ingress <ingress-name> -n ansible-vault
   ```

### Полезные команды

```bash
# Проверка ресурсов
kubectl top pods -n ansible-vault

# Описание ресурса
kubectl describe <resource-type> <name> -n ansible-vault

# Порт-форвардинг для отладки
kubectl port-forward service/ansible-vault-backend-service 8000:8000 -n ansible-vault
```

## 📚 Дополнительные ресурсы

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
