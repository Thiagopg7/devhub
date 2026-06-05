import { cn, initials } from '@/lib/utils';

const SIZES = {
    sm: { box: 'w-9 h-9', text: 'text-xs', name: 'text-sm' },
    md: { box: 'w-10 h-10', text: 'text-sm', name: 'text-sm' },
};

/** Selo de autoria reutilizável: avatar (imagem ou iniciais) + nome + subtítulo. */
export default function AuthorBadge({ size = 'md', author = null, subtitle = 'Engenharia & Conteúdo', className }) {
    const c = SIZES[size];
    const name = author?.name || 'Equipe DevHub';
    const avatar = author?.avatar_image_url || null;

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {avatar ? (
                <img src={avatar} alt={name} className={cn('rounded-full object-cover shrink-0', c.box)} />
            ) : (
                <div className={cn('rounded-full grid place-items-center font-display font-semibold text-white shrink-0', c.box, c.text)}
                    style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
                    {author ? initials(name) : 'DH'}
                </div>
            )}
            <div>
                <div className={cn('font-semibold text-white', c.name)}>{name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>
            </div>
        </div>
    );
}
