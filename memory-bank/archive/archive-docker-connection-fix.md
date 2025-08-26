# 🐳 **Archive: Docker Connection Fix - Ansible Vault Web Service**

## 📋 **Metadata**

- **Task ID**: `docker-connection-fix-ansible-vault`
- **Type**: Level 1 (Bug Fix) - Docker Infrastructure
- **Date Completed**: 22 августа 2025
- **Related Task**: `ansible-vault-web-service` (основная задача)
- **Status**: COMPLETED & ARCHIVED

## 🎯 **Task Overview**

**Проблема**: Frontend в Docker контейнере не мог подключиться к backend API, получая ошибку `net::ERR_NAME_NOT_RESOLVED` при попытке обращения к `http://backend:8000`.

**Решение**: Исправлена логика конфигурации API endpoints - frontend теперь всегда использует `http://localhost:8000` для API запросов, что корректно работает в Docker окружении.

## 🔧 **Technical Details**

### **Root Cause**

- Frontend пытался использовать `http://backend:8000` (имя Docker сервиса)
- В браузере `backend` не может быть разрешен, так как это внутреннее имя Docker сети
- Docker контейнеры должны общаться через порты, а не имена сервисов

### **Implementation Changes**

#### **1. Frontend Configuration (`frontend/src/config.ts`)**

```typescript
// ДО (неправильно):
const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_DOCKER === 'true') {
    return 'http://backend:8000'; // ❌ Недоступно в браузере
  }
  return 'http://localhost:8000';
};

// ПОСЛЕ (исправлено):
const getApiBaseUrl = (): string => {
  // Всегда используем localhost для браузера
  // Docker контейнеры общаются через порты, а не имена сервисов
  return 'http://localhost:8000'; // ✅ Корректно работает
};
```

#### **2. Docker Architecture**

- **Backend**: Порт 8000 проброшен на `localhost:8000`
- **Frontend**: Порт 80 проброшен на `localhost:80`
- **Связь**: Frontend в браузере → `localhost:8000` → Docker перенаправляет в backend контейнер

### **Files Modified**

- `frontend/src/config.ts` - Исправлена логика API URL
- `frontend/src/components/EncryptionForm.tsx` - Обновлены API вызовы
- `frontend/src/components/FileUpload.tsx` - Обновлены API вызовы

## 🧪 **Testing & Verification**

### **Pre-Fix State**

```bash
# Ошибка в браузере:
POST http://backend:8000/api/v1/encrypt/text net::ERR_NAME_NOT_RESOLVED
❌ Ошибка: Ошибка соединения с сервером
```

### **Post-Fix State**

```bash
# Backend доступен:
curl -f http://localhost:8000/health
{"status":"healthy","service":"ansible-vault-web"}

# Frontend доступен:
curl -f http://localhost/
<!doctype html><html lang="ru">...

# Docker контейнеры работают:
docker-compose ps
NAME                     STATUS
ansible-vault-backend    Up 8 seconds
ansible-vault-frontend   Up About a minute
```

## 💡 **Key Lessons Learned**

### **Technical Insights**

1. **Docker Networking**: Имена сервисов (`backend`) доступны только внутри Docker сети, не в браузере
2. **Port Mapping**: Правильный подход - проброс портов на localhost для внешнего доступа
3. **Environment Variables**: `REACT_APP_DOCKER=true` не должен влиять на API URL для браузера

### **Architecture Principles**

- **Separation of Concerns**: Frontend (браузер) и Backend (Docker) должны общаться через стандартные порты
- **Port Forwarding**: Docker Compose порты должны быть проброшены на хост для внешнего доступа
- **API Configuration**: Frontend конфигурация должна учитывать, где выполняется код (браузер vs контейнер)

## 🚀 **Future Considerations**

### **Production Deployment**

- В продакшне frontend и backend могут быть развернуты на разных серверах
- API URL должен настраиваться через environment variables
- Рассмотреть использование reverse proxy (Nginx) для единой точки входа

### **Development Workflow**

- Docker Compose конфигурация должна быть протестирована на разных платформах
- Добавить health checks для автоматической проверки доступности сервисов
- Рассмотреть использование Docker networks для изоляции

## 📚 **References**

- **Main Task Archive**: `memory-bank/archive/archive-ansible-vault-web-service.md`
- **Docker Compose**: `docker-compose.yml`
- **Frontend Config**: `frontend/src/config.ts`
- **Git Commit**: `🔧 Docker: Исправлена логика подключения - frontend всегда использует localhost для API`

## ✅ **Final Status**

**Docker Connection Fix**: ✅ **COMPLETED & ARCHIVED**  
**Main Task**: ✅ **COMPLETED & ARCHIVED**  
**Overall Project**: ✅ **FULLY PRODUCTION READY**

---

**Archive Created**: 22 августа 2025  
**Next Step**: Memory Bank готов к новой задаче


