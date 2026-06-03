import { useState } from 'react';
import { Check } from 'lucide-react';

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.3L4 21H1l7.5-8.6L.5 3H7l4.5 5.8L17.5 3zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 005 0 2.5 2.5 0 00-2.52-2.5zM3 8.98h4v12.02H3V8.98zM10 8.98h3.8v1.64h.06c.53-1 1.83-2.06 3.76-2.06 4 0 4.74 2.64 4.74 6.07v6.37h-4v-5.65c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.99v5.74H10V8.98z" />
        </svg>
    );
}

async function copyToClipboard(text) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}

function CopyLinkBtn() {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await copyToClipboard(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };
    return (
        <button onClick={copy} aria-label="Copiar link"
            className="w-9 h-9 grid place-items-center rounded-lg transition-all hover:-translate-y-0.5"
            style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                color: copied ? 'var(--accent)' : 'var(--text-muted)',
            }}>
            {copied
                ? <Check size={14} />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" /><path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" /></svg>
            }
        </button>
    );
}

function shareUrl(platform, url, title) {
    const enc = encodeURIComponent;
    if (platform === 'x')
        return `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
    if (platform === 'linkedin')
        return `https://www.linkedin.com/shareArticle?mini=true&url=${enc(url)}&title=${enc(title)}`;
    return '#';
}

export default function ShareButtons({ url, title, className = '' }) {
    const btnCls = "share-tile w-9 h-9 grid place-items-center rounded-lg hover:-translate-y-0.5";

    return (
        <div className={`flex gap-2 ${className}`}>
            <a href={shareUrl('x', url, title)} target="_blank" rel="noopener noreferrer"
                aria-label="Compartilhar no X" className={btnCls}>
                <XIcon />
            </a>
            <a href={shareUrl('linkedin', url, title)} target="_blank" rel="noopener noreferrer"
                aria-label="Compartilhar no LinkedIn" className={btnCls}>
                <LinkedInIcon />
            </a>
            <CopyLinkBtn />
        </div>
    );
}
