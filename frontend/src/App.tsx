import React, { useState } from 'react';
import Header from './components/Header';
import EncryptionForm from './components/EncryptionForm';
import FileUpload from './components/FileUpload';
import './index.css';

type TabType = 'text-tab' | 'file-tab';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('text-tab');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main id="top" className="container" style={{ padding: '2rem 1rem' }}>
        {/* Tab Navigation */}
        <div className="text-center mb-8">
          <div className="modern-tab-container">
            <button
              onClick={() => setActiveTab('text-tab')}
              className={`modern-tab-button ${activeTab === 'text-tab' ? 'active' : ''}`}
            >
              📄 Шифрование текста
            </button>
            <button
              onClick={() => setActiveTab('file-tab')}
              className={`modern-tab-button ${activeTab === 'file-tab' ? 'active' : ''}`}
            >
              📁 Шифрование файлов
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'text-tab' && (
          <EncryptionForm />
        )}

        {activeTab === 'file-tab' && (
          <div className="main-form-centered">
            <div className="modern-card">
              <FileUpload />
            </div>
          </div>
        )}

        {/* Секции для ссылок header */}
        <section id="features" className="modern-section">
          <div className="container" style={{ padding: '0 1rem' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="modern-section-title">Возможности</h2>
              <p className="modern-section-subtitle">
                Мощный и безопасный сервис для шифрования текста и файлов с использованием проверенных технологий
              </p>
              <div className="modern-grid md:grid-cols-3">
                <div className="modern-feature-card">
                  <span className="modern-feature-icon">🔒</span>
                  <h3 className="modern-feature-title">Шифрование текста</h3>
                  <p className="modern-feature-description">
                    Быстрое и безопасное шифрование любого текста с помощью Ansible Vault
                  </p>
                </div>
                <div className="modern-feature-card">
                  <span className="modern-feature-icon">📁</span>
                  <h3 className="modern-feature-title">Шифрование файлов</h3>
                  <p className="modern-feature-description">
                    Защита конфиденциальных файлов с поддержкой множества форматов
                  </p>
                </div>
                <div className="modern-feature-card">
                  <span className="modern-feature-icon">📋</span>
                  <h3 className="modern-feature-title">Готовые шаблоны</h3>
                  <p className="modern-feature-description">
                    Быстрый старт с популярными шаблонами конфигураций
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="modern-section">
          <div className="container" style={{ padding: '0 1rem' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="modern-section-title">Безопасность</h2>
              <p className="modern-section-subtitle">
                Ваши данные защищены с использованием проверенных технологий шифрования
              </p>
              <div className="modern-info-grid">
                <div className="modern-info-card">
                  <h3 className="modern-info-title">
                    <span>🔐</span>
                    Ansible Vault
                  </h3>
                  <ul className="modern-info-list">
                    <li>Использование проверенного алгоритма AES256</li>
                    <li>Совместимость с существующими Ansible Vault файлами</li>
                    <li>Безопасное хранение паролей</li>
                    <li>Аудит всех операций шифрования</li>
                  </ul>
                </div>
                <div className="modern-info-card">
                  <h3 className="modern-info-title">
                    <span>🛡️</span>
                    Защита данных
                  </h3>
                  <ul className="modern-info-list">
                    <li>Шифрование на стороне клиента</li>
                    <li>Пароли не сохраняются на сервере</li>
                    <li>HTTPS соединение</li>
                    <li>Автоматическая очистка временных файлов</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="modern-section">
          <div className="container" style={{ padding: '0 1rem' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="modern-section-title">Документация</h2>
              <p className="modern-section-subtitle">
                Подробные инструкции по использованию и техническая документация API
              </p>
              <div className="modern-info-grid">
                <div className="modern-info-card">
                  <h3 className="modern-info-title">
                    <span>📖</span>
                    Как использовать
                  </h3>
                  <ol className="modern-info-list" style={{ counterReset: 'step-counter' }}>
                    <li style={{ counterIncrement: 'step-counter' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {String.fromCharCode(65 + 0)}.
                      </span>
                      Выберите режим: шифрование или расшифровка
                    </li>
                    <li style={{ counterIncrement: 'step-counter' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {String.fromCharCode(65 + 1)}.
                      </span>
                      Введите текст или загрузите файл
                    </li>
                    <li style={{ counterIncrement: 'step-counter' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {String.fromCharCode(65 + 2)}.
                      </span>
                      Укажите надежный пароль (минимум 8 символов)
                    </li>
                    <li style={{ counterIncrement: 'step-counter' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {String.fromCharCode(65 + 3)}.
                      </span>
                      Нажмите кнопку для выполнения операции
                    </li>
                    <li style={{ counterIncrement: 'step-counter' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {String.fromCharCode(65 + 4)}.
                      </span>
                      Скопируйте результат или скачайте файл
                    </li>
                  </ol>
                </div>
                <div className="modern-info-card">
                  <h3 className="modern-info-title">
                    <span>🔧</span>
                    API Endpoints
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-bold">POST</span>
                      <span className="text-sm font-mono text-gray-700">/api/v1/encrypt/text</span>
                      <span className="text-xs text-gray-500">Шифрование текста</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-bold">POST</span>
                      <span className="text-sm font-mono text-gray-700">/api/v1/decrypt/text</span>
                      <span className="text-xs text-gray-500">Расшифровка текста</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-bold">POST</span>
                      <span className="text-sm font-mono text-gray-700">/api/v1/encrypt/file</span>
                      <span className="text-xs text-gray-500">Шифрование файла</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-bold">POST</span>
                      <span className="text-sm font-mono text-gray-700">/api/v1/decrypt/file</span>
                      <span className="text-xs text-gray-500">Расшифровка файла</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer is removed as per the edit hint */}
    </div>
  );
}

export default App;
