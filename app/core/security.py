import os
import hashlib
import re
from typing import Tuple, Optional
from fastapi import HTTPException, UploadFile

class SecurityValidator:
    """Валидатор безопасности для файлов и паролей"""
    
    # Максимальный размер файла (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    # Разрешенные типы файлов
    ALLOWED_EXTENSIONS = {
        '.txt', '.md', '.py', '.js', '.ts', '.html', '.css', '.json', '.xml',
        '.yml', '.yaml', '.ini', '.cfg', '.conf', '.log', '.csv', '.sql'
    }
    
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, str]:
        """Валидирует пароль"""
        if len(password) < 8:
            return False, "Пароль должен содержать минимум 8 символов"
        
        if not re.search(r'[A-Z]', password):
            return False, "Пароль должен содержать хотя бы одну заглавную букву"
        
        if not re.search(r'[a-z]', password):
            return False, "Пароль должен содержать хотя бы одну строчную букву"
        
        if not re.search(r'\d', password):
            return False, "Пароль должен содержать хотя бы одну цифру"
        
        return True, "Пароль валиден"
    
    @staticmethod
    def validate_file(file: UploadFile) -> Tuple[bool, str]:
        """Валидирует загружаемый файл"""
        # Проверяем размер файла
        if file.size and file.size > SecurityValidator.MAX_FILE_SIZE:
            return False, f"Размер файла превышает {SecurityValidator.MAX_FILE_SIZE // (1024*1024)}MB"
        
        # Проверяем расширение файла
        if file.filename:
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in SecurityValidator.ALLOWED_EXTENSIONS:
                return False, f"Неподдерживаемый тип файла: {file_ext}"
        
        return True, "Файл валиден"
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Очищает имя файла от потенциально опасных символов"""
        # Убираем опасные символы
        sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
        # Ограничиваем длину
        if len(sanitized) > 100:
            name, ext = os.path.splitext(sanitized)
            sanitized = name[:100-len(ext)] + ext
        return sanitized
    
    @staticmethod
    def generate_file_hash(content: bytes) -> str:
        """Генерирует хеш файла для проверки целостности"""
        return hashlib.sha256(content).hexdigest()

# Создаем глобальный экземпляр валидатора
security_validator = SecurityValidator()
