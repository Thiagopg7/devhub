import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function SectionHead({ eyebrow, title, subtitle, linkHref, linkLabel }) {
    return (
        <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3"
                    style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-base max-w-[52ch]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
                )}
            </div>
            {linkHref && (
                <Link href={linkHref}
                    className="inline-flex items-center gap-2 text-sm font-mono transition-all hover:gap-3.5"
                    style={{ color: 'var(--accent)', letterSpacing: '0.02em' }}>
                    {linkLabel ?? 'Ver todos'}
                    <ArrowRight size={15} />
                </Link>
            )}
        </div>
    );
}
