import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Lang = 'en' | 'ru';

const translations = {
  // Topbar
  encrypt: { en: 'encrypt', ru: 'шифровать' },
  decrypt: { en: 'decrypt', ru: 'расшифровать' },
  diff: { en: 'diff', ru: 'разница' },
  templates: { en: 'templates', ru: 'шаблоны' },

  // Pane labels
  vaultInput: { en: 'vault input', ru: 'зашифрованный ввод' },
  plaintextInput: { en: 'plaintext input', ru: 'текстовый ввод' },
  output: { en: 'output', ru: 'вывод' },
  ENCRYPTED: { en: 'ENCRYPTED', ru: 'ЗАШИФРОВАНО' },
  DECRYPTED: { en: 'DECRYPTED', ru: 'РАСШИФРОВАНО' },

  // Action bar
  key: { en: 'key', ru: 'ключ' },
  vaultPasswordPlaceholder: { en: 'vault password (\u22658 chars)', ru: 'пароль vault (\u22658 символов)' },
  vaultPassword: { en: 'vault password', ru: 'пароль vault' },
  processing: { en: 'processing...', ru: 'обработка...' },

  // Empty output
  awaitingEncryption: { en: 'awaiting encryption', ru: 'ожидание шифрования' },
  awaitingDecryption: { en: 'awaiting decryption', ru: 'ожидание расшифровки' },
  awaitingEncryptionDesc: {
    en: 'Enter a password and press encrypt \u2014 result will appear here in $ANSIBLE_VAULT;1.1;AES256 format.',
    ru: 'Введите пароль и нажмите шифровать \u2014 результат появится здесь в формате $ANSIBLE_VAULT;1.1;AES256.',
  },
  awaitingDecryptionDesc: {
    en: 'Enter a password and press decrypt \u2014 decrypted data will appear here.',
    ru: 'Введите пароль и нажмите расшифровать \u2014 расшифрованные данные появятся здесь.',
  },
  run: { en: 'run', ru: 'запуск' },

  // Placeholder
  pastePlaceholder: { en: 'Paste YAML, .env, or any text', ru: 'Вставьте YAML, .env или любой текст' },
  paste: { en: 'paste', ru: 'вставить' },
  file: { en: 'file', ru: 'файл' },
  dragDropHint: { en: 'or drag & drop a file here', ru: 'или перетащите файл сюда' },

  // Drop overlay
  dropFile: { en: 'Drop file to load', ru: 'Отпустите файл для загрузки' },

  // Tooltips
  uploadFile: { en: 'Upload file (Ctrl+O)', ru: 'Загрузить файл (Ctrl+O)' },
  clearCtrl: { en: 'Clear (Ctrl+Del)', ru: 'Очистить (Ctrl+Del)' },
  outputToInput: { en: 'Output \u2192 Input', ru: 'Вывод \u2192 Ввод' },
  copyCtrl: { en: 'Copy (Ctrl+Shift+C)', ru: 'Копировать (Ctrl+Shift+C)' },
  download: { en: 'Download', ru: 'Скачать' },
  show: { en: 'Show', ru: 'Показать' },
  hide: { en: 'Hide', ru: 'Скрыть' },
  copyCli: { en: 'Copy CLI command', ru: 'Скопировать CLI команду' },
  keyboardShortcuts: { en: 'Keyboard shortcuts', ru: 'Клавиатурные сокращения' },

  // Status bar
  serverReady: { en: 'server ready', ru: 'сервер готов' },

  // Toasts / errors
  noData: { en: 'No data to process', ru: 'Нет данных для обработки' },
  enterPassword: { en: 'Enter password', ru: 'Введите пароль' },
  passwordTooShort: { en: 'Password must be at least 8 characters', ru: 'Пароль должен быть не менее 8 символов' },
  operationFailed: { en: 'Operation failed', ru: 'Операция не удалась' },
  connectionError: { en: 'Connection error', ru: 'Ошибка соединения' },
  serverUnavailable: { en: 'Server unavailable', ru: 'Сервер недоступен' },
  copiedToClipboard: { en: 'Copied to clipboard', ru: 'Скопировано в буфер' },
  failedToCopy: { en: 'Failed to copy', ru: 'Не удалось скопировать' },
  fileDownloaded: { en: 'File downloaded', ru: 'Файл загружен' },
  cleared: { en: 'Cleared', ru: 'Очищено' },
  outputToInputToast: { en: 'Output \u2192 Input', ru: 'Вывод \u2192 Ввод' },
  fileExceeds: { en: 'File exceeds 10MB', ru: 'Файл превышает 10МБ' },
  loaded: { en: 'Loaded', ru: 'Загружен' },
  template: { en: 'Template', ru: 'Шаблон' },
  cliCopied: { en: 'CLI command copied', ru: 'CLI команда скопирована' },
  encrypted: { en: 'Encrypted', ru: 'Зашифровано' },
  decrypted: { en: 'Decrypted', ru: 'Расшифровано' },
  error: { en: 'Error', ru: 'Ошибка' },

  // Password strength
  weak: { en: 'weak', ru: 'слабый' },
  fair: { en: 'fair', ru: 'средний' },
  good: { en: 'good', ru: 'хороший' },
  strong: { en: 'strong', ru: 'сильный' },
  excellent: { en: 'excellent', ru: 'отличный' },

  // Help modal
  helpEncrypt: { en: 'Encrypt', ru: 'Шифрование' },
  helpDecrypt: { en: 'Decrypt', ru: 'Расшифровка' },
  helpOpenTemplates: { en: 'Open templates', ru: 'Открыть шаблоны' },
  helpUploadFile: { en: 'Upload file', ru: 'Загрузить файл' },
  helpCopyOutput: { en: 'Copy output', ru: 'Скопировать вывод' },
  helpDiff: { en: 'Diff input/output', ru: 'Сравнить ввод/вывод' },
  helpClearAll: { en: 'Clear all', ru: 'Очистить все' },
  helpTogglePassword: { en: 'Toggle password', ru: 'Показать/скрыть пароль' },

  // Templates menu
  searchTemplates: { en: 'Search templates...', ru: 'Поиск шаблонов...' },
  nothingFound: { en: 'Nothing found', ru: 'Ничего не найдено' },
  navigate: { en: '\u2191\u2193 navigate \u00B7 \u21B5 select', ru: '\u2191\u2193 навигация \u00B7 \u21B5 выбрать' },

  // Diff labels
  plaintext: { en: 'plaintext', ru: 'текст' },
  vault: { en: 'vault', ru: 'vault' },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations[key]?.en || key,
});

export const useI18n = () => useContext(I18nContext);

const STORAGE_KEY = 'vault-web-lang';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') return stored;
    const browserLang = navigator.language?.slice(0, 2);
    return browserLang === 'ru' ? 'ru' : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((key: TranslationKey) => translations[key]?.[lang] || key, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
