import logging
import tempfile
import os

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from app.schemas.encryption import (
    TextEncryptRequest, TextEncryptResponse, TextDecryptRequest, TextDecryptResponse,
)
from app.core.vault import vault_service
from app.core.security import security_validator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["encryption"])


def _cleanup_files(*paths: str):
    """Remove temporary files after response is sent."""
    for path in paths:
        try:
            if path and os.path.exists(path):
                os.unlink(path)
        except OSError:
            pass


@router.post("/encrypt/text", response_model=TextEncryptResponse)
async def encrypt_text(request: TextEncryptRequest):
    try:
        is_valid, message = security_validator.validate_password(request.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        encrypted_text = vault_service.encrypt_text(request.text, request.password)

        return TextEncryptResponse(
            encrypted_text=encrypted_text,
            algorithm=request.algorithm,
            success=True,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Text encryption error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Text encryption failed")


@router.post("/decrypt/text", response_model=TextDecryptResponse)
async def decrypt_text(request: TextDecryptRequest):
    try:
        is_valid, message = security_validator.validate_password(request.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        decrypted_text = vault_service.decrypt_text(request.encrypted_text, request.password)

        return TextDecryptResponse(
            decrypted_text=decrypted_text,
            success=True,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Text decryption error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Text decryption failed. Check your password and encrypted text.")


@router.post("/encrypt/file")
async def encrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    algorithm: str = Form(default="ansible-vault"),
):
    temp_file_path = None
    encrypted_file_path = None
    try:
        is_valid, message = security_validator.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        is_valid, message = security_validator.validate_password(password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        with tempfile.NamedTemporaryFile(delete=False, dir=tempfile.gettempdir()) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        encrypted_file_path, encrypted_filename = vault_service.encrypt_file(
            temp_file_path, password
        )

        # Clean up input temp file immediately, output after response
        _cleanup_files(temp_file_path)
        temp_file_path = None

        return FileResponse(
            path=encrypted_file_path,
            filename=encrypted_filename,
            media_type="application/octet-stream",
            background=BackgroundTask(_cleanup_files, encrypted_file_path),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("File encryption error: %s", e, exc_info=True)
        _cleanup_files(temp_file_path, encrypted_file_path)
        raise HTTPException(status_code=500, detail="File encryption failed")


@router.post("/decrypt/file")
async def decrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    temp_file_path = None
    decrypted_file_path = None
    try:
        is_valid, message = security_validator.validate_password(password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        with tempfile.NamedTemporaryFile(delete=False, dir=tempfile.gettempdir()) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        decrypted_file_path, decrypted_filename = vault_service.decrypt_file(
            temp_file_path, password
        )

        _cleanup_files(temp_file_path)
        temp_file_path = None

        return FileResponse(
            path=decrypted_file_path,
            filename=decrypted_filename,
            media_type="application/octet-stream",
            background=BackgroundTask(_cleanup_files, decrypted_file_path),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("File decryption error: %s", e, exc_info=True)
        _cleanup_files(temp_file_path, decrypted_file_path)
        raise HTTPException(status_code=500, detail="File decryption failed. Check your password.")
