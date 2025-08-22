from pydantic import BaseModel, Field
from typing import Optional

class TextEncryptRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Текст для шифрования")
    password: str = Field(..., min_length=8, description="Пароль для шифрования")
    algorithm: str = Field(default="ansible-vault", description="Алгоритм шифрования")

class TextEncryptResponse(BaseModel):
    encrypted_text: str = Field(..., description="Зашифрованный текст")
    algorithm: str = Field(..., description="Использованный алгоритм")
    success: bool = Field(..., description="Статус операции")

class TextDecryptRequest(BaseModel):
    encrypted_text: str = Field(..., description="Зашифрованный текст")
    password: str = Field(..., min_length=8, description="Пароль для расшифровки")

class TextDecryptResponse(BaseModel):
    decrypted_text: str = Field(..., description="Расшифрованный текст")
    success: bool = Field(..., description="Статус операции")

class FileEncryptRequest(BaseModel):
    password: str = Field(..., min_length=8, description="Пароль для шифрования")
    algorithm: str = Field(default="ansible-vault", description="Алгоритм шифрования")

class FileEncryptResponse(BaseModel):
    filename: str = Field(..., description="Имя зашифрованного файла")
    algorithm: str = Field(..., description="Использованный алгоритм")
    success: bool = Field(..., description="Статус операции")
    download_url: str = Field(..., description="URL для скачивания")

class FileDecryptRequest(BaseModel):
    password: str = Field(..., min_length=8, description="Пароль для расшифровки")

class FileDecryptResponse(BaseModel):
    filename: str = Field(..., description="Имя расшифрованного файла")
    success: bool = Field(..., description="Статус операции")
    download_url: str = Field(..., description="URL для скачивания")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Описание ошибки")
    code: str = Field(..., description="Код ошибки")
    details: Optional[dict] = Field(default=None, description="Дополнительные детали")
