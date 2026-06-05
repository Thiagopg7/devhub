import DOMPurify from 'dompurify';

function TechItem({ name, icon }) {
    return (
        <span className="inline-flex items-center gap-2.5 select-none" style={{ color: 'var(--text-muted)' }}>
            <span className="w-5 h-5 shrink-0" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(icon) }} />
            <span className="font-display font-medium text-[15px]" style={{ color: 'var(--text-body)' }}>{name}</span>
        </span>
    );
}

export default function StackMarquee({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <div style={{ paddingBlock: 48, borderBlock: '1px solid var(--border)', background: 'var(--base)' }}>
            <p className="text-center font-mono text-[12px] tracking-[0.12em] uppercase mb-7" style={{ color: 'var(--text-muted)' }}>
                Construído com as ferramentas que a gente ensina
            </p>

            <div className="relative overflow-hidden"
                style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
                <div className="marquee-track flex" style={{ gap: 56, width: 'max-content' }}>
                    {/* duplicated set para loop contínuo */}
                    {[...items, ...items].map((tech, i) => (
                        <TechItem key={i} name={tech.name} icon={tech.icon} />
                    ))}
                </div>
            </div>
        </div>
    );
}
