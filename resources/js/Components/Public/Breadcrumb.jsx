import { Fragment } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Breadcrumb de navegação das páginas públicas.
 * items: [{ label, href?, truncate? }] — o último item (ou os sem href) é renderizado como texto atual.
 */
export default function Breadcrumb({ items, center = false }) {
    return (
        <nav className={`flex items-center gap-2 font-mono text-xs mb-8${center ? ' justify-center' : ''}`} style={{ color: 'var(--text-muted)' }}>
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <Fragment key={i}>
                        {i > 0 && <span>/</span>}
                        {item.href && !isLast ? (
                            <Link href={item.href} className="hover:text-[var(--accent)] transition-colors">{item.label}</Link>
                        ) : (
                            <span className={item.truncate ? 'truncate max-w-[200px]' : undefined} style={{ color: 'var(--text-bright)' }}>
                                {item.label}
                            </span>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}
