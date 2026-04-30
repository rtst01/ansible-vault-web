import React, { useMemo } from 'react';
import { diffLines } from '../utils/diff';
import * as Icons from './Icons';

interface Props {
  left: string;
  right: string;
  leftLabel: string;
  rightLabel: string;
}

const DiffView: React.FC<Props> = ({ left, right, leftLabel, rightLabel }) => {
  const ops = useMemo(() => diffLines(left, right), [left, right]);

  const rows = useMemo(() => {
    return ops.map((op) => {
      if (op.t === 'eq') return { left: op.a || '', right: op.b || '', lt: 'eq', rt: 'eq', li: (op.ai ?? 0) + 1, ri: (op.bi ?? 0) + 1 };
      if (op.t === 'rm') return { left: op.a || '', right: '', lt: 'rm', rt: 'pad', li: (op.ai ?? 0) + 1, ri: '' as string | number };
      return { left: '', right: op.b || '', lt: 'pad', rt: 'add', li: '' as string | number, ri: (op.bi ?? 0) + 1 };
    });
  }, [ops]);

  return (
    <div className="diff-grid">
      <div className="diff-col">
        <div className="diff-col-header"><Icons.GitDiff size={12} /> {leftLabel}</div>
        <div className="diff-content">
          {rows.map((r, i) => (
            <div key={i} className={`diff-line ${r.lt === 'rm' ? 'rm' : ''}`}>
              <span className="ln">{r.li}</span>
              <span className="marker">{r.lt === 'rm' ? '−' : ' '}</span>
              <span className="content">{r.left}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="diff-col">
        <div className="diff-col-header"><Icons.GitDiff size={12} /> {rightLabel}</div>
        <div className="diff-content">
          {rows.map((r, i) => (
            <div key={i} className={`diff-line ${r.rt === 'add' ? 'add' : ''}`}>
              <span className="ln">{r.ri}</span>
              <span className="marker">{r.rt === 'add' ? '+' : ' '}</span>
              <span className="content">{r.right}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiffView;
