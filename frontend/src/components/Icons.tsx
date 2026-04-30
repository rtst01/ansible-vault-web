import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  stroke?: number;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 14, className = '', stroke = 1.75, style, children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {children}
  </svg>
);

export const Lock: React.FC<IconProps> = (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="1.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
export const Unlock: React.FC<IconProps> = (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="1.5" /><path d="M8 11V7a4 4 0 0 1 7.8-1" /></Icon>;
export const Vault: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="14" cy="12" r="3" /><path d="M14 9v-1M14 16v-1M11 12h-1M17 12h-1M11.9 9.9l-.7-.7M16.8 14.8l-.7-.7M11.9 14.1l-.7.7M16.8 9.2l-.7.7" /><path d="M3 9h3M3 15h3" /></Icon>;
export const FileText: React.FC<IconProps> = (p) => <Icon {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M9 13h6M9 17h4" /></Icon>;
export const Shield: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></Icon>;
export const Eye: React.FC<IconProps> = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const EyeOff: React.FC<IconProps> = (p) => <Icon {...p}><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2" /><path d="M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 3.9M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7c1.6 0 3-.3 4.2-.7" /></Icon>;
export const Copy: React.FC<IconProps> = (p) => <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></Icon>;
export const Check: React.FC<IconProps> = (p) => <Icon {...p}><path d="M5 12l5 5L20 7" /></Icon>;
export const X: React.FC<IconProps> = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
export const Download: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 3v13M6 11l6 6 6-6M4 21h16" /></Icon>;
export const Upload: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 21V8M6 13l6-6 6 6M4 3h16" /></Icon>;
export const Trash: React.FC<IconProps> = (p) => <Icon {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14M10 11v6M14 11v6" /></Icon>;
export const Templates: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>;
export const Zap: React.FC<IconProps> = (p) => <Icon {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></Icon>;
export const Search: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>;
export const GitDiff: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M6 8v8a2 2 0 0 0 2 2h2M18 16V8a2 2 0 0 0-2-2h-2M11 5l-3 3 3 3M13 19l3-3-3-3" /></Icon>;
export const Terminal: React.FC<IconProps> = (p) => <Icon {...p}><rect x="2" y="4" width="20" height="16" rx="1.5" /><path d="M6 9l3 3-3 3M12 15h6" /></Icon>;
export const ArrowRight: React.FC<IconProps> = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>;
export const Keyboard: React.FC<IconProps> = (p) => <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="1.5" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" /></Icon>;
export const Help: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.9.5c0 1.5-2.5 2-2.5 3.5M12 17h.01" /></Icon>;
export const Refresh: React.FC<IconProps> = (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /></Icon>;
export const Server: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><path d="M7 6.5h.01M7 17.5h.01" /></Icon>;
