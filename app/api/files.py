import logging
import tempfile
import os
from typing import Tuple

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

from app.core.security import security_validator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["files"])

# Dedicated subdirectory for app uploads inside system temp
APP_TEMP_DIR = os.path.join(tempfile.gettempdir(), "ansible-vault-web")
os.makedirs(APP_TEMP_DIR, exist_ok=True)


def _safe_path(filename: str) -> str:
    """Resolve filename inside APP_TEMP_DIR, preventing path traversal."""
    # Strip any directory components
    safe_name = os.path.basename(filename)
    if not safe_name:
        raise HTTPException(status_code=400, detail="Invalid filename")
    resolved = os.path.normpath(os.path.join(APP_TEMP_DIR, safe_name))
    if not resolved.startswith(os.path.normpath(APP_TEMP_DIR)):
        raise HTTPException(status_code=400, detail="Invalid filename")
    return resolved


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file for processing."""
    try:
        is_valid, message = security_validator.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        content = await file.read()
        safe_name = security_validator.sanitize_filename(file.filename or "upload")
        file_path = os.path.join(APP_TEMP_DIR, safe_name)

        with open(file_path, "wb") as f:
            f.write(content)

        return {
            "filename": safe_name,
            "size": len(content),
            "message": "File uploaded successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Upload error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="File upload failed")


@router.get("/download/{filename}")
async def download_file(filename: str):
    """Download a file by name from the app temp directory."""
    try:
        file_path = _safe_path(filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        return FileResponse(
            path=file_path,
            filename=os.path.basename(file_path),
            media_type="application/octet-stream",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Download error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="File download failed")


@router.delete("/files/{filename}")
async def delete_file(filename: str):
    """Delete a temporary file."""
    try:
        file_path = _safe_path(filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        os.unlink(file_path)
        return {"message": "File deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="File deletion failed")


@router.get("/files")
async def list_files():
    """List files in the app temp directory only."""
    try:
        files_list = []
        for filename in os.listdir(APP_TEMP_DIR):
            file_path = os.path.join(APP_TEMP_DIR, filename)
            if os.path.isfile(file_path):
                stat = os.stat(file_path)
                files_list.append({
                    "filename": filename,
                    "size": stat.st_size,
                    "modified": stat.st_mtime,
                })

        return {"files": files_list}

    except Exception as e:
        logger.error("List files error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to list files")
