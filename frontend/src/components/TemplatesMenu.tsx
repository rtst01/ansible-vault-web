import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VAULT_TEMPLATES, VaultTemplate } from '../data/templates';
import * as Icons from './Icons';
import { useI18n } from '../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (t: VaultTemplate) => void;
}

const TemplatesMenu: React.FC<Props> = ({ open, onClose, onPick }) => {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setFocused(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return VAULT_TEMPLATES.filter(tmpl =>
      !ql || tmpl.name.toLowerCase().includes(ql) || tmpl.desc.toLowerCase().includes(ql) || tmpl.tag.toLowerCase().includes(ql)
    );
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(filtered.length - 1, f + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const tmpl = filtered[focused];
        if (tmpl) onPick(tmpl);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, focused, onClose, onPick]);

  if (!open) return null;
  return (
    <div className="templates-menu" onClick={(e) => e.stopPropagation()}>
      <div className="menu-search">
        <Icons.Search size={12} />
        <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setFocused(0); }} placeholder={t('searchTemplates')} />
        <kbd>esc</kbd>
      </div>
      <div className="menu-list">
        {filtered.length === 0 && <div style={{ padding: 16, color: 'var(--fg-3)', fontSize: 12, textAlign: 'center' }}>{t('nothingFound')}</div>}
        {filtered.map((tmpl, i) => (
          <button key={tmpl.id} className={`tmpl-item ${i === focused ? 'focused' : ''}`} onClick={() => onPick(tmpl)} onMouseEnter={() => setFocused(i)}>
            <span className="tmpl-ico"><Icons.FileText size={14} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tmpl-name">{tmpl.name}</div>
              <div className="tmpl-desc">{tmpl.desc}</div>
            </div>
            <span className="tmpl-tag">{tmpl.tag}</span>
          </button>
        ))}
      </div>
      <div className="menu-footer">
        <span>{t('navigate')}</span>
        <span>{filtered.length} / {VAULT_TEMPLATES.length}</span>
      </div>
    </div>
  );
};

export default TemplatesMenu;
