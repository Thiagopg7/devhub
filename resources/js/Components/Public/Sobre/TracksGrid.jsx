import { Link } from '@inertiajs/react';
import { Server, Monitor, Brain, Database, Briefcase, Wrench } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';

const TRACKS = [
    { Icon: Server,    name: 'Backend',        desc: 'Laravel, APIs, filas, arquitetura',         count: '38 artigos',  color: 'var(--accent)', href: '/blog' },
    { Icon: Monitor,   name: 'Frontend',        desc: 'React, Inertia, Tailwind, UI',               count: '31 artigos',  color: '#61dafb', href: '/blog' },
    { Icon: Brain,     name: 'IA & Dados',      desc: 'Embeddings, LLMs, pipelines',                count: '14 artigos',  color: '#a4abff', href: '/blog' },
    { Icon: Database,  name: 'Banco de Dados',  desc: 'PostgreSQL, modelagem, performance',         count: '22 artigos',  color: 'var(--teal)', href: '/blog' },
    { Icon: Briefcase, name: 'Carreira',        desc: 'Crescimento, soft skills, mercado',          count: '12 artigos',  color: 'var(--gold)', href: '/blog' },
    { Icon: Wrench,    name: 'Ferramentas',     desc: 'IA, deploy, produtividade dev',              count: '9 reviews',   color: '#e08a63', href: '/blog' },
];

/** Trilhas de conteúdo cobertas pelo DevHub (página Sobre). */
export default function TracksGrid() {
    return (
        <section style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal className="mb-3 text-center">
                    <span className="eyebrow" style={{ justifyContent: 'center' }}>O que cobrimos</span>
                </Reveal>
                <Reveal delay={80} className="text-center mb-4">
                    <h2 className="font-display font-semibold text-white leading-tight tracking-tight"
                        style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
                        Seis trilhas de conteúdo
                    </h2>
                </Reveal>
                <Reveal delay={140} className="text-center mb-14">
                    <p className="max-w-[52ch] mx-auto text-base" style={{ color: 'var(--text-muted)' }}>
                        Do primeiro CRUD ao deploy em produção — organizamos tudo por tema para você seguir a sua.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TRACKS.map(({ Icon, name, desc, count, color, href }, i) => (
                        <Reveal key={name} delay={i * 80}>
                            <Link href={href}
                                className="card card-hover flex items-center gap-4 rounded-2xl p-5 group">
                                <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                                    style={{ background: `${color}18`, color }}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white text-sm">{name}</div>
                                    <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                                </div>
                                <span className="font-mono text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{count}</span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
