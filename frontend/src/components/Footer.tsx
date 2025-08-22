import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Ansible Vault Web</h3>
            <p className="text-gray-400 text-sm">
              Безопасный веб-сервис для шифрования и расшифровки файлов и текста
              с использованием современных криптографических алгоритмов.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Возможности</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🔒 Шифрование текста</li>
              <li>📁 Шифрование файлов</li>
              <li>🔓 Расшифровка данных</li>
              <li>🛡️ Безопасные алгоритмы</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Технологии</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Python FastAPI</li>
              <li>React TypeScript</li>
              <li>Custom CSS</li>
              <li>Cryptography</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-base font-medium">
            © 2025 Ansible Vault Web. Все права защищены. | 
            📧 <a href="mailto:rtst001@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              rtst001@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
