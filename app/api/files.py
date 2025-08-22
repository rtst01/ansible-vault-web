from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
import tempfile
import os
import shutil
from typing import List

from app.core.security import security_validator

router = APIRouter(prefix="/api/v1", tags=["files"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Загружает файл для обработки"""
    try:
        # Валидируем файл
        is_valid, message = security_validator.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Создаем временный файл
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Возвращаем информацию о загруженном файле
        return {
            "filename": file.filename,
            "size": len(content),
            "temp_path": temp_file_path,
            "message": "Файл успешно загружен"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_file(filename: str):
    """Скачивает файл по имени"""
    try:
        # Проверяем существование файла
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Файл не найден")
        
        # Возвращаем файл для скачивания
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='application/octet-stream'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/files/{filename}")
async def delete_file(filename: str):
    """Удаляет временный файл"""
    try:
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Файл не найден")
        
        # Удаляем файл
        os.unlink(file_path)
        
        return {"message": f"Файл {filename} успешно удален"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def list_files():
    """Список временных файлов"""
    try:
        temp_dir = tempfile.gettempdir()
        files = []
        
        for filename in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, filename)
            if os.path.isfile(file_path):
                stat = os.stat(file_path)
                files.append({
                    "filename": filename,
                    "size": stat.st_size,
                    "created": stat.st_ctime,
                    "modified": stat.st_mtime
                })
        
        return {"files": files}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
