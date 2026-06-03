import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const VARIANTS = {
    primary: 'btn-primary',
    ghost:   'btn-ghost',
};

const SIZES = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
};

const isExternal = (href) => /^(https?:|mailto:|tel:|#)/.test(href);

/**
 * Botão/CTA padrão das páginas públicas.
 * - `href` interno → Inertia <Link>; href externo/#/mailto → <a>; sem href → <button>.
 * - variant: 'primary' (gradiente) | 'ghost'  ·  size: 'sm' | 'md' | 'lg'
 */
export default function Button({ href, as, variant = 'primary', size = 'md', className, children, ...props }) {
    const cls = cn('btn', VARIANTS[variant], SIZES[size], className);

    if (href) {
        return isExternal(href)
            ? <a href={href} className={cls} {...props}>{children}</a>
            : <Link href={href} className={cls} {...props}>{children}</Link>;
    }

    const Tag = as || 'button';
    return <Tag className={cls} {...props}>{children}</Tag>;
}
