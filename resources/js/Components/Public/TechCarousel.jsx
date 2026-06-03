import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GLYPH_BGS = [
    'radial-gradient(120% 120% at 30% 20%, #3d2f17, #1c1407)',
    'radial-gradient(120% 120% at 30% 20%, #12423c, #0a1f24)',
    'radial-gradient(120% 120% at 30% 20%, #2a2c5a, #131430)',
    'radial-gradient(120% 120% at 30% 20%, #243347, #111c2a)',
    'radial-gradient(120% 120% at 30% 20%, #163a52, #0c1c2e)',
];

const TECH_CATS = {
    'claude': 'Assistente de IA', 'claude ai': 'Assistente de IA',
    'chatgpt': 'Modelo de linguagem', 'gpt': 'Modelo de linguagem',
    'figma': 'Design & Protótipo',
    'github copilot': 'Par de programação', 'copilot': 'Par de programação',
    'vercel': 'Deploy & Hospedagem',
    'notion': 'Documentação',
    'react': 'Biblioteca UI', 'react.js': 'Biblioteca UI',
    'vue': 'Framework JS', 'vue.js': 'Framework JS',
    'laravel': 'Framework PHP',
    'mysql': 'Banco de dados', 'postgresql': 'Banco de dados', 'postgres': 'Banco de dados',
    'redis': 'Cache & Filas',
    'docker': 'Containerização',
    'tailwind': 'CSS Framework', 'tailwindcss': 'CSS Framework',
    'vite': 'Build Tool',
    'inertia': 'Full-stack SPA', 'inertia.js': 'Full-stack SPA',
    'typescript': 'Superset JS', 'javascript': 'Linguagem',
    'node': 'Runtime JS', 'node.js': 'Runtime JS',
    'next': 'Framework React', 'next.js': 'Framework React',
    'github': 'Controle de versão', 'git': 'Controle de versão',
    'aws': 'Cloud & Infra', 'gcp': 'Cloud & Infra', 'azure': 'Cloud & Infra',
};

function techCat(name) {
    return TECH_CATS[name.toLowerCase().trim()] || '';
}

const GAP = 24;

function TechCard({ tech, glyphBg }) {
    const cat = techCat(tech.name);

    return (
        <a href={tech.url || '#'} target="_blank" rel="noopener noreferrer"
            className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-h)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

            <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '16/10', background: glyphBg, borderBottom: '1px solid rgba(150,178,208,0.10)' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)', backgroundSize: '18px 18px' }} />
                {tech.screenshot_image_url ? (
                    <img src={tech.screenshot_image_url} alt={tech.name} loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 z-10" />
                ) : (
                    <div className="absolute inset-0 grid place-items-center z-10 px-3">
                        <span className="font-display font-bold text-white/90 text-center select-none"
                            style={{ fontSize: 'clamp(20px,3vw,30px)', letterSpacing: '-0.02em' }}>
                            {tech.name.split(' ')[0]}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-[22px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[11px] grid place-items-center shrink-0" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
                        {tech.icon_image_url ? (
                            <img src={tech.icon_image_url} alt={tech.name} loading="lazy" className="w-6 h-6 object-contain" />
                        ) : (
                            <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                {tech.name.slice(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="font-display font-semibold text-white leading-tight" style={{ fontSize: 15 }}>{tech.name}</div>
                        {cat && (
                            <div className="font-mono text-[10.5px] uppercase tracking-[0.06em] mt-0.5" style={{ color: 'var(--text-muted)' }}>{cat}</div>
                        )}
                    </div>
                </div>

                {tech.description && (
                    <p className="mt-4 text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
                        {tech.description}
                    </p>
                )}

                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Acessar
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                </div>
            </div>
        </a>
    );
}

export default function TechCarousel({ technologies = [] }) {
    const [index, setIndex] = useState(0);
    const [perPage, setPerPage] = useState(3);
    const [containerWidth, setContainerWidth] = useState(0);
    const viewportRef = useRef(null);

    const getPerPage = () => {
        const w = window.innerWidth;
        if (w <= 760) return 1;
        if (w <= 1024) return 2;
        return 3;
    };

    useEffect(() => {
        if (!viewportRef.current) return;
        const ro = new ResizeObserver(entries => {
            setContainerWidth(entries[0].contentRect.width);
            setPerPage(getPerPage());
        });
        ro.observe(viewportRef.current);
        return () => ro.disconnect();
    }, []);

    if (technologies.length === 0) return null;

    const maxIdx = Math.max(0, technologies.length - perPage);
    const safeIdx = Math.min(index, maxIdx);
    const cardWidth = containerWidth > 0 ? (containerWidth - (perPage - 1) * GAP) / perPage : 0;
    const offset = safeIdx * (cardWidth + GAP);

    const prev = () => setIndex(i => Math.max(0, i - 1));
    const next = () => setIndex(i => Math.min(maxIdx, i + 1));

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="eyebrow">Ferramentas &amp; Tecnologias</span>
                    <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>No nosso radar</h2>
                    <p className="mt-2 text-base max-w-[52ch]" style={{ color: 'var(--text-muted)' }}>As plataformas que estão moldando como a gente escreve código e cria produtos.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <NavBtn onClick={prev} disabled={safeIdx === 0} aria-label="Anterior" side="left">
                        <ChevronLeft size={20} />
                    </NavBtn>
                    <NavBtn onClick={next} disabled={safeIdx >= maxIdx} aria-label="Próxima" side="right">
                        <ChevronRight size={20} />
                    </NavBtn>
                </div>
            </div>

            <div ref={viewportRef} className="overflow-hidden">
                <div
                    className="flex"
                    style={{
                        gap: GAP,
                        transform: `translateX(${-offset}px)`,
                        transition: 'transform .5s cubic-bezier(.4,0,.2,1)',
                    }}
                >
                    {technologies.map((tech, i) => (
                        <div key={tech.id} className="shrink-0 flex flex-col"
                            style={{ width: `calc((100% - ${(perPage - 1) * GAP}px) / ${perPage})` }}>
                            <TechCard tech={tech} glyphBg={GLYPH_BGS[i % GLYPH_BGS.length]} />
                        </div>
                    ))}
                </div>
            </div>

            {technologies.length > perPage && (
                <div className="flex justify-center items-center gap-[9px] mt-8">
                    {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Ir para slide ${i + 1}`}
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                                width: i === safeIdx ? 26 : 8,
                                background: i === safeIdx ? 'var(--accent)' : 'var(--surface-2)',
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function NavBtn({ onClick, disabled, children, ...rest }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-[46px] h-[46px] grid place-items-center rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-s)',
                color: 'var(--text-body)',
            }}
            onMouseEnter={e => {
                if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent-ink)';
                    e.currentTarget.style.borderColor = 'transparent';
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.color = 'var(--text-body)';
                e.currentTarget.style.borderColor = 'var(--border-s)';
            }}
            {...rest}
        >
            {children}
        </button>
    );
}
