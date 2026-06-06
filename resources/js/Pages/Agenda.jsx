import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import PageHero from '@/Components/Public/PageHero';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import EventCard from '@/Components/Public/Agenda/EventCard';
import { Calendar, CheckCircle, Clock, Minus, Loader2 } from 'lucide-react';

const FILTERS = [
    { key: 'all',  label: 'Todos',               icon: <Calendar size={16} /> },
    { key: 'open', label: 'Inscrições abertas',  icon: <CheckCircle size={16} /> },
    { key: 'soon', label: 'Próximos',            icon: <Clock size={16} /> },
    { key: 'full', label: 'Lotado',              icon: <Minus size={16} /> },
];

export default function Agenda({ events = { data: [], current_page: 1, last_page: 1, total: 0 }, counts = {}, filters = {} }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    const [activeFilter, setActiveFilter] = useState(filters.status || 'all');
    const [items, setItems] = useState(events.data);
    const [loading, setLoading] = useState(false);
    const gridRef = useRef(null);

    const hasMore = events.current_page < events.last_page;

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;
        el.classList.remove('is-filtering');
        void el.offsetWidth;
        el.classList.add('is-filtering');
    }, [activeFilter]);

    const changeFilter = (key) => {
        if (key === activeFilter) return;
        setActiveFilter(key);
        router.get(route('agenda'), key === 'all' ? {} : { status: key }, {
            only: ['events', 'counts', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: (page) => setItems(page.props.events.data),
        });
    };

    const loadMore = () => {
        if (loading || !hasMore) return;
        setLoading(true);
        router.reload({
            data: { page: events.current_page + 1 },
            only: ['events'],
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => setItems((prev) => [...prev, ...page.props.events.data]),
            onFinish: () => setLoading(false),
        });
    };

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
                                onClick={() => changeFilter(f.key)}
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
                                    {counts[f.key] ?? 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </PageHero>

            <section style={{ background: 'var(--base)', paddingTop: 64, paddingBottom: 80 }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {items.length > 0 ? (
                        <>
                            <div ref={gridRef} className="posts flex flex-col gap-4">
                                {items.map(event => (
                                    <div key={event.id} className="post">
                                        <EventCard event={event} />
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-10 flex justify-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait"
                                        style={{
                                            padding: '12px 22px',
                                            borderRadius: 12,
                                            background: 'var(--surface)',
                                            color: 'var(--text-body)',
                                            border: '1px solid var(--border-s)',
                                        }}
                                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(60,189,248,0.07)'; } }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-s)'; e.currentTarget.style.background = 'var(--surface)'; }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={15} className="animate-spin" />
                                                Carregando…
                                            </>
                                        ) : (
                                            <>
                                                Carregar mais
                                                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    {events.total - items.length} restantes
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
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
