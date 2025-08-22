import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileResult {
  filename: string;
  success: boolean;
  error?: string;
  downloadUrl?: string;
}

const FileUpload: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<FileResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.py', '.js', '.ts', '.html', '.css', '.json', '.xml', '.yml', '.yaml'],
      'application/*': ['.ini', '.cfg', '.conf', '.log', '.csv', '.sql']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('password', password);

      const endpoint = mode === 'encrypt'
        ? '/api/v1/encrypt/file'
        : '/api/v1/decrypt/file';

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Получаем имя файла из заголовка
        const contentDisposition = response.headers.get('content-disposition');
        let filename = selectedFile.name;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Создаем blob и скачиваем файл
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setResult({
          filename,
          success: true,
          downloadUrl: url,
        });
      } else {
        const errorData = await response.json();
        setResult({
          filename: selectedFile.name,
          success: false,
          error: errorData.detail || 'Произошла ошибка',
        });
      }
    } catch (error) {
      setResult({
        filename: selectedFile.name,
        success: false,
        error: 'Ошибка соединения с сервером',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">
          {mode === 'encrypt' ? '🔒 Шифрование файлов' : '🔓 Расшифровка файлов'}
        </h2>
        <p className="section-description">
          {mode === 'encrypt'
            ? 'Безопасное шифрование файлов'
            : 'Расшифровка зашифрованных файлов'
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
        {/* File Upload */}
        <div className="modern-form-group">
          <label className="modern-form-label">
            {mode === 'encrypt' ? 'Выберите файл для шифрования' : 'Выберите файл для расшифровки'}
          </label>

          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`file-upload-area ${isDragActive ? 'drag-active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div style={{ fontSize: '2.5rem' }}>📁</div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл сюда или нажмите для выбора'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Поддерживаемые форматы: TXT, MD, PY, JS, TS, HTML, CSS, JSON, XML, YAML, INI, CFG, LOG, CSV, SQL
                  </p>
                  <p className="text-sm text-gray-500">
                    Максимальный размер: 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="file-info">
              <div className="file-info-header">
                <div className="file-info-content">
                  <span style={{ fontSize: '1.5rem' }}>📄</span>
                  <div className="file-info-details">
                    <p className="filename">{selectedFile.name}</p>
                    <p className="filesize">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="remove-button"
                  title="Удалить файл"
                >
                  ❌
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
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
          <p className="text-sm text-gray-500 mt-1">
            Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="modern-btn modern-btn-primary w-full"
        >
          {loading ? '⏳ Обработка...' : (mode === 'encrypt' ? '🔒 Зашифровать файл' : '🔓 Расшифровать файл')}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className={`results-section ${result.success ? 'results-success' : 'results-error'}`}>
          {result.success ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-success">
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <span className="font-medium">
                  {mode === 'encrypt' ? 'Файл успешно зашифрован!' : 'Файл успешно расшифрован!'}
                </span>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', borderRadius: '0.5rem', padding: '1rem' }}>
                <p className="text-sm text-gray-600">
                  <strong>Имя файла:</strong> {result.filename}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Файл автоматически скачан в папку загрузок
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-error">
              <span style={{ fontSize: '1.5rem' }}>❌</span>
              <span className="font-medium">Ошибка: {result.error}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FileUpload;
