import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

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

const navBtnCls = [
    'grid place-items-center w-[46px] h-[46px] rounded-full cursor-pointer transition-colors',
    'bg-[var(--surface-2)] border border-[var(--border-s)] text-[var(--text-body)]',
    'hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-transparent',
    '[&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none',
].join(' ');

export default function TechCarousel({ technologies = [] }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (technologies.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="eyebrow">Ferramentas &amp; Tecnologias</span>
                    <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>No nosso radar</h2>
                    <p className="mt-2 text-base max-w-[52ch]" style={{ color: 'var(--text-muted)' }}>As plataformas que estão moldando como a gente escreve código e cria produtos.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button ref={prevRef} type="button" className={navBtnCls} aria-label="Anterior">
                        <ChevronLeft size={20} />
                    </button>
                    <button ref={nextRef} type="button" className={navBtnCls} aria-label="Próxima">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, Pagination]}
                grabCursor
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="public-swiper"
            >
                {technologies.map((tech, i) => (
                    <SwiperSlide key={tech.id} style={{ height: 'auto' }}>
                        <TechCard tech={tech} glyphBg={GLYPH_BGS[i % GLYPH_BGS.length]} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
