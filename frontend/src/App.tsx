import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Icons from './components/Icons';
import Editor from './components/Editor';
import TemplatesMenu from './components/TemplatesMenu';
import HelpModal from './components/HelpModal';
import DiffView from './components/DiffView';
import { isVault, passwordStrength } from './utils/highlight';
import { getApiUrl, API_ENDPOINTS } from './config';
import { VaultTemplate } from './data/templates';
import { useI18n } from './i18n';
import './index.css';

const DEFAULT_INPUT = `apiVersion: v1
kind: Secret
metadata:
  name: app-credentials
  namespace: production
type: Opaque
stringData:
  DB_USER: "app_service"
  DB_PASSWORD: "ChangeMe_S3cur3!"
  API_KEY: "sk_live_REPLACE_ME"
  JWT_SECRET: "REPLACE_WITH_STRONG_SECRET_64+"
`;

interface ToastState {
  msg: string;
  kind: 'ok' | 'err' | 'info';
  id: number;
}

function App() {
  const { t, lang, setLang } = useI18n();
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorShake, setErrorShake] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [tmplOpen, setTmplOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [diffMode, setDiffMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [splitPct, setSplitPct] = useState(50);
  const [draggingDivider, setDraggingDivider] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<HTMLDivElement>(null);

  const inputIsVault = useMemo(() => isVault(input), [input]);
  const outputIsVault = useMemo(() => isVault(output), [output]);

  // Auto-detect mode
  useEffect(() => {
    if (inputIsVault && mode !== 'decrypt') setMode('decrypt');
    else if (!inputIsVault && input.trim() && mode !== 'encrypt') setMode('encrypt');
  }, [inputIsVault]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = useCallback((msg: string, kind: 'ok' | 'err' | 'info' = 'info') => {
    setToast({ msg, kind, id: Date.now() });
    setTimeout(() => setToast(tt => (tt && tt.msg === msg ? null : tt)), 2200);
  }, []);

  const flashError = useCallback((msg: string) => {
    setError(msg);
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 350);
  }, []);

  const run = useCallback(async () => {
    if (!input.trim()) { flashError(t('noData')); return; }
    if (!password) { flashError(t('enterPassword')); return; }
    if (password.length < 8) { flashError(t('passwordTooShort')); return; }

    setBusy(true);
    setError(null);
    try {
      const endpoint = mode === 'encrypt' ? API_ENDPOINTS.ENCRYPT_TEXT : API_ENDPOINTS.DECRYPT_TEXT;
      const payload = mode === 'encrypt'
        ? { text: input, password, algorithm: 'ansible-vault' }
        : { encrypted_text: input, password };

      const t0 = performance.now();
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const dt = Math.round(performance.now() - t0);

      if (response.ok) {
        const result = mode === 'encrypt' ? data.encrypted_text : data.decrypted_text;
        setOutput(result);
        showToast(`${mode === 'encrypt' ? t('encrypted') : t('decrypted')} · ${dt}ms`, 'ok');
      } else {
        flashError(data.detail || t('operationFailed'));
        showToast(data.detail || t('error'), 'err');
      }
    } catch {
      flashError(t('connectionError'));
      showToast(t('serverUnavailable'), 'err');
    } finally {
      setBusy(false);
    }
  }, [input, password, mode, flashError, showToast, t]);

  const copyOut = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      showToast(t('copiedToClipboard'), 'ok');
    } catch {
      showToast(t('failedToCopy'), 'err');
    }
  }, [output, showToast, t]);

  const downloadOut = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encrypt' ? 'vault.yml' : 'decrypted.yml';
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('fileDownloaded'), 'ok');
  }, [output, mode, showToast, t]);

  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    showToast(t('cleared'), 'info');
  }, [showToast, t]);

  const swapInOut = useCallback(() => {
    if (!output) return;
    setInput(output);
    setOutput('');
    showToast(t('outputToInputToast'), 'info');
  }, [output, showToast, t]);

  const onFileChosen = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { flashError(t('fileExceeds')); return; }
    const text = await file.text();
    setInput(text);
    showToast(`${t('loaded')}: ${file.name}`, 'ok');
  }, [flashError, showToast, t]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChosen(f);
  }, [onFileChosen]);

  // Global drag listeners
  useEffect(() => {
    let counter = 0;
    const onEnter = (e: DragEvent) => { e.preventDefault(); counter++; setDragging(true); };
    const onLeave = (e: DragEvent) => { e.preventDefault(); counter--; if (counter <= 0) { counter = 0; setDragging(false); } };
    const onOver = (e: DragEvent) => e.preventDefault();
    const onDropWin = (e: DragEvent) => { e.preventDefault(); counter = 0; setDragging(false); };
    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('dragover', onOver);
    window.addEventListener('drop', onDropWin);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('drop', onDropWin);
    };
  }, []);

  // Hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'e') { e.preventDefault(); setMode('encrypt'); setTimeout(run, 0); }
      else if (meta && e.key.toLowerCase() === 'd') { e.preventDefault(); setMode('decrypt'); setTimeout(run, 0); }
      else if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); setTmplOpen(v => !v); }
      else if (meta && e.key.toLowerCase() === 'o') { e.preventDefault(); fileInputRef.current?.click(); }
      else if (meta && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); copyOut(); }
      else if (meta && e.key === '/') { e.preventDefault(); setDiffMode(v => !v); }
      else if (meta && (e.key === 'Backspace' || e.key === 'Delete')) { e.preventDefault(); clearAll(); }
      else if (e.altKey && e.key.toLowerCase() === 'p') { e.preventDefault(); setShowPw(v => !v); }
      else if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); setHelpOpen(v => !v); }
      }
      else if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false);
        if (tmplOpen) setTmplOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run, copyOut, clearAll, helpOpen, tmplOpen]);

  // Close templates on outside click
  useEffect(() => {
    if (!tmplOpen) return;
    const onClick = () => setTmplOpen(false);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [tmplOpen]);

  // Divider drag
  useEffect(() => {
    if (!draggingDivider) return;
    const onMove = (e: MouseEvent) => {
      if (!wsRef.current) return;
      const rect = wsRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.max(20, Math.min(80, pct)));
    };
    const onUp = () => setDraggingDivider(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingDivider]);

  const strengthNames = [t('weak'), t('fair'), t('good'), t('strong'), t('excellent')];
  const strength = passwordStrength(password);
  const lineCount = (input || '').split('\n').length;
  const charCount = (input || '').length;
  const outLines = (output || '').split('\n').length;

  const pickTemplate = (tmpl: VaultTemplate) => {
    setInput(tmpl.content);
    setMode('encrypt');
    setTmplOpen(false);
    showToast(`${t('template')}: ${tmpl.name}`, 'info');
  };

  const cliCmd = mode === 'encrypt'
    ? <><span className="arg">ansible-vault</span> encrypt <span className="flag">--vault-password-file</span> <span className="arg">@~/.vault_pass</span> {input.trim() ? 'input.yml' : ''}</>
    : <><span className="arg">ansible-vault</span> decrypt <span className="flag">--vault-password-file</span> <span className="arg">@~/.vault_pass</span> vault.yml</>;

  return (
    <div className="app">
      <input
        type="file"
        ref={fileInputRef}
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 1, height: 1, opacity: 0 }}
        onChange={(e) => onFileChosen(e.target.files?.[0])}
      />

      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark"><Icons.Vault size={18} /></span>
          <span className="brand-name">vault<span className="muted">.web</span></span>
        </div>
        <div className="tabbar">
          <button className={`tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => setMode('encrypt')}>
            <Icons.Lock size={13} className="ico" /> {t('encrypt')} <kbd style={{ marginLeft: 6 }}>^E</kbd>
          </button>
          <button className={`tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => setMode('decrypt')}>
            <Icons.Unlock size={13} className="ico" /> {t('decrypt')} <kbd style={{ marginLeft: 6 }}>^D</kbd>
          </button>
          <button className={`tab ${diffMode ? 'active' : ''}`} onClick={() => setDiffMode(v => !v)} disabled={!output} style={{ opacity: output ? 1 : 0.5 }}>
            <Icons.GitDiff size={13} className="ico" /> {t('diff')} <kbd style={{ marginLeft: 6 }}>^/</kbd>
          </button>
        </div>
        <div className="topbar-right">
          <div className="privacy-pill" title="Ansible Vault AES256 encryption via server">
            <span className="dot"></span>
            <Icons.Server size={12} />
            <span>ansible-vault</span>
          </div>
          <button className="tb-btn tb-templates" onClick={(e) => { e.stopPropagation(); setTmplOpen(v => !v); }}>
            <Icons.Templates size={13} /> {t('templates')} <kbd>^K</kbd>
          </button>
          <button
            className="tb-btn lang-switcher"
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            title={lang === 'en' ? 'Switch to Russian' : 'Switch to English'}
          >
            {lang === 'en' ? 'RU' : 'EN'}
          </button>
          <button className="tb-btn" onClick={() => setHelpOpen(true)} title={t('keyboardShortcuts')}>
            <Icons.Keyboard size={13} />
          </button>
        </div>
      </div>

      {/* CLI bar */}
      <div className="cli-bar">
        <Icons.Terminal size={12} />
        <span className="prompt">$</span>
        <span className="cmd">{cliCmd}</span>
        <button className="icon-btn" title={t('copyCli')} onClick={() => {
          const cmd = mode === 'encrypt'
            ? 'ansible-vault encrypt --vault-password-file @~/.vault_pass input.yml'
            : 'ansible-vault decrypt --vault-password-file @~/.vault_pass vault.yml';
          navigator.clipboard.writeText(cmd).then(() => showToast(t('cliCopied'), 'ok'));
        }}>
          <Icons.Copy size={12} />
        </button>
      </div>

      {/* Workspace */}
      <div className={`workspace ${diffMode && output ? 'diff-mode' : ''}`} ref={wsRef}
        style={!diffMode || !output ? { gridTemplateColumns: `${splitPct}% 1fr` } : {}}>
        {diffMode && output ? (
          <DiffView left={input} right={output} leftLabel={mode === 'encrypt' ? t('plaintext') : t('vault')} rightLabel={mode === 'encrypt' ? t('vault') : t('plaintext')} />
        ) : (
          <>
            {/* INPUT pane */}
            <div className="pane">
              <div className="pane-header">
                <div className="pane-label">
                  {inputIsVault ? <Icons.Lock size={12} className="ico" /> : <Icons.FileText size={12} className="ico" />}
                  <span>{inputIsVault ? t('vaultInput') : t('plaintextInput')}</span>
                  {inputIsVault && <span style={{ marginLeft: 6, color: 'var(--acc)', fontSize: 10, padding: '2px 6px', background: 'var(--acc-glow)', borderRadius: 2, letterSpacing: '0.06em' }}>{t('ENCRYPTED')}</span>}
                </div>
                <div className="pane-meta">
                  <span>{lineCount} ln</span><span className="sep">&middot;</span><span>{charCount} ch</span>
                </div>
                <button className="icon-btn" title={t('uploadFile')} onClick={() => fileInputRef.current?.click()}>
                  <Icons.Upload size={13} />
                </button>
                <button className="icon-btn" title={t('clearCtrl')} onClick={clearAll} disabled={!input}>
                  <Icons.Trash size={13} />
                </button>
              </div>
              <div className="pane-body">
                <Editor value={input} onChange={setInput} isVault={inputIsVault} onDrop={onDrop} placeholder={
                  <div className="placeholder-card">
                    <div className="icon-stack"><Icons.FileText size={48} stroke={1.2} /></div>
                    <div>{t('pastePlaceholder')}</div>
                    <div className="hints">
                      <span className="hint-row"><kbd>Ctrl</kbd><kbd>V</kbd> {t('paste')}</span>
                      <span className="hint-row"><kbd>Ctrl</kbd><kbd>O</kbd> {t('file')}</span>
                      <span className="hint-row"><kbd>Ctrl</kbd><kbd>K</kbd> {t('templates')}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontFamily: 'var(--sans)' }}>{t('dragDropHint')}</div>
                  </div>
                } />
              </div>

              {/* Action bar */}
              <div className={`action-bar ${errorShake ? 'shake' : ''}`}>
                <div className="password-input">
                  <span className="label">{t('key')}</span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder={mode === 'encrypt' ? t('vaultPasswordPlaceholder') : t('vaultPassword')}
                    autoComplete="off"
                    onKeyDown={(e) => { if (e.key === 'Enter') run(); }}
                  />
                  {mode === 'encrypt' && password && (
                    <div className="strength-meter" title={`${strengthNames[strength]}`}>
                      {[1, 2, 3, 4].map(i => <span key={i} className={`bar ${i <= strength ? `on-${strength}` : ''}`} />)}
                    </div>
                  )}
                  <button className="icon-btn" onClick={() => setShowPw(v => !v)} title={showPw ? t('hide') : t('show')}>
                    {showPw ? <Icons.EyeOff size={13} /> : <Icons.Eye size={13} />}
                  </button>
                </div>
                <button className="run-btn" onClick={run} disabled={busy || !input.trim() || !password}>
                  {busy ? <><Icons.Refresh size={13} className="spinning" /> {t('processing')}</> :
                    mode === 'encrypt' ? <><Icons.Lock size={13} /> {t('encrypt')} <kbd>^E</kbd></> :
                    <><Icons.Unlock size={13} /> {t('decrypt')} <kbd>^D</kbd></>}
                </button>
              </div>
            </div>

            <div className={`divider ${draggingDivider ? 'dragging' : ''}`} style={{ left: `${splitPct}%` }} onMouseDown={(e) => { e.preventDefault(); setDraggingDivider(true); }} />

            {/* OUTPUT pane */}
            <div className="pane">
              <div className="pane-header">
                <div className="pane-label">
                  {outputIsVault ? <Icons.Lock size={12} className="ico" /> : <Icons.FileText size={12} className="ico" />}
                  <span>{t('output')}</span>
                  {output && <span style={{ marginLeft: 6, color: outputIsVault ? 'var(--acc)' : 'var(--ok)', fontSize: 10, padding: '2px 6px', background: outputIsVault ? 'var(--acc-glow)' : 'var(--ok-bg)', borderRadius: 2, letterSpacing: '0.06em' }}>{outputIsVault ? t('ENCRYPTED') : t('DECRYPTED')}</span>}
                </div>
                <div className="pane-meta">
                  {output && <><span>{outLines} ln</span><span className="sep">&middot;</span><span>{output.length} ch</span></>}
                </div>
                <button className="icon-btn" title={t('outputToInput')} onClick={swapInOut} disabled={!output}>
                  <Icons.ArrowRight size={13} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button className="icon-btn" title={t('copyCtrl')} onClick={copyOut} disabled={!output}>
                  <Icons.Copy size={13} />
                </button>
                <button className="icon-btn" title={t('download')} onClick={downloadOut} disabled={!output}>
                  <Icons.Download size={13} />
                </button>
              </div>
              <div className="pane-body">
                {output ? (
                  <Editor value={output} onChange={() => {}} readOnly isVault={outputIsVault} />
                ) : (
                  <div className="empty-output">
                    <div style={{ color: 'var(--fg-3)' }}>
                      {mode === 'encrypt' ? <Icons.Lock size={32} stroke={1.2} /> : <Icons.Unlock size={32} stroke={1.2} />}
                    </div>
                    <h3>{mode === 'encrypt' ? t('awaitingEncryption') : t('awaitingDecryption')}</h3>
                    <p>{mode === 'encrypt' ? t('awaitingEncryptionDesc') : t('awaitingDecryptionDesc')}</p>
                    <div className="hints">
                      <span className="hint-row"><kbd>Ctrl</kbd><kbd>{mode === 'encrypt' ? 'E' : 'D'}</kbd> {t('run')}</span>
                      <span className="hint-row"><kbd>Ctrl</kbd><kbd>/</kbd> {t('diff')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {dragging && (
          <div className="drop-overlay">
            <div className="msg">
              <Icons.Upload size={28} />
              <div>{t('dropFile')}</div>
              <div style={{ fontSize: 11, color: 'var(--acc-2)' }}>max 10MB</div>
            </div>
          </div>
        )}

        <TemplatesMenu open={tmplOpen} onClose={() => setTmplOpen(false)} onPick={pickTemplate} />
      </div>

      {/* Status bar */}
      <div className="statusbar">
        <div className="status-cell acc"><Icons.Vault size={11} /><span>AES256</span></div>
        <div className="status-cell"><span>Ansible Vault · spec 1.1</span></div>
        {error && <div className="status-cell err"><Icons.X size={11} /> {error}</div>}
        <div className="spacer"></div>
        <div className="status-cell ok"><span className="dot-dot ok"></span><span>{t('serverReady')}</span></div>
        <div className="status-cell right" style={{ cursor: 'pointer' }} onClick={() => setHelpOpen(true)}><Icons.Help size={11} /> ?</div>
        <div className="status-cell right"><span>v1.0.0</span></div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.kind}`} key={toast.id}>
          {toast.kind === 'ok' && <Icons.Check size={13} />}
          {toast.kind === 'err' && <Icons.X size={13} />}
          {toast.kind === 'info' && <Icons.Zap size={13} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;
