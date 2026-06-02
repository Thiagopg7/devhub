import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBanner from '@/Components/Public/HeroBanner';
import PostCard from '@/Components/Public/PostCard';
import TechCarousel from '@/Components/Public/TechCarousel';
import StackMarquee from '@/Components/Public/StackMarquee';
import Newsletter from '@/Components/Public/Newsletter';
import Reveal from '@/Components/Public/Reveal';
import { ArrowRight, Calendar, Clock, MapPin, LayoutGrid, Globe, Server, Database, Brain, Briefcase, Shield, Cloud, Code2, Layers, Cpu } from 'lucide-react';

const CATEGORY_ICONS = {
    all:       LayoutGrid,
    frontend:  Globe,
    web:       Globe,
    backend:   Server,
    servidor:  Server,
    banco:     Database,
    dados:     Database,
    database:  Database,
    ia:        Brain,
    intelig:   Brain,
    machine:   Cpu,
    devops:    Cloud,
    infra:     Cloud,
    cloud:     Cloud,
    carreira:  Briefcase,
    emprego:   Briefcase,
    segurança: Shield,
    mobile:    Code2,
    default:   Code2,
};

function categoryIcon(name) {
    const key = name.toLowerCase();
    for (const [token, Icon] of Object.entries(CATEGORY_ICONS)) {
        if (key.includes(token)) return Icon;
    }
    return CATEGORY_ICONS.default;
}

/* ── Static testimonials ───────────────────────────────────── */
const TESTIMONIALS = [
    { text: 'Os artigos do DevHub foram o empurrão que faltava pra eu sair do tutorial hell. Direto ao ponto, sem encheção, e com exemplos que dá pra usar no projeto real.', name: 'Mariana Alves', role: 'Desenvolvedora Front-end', initials: 'MA', gradient: 'linear-gradient(135deg,#3cbdf8,#2a9be0)' },
    { text: 'Finalmente um conteúdo de Laravel em português que cobre o mundo real: filas, deploy, testes. Virou leitura semanal aqui no time.', name: 'Rafael Mendes', role: 'Tech Lead', initials: 'RM', gradient: 'linear-gradient(135deg,#7b86ff,#5560e6)' },
    { text: 'Implementei busca semântica seguindo o guia de IA e funcionou de primeira. O nível de detalhe técnico do DevHub é raro de achar por aí.', name: 'Carla Souza', role: 'Engenheira de Software', initials: 'CS', gradient: 'linear-gradient(135deg,#2fd9c2,#1b9e8c)' },
];

/* ── Static events ─────────────────────────────────────────── */
const EVENTS = [
    { day: '12', mon: 'Jun', yr: '2026', type: 'Conferência', typeColor: '#3cbdf8', online: true,  title: 'Laravel Live Brasil 2026', org: 'Comunidade Laravel BR', time: '19h00 – 22h00 (BRT)', location: 'Transmissão ao vivo', cta: 'Garantir vaga', primary: true,  seats: 'Gratuito · inscrição aberta', seatsLow: false },
    { day: '21', mon: 'Jun', yr: '2026', type: 'Meetup',      typeColor: '#7b86ff', online: false, title: 'React Summit São Paulo',    org: 'Frontend Guild',       time: '14h00 – 18h00',      location: 'São Paulo, SP',           cta: 'Saiba mais',    primary: false, seats: 'Últimas vagas',              seatsLow: true  },
    { day: '05', mon: 'Jul', yr: '2026', type: 'Workshop',    typeColor: '#2fd9c2', online: true,  title: 'Construindo APIs com IA: do embedding à busca semântica', org: 'DevHub', time: '20h00 – 21h30 (BRT)', location: 'Hands-on ao vivo', cta: 'Garantir vaga', primary: true, seats: 'Vagas limitadas', seatsLow: false },
];

function Stars() {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="#f0b65a" width="14" height="14">
                    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>
                </svg>
            ))}
        </div>
    );
}

function SectionHead({ eyebrow, title, subtitle, linkHref, linkLabel }) {
    return (
        <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>{title}</h2>
                {subtitle && <p className="mt-2 text-base max-w-[52ch]" style={{ color: '#7b8da3' }}>{subtitle}</p>}
            </div>
            {linkHref && (
                <Link href={linkHref} className="inline-flex items-center gap-2 text-sm font-mono transition-all hover:gap-3.5" style={{ color: '#3cbdf8', letterSpacing: '0.02em' }}>
                    {linkLabel ?? 'Ver todos'}
                    <ArrowRight size={15} />
                </Link>
            )}
        </div>
    );
}

export default function Home({ featuredPosts = [], technologies = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName  = siteConfig.site_name || 'DevHub';
    const homeTitle = `${siteName} — Hub de Inovação e Tecnologia`;

    /* Category filter state (client-side, only for homepage preview) */
    const allCategories = [...new Set(featuredPosts.map(p => p.category?.name).filter(Boolean))];
    const [activeFilter, setActiveFilter] = useState('all');
    const visiblePosts  = activeFilter === 'all'
        ? featuredPosts
        : featuredPosts.filter(p => p.category?.name === activeFilter);

    /* Pick featured (first post) */
    const featured = featuredPosts[0] ?? null;

    return (
        <PublicLayout>
            <Head title={homeTitle}>
                {siteConfig.site_tagline && <meta name="description" content={siteConfig.site_tagline} />}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={homeTitle} />
                {siteConfig.site_tagline && <meta property="og:description" content={siteConfig.site_tagline} />}
                <meta property="og:url" content={route('home')} />
            </Head>

            <HeroBanner />

            {/* ── Featured ────────────────────────────────────────── */}
            {featured && (
                <section style={{ background: '#0c1828', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <Reveal><SectionHead eyebrow="Destaque da semana" title="Leitura obrigatória" linkHref="/blog" linkLabel="Ver todos os destaques" /></Reveal>

                        <Reveal delay={150} as="article" className="grid md:grid-cols-[1.15fr_1fr] rounded-[22px] overflow-hidden"
                            style={{ background: 'linear-gradient(135deg,#101f30,#15243a)', border: '1px solid rgba(150,178,208,0.12)', boxShadow: '0 18px 40px -22px rgba(0,0,0,0.7)' }}>

                            {/* Media */}
                            <div className="relative min-h-[320px] overflow-hidden">
                                {featured.banner_image_url ? (
                                    <img src={featured.banner_image_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 grid place-items-center" style={{ background: 'linear-gradient(135deg,#101f30,#0a131e)' }}>
                                        <span className="font-display font-semibold text-2xl text-center px-8 leading-tight" style={{ color: '#3cbdf8', opacity: 0.8 }}>
                                            {featured.title}
                                        </span>
                                    </div>
                                )}
                                {featured.category && (
                                    <span className="absolute top-4 left-4 z-10 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-semibold"
                                        style={{ background: '#3cbdf8', color: '#03121d' }}>
                                        {featured.category.name}
                                    </span>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-10 flex flex-col justify-center">
                                <div className="inline-flex items-center flex-wrap gap-3 font-mono text-[13px] mb-4 leading-none" style={{ color: '#7b8da3' }}>
                                    {featured.category && <span style={{ color: '#3cbdf8' }}>{featured.category.name}</span>}
                                    <span aria-hidden="true">•</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar size={12} style={{ display: 'block', flexShrink: 0 }} />
                                        {new Date(featured.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span aria-hidden="true">•</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock size={12} style={{ display: 'block', flexShrink: 0 }} />
                                        {Math.max(1, Math.ceil((featured.content ?? '').replace(/<[^>]+>/g, '').split(/\s+/).length / 200))} min
                                    </span>
                                </div>
                                <h3 className="font-display font-semibold text-white leading-tight tracking-tight mb-3" style={{ fontSize: 'clamp(26px,2.8vw,34px)' }}>
                                    {featured.title}
                                </h3>
                                {featured.description && (
                                    <p className="text-base mb-8 max-w-[50ch]" style={{ color: '#b6c5d8' }}>{featured.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full grid place-items-center font-display font-semibold text-sm text-white shrink-0"
                                        style={{ background: 'linear-gradient(135deg,#3cbdf8,#2a9be0)' }}>DH</div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">Equipe DevHub</div>
                                        <div className="text-xs" style={{ color: '#7b8da3' }}>Engenharia &amp; Conteúdo</div>
                                    </div>
                                    <Link href={route('blog.show', featured.slug)}
                                        className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,178,208,0.24)', color: '#eaf1fa' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor='#3cbdf8'; e.currentTarget.style.color='#3cbdf8'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(150,178,208,0.24)'; e.currentTarget.style.color='#eaf1fa'; }}>
                                        Ler artigo <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            )}

            {/* ── Posts grid ──────────────────────────────────────── */}
            <section style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Reveal>
                        <SectionHead
                            eyebrow="Últimas publicações"
                            title="Explore por trilha"
                            subtitle="Escolha um tema e mergulhe. Filtre os artigos pela área que você quer dominar."
                            linkHref="/blog"
                            linkLabel="Ver todos"
                        />
                    </Reveal>

                    <Reveal delay={100}>
                        {/* Category filter pills */}
                        {allCategories.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-9">
                                {[{ label: 'Todos', value: 'all' }, ...allCategories.map(c => ({ label: c, value: c }))].map(({ label, value }) => {
                                    const active = activeFilter === value;
                                    const Icon = categoryIcon(value);
                                    return (
                                        <button key={value} onClick={() => setActiveFilter(value)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all"
                                            style={active
                                                ? { background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d', border: '1px solid transparent' }
                                                : { background: '#101f30', border: '1px solid rgba(150,178,208,0.12)', color: '#b6c5d8' }}>
                                            <Icon size={14} />
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {visiblePosts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
                            </div>
                        ) : (
                            <p className="text-center py-16 font-mono text-sm" style={{ color: '#7b8da3' }}>
                                Nenhum artigo nesta trilha ainda. Volte em breve. :)
                            </p>
                        )}

                        <div className="sm:hidden mt-8 text-center">
                            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#3cbdf8' }}>
                                Ver todos os posts <ArrowRight size={16} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Stack marquee ────────────────────────────────────── */}
            <StackMarquee />

            {/* ── Tech Carousel ────────────────────────────────────── */}
            <div style={{ background: '#0c1828' }}>
                <TechCarousel technologies={technologies} />
            </div>

            {/* ── Events (static preview) ─────────────────────────── */}
            <section style={{ background: '#0a131e', borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Reveal><SectionHead eyebrow="Agenda" title="Próximos eventos de tecnologia" subtitle="Conferências, meetups e workshops que valem o seu tempo. Marque na agenda." /></Reveal>

                    <div className="space-y-4">
                        {EVENTS.map((ev, i) => (
                            <Reveal key={ev.title} delay={i * 100}>
                            <div className="flex flex-col md:flex-row md:items-center gap-5 rounded-2xl p-5"
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}>

                                {/* Date badge */}
                                <div className="flex flex-col items-center justify-center rounded-xl px-5 py-3 shrink-0 text-center w-20"
                                    style={{ background: '#15243a', border: '1px solid rgba(150,178,208,0.18)' }}>
                                    <span className="font-display font-bold text-2xl text-white leading-none">{ev.day}</span>
                                    <span className="text-xs font-mono uppercase mt-0.5" style={{ color: '#3cbdf8' }}>{ev.mon}</span>
                                    <span className="text-[11px] mt-0.5" style={{ color: '#7b8da3' }}>{ev.yr}</span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="font-mono text-[11px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-semibold"
                                            style={{ background: `${ev.typeColor}18`, color: ev.typeColor }}>
                                            {ev.type}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: '#7b8da3' }}>
                                            <span className={`w-2 h-2 rounded-full ${ev.online ? 'bg-[#2fd9c2]' : 'bg-[#7b8da3]'}`} />
                                            {ev.online ? 'Online' : 'Presencial'}
                                        </span>
                                    </div>
                                    <h4 className="font-display font-semibold text-white text-base leading-tight mb-1">{ev.title}</h4>
                                    <p className="text-sm" style={{ color: '#7b8da3' }}>por <b className="text-[#b6c5d8]">{ev.org}</b></p>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-xs" style={{ color: '#7b8da3' }}>
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {ev.time}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {ev.location}</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <a href="#" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                                        style={ev.primary
                                            ? { background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d' }
                                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,178,208,0.24)', color: '#eaf1fa' }}>
                                        {ev.cta} <ArrowRight size={14} />
                                    </a>
                                    <span className={`text-xs font-mono ${ev.seatsLow ? 'text-[#f0b65a]' : ''}`} style={ev.seatsLow ? {} : { color: '#7b8da3' }}>
                                        {ev.seats}
                                    </span>
                                </div>
                            </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials (static) ───────────────────────────── */}
            <section style={{ background: '#0c1828', borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Reveal><SectionHead eyebrow="O que dizem" title="Quem lê, recomenda" subtitle="A comunidade de devs que acompanha o DevHub no dia a dia." /></Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <Reveal key={t.name} delay={i * 120} as="figure" className="flex flex-col rounded-2xl p-7"
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}>
                                <div className="text-5xl leading-none mb-4 font-display" style={{ color: '#3cbdf8', opacity: 0.5 }}>&ldquo;</div>
                                <p className="flex-1 text-sm leading-relaxed mb-5" style={{ color: '#b6c5d8' }}>{t.text}</p>
                                <Stars />
                                <figcaption className="flex items-center gap-3 mt-5">
                                    <div className="w-10 h-10 rounded-full grid place-items-center font-display font-semibold text-sm text-white shrink-0"
                                        style={{ background: t.gradient }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{t.name}</div>
                                        <div className="text-xs" style={{ color: '#7b8da3' }}>{t.role}</div>
                                    </div>
                                </figcaption>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
