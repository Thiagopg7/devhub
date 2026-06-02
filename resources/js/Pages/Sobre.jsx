import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import Reveal from '@/Components/Public/Reveal';
import {
    ArrowRight, Code2, CheckCircle2, Globe,
    Server, Monitor, Database, Brain, Briefcase, Wrench,
} from 'lucide-react';

const STATS = [
    { value: '+120', label: 'artigos publicados' },
    { value: '6',    label: 'trilhas de conteúdo' },
    { value: '+40k', label: 'leitores por mês' },
    { value: '100%', label: 'conteúdo em português' },
];

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

const TRACKS = [
    { Icon: Server,    name: 'Backend',        desc: 'Laravel, APIs, filas, arquitetura',         count: '38 artigos',  color: '#3cbdf8', href: '/blog' },
    { Icon: Monitor,   name: 'Frontend',        desc: 'React, Inertia, Tailwind, UI',               count: '31 artigos',  color: '#61dafb', href: '/blog' },
    { Icon: Brain,     name: 'IA & Dados',      desc: 'Embeddings, LLMs, pipelines',                count: '14 artigos',  color: '#a4abff', href: '/blog' },
    { Icon: Database,  name: 'Banco de Dados',  desc: 'PostgreSQL, modelagem, performance',         count: '22 artigos',  color: '#2fd9c2', href: '/blog' },
    { Icon: Briefcase, name: 'Carreira',        desc: 'Crescimento, soft skills, mercado',          count: '12 artigos',  color: '#f0b65a', href: '/blog' },
    { Icon: Wrench,    name: 'Ferramentas',     desc: 'IA, deploy, produtividade dev',              count: '9 reviews',   color: '#e08a63', href: '/blog' },
];

export default function Sobre() {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    return (
        <PublicLayout>
            <Head title={`Sobre Nós — ${siteName}`}>
                <meta name="description" content="Conheça o DevHub — hub de conhecimento técnico em português para devs brasileiros." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Sobre Nós — ${siteName}`} />
                <meta property="og:description" content="Conheça o DevHub — hub de conhecimento técnico em português para devs brasileiros." />
                <meta property="og:url" content={route('sobre')} />
            </Head>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 700, height: 700, left: '50%', top: -260, transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(60,189,248,0.09) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <nav className="flex items-center justify-center gap-2 font-mono text-xs mb-10" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>Sobre Nós</span>
                    </nav>

                    <span className="eyebrow" style={{ justifyContent: 'center' }}>Sobre o {siteName}</span>
                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-4 mb-6"
                        style={{ fontSize: 'clamp(34px,5vw,60px)' }}>
                        Um hub de conhecimento para quem{' '}
                        <span className="bg-gradient-to-r from-[#3cbdf8] to-[#7b86ff] bg-clip-text text-transparent">
                            constrói com código.
                        </span>
                    </h1>
                    <p className="max-w-[62ch] mx-auto text-base leading-relaxed" style={{ color: '#b6c5d8' }}>
                        O {siteName} nasceu de uma ideia simples: reunir, em português e com profundidade técnica,
                        o conteúdo que a gente gostaria de ter encontrado quando começou. Tutoriais testados,
                        decisões de arquitetura explicadas e as ferramentas que realmente usamos no dia a dia.
                    </p>
                </div>
            </section>

            {/* ── Stats strip ──────────────────────────────────────── */}
            <section style={{ background: '#0c1828', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
                        style={{ background: 'rgba(150,178,208,0.1)' }}>
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="flex flex-col items-center justify-center py-8 px-4 text-center"
                                style={{ background: '#0c1828' }}>
                                <span className="font-display font-bold text-white leading-none"
                                    style={{ fontSize: 'clamp(30px,4vw,44px)' }}>
                                    {value}
                                </span>
                                <span className="font-mono text-xs mt-2 uppercase tracking-widest" style={{ color: '#7b8da3' }}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ── Values ───────────────────────────────────────────── */}
            <section style={{ background: '#0a131e' }}>
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
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}>
                                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                                    style={{ background: 'rgba(60,189,248,0.1)', color: '#3cbdf8' }}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="font-display font-semibold text-white text-lg mb-3">{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#b6c5d8' }}>{desc}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tracks ───────────────────────────────────────────── */}
            <section style={{ background: '#0c1828', borderTop: '1px solid rgba(150,178,208,0.12)', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
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
                        <p className="max-w-[52ch] mx-auto text-base" style={{ color: '#7b8da3' }}>
                            Do primeiro CRUD ao deploy em produção — organizamos tudo por tema para você seguir a sua.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TRACKS.map(({ Icon, name, desc, count, color, href }, i) => (
                            <Reveal key={name} delay={i * 80}>
                                <Link href={href}
                                    className="flex items-center gap-4 rounded-2xl p-5 transition-all group"
                                    style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.3)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.12)'}>
                                    <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                                        style={{ background: `${color}18`, color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-sm">{name}</div>
                                        <div className="text-xs mt-0.5 truncate" style={{ color: '#7b8da3' }}>{desc}</div>
                                    </div>
                                    <span className="font-mono text-xs shrink-0" style={{ color: '#7b8da3' }}>{count}</span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <section style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Reveal className="relative rounded-[22px] overflow-hidden text-center px-8 py-16"
                        style={{ background: 'linear-gradient(135deg,#101f30,#15243a)', border: '1px solid rgba(150,178,208,0.18)' }}>
                        {/* glow */}
                        <div className="absolute pointer-events-none" style={{ width: 600, height: 600, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                        <div className="relative z-10 max-w-[560px] mx-auto">
                            <span className="eyebrow" style={{ justifyContent: 'center' }}>Construído com</span>
                            <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-4 mb-4"
                                style={{ fontSize: 'clamp(26px,3vw,36px)' }}>
                                Praticamos o que escrevemos
                            </h2>
                            <p className="text-base leading-relaxed" style={{ color: '#b6c5d8' }}>
                                O {siteName} roda em{' '}
                                <strong className="text-white">Laravel</strong> +{' '}
                                <strong className="text-white">React</strong> com Inertia.js,
                                estilizado com Tailwind e servido com MySQL — exatamente a stack que ensinamos.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center mt-8">
                                <Link href="/blog"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d' }}>
                                    Começar a ler <ArrowRight size={15} />
                                </Link>
                                <Link href="/#newsletter"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,178,208,0.24)', color: '#eaf1fa' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#3cbdf8'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.24)'}>
                                    Assinar a newsletter
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
