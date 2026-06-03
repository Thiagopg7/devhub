import { cn } from '@/lib/utils';

const SIZES = {
    sm: { box: 'w-9 h-9 text-xs',  name: 'text-sm' },
    md: { box: 'w-10 h-10 text-sm', name: 'text-sm' },
};

/** Selo de autoria reutilizável: avatar "DH" + nome + subtítulo. */
export default function AuthorBadge({ size = 'md', name = 'Equipe DevHub', subtitle = 'Engenharia & Conteúdo', className }) {
    const c = SIZES[size];

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className={cn('rounded-full grid place-items-center font-display font-semibold text-white shrink-0', c.box)}
                style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
                DH
            </div>
            <div>
                <div className={cn('font-semibold text-white', c.name)}>{name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>
            </div>
        </div>
    );
}
