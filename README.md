# Ansible Vault Web Service

Веб-сервис для шифрования и расшифровки файлов и текста с использованием современных криптографических алгоритмов.

## 🚀 Возможности

- **�� Шифрование текста**: Безопасное шифрование текстовых данных
- **📁 Шифрование файлов**: Поддержка множества форматов файлов
- **🔓 Расшифровка**: Расшифровка зашифрованных данных
- **🛡️ Безопасность**: Надежные алгоритмы шифрования
- **💻 Современный UI**: Интуитивный веб-интерфейс

## 🏗️ Архитектура

### Backend (FastAPI)
- **Framework**: FastAPI (Python 3.12+)
- **Encryption**: Cryptography library
- **API**: RESTful API с OpenAPI документацией
- **Security**: Валидация паролей и файлов

### Frontend (React)
- **Framework**: React 18 + TypeScript
- **Styling**: Custom CSS с responsive дизайном
- **Features**: Drag & drop для файлов, табы для разных операций

## 🚀 Быстрый старт

### Backend
```bash
# Установка зависимостей
poetry install

# Запуск сервера
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm start

# Production сборка
npm run build
```

## 📚 API Endpoints

- `POST /api/v1/encrypt/text` - Шифрование текста
- `POST /api/v1/decrypt/text` - Расшифровка текста
- `POST /api/v1/encrypt/file` - Шифрование файла
- `POST /api/v1/decrypt/file` - Расшифровка файла
- `GET /docs` - Swagger UI документация

## 🔒 Безопасность

- Валидация паролей (минимум 8 символов, сложность)
- Ограничение размера файлов (10MB)
- Проверка типов файлов
- Безопасная передача данных

## 🧪 Тестирование

```bash
# Backend API
curl -X POST "http://localhost:8000/api/v1/encrypt/text" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World", "password": "TestPass123"}'

# Frontend
open http://localhost:3000
```

## �� Структура проекта

```
my_vault/
├── app/                    # Backend FastAPI
│   ├── api/               # API endpoints
│   ├── core/              # Core services
│   ├── schemas/           # Pydantic models
│   └── main.py            # Main application
├── frontend/              # React frontend
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   └── package.json       # Dependencies
└── memory-bank/           # Project documentation
```

## 🎯 Статус проекта

✅ **Backend API**: Полностью реализован и протестирован
✅ **Frontend UI**: Полностью реализован и собран
✅ **Интеграция**: Протестирована между frontend и backend
✅ **Документация**: API документация доступна по адресу `/docs`

## 🔄 Следующие шаги

- [ ] Добавление аутентификации
- [ ] Поддержка дополнительных алгоритмов шифрования
- [ ] Логирование операций
- [ ] Мониторинг производительности
- [ ] Docker контейнеризация

## 📄 Лицензия

MIT License
