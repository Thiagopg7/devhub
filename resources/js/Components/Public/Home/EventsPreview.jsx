import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';
import EventCard from '@/Components/Public/Agenda/EventCard';

export default function EventsPreview({ events = [] }) {
    return (
        <section style={{ background: 'var(--base)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal>
                    <SectionHead
                        eyebrow="Agenda"
                        title="Próximos eventos de tecnologia"
                        subtitle="Conferências, meetups e workshops que valem o seu tempo. Marque na agenda."
                    />
                </Reveal>

                {events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event, i) => (
                            <Reveal key={event.id} delay={i * 100}>
                                <EventCard event={event} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-16 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                        Nenhum evento próximo no momento.
                    </p>
                )}

                <Reveal delay={events.length * 100}>
                    <div className="mt-10 flex justify-center">
                        <Link
                            href={route('agenda')}
                            className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:-translate-y-0.5"
                            style={{
                                padding: '12px 22px',
                                borderRadius: 12,
                                background: 'var(--surface)',
                                color: 'var(--text-body)',
                                border: '1px solid var(--border-s)',
                            }}
                        >
                            Ver todos os eventos <ArrowRight size={14} />
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
