import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import {
    Calendar, CheckCircle, Clock, Globe, Minus,
    MapPin, Monitor, ArrowRight,
} from 'lucide-react';

/* ── Static event data ───────────────────────────────────────── */
const EVENTS = [
    {
        id: 1,
        status: 'open',
        date: '2026-06-12',
        day: '12', month: 'Jun', year: '2026',
        type: 'conf',
        typeLabel: 'Conferência',
        online: true,
        title: 'Laravel Live Brasil 2026',
        org: 'Comunidade Laravel BR',
        time: '19h00 – 22h00 (BRT)',
        location: 'Transmissão ao vivo',
        ctaLabel: 'Garantir vaga',
        ctaStyle: 'primary',
        ctaUrl: '#',
        seats: 'Gratuito · inscrição aberta',
        seatsLow: false,
    },
    {
        id: 2,
        status: 'full',
        date: '2026-06-21',
        day: '21', month: 'Jun', year: '2026',
        type: 'meetup',
        typeLabel: 'Meetup',
        online: false,
        title: 'React Summit São Paulo',
        org: 'Frontend Guild',
        time: '14h00 – 18h00',
        location: 'São Paulo, SP',
        ctaLabel: 'Fila de espera',
        ctaStyle: 'ghost',
        ctaUrl: '#',
        seats: 'Lotado',
        seatsLow: true,
    },
    {
        id: 3,
        status: 'open',
        date: '2026-07-05',
        day: '05', month: 'Jul', year: '2026',
        type: 'workshop',
        typeLabel: 'Workshop',
        online: true,
        title: 'Construindo APIs com IA: do embedding à busca semântica',
        org: 'DevHub',
        time: '20h00 – 21h30 (BRT)',
        location: 'Hands-on ao vivo',
        ctaLabel: 'Garantir vaga',
        ctaStyle: 'primary',
        ctaUrl: '#',
        seats: 'Vagas limitadas',
        seatsLow: false,
    },
    {
        id: 4,
        status: 'open',
        date: '2026-07-18',
        day: '18', month: 'Jul', year: '2026',
        type: 'hack',
        typeLabel: 'Hackathon',
        online: false,
        title: 'Hack the Future — 36h de código',
        org: 'TechHub & parceiros',
        time: '09h00 (sex) – 21h00 (sáb)',
        location: 'Curitiba, PR',
        ctaLabel: 'Inscrever time',
        ctaStyle: 'primary',
        ctaUrl: '#',
        seats: 'Inscrições em times',
        seatsLow: false,
    },
    {
        id: 5,
        status: 'open',
        date: '2026-08-02',
        day: '02', month: 'Ago', year: '2026',
        type: 'conf',
        typeLabel: 'Conferência',
        online: true,
        title: 'DevOps Brasil Summit 2026',
        org: 'DevOps Community BR',
        time: '10h00 – 17h00 (BRT)',
        location: 'Transmissão ao vivo',
        ctaLabel: 'Garantir vaga',
        ctaStyle: 'primary',
        ctaUrl: '#',
        seats: 'Gratuito · inscrição aberta',
        seatsLow: false,
    },
    {
        id: 6,
        status: 'soon',
        date: '2026-08-16',
        day: '16', month: 'Ago', year: '2026',
        type: 'meetup',
        typeLabel: 'Meetup',
        online: false,
        title: 'TypeScript Mastery — Rio de Janeiro',
        org: 'TypeScript Brasil',
        time: '19h00 – 22h00',
        location: 'Rio de Janeiro, RJ',
        ctaLabel: 'Saiba mais',
        ctaStyle: 'ghost',
        ctaUrl: '#',
        seats: 'Inscrições em breve',
        seatsLow: false,
    },
    {
        id: 7,
        status: 'soon',
        date: '2026-09-10',
        day: '10', month: 'Set', year: '2026',
        type: 'workshop',
        typeLabel: 'Workshop',
        online: false,
        title: 'PostgreSQL Avançado: performance e tuning',
        org: 'DevHub',
        time: '09h00 – 17h00',
        location: 'Belo Horizonte, MG',
        ctaLabel: 'Saiba mais',
        ctaStyle: 'ghost',
        ctaUrl: '#',
        seats: 'Inscrições em breve',
        seatsLow: false,
    },
];

const FILTERS = [
    {
        key: 'all',
        label: 'Todos',
        icon: <Calendar size={16} />,
    },
    {
        key: 'open',
        label: 'Inscrições abertas',
        icon: <CheckCircle size={16} />,
    },
    {
        key: 'soon',
        label: 'Próximos',
        icon: <Clock size={16} />,
    },
    {
        key: 'full',
        label: 'Lotado',
        icon: <Minus size={16} />,
    },
];

const TYPE_STYLES = {
    conf:     { color: '#9fe3ff', bg: 'rgba(60,189,248,0.12)' },
    meetup:   { color: '#b9bfff', bg: 'rgba(123,134,255,0.14)' },
    workshop: { color: '#8af0e2', bg: 'rgba(47,217,194,0.13)' },
    hack:     { color: '#f4c987', bg: 'rgba(240,182,90,0.14)' },
};

function EventCard({ event }) {
    const typeStyle = TYPE_STYLES[event.type] || TYPE_STYLES.conf;
    const isPrimary = event.ctaStyle === 'primary';

    return (
        <article className="event-card group"
            style={{
                display: 'grid',
                gridTemplateColumns: '92px 1fr auto',
                gap: 26,
                alignItems: 'center',
                background: '#101f30',
                border: '1px solid rgba(150,178,208,0.12)',
                borderRadius: 14,
                padding: '22px 26px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color .25s, transform .25s, box-shadow .25s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(150,178,208,0.28)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                e.currentTarget.querySelector('.event-accent-bar').style.transform = 'scaleY(1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(150,178,208,0.12)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.event-accent-bar').style.transform = 'scaleY(0)';
            }}>

            {/* Accent bar */}
            <div className="event-accent-bar" style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: 'var(--accent)', transform: 'scaleY(0)',
                transformOrigin: 'top', transition: 'transform .3s ease',
            }} />

            {/* Date badge */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center',
                background: 'rgba(60,189,248,0.08)', border: '1px solid rgba(60,189,248,0.2)',
                borderRadius: 10, padding: '12px 6px',
            }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, lineHeight: 1, color: '#fff' }}>
                    {event.day}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#3cbdf8', marginTop: 4 }}>
                    {event.month}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: '#7b8da3', marginTop: 2 }}>
                    {event.year}
                </span>
            </div>

            {/* Main info */}
            <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
                        fontWeight: 500, padding: '4px 10px', borderRadius: 999,
                        color: typeStyle.color, background: typeStyle.bg,
                    }}>
                        {event.typeLabel}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#b6c5d8' }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: event.online ? '#2fd9c2' : '#3cbdf8',
                            boxShadow: event.online
                                ? '0 0 0 3px rgba(47,217,194,0.18)'
                                : '0 0 0 3px rgba(60,189,248,0.18)',
                        }} />
                        {event.online ? 'Online' : 'Presencial'}
                    </span>
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 19, letterSpacing: '-0.01em', lineHeight: 1.25, color: '#fff', margin: 0 }}>
                    {event.title}
                </h4>
                <p style={{ color: '#7b8da3', fontSize: 13.5, marginTop: 4 }}>
                    por <strong style={{ color: '#b6c5d8', fontWeight: 600 }}>{event.org}</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#7b8da3' }}>
                        <Clock size={14} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                        {event.time}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#7b8da3' }}>
                        {event.online
                            ? <Globe size={14} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                            : <MapPin size={14} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                        }
                        {event.location}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <a href={event.ctaUrl}
                    className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={isPrimary ? {
                        background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)',
                        color: '#03121d',
                        padding: '11px 18px',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px -8px rgba(60,189,248,0.35)',
                    } : {
                        background: 'transparent',
                        color: '#b6c5d8',
                        padding: '10px 18px',
                        borderRadius: 12,
                        border: '1px solid rgba(150,178,208,0.24)',
                    }}>
                    {event.ctaLabel}
                    <ArrowRight size={14} />
                </a>
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: event.seatsLow ? '#f0b65a' : '#7b8da3',
                }}>
                    {event.seats}
                </span>
            </div>
        </article>
    );
}

export default function Agenda() {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const [activeFilter, setActiveFilter] = useState('all');

    const counts = {
        all: EVENTS.length,
        open: EVENTS.filter(e => e.status === 'open').length,
        soon: EVENTS.filter(e => e.status === 'soon').length,
        full: EVENTS.filter(e => e.status === 'full').length,
    };

    const visible = activeFilter === 'all'
        ? EVENTS
        : EVENTS.filter(e => e.status === activeFilter);

    return (
        <PublicLayout>
            <Head title={`Agenda de Eventos — ${siteName}`}>
                <meta name="description" content="Conferências, meetups e workshops de tecnologia. Filtre por status e encontre o próximo evento para você." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Agenda de Eventos — ${siteName}`} />
                <meta property="og:site_name" content={siteName} />
            </Head>

            {/* ── Page header ─────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 600, height: 600, right: -100, top: -200, background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 font-mono text-xs mb-8" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>Agenda de eventos</span>
                    </nav>

                    <span className="eyebrow">Próximos eventos</span>
                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                        style={{ fontSize: 'clamp(34px,5vw,56px)', maxWidth: 820 }}>
                        Conferências, meetups e workshops
                    </h1>
                    <p className="mb-8 max-w-[60ch]" style={{ color: '#b6c5d8', fontSize: 16 }}>
                        Eventos de tecnologia que valem seu tempo. Filtre por tipo, formato ou status para encontrar o que busca.
                    </p>

                    {/* Status filters */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        {FILTERS.map(f => {
                            const isActive = activeFilter === f.key;
                            return (
                                <button key={f.key}
                                    onClick={() => setActiveFilter(f.key)}
                                    className="inline-flex items-center gap-2.5 font-semibold text-sm transition-all hover:-translate-y-0.5"
                                    style={{
                                        padding: '12px 18px 12px 13px',
                                        borderRadius: 999,
                                        ...(isActive ? {
                                            background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)',
                                            color: '#03121d',
                                            border: '1px solid transparent',
                                        } : {
                                            background: '#101f30',
                                            color: '#b6c5d8',
                                            border: '1px solid rgba(150,178,208,0.18)',
                                        }),
                                    }}>
                                    <span className="w-7 h-7 grid place-items-center rounded-[9px]"
                                        style={{
                                            background: isActive ? 'rgba(3,18,29,0.18)' : 'rgba(60,189,248,0.1)',
                                            color: isActive ? '#03121d' : '#3cbdf8',
                                        }}>
                                        {f.icon}
                                    </span>
                                    {f.label}
                                    <span className="font-mono text-xs"
                                        style={{ color: isActive ? 'rgba(3,18,29,0.7)' : '#7b8da3' }}>
                                        {counts[f.key]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Events list ─────────────────────────────────── */}
            <section style={{ background: '#0a131e', paddingTop: 64, paddingBottom: 80 }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {visible.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {visible.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-16 font-mono text-sm" style={{ color: '#7b8da3' }}>
                            Nenhum evento encontrado nesta categoria.
                        </p>
                    )}
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
