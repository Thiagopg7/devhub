import Reveal from '@/Components/Public/Reveal';

const STATS = [
    { value: '+120', label: 'artigos publicados' },
    { value: '6',    label: 'trilhas de conteúdo' },
    { value: '+40k', label: 'leitores por mês' },
    { value: '100%', label: 'conteúdo em português' },
];

/** Faixa de métricas da página Sobre. */
export default function StatsStrip() {
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
