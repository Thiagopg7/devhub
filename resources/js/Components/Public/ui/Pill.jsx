import { cn } from '@/lib/utils';

/**
 * Pill de filtro (botão arredondado) usada nas listagens públicas.
 * `active` alterna entre o estado preenchido (gradiente) e o neutro.
 */
export default function Pill({ active = false, size = 'px-4 py-2.5 text-sm', className, children, ...props }) {
    return (
        <button
            className={cn('pill', active ? 'pill-active' : 'pill-idle', size, className)}
            {...props}
        >
            {children}
        </button>
    );
}
