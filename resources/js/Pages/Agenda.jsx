import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import PageHero from '@/Components/Public/PageHero';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import EventCard from '@/Components/Public/Agenda/EventCard';
import { EVENTS } from '@/Components/Public/Agenda/events';
import { Calendar, CheckCircle, Clock, Minus } from 'lucide-react';

const FILTERS = [
    { key: 'all',  label: 'Todos',               icon: <Calendar size={16} /> },
    { key: 'open', label: 'Inscrições abertas',  icon: <CheckCircle size={16} /> },
    { key: 'soon', label: 'Próximos',            icon: <Clock size={16} /> },
    { key: 'full', label: 'Lotado',              icon: <Minus size={16} /> },
];

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

            <PageHero>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agenda de eventos' }]} />

                <span className="eyebrow">Próximos eventos</span>
                <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                    style={{ fontSize: 'clamp(34px,5vw,56px)', maxWidth: 820 }}>
                    Conferências, meetups e workshops
                </h1>
                <p className="mb-8 max-w-[60ch]" style={{ color: 'var(--text-body)', fontSize: 16 }}>
                    Eventos de tecnologia que valem seu tempo. Filtre por tipo, formato ou status para encontrar o que busca.
                </p>

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
                                        background: 'linear-gradient(180deg,var(--accent),var(--accent-2))',
                                        color: 'var(--accent-ink)',
                                        border: '1px solid transparent',
                                    } : {
                                        background: 'var(--surface)',
                                        color: 'var(--text-body)',
                                        border: '1px solid var(--border-2)',
                                    }),
                                }}>
                                <span className="w-7 h-7 grid place-items-center rounded-[9px]"
                                    style={{
                                        background: isActive ? 'rgba(3,18,29,0.18)' : 'rgba(60,189,248,0.1)',
                                        color: isActive ? 'var(--accent-ink)' : 'var(--accent)',
                                    }}>
                                    {f.icon}
                                </span>
                                {f.label}
                                <span className="font-mono text-xs"
                                    style={{ color: isActive ? 'rgba(3,18,29,0.7)' : 'var(--text-muted)' }}>
                                    {counts[f.key]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </PageHero>

            <section style={{ background: 'var(--base)', paddingTop: 64, paddingBottom: 80 }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {visible.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {visible.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-16 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                            Nenhum evento encontrado nesta categoria.
                        </p>
                    )}
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
