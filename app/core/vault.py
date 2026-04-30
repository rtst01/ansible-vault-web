import logging
import tempfile
import os
from typing import Tuple

from ansible.parsing.vault import VaultLib, VaultSecret
from ansible.errors import AnsibleError

logger = logging.getLogger(__name__)


class VaultService:
    """Service for Ansible Vault encryption/decryption."""

    @staticmethod
    def _create_vault(password: str) -> VaultLib:
        secret = VaultSecret(password.encode('utf-8'))
        return VaultLib([('default', secret)])

    def encrypt_text(self, text: str, password: str) -> str:
        try:
            vault = self._create_vault(password)
            encrypted_data = vault.encrypt(text.encode('utf-8'))
            return encrypted_data.decode('utf-8')
        except AnsibleError:
            raise
        except Exception as e:
            logger.error("Text encryption error: %s", e, exc_info=True)
            raise AnsibleError("Text encryption failed")

    def decrypt_text(self, encrypted_text: str, password: str) -> str:
        try:
            vault = self._create_vault(password)
            decrypted_data = vault.decrypt(encrypted_text.encode('utf-8'))
            return decrypted_data.decode('utf-8')
        except AnsibleError:
            raise
        except Exception as e:
            logger.error("Text decryption error: %s", e, exc_info=True)
            raise AnsibleError("Text decryption failed")

    def encrypt_file(self, file_path: str, password: str) -> Tuple[str, str]:
        try:
            vault = self._create_vault(password)

            with open(file_path, 'rb') as f:
                file_content = f.read()

            encrypted_content = vault.encrypt(file_content)

            temp_dir = tempfile.gettempdir()
            original_filename = os.path.basename(file_path)
            encrypted_filename = f"{original_filename}.vault"
            encrypted_file_path = os.path.join(temp_dir, encrypted_filename)

            with open(encrypted_file_path, 'wb') as f:
                f.write(encrypted_content)

            return encrypted_file_path, encrypted_filename

        except AnsibleError:
            raise
        except Exception as e:
            logger.error("File encryption error: %s", e, exc_info=True)
            raise AnsibleError("File encryption failed")

    def decrypt_file(self, encrypted_file_path: str, password: str) -> Tuple[str, str]:
        try:
            vault = self._create_vault(password)

            with open(encrypted_file_path, 'rb') as f:
                encrypted_content = f.read()

            decrypted_data = vault.decrypt(encrypted_content)

            temp_dir = tempfile.gettempdir()
            encrypted_filename = os.path.basename(encrypted_file_path)
            if encrypted_filename.endswith('.vault'):
                original_filename = encrypted_filename[:-6]
            else:
                original_filename = f"decrypted_{encrypted_filename}"

            decrypted_file_path = os.path.join(temp_dir, original_filename)

            with open(decrypted_file_path, 'wb') as f:
                f.write(decrypted_data)

            return decrypted_file_path, original_filename

        except AnsibleError:
            raise
        except Exception as e:
            logger.error("File decryption error: %s", e, exc_info=True)
            raise AnsibleError("File decryption failed")


vault_service = VaultService()
