import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const arrowBtn = 'inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors hover-accent hover:text-[var(--accent)]';
const pageBtn = 'inline-flex items-center justify-center min-w-[40px] px-3 py-2 text-sm rounded-xl transition-colors hover-accent hover:text-[var(--accent)]';
const linkStyle = { border: '1px solid var(--border-2)', color: 'var(--text-body)' };
const disabledStyle = { border: '1px solid var(--border-faint)', color: 'var(--text-muted)', cursor: 'not-allowed' };

function getPageNumbers(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
    if (current < last - 2) pages.push('...');
    pages.push(last);
    return pages;
}

/**
 * Paginação numerada das listagens públicas.
 * pageUrl: (page) => url — gera o link de cada número de página.
 */
export default function Pagination({ currentPage, lastPage, prevUrl, nextUrl, pageUrl }) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {prevUrl ? (
                <Link href={prevUrl} className={arrowBtn} style={linkStyle}>
                    <ChevronLeft size={16} /> Anterior
                </Link>
            ) : (
                <span className={arrowBtn} style={disabledStyle}>
                    <ChevronLeft size={16} /> Anterior
                </span>
            )}

            {getPageNumbers(currentPage, lastPage).map((page, i) =>
                page === '...' ? (
                    <span key={`e${i}`} className="px-1 text-sm" style={{ color: 'var(--text-muted)' }}>…</span>
                ) : page === currentPage ? (
                    <span key={page} className={`${pageBtn} font-semibold`}
                        style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: '1px solid var(--accent)' }}>
                        {page}
                    </span>
                ) : (
                    <Link key={page} href={pageUrl(page)} className={pageBtn} style={linkStyle}>
                        {page}
                    </Link>
                )
            )}

            {nextUrl ? (
                <Link href={nextUrl} className={arrowBtn} style={linkStyle}>
                    Próximo <ChevronRight size={16} />
                </Link>
            ) : (
                <span className={arrowBtn} style={disabledStyle}>
                    Próximo <ChevronRight size={16} />
                </span>
            )}
        </div>
    );
}
