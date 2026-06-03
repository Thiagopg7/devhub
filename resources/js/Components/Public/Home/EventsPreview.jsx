import { ArrowRight, Clock, MapPin } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';
import Button from '@/Components/Public/ui/Button';

const EVENTS = [
    { day: '12', mon: 'Jun', yr: '2026', type: 'Conferência', typeColor: 'var(--accent)', online: true,  title: 'Laravel Live Brasil 2026', org: 'Comunidade Laravel BR', time: '19h00 – 22h00 (BRT)', location: 'Transmissão ao vivo', cta: 'Garantir vaga', primary: true,  seats: 'Gratuito · inscrição aberta', seatsLow: false },
    { day: '21', mon: 'Jun', yr: '2026', type: 'Meetup',      typeColor: 'var(--violet)', online: false, title: 'React Summit São Paulo',    org: 'Frontend Guild',       time: '14h00 – 18h00',      location: 'São Paulo, SP',           cta: 'Saiba mais',    primary: false, seats: 'Últimas vagas',              seatsLow: true  },
    { day: '05', mon: 'Jul', yr: '2026', type: 'Workshop',    typeColor: 'var(--teal)', online: true,  title: 'Construindo APIs com IA: do embedding à busca semântica', org: 'DevHub', time: '20h00 – 21h30 (BRT)', location: 'Hands-on ao vivo', cta: 'Garantir vaga', primary: true, seats: 'Vagas limitadas', seatsLow: false },
];

export default function EventsPreview() {
    return (
        <section style={{ background: 'var(--base)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal><SectionHead eyebrow="Agenda" title="Próximos eventos de tecnologia" subtitle="Conferências, meetups e workshops que valem o seu tempo. Marque na agenda." /></Reveal>

                <div className="space-y-4">
                    {EVENTS.map((ev, i) => (
                        <Reveal key={ev.title} delay={i * 100}>
                        <div className="flex flex-col md:flex-row md:items-center gap-5 rounded-2xl p-5"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

                            <div className="flex flex-col items-center justify-center rounded-xl px-5 py-3 shrink-0 text-center w-20"
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
                                <span className="font-display font-bold text-2xl text-white leading-none">{ev.day}</span>
                                <span className="text-xs font-mono uppercase mt-0.5" style={{ color: 'var(--accent)' }}>{ev.mon}</span>
                                <span className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{ev.yr}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-semibold"
                                        style={{ background: `${ev.typeColor}18`, color: ev.typeColor }}>
                                        {ev.type}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                        <span className={`w-2 h-2 rounded-full ${ev.online ? 'bg-[var(--teal)]' : 'bg-[var(--text-muted)]'}`} />
                                        {ev.online ? 'Online' : 'Presencial'}
                                    </span>
                                </div>
                                <h4 className="font-display font-semibold text-white text-base leading-tight mb-1">{ev.title}</h4>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>por <b className="text-[var(--text-body)]">{ev.org}</b></p>
                                <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {ev.time}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {ev.location}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <Button href="#" variant={ev.primary ? 'primary' : 'ghost'} size="sm">
                                    {ev.cta} <ArrowRight size={14} />
                                </Button>
                                <span className={`text-xs font-mono ${ev.seatsLow ? 'text-[var(--gold)]' : ''}`} style={ev.seatsLow ? {} : { color: 'var(--text-muted)' }}>
                                    {ev.seats}
                                </span>
                            </div>
                        </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
