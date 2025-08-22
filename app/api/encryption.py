from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import FileResponse
import tempfile
import os
from typing import Optional

from app.schemas.encryption import (
    TextEncryptRequest, TextEncryptResponse, TextDecryptRequest, TextDecryptResponse,
    FileEncryptRequest, FileEncryptResponse, FileDecryptRequest, FileDecryptResponse,
    ErrorResponse
)
from app.core.vault import vault_service
from app.core.security import security_validator

router = APIRouter(prefix="/api/v1", tags=["encryption"])

@router.post("/encrypt/text", response_model=TextEncryptResponse)
async def encrypt_text(request: TextEncryptRequest):
    """Шифрует текст с помощью Ansible Vault"""
    try:
        # Валидируем пароль
        is_valid, message = security_validator.validate_password(request.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Шифруем текст
        encrypted_text = vault_service.encrypt_text(request.text, request.password)
        
        return TextEncryptResponse(
            encrypted_text=encrypted_text,
            algorithm=request.algorithm,
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt/text", response_model=TextDecryptResponse)
async def decrypt_text(request: TextDecryptRequest):
    """Расшифровывает текст с помощью Ansible Vault"""
    try:
        # Валидируем пароль
        is_valid, message = security_validator.validate_password(request.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Расшифровываем текст
        decrypted_text = vault_service.decrypt_text(request.encrypted_text, request.password)
        
        return TextDecryptResponse(
            decrypted_text=decrypted_text,
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/encrypt/file", response_model=FileEncryptResponse)
async def encrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    algorithm: str = Form(default="ansible-vault")
):
    """Шифрует файл с помощью Ansible Vault"""
    try:
        # Валидируем файл
        is_valid, message = security_validator.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Валидируем пароль
        is_valid, message = security_validator.validate_password(password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Создаем временный файл для загрузки
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Шифруем файл
            encrypted_file_path, encrypted_filename = vault_service.encrypt_file(
                temp_file_path, password
            )
            
            # Возвращаем зашифрованный файл
            return FileResponse(
                path=encrypted_file_path,
                filename=encrypted_filename,
                media_type='application/octet-stream'
            )
            
        finally:
            # Удаляем временный файл
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt/file", response_model=FileDecryptResponse)
async def decrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    """Расшифровывает файл с помощью Ansible Vault"""
    try:
        # Валидируем пароль
        is_valid, message = security_validator.validate_password(password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Создаем временный файл для загрузки
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Расшифровываем файл
            decrypted_file_path, decrypted_filename = vault_service.decrypt_file(
                temp_file_path, password
            )
            
            # Возвращаем расшифрованный файл
            return FileResponse(
                path=decrypted_file_path,
                filename=decrypted_filename,
                media_type='application/octet-stream'
            )
            
        finally:
            # Удаляем временный файл
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
