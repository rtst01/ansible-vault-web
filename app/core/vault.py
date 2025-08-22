import tempfile
import os
from typing import Optional, Tuple
from ansible.parsing.vault import VaultLib
from ansible.parsing.vault import VaultSecret
from ansible.errors import AnsibleError

class VaultService:
    """Сервис для работы с настоящим Ansible Vault"""
    
    def __init__(self):
        self.vault = None
    
    def _create_vault(self, password: str) -> VaultLib:
        """Создает экземпляр VaultLib с паролем"""
        try:
            # Создаем VaultSecret и VaultLib
            secret = VaultSecret(password.encode('utf-8'))
            vault = VaultLib([('default', secret)])
            return vault
        except Exception as e:
            raise AnsibleError(f"Ошибка создания Vault: {str(e)}")
    
    def encrypt_text(self, text: str, password: str) -> str:
        """Шифрует текст с помощью Ansible Vault"""
        try:
            vault = self._create_vault(password)
            encrypted_data = vault.encrypt(text.encode('utf-8'))
            return encrypted_data.decode('utf-8')
        except Exception as e:
            raise AnsibleError(f"Ошибка шифрования текста: {str(e)}")
    
    def decrypt_text(self, encrypted_text: str, password: str) -> str:
        """Расшифровывает текст с помощью Ansible Vault"""
        try:
            vault = self._create_vault(password)
            decrypted_data = vault.decrypt(encrypted_text.encode('utf-8'))
            return decrypted_data.decode('utf-8')
        except Exception as e:
            raise AnsibleError(f"Ошибка расшифровки текста: {str(e)}")
    
    def encrypt_file(self, file_path: str, password: str) -> Tuple[str, str]:
        """Шифрует файл с помощью Ansible Vault"""
        try:
            vault = self._create_vault(password)
            
            # Читаем файл
            with open(file_path, 'rb') as f:
                file_content = f.read()
            
            # Шифруем содержимое
            encrypted_content = vault.encrypt(file_content)
            
            # Создаем временный зашифрованный файл
            temp_dir = tempfile.gettempdir()
            original_filename = os.path.basename(file_path)
            encrypted_filename = f"{original_filename}.vault"
            encrypted_file_path = os.path.join(temp_dir, encrypted_filename)
            
            with open(encrypted_file_path, 'wb') as f:
                f.write(encrypted_content)
            
            return encrypted_file_path, encrypted_filename
            
        except Exception as e:
            raise AnsibleError(f"Ошибка шифрования файла: {str(e)}")
    
    def decrypt_file(self, encrypted_file_path: str, password: str) -> Tuple[str, str]:
        """Расшифровывает файл с помощью Ansible Vault"""
        try:
            vault = self._create_vault(password)
            
            # Читаем зашифрованный файл
            with open(encrypted_file_path, 'rb') as f:
                encrypted_content = f.read()
            
            # Расшифровываем содержимое
            decrypted_data = vault.decrypt(encrypted_content)
            
            # Создаем временный расшифрованный файл
            temp_dir = tempfile.gettempdir()
            encrypted_filename = os.path.basename(encrypted_file_path)
            if encrypted_filename.endswith('.vault'):
                original_filename = encrypted_filename[:-6]  # Убираем .vault
            else:
                original_filename = f"decrypted_{encrypted_filename}"
            
            decrypted_file_path = os.path.join(temp_dir, original_filename)
            
            with open(decrypted_file_path, 'wb') as f:
                f.write(decrypted_data)
            
            return decrypted_file_path, original_filename
            
        except Exception as e:
            raise AnsibleError(f"Ошибка расшифровки файла: {str(e)}")

# Создаем глобальный экземпляр сервиса
vault_service = VaultService()
