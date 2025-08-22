from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.api import encryption, files

app = FastAPI(
    title="Ansible Vault Web Service",
    description="Веб-сервис для шифрования и расшифровки файлов и текста с использованием Ansible Vault",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене ограничить конкретными доменами
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(encryption.router)
app.include_router(files.router)

@app.get("/")
async def root():
    """Главная страница"""
    return {
        "message": "Ansible Vault Web Service",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "text_encryption": "/api/v1/encrypt/text",
            "text_decryption": "/api/v1/decrypt/text",
            "file_encryption": "/api/v1/encrypt/file",
            "file_decryption": "/api/v1/decrypt/file",
            "file_management": "/api/v1/files"
        }
    }

@app.get("/health")
async def health():
    """Проверка состояния сервиса"""
    return {"status": "healthy", "service": "ansible-vault-web"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Глобальный обработчик исключений"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Внутренняя ошибка сервера",
            "detail": str(exc),
            "type": type(exc).__name__
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
