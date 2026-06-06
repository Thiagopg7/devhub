import { ArrowRight, Clock, Globe, MapPin } from 'lucide-react';

const TYPE_STYLES = {
    conf:     { color: '#9fe3ff', bg: 'rgba(60,189,248,0.12)' },
    meetup:   { color: '#b9bfff', bg: 'rgba(123,134,255,0.14)' },
    workshop: { color: '#8af0e2', bg: 'rgba(47,217,194,0.13)' },
    hack:     { color: '#f4c987', bg: 'rgba(240,182,90,0.14)' },
};

export default function EventCard({ event }) {
    const typeStyle = TYPE_STYLES[event.type] || TYPE_STYLES.conf;
    const isPrimary = event.cta_style === 'primary';
    const isFull    = event.status === 'full';
    const isPast    = event.is_past;

    return (
        <article
            className="event-card card group"
            style={{
                display: 'grid',
                gridTemplateColumns: '92px 1fr auto',
                gap: 26,
                alignItems: 'center',
                borderRadius: 14,
                padding: '22px 26px',
                position: 'relative',
                overflow: 'hidden',
                opacity: isPast ? 0.5 : 1,
                transition: 'opacity .2s',
            }}>

            <div className="event-accent-bar" style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: isPast ? 'var(--border-s)' : 'var(--accent)',
                transform: 'scaleY(0)',
                transformOrigin: 'top', transition: 'transform .3s ease',
            }} />

            {/* Data */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center',
                background: isPast ? 'rgba(150,178,208,0.06)' : 'rgba(60,189,248,0.08)',
                border: `1px solid ${isPast ? 'rgba(150,178,208,0.15)' : 'rgba(60,189,248,0.2)'}`,
                borderRadius: 10, padding: '12px 6px',
            }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, lineHeight: 1, color: isPast ? 'var(--text-muted)' : '#fff' }}>
                    {event.day}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: isPast ? 'var(--text-muted)' : 'var(--accent)', marginTop: 4 }}>
                    {event.month}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    {event.year}
                </span>
            </div>

            {/* Informações */}
            <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
                        fontWeight: 500, padding: '4px 10px', borderRadius: 999,
                        color: typeStyle.color, background: typeStyle.bg,
                    }}>
                        {event.type_label}
                    </span>

                    {isFull && (
                        <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
                            fontWeight: 500, padding: '4px 10px', borderRadius: 999,
                            color: '#ff8080', background: 'rgba(255,80,80,0.12)',
                            border: '1px solid rgba(255,80,80,0.2)',
                        }}>
                            Lotado
                        </span>
                    )}

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-body)' }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: event.is_online ? 'var(--teal)' : 'var(--accent)',
                            boxShadow: event.is_online
                                ? '0 0 0 3px rgba(47,217,194,0.18)'
                                : '0 0 0 3px rgba(60,189,248,0.18)',
                        }} />
                        {event.is_online ? 'Online' : 'Presencial'}
                    </span>
                </div>

                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 19, letterSpacing: '-0.01em', lineHeight: 1.25, color: isPast ? 'var(--text-body)' : '#fff', margin: 0 }}>
                    {event.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
                    por <strong style={{ color: 'var(--text-body)', fontWeight: 600 }}>{event.org}</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
                    {event.time && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-muted)' }}>
                            <Clock size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            {event.time}
                        </span>
                    )}
                    {event.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-muted)' }}>
                            {event.is_online
                                ? <Globe size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                                : <MapPin size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            }
                            {event.location}
                        </span>
                    )}
                </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                {event.cta_url && event.cta_label && (
                    isPast ? (
                        <span
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                fontWeight: 600, fontSize: 14,
                                padding: '10px 18px', borderRadius: 12,
                                background: 'var(--surface-2)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border)',
                                cursor: 'not-allowed',
                                userSelect: 'none',
                            }}>
                            {event.cta_label}
                            <ArrowRight size={14} />
                        </span>
                    ) : (
                        <a href={event.cta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:-translate-y-0.5"
                            style={isPrimary ? {
                                background: 'linear-gradient(180deg,var(--accent),var(--accent-2))',
                                color: 'var(--accent-ink)',
                                padding: '11px 18px',
                                borderRadius: 12,
                                boxShadow: '0 8px 24px -8px rgba(60,189,248,0.35)',
                            } : {
                                background: 'transparent',
                                color: 'var(--text-body)',
                                padding: '10px 18px',
                                borderRadius: 12,
                                border: '1px solid var(--border-s)',
                            }}>
                            {event.cta_label}
                            <ArrowRight size={14} />
                        </a>
                    )
                )}
                {event.seats && !isPast && (
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: event.seats_low ? 'var(--gold)' : 'var(--text-muted)',
                    }}>
                        {event.seats}
                    </span>
                )}
            </div>
        </article>
    );
}
