const ESC = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlightValue(v: string): string {
  if (!v) return '';
  if (/^"[^"]*"$/.test(v) || /^'[^']*'$/.test(v)) return `<span class="tok-str">${ESC(v)}</span>`;
  if (/^-?\d+(\.\d+)?$/.test(v.trim())) return `<span class="tok-num">${ESC(v)}</span>`;
  if (/^(true|false|yes|no|null|~)$/i.test(v.trim())) return `<span class="tok-bool">${ESC(v)}</span>`;
  return ESC(v).replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="tok-str">$1</span>');
}

function highlightLine(line: string): string {
  if (/^\s*#/.test(line)) return `<span class="tok-com">${ESC(line)}</span>`;

  const m = line.match(/^(\s*)([A-Za-z_][\w.-]*|"[^"]+"|'[^']+')(\s*):(\s*)(.*)$/);
  if (m) {
    const [, indent, key, sp1, sp2, rest] = m;
    return ESC(indent) + `<span class="tok-key">${ESC(key)}</span>` + ESC(sp1) + `<span class="tok-punct">:</span>` + ESC(sp2) + highlightValue(rest);
  }

  const env = line.match(/^(\s*)([A-Z_][A-Z0-9_]*)(=)(.*)$/);
  if (env) {
    const [, indent, key, eq, val] = env;
    return ESC(indent) + `<span class="tok-key">${ESC(key)}</span>` + `<span class="tok-punct">${ESC(eq)}</span>` + highlightValue(val);
  }

  const li = line.match(/^(\s*)(-)(\s+)(.*)$/);
  if (li) {
    const [, indent, dash, sp, rest] = li;
    return ESC(indent) + `<span class="tok-punct">${ESC(dash)}</span>` + ESC(sp) + highlightValue(rest);
  }

  return highlightValue(line);
}

export function highlight(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  if (lines[0] && lines[0].startsWith('$ANSIBLE_VAULT')) {
    const out = [`<span class="tok-vault-header">${ESC(lines[0])}</span>`];
    for (let i = 1; i < lines.length; i++) {
      out.push(`<span class="tok-vault-body">${ESC(lines[i])}</span>`);
    }
    return out.join('\n') + '\n';
  }
  return lines.map(highlightLine).join('\n') + '\n';
}

export function isVault(text: string): boolean {
  return /^\$ANSIBLE_VAULT/m.test((text || '').trim());
}

export function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 14) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
