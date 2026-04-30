import React, { useRef, useMemo, useCallback } from 'react';
import { highlight } from '../utils/highlight';

interface EditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  isVault?: boolean;
  onDrop?: (e: React.DragEvent) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder, readOnly, isVault, onDrop }) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => (value || '').split('\n').length, [value]);

  const onScroll = useCallback(() => {
    if (gutterRef.current && editorRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, []);

  const html = useMemo(() => highlight(value || ''), [value]);

  const gutterText = useMemo(() => {
    return Array.from({ length: lines }, (_, i) => String(i + 1)).join('\n');
  }, [lines]);

  const isEmpty = !value;

  return (
    <div className="editor-wrap">
      <div className="gutter" ref={gutterRef}>{gutterText}</div>
      <div
        className={`editor ${isEmpty ? 'empty' : ''} ${isVault ? 'is-vault' : ''}`}
        ref={editorRef}
        onScroll={onScroll}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {isEmpty && placeholder && <div className="placeholder">{placeholder}</div>}
        <pre className="syntax" dangerouslySetInnerHTML={{ __html: html }} />
        <textarea
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          wrap="off"
        />
      </div>
    </div>
  );
};

export default Editor;
