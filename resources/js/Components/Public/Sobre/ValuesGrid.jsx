import { Code2, CheckCircle2, Globe } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';

const VALUES = [
    {
        Icon: Code2,
        title: 'Profundidade técnica',
        desc: 'Nada de tutorial raso que para no "hello world". A gente vai até onde a coisa fica interessante — e difícil.',
    },
    {
        Icon: CheckCircle2,
        title: 'Testado na prática',
        desc: 'Todo código que publicamos foi escrito, rodado e revisado. Se está aqui, funciona — e explicamos por quê.',
    },
    {
        Icon: Globe,
        title: 'Aberto e em português',
        desc: 'Conteúdo de qualidade não deveria depender de inglês fluente. Escrevemos para a comunidade dev brasileira.',
    },
];

/** Princípios que guiam o conteúdo (página Sobre). */
export default function ValuesGrid() {
    return (
        <section style={{ background: 'var(--base)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal className="mb-12 text-center">
                    <span className="eyebrow" style={{ justifyContent: 'center' }}>Nossos princípios</span>
                    <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3"
                        style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
                        O que guia cada artigo
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {VALUES.map(({ Icon, title, desc }, i) => (
                        <Reveal key={title} delay={i * 100} className="rounded-2xl p-8"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                                style={{ background: 'rgba(60,189,248,0.1)', color: 'var(--accent)' }}>
                                <Icon size={20} />
                            </div>
                            <h3 className="font-display font-semibold text-white text-lg mb-3">{title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{desc}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
