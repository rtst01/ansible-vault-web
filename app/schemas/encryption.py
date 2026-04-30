from pydantic import BaseModel, Field
from typing import Optional


class TextEncryptRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to encrypt")
    password: str = Field(..., min_length=8, max_length=128, description="Encryption password")
    algorithm: str = Field(default="ansible-vault", description="Encryption algorithm")


class TextEncryptResponse(BaseModel):
    encrypted_text: str
    algorithm: str
    success: bool


class TextDecryptRequest(BaseModel):
    encrypted_text: str = Field(..., min_length=1, max_length=500000, description="Encrypted text")
    password: str = Field(..., min_length=8, max_length=128, description="Decryption password")


class TextDecryptResponse(BaseModel):
    decrypted_text: str
    success: bool


class ErrorResponse(BaseModel):
    error: str
    code: str
    details: Optional[dict] = None
