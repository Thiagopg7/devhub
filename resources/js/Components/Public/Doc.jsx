import { Info } from 'lucide-react';

/* Primitivos de documento para páginas de texto longo (Privacidade, Termos, etc.). */

export function Section({ id, title, children }) {
    return (
        <section id={id} className="mt-10">
            <h2 className="font-display font-semibold text-white mb-4"
                style={{ fontSize: 'clamp(18px,2.2vw,22px)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                {title}
            </h2>
            <div className="space-y-3 text-base leading-relaxed" style={{ color: 'var(--text-body)' }}>
                {children}
            </div>
        </section>
    );
}

export function Ul({ items }) {
    return (
        <ul className="space-y-2 pl-5">
            {items.map((item, i) => (
                <li key={i} className="relative before:absolute before:-left-4 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--accent)]">
                    {item}
                </li>
            ))}
        </ul>
    );
}

export function Ol({ items }) {
    return (
        <ol className="space-y-2 pl-5 list-decimal marker:text-[var(--accent)] marker:font-semibold">
            {items.map((item, i) => (
                <li key={i}>{item}</li>
            ))}
        </ol>
    );
}

export function Callout({ children }) {
    return (
        <div className="flex gap-4 rounded-xl p-5 mt-4"
            style={{ background: 'rgba(60,189,248,0.06)', border: '1px solid rgba(60,189,248,0.2)' }}>
            <Info size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{children}</p>
        </div>
    );
}
