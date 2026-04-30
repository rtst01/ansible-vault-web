import React from 'react';
import * as Icons from './Icons';
import { useI18n } from '../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useI18n();

  if (!open) return null;

  const rows = [
    { l: t('helpEncrypt'), k: ['Ctrl', 'E'] },
    { l: t('helpDecrypt'), k: ['Ctrl', 'D'] },
    { l: t('helpOpenTemplates'), k: ['Ctrl', 'K'] },
    { l: t('helpUploadFile'), k: ['Ctrl', 'O'] },
    { l: t('helpCopyOutput'), k: ['Ctrl', 'Shift', 'C'] },
    { l: t('helpDiff'), k: ['Ctrl', '/'] },
    { l: t('helpClearAll'), k: ['Ctrl', 'Del'] },
    { l: t('helpTogglePassword'), k: ['Alt', 'P'] },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('keyboardShortcuts')}</h2>
          <button className="close" onClick={onClose}><Icons.X size={16} /></button>
        </div>
        <div className="modal-body">
          {rows.map((r, i) => (
            <div key={i} className="kbd-row">
              <span>{r.l}</span>
              <span className="keys">{r.k.map((k, j) => <kbd key={j}>{k}</kbd>)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
