import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';

/* ── Depoimentos estáticos ──────────────────────────────────────────── */
const TESTIMONIALS = [
    { text: 'Os artigos do DevHub foram o empurrão que faltava pra eu sair do tutorial hell. Direto ao ponto, sem encheção, e com exemplos que dá pra usar no projeto real.', name: 'Mariana Alves', role: 'Desenvolvedora Front-end', initials: 'MA', gradient: 'linear-gradient(135deg,var(--accent),var(--accent-2))' },
    { text: 'Finalmente um conteúdo de Laravel em português que cobre o mundo real: filas, deploy, testes. Virou leitura semanal aqui no time.', name: 'Rafael Mendes', role: 'Tech Lead', initials: 'RM', gradient: 'linear-gradient(135deg,var(--violet),#5560e6)' },
    { text: 'Implementei busca semântica seguindo o guia de IA e funcionou de primeira. O nível de detalhe técnico do DevHub é raro de achar por aí.', name: 'Carla Souza', role: 'Engenheira de Software', initials: 'CS', gradient: 'linear-gradient(135deg,var(--teal),#1b9e8c)' },
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 120} as="figure" className="flex flex-col rounded-2xl p-7"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div className="text-5xl leading-none mb-4 font-display" style={{ color: 'var(--accent)', opacity: 0.5 }}>&ldquo;</div>
                            <p className="flex-1 text-sm leading-relaxed mb-5" style={{ color: 'var(--text-body)' }}>{t.text}</p>
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
