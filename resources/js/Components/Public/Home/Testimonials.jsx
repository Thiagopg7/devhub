import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';

/* ── Depoimentos estáticos ──────────────────────────────────────────── */
const TESTIMONIALS = [
    { text: 'Exemplo de depoimento — este espaço será preenchido com feedback real de leitores.', name: 'Leitor DevHub', role: 'Desenvolvedor', initials: '?', gradient: 'linear-gradient(135deg,var(--accent),var(--accent-2))' },
    { text: 'Exemplo de depoimento — este espaço será preenchido com feedback real de leitores.', name: 'Leitor DevHub', role: 'Desenvolvedor', initials: '?', gradient: 'linear-gradient(135deg,var(--violet),#5560e6)' },
    { text: 'Exemplo de depoimento — este espaço será preenchido com feedback real de leitores.', name: 'Leitor DevHub', role: 'Desenvolvedor', initials: '?', gradient: 'linear-gradient(135deg,var(--teal),#1b9e8c)' },
];

function Stars() {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="var(--gold)" width="14" height="14">
                    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal><SectionHead eyebrow="O que dizem" title="Quem lê, recomenda" subtitle="A comunidade de devs que acompanha o DevHub no dia a dia." /></Reveal>

                <Reveal>
                    <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-8"
                        style={{ background: 'rgba(123,134,255,0.1)', border: '1px solid rgba(123,134,255,0.25)', color: 'var(--violet)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Seção em construção — depoimentos reais em breve
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 120} as="figure" className="flex flex-col rounded-2xl p-7"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div className="text-5xl leading-none mb-4 font-display" style={{ color: 'var(--accent)', opacity: 0.5 }}>&ldquo;</div>
                            <p className="flex-1 text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-muted)' }}>{t.text}</p>
                            <Stars />
                            <figcaption className="flex items-center gap-3 mt-5">
                                <div className="w-10 h-10 rounded-full grid place-items-center font-display font-semibold text-sm text-white shrink-0"
                                    style={{ background: t.gradient }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t.name}</div>
                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                                </div>
                            </figcaption>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
