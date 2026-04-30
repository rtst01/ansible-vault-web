# Ansible Vault Web

Веб-интерфейс для шифрования/расшифровки через Ansible Vault. Под капотом настоящий `ansible-vault` (AES256), не браузерная криптография.

## Стек

- **Backend** — Python 3.11, FastAPI, ansible (библиотека)
- **Frontend** — React 18, TypeScript, CSS (dark theme)
- **Прод** — Docker Compose: nginx (frontend) + uvicorn (backend)

## Запуск

### Docker (рекомендуется)

```bash
docker compose up -d
```

Откроется на http://localhost (порт 80). Backend доступен только внутри docker-сети, наружу не торчит.

### Локально (для разработки)

Backend:
```bash
poetry install
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm start
```

Frontend dev-сервер — http://localhost:3000, API — http://localhost:8000.
Swagger UI доступен только в dev-режиме: http://localhost:8000/docs.

## Что умеет

- Шифрование и расшифровка текста через `ansible-vault`
- Шифрование и расшифровка файлов (до 10MB)
- Автоопределение режима — вставил vault-текст, автоматически переключится на расшифровку
- Шаблоны (K8s Secret, Docker Compose, .env, Ansible vars и т.д.)
- Diff-просмотр — сравнение до/после
- Drag & drop файлов
- Горячие клавиши (Ctrl+E/D/K/O, Ctrl+Shift+C, Ctrl+/, ?)
- Двуязычный интерфейс EN/RU (переключатель в topbar, язык сохраняется)

## API

```
POST /api/v1/encrypt/text     — шифрование текста
POST /api/v1/decrypt/text     — расшифровка текста
POST /api/v1/encrypt/file     — шифрование файла
POST /api/v1/decrypt/file     — расшифровка файла
GET  /health                  — healthcheck
```

Пример:
```bash
curl -X POST http://localhost/api/v1/encrypt/text \
  -H "Content-Type: application/json" \
  -d '{"text": "secret: pa$$w0rd", "password": "mypassword1"}'
```

## Структура

```
├── app/                    # FastAPI backend
│   ├── api/
│   │   ├── encryption.py   # encrypt/decrypt endpoints
│   │   └── files.py        # file upload/download
│   ├── core/
│   │   ├── vault.py        # обертка над ansible-vault
│   │   └── security.py     # валидация, санитизация
│   ├── schemas/            # Pydantic-модели
│   └── main.py
├── frontend/               # React SPA
│   ├── src/
│   │   ├── App.tsx         # основной компонент
│   │   ├── i18n.tsx        # локализация EN/RU
│   │   ├── components/     # Editor, DiffView, HelpModal, ...
│   │   ├── utils/          # подсветка синтаксиса, diff
│   │   └── data/           # шаблоны
│   ├── nginx.conf          # конфиг nginx для прода
│   └── Dockerfile
├── docker-compose.yml
├── Dockerfile              # backend image
└── pyproject.toml
```

## Переменные окружения (backend)

| Переменная | Что делает | По умолчанию |
|---|---|---|
| `ENVIRONMENT` | `production` — отключает Swagger | `development` |
| `LOG_LEVEL` | уровень логов | `WARNING` (прод) |
| `ALLOWED_ORIGINS` | CORS origins через запятую | `http://localhost,http://localhost:80,http://localhost:3000` |

## Безопасность

- Пароль >= 8 символов, макс 128
- Файлы до 10MB, проверка расширений
- Защита от path traversal
- CSP, X-Frame-Options, X-Content-Type-Options в nginx
- В проде Swagger/ReDoc отключен, ошибки не утекают наружу
- Контейнеры работают от непривилегированных пользователей

## Лицензия

MIT
