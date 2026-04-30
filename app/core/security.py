import os
import hashlib
import re
from typing import Tuple
from fastapi import UploadFile


class SecurityValidator:
    """Security validator for files and passwords."""

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_PASSWORD_LENGTH = 128

    ALLOWED_EXTENSIONS = {
        '.txt', '.md', '.json', '.xml',
        '.yml', '.yaml', '.ini', '.cfg', '.conf', '.csv',
    }

    @staticmethod
    def validate_password(password: str) -> Tuple[bool, str]:
        if not password or len(password) < 8:
            return False, "Password must be at least 8 characters"

        if len(password) > SecurityValidator.MAX_PASSWORD_LENGTH:
            return False, f"Password must not exceed {SecurityValidator.MAX_PASSWORD_LENGTH} characters"

        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"

        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"

        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"

        return True, "Password is valid"

    @staticmethod
    def validate_file(file: UploadFile) -> Tuple[bool, str]:
        if file.size and file.size > SecurityValidator.MAX_FILE_SIZE:
            return False, f"File size exceeds {SecurityValidator.MAX_FILE_SIZE // (1024 * 1024)}MB limit"

        if file.filename:
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext and file_ext not in SecurityValidator.ALLOWED_EXTENSIONS:
                return False, f"Unsupported file type: {file_ext}"

        return True, "File is valid"

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename - remove path traversal and dangerous characters."""
        # Take only the basename to prevent path traversal
        filename = os.path.basename(filename)
        # Remove dangerous characters
        sanitized = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', filename)
        # Remove leading dots (hidden files)
        sanitized = sanitized.lstrip('.')
        if not sanitized:
            sanitized = "upload"
        # Limit length
        if len(sanitized) > 100:
            name, ext = os.path.splitext(sanitized)
            sanitized = name[:100 - len(ext)] + ext
        return sanitized

    @staticmethod
    def generate_file_hash(content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()


security_validator = SecurityValidator()
