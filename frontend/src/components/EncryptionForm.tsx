import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  icon: string;
}

interface EncryptionResult {
  encryptedText?: string;
  decryptedText?: string;
  success: boolean;
  error?: string;
}

const EncryptionForm: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<EncryptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const resultTextareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Шаблоны файлов
  const templates: Template[] = [
    {
      id: 'k8s-secret',
      name: 'K8s Secret',
      description: 'Kubernetes Secret с переменными окружения',
      category: 'Kubernetes',
      icon: '☸️',
      content: `apiVersion: v1
kind: Secret
metadata:
  name: app-secret
  namespace: default
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@localhost:5432/dbname"
  API_KEY: "your-api-key-here"
  JWT_SECRET: "your-jwt-secret-key"`
    },
    {
      id: 'k8s-configmap',
      name: 'K8s ConfigMap',
      description: 'Конфигурационные данные приложения',
      category: 'Kubernetes',
      icon: '⚙️',
      content: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  LOG_LEVEL: "INFO"
  ENVIRONMENT: "production"
  MAX_CONNECTIONS: "100"`
    },
    {
      id: 'docker-compose',
      name: 'Docker Compose',
      description: 'Docker Compose с переменными',
      category: 'Docker',
      icon: '🐳',
      content: `version: '3.8'
services:
  app:
    image: myapp:latest
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/dbname
      - API_KEY=your-api-key`
    },
    {
      id: 'env-file',
      name: '.env файл',
      description: 'Переменные окружения',
      category: 'Environment',
      icon: '🔧',
      content: `# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your-api-key-here
JWT_SECRET=your-super-secret-jwt-key`
    },
    {
      id: 'nginx-config',
      name: 'Nginx',
      description: 'Конфигурация Nginx с SSL',
      category: 'Web Server',
      icon: '🌐',
      content: `server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}`
    }
  ];

  // Debounced функция для изменения высоты textarea
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, 50); // 50ms debounce
  }, []);

  // Обработчик изменения текста с debounced изменением высоты
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight(e.target);
  };

  // Обработчик выбора шаблона
  const handleTemplateSelect = (template: Template) => {
    setText(template.content);
    setMode('encrypt'); // Переключаемся на шифрование
    // Автоматически изменяем высоту textarea
    setTimeout(() => {
      if (inputTextareaRef.current) {
        adjustTextareaHeight(inputTextareaRef.current);
      }
    }, 100);
  };

  // Автоматическое изменение высоты результата при изменении
  useEffect(() => {
    if (resultTextareaRef.current && result) {
      const textarea = resultTextareaRef.current;
      // Небольшая задержка для корректного расчета высоты
      setTimeout(() => adjustTextareaHeight(textarea), 10);
    }
  }, [result, adjustTextareaHeight]);

  // Автоматическое изменение высоты при изменении содержимого результата
  useEffect(() => {
    if (resultTextareaRef.current && result?.success) {
      const textarea = resultTextareaRef.current;
      const content = mode === 'encrypt' ? result.encryptedText : result.decryptedText;
      if (content) {
        setTimeout(() => adjustTextareaHeight(textarea), 10);
      }
    }
  }, [result?.encryptedText, result?.decryptedText, mode, adjustTextareaHeight, result?.success]);

  // Автоматическое изменение высоты при загрузке страницы
  useEffect(() => {
    if (inputTextareaRef.current) {
      adjustTextareaHeight(inputTextareaRef.current);
    }
  }, [adjustTextareaHeight]);

  // Автоматическое изменение высоты при смене режима
  useEffect(() => {
    if (inputTextareaRef.current) {
      adjustTextareaHeight(inputTextareaRef.current);
    }
  }, [mode, adjustTextareaHeight]);

  // Очистка timeout при размонтировании
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const endpoint = mode === 'encrypt'
        ? '/api/v1/encrypt/text'
        : '/api/v1/decrypt/text';

      const payload = mode === 'encrypt'
        ? { text, password, algorithm: 'ansible-vault' }
        : { encrypted_text: text, password };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          encryptedText: mode === 'encrypt' ? data.encrypted_text : undefined,
          decryptedText: mode === 'decrypt' ? data.decrypted_text : undefined,
        });
      } else {
        setResult({
          success: false,
          error: data.detail || 'Произошла ошибка',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Ошибка соединения с сервером',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="encryption-container">
      {/* Основная форма по центру */}
      <div className="main-form-centered">
        <div className="modern-card">
          <div className="section-header">
            <h2 className="section-title">
              {mode === 'encrypt' ? '🔒 Шифрование текста' : '🔓 Расшифровка текста'}
            </h2>
            <p className="section-description">
              {mode === 'encrypt'
                ? 'Зашифруйте ваш текст с помощью надежного алгоритма Ansible Vault'
                : 'Расшифруйте зашифрованный текст с помощью пароля'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <div className="modern-tab-container">
              <button
                onClick={() => setMode('encrypt')}
                className={`modern-tab-button ${mode === 'encrypt' ? 'active' : ''}`}
              >
                🔒 Шифровать
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`modern-tab-button ${mode === 'decrypt' ? 'active' : ''}`}
              >
                🔓 Расшифровать
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="modern-form-group">
              <label className="modern-form-label">
                {mode === 'encrypt' ? 'Текст для шифрования' : 'Зашифрованный текст'}
              </label>
              <textarea
                ref={inputTextareaRef}
                value={text}
                onChange={handleTextChange}
                onFocus={(e) => adjustTextareaHeight(e.target)}
                className="modern-form-input modern-form-textarea auto-resize"
                placeholder={mode === 'encrypt'
                  ? 'Введите текст, который хотите зашифровать...'
                  : 'Введите зашифрованный текст...'
                }
                required
              />
            </div>

            <div className="modern-form-group">
              <label className="modern-form-label">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modern-form-input"
                placeholder="Введите пароль (минимум 8 символов)"
                required
                minLength={8}
              />
              <p className="text-sm text-gray-500 mt-3">
                Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="modern-btn modern-btn-primary w-full"
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Обработка...' : (mode === 'encrypt' ? '🔒 Зашифровать' : '🔓 Расшифровать')}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className={`results-section ${result.success ? 'results-success' : 'results-error'} mt-8`}>
              {result.success ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-success">
                    <span style={{ fontSize: '2rem' }}>✅</span>
                    <span className="font-semibold text-lg">
                      {mode === 'encrypt' ? 'Текст успешно зашифрован!' : 'Текст успешно расшифрован!'}
                    </span>
                  </div>

                  <div>
                    <label className="modern-form-label">
                      {mode === 'encrypt' ? 'Зашифрованный текст' : 'Расшифрованный текст'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        ref={resultTextareaRef}
                        value={mode === 'encrypt' ? result.encryptedText : result.decryptedText}
                        readOnly
                        onFocus={(e) => adjustTextareaHeight(e.target)}
                        className="modern-form-input modern-form-textarea auto-resize"
                        style={{ backgroundColor: '#f8fafc' }}
                      />
                      <button
                        onClick={() => copyToClipboard(mode === 'encrypt' ? result.encryptedText! : result.decryptedText!)}
                        className="copy-button"
                        title="Копировать в буфер обмена"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-error">
                  <span style={{ fontSize: '2rem' }}>❌</span>
                  <span className="font-semibold text-lg">Ошибка: {result.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Компактные шаблоны справа */}
      <div className="compact-templates">
        <div className="modern-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="template-status-indicator"></span>
              📋 Шаблоны
            </h3>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors duration-200"
            >
              {showTemplates ? '−' : '+'}
            </button>
          </div>

          {showTemplates && (
            <div className="space-y-2">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="template-item"
                  onClick={() => handleTemplateSelect(template)}
                  title={`Нажмите чтобы использовать шаблон: ${template.name}`}
                >
                  <div className="flex items-center">
                    <div className="template-icon">{template.icon}</div>
                    <div className="template-content">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showTemplates && (
            <p className="text-sm text-gray-500 text-center py-4">
              Нажмите + чтобы показать шаблоны
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncryptionForm;
