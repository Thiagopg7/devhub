import Reveal from '@/Components/Public/Reveal';
import useCountUp from '@/hooks/useCountUp';

/** Valor numérico com animação de contagem (prefixo/sufixo opcionais, ex.: "+", "k", "%"). */
function AnimatedValue({ prefix = '', count, suffix = '' }) {
    const value = useCountUp(count);
    return <>{prefix}{value}{suffix}</>;
}

/** Faixa de métricas da página Sobre. */
export default function StatsStrip({ stats = {} }) {
    const publishedPosts = stats.publishedPosts ?? 0;
    const categories = stats.categories ?? 0;

    // Arredonda os artigos pra baixo na dezena (ex.: 28 → 20) para exibir "+20"
    const postsTarget = publishedPosts >= 10 ? Math.floor(publishedPosts / 10) * 10 : publishedPosts;

    const STATS = [
        { value: <AnimatedValue prefix="+" count={postsTarget} />,    label: 'artigos publicados' },
        { value: <AnimatedValue count={categories} />,               label: 'trilhas de conteúdo' },
        { value: <AnimatedValue prefix="+" count={40} suffix="k" />, label: 'leitores por mês' },
        { value: <AnimatedValue count={100} suffix="%" />,           label: 'conteúdo em português' },
    ];

    return (
        <section style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(150,178,208,0.1)' }}>
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center justify-center py-8 px-4 text-center"
                            style={{ background: 'var(--panel)' }}>
                            <span className="font-display font-bold text-white leading-none"
                                style={{ fontSize: 'clamp(30px,4vw,44px)' }}>
                                {value}
                            </span>
                            <span className="font-mono text-xs mt-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
