import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

function TechCard({ tech }) {
    return (
        <a
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-1"
        >
            {/* Screenshot / preview */}
            <div className="aspect-video overflow-hidden bg-slate-700 shrink-0">
                {tech.screenshot_url ? (
                    <img
                        src={tech.screenshot_url}
                        alt={tech.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-900/40 to-slate-800 flex items-center justify-center">
                        {tech.icon_url ? (
                            <img src={tech.icon_url} alt={tech.name} loading="lazy" className="w-16 h-16 object-contain opacity-30" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-sky-400/20 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-sky-400/40" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-3">
                    {tech.icon_url ? (
                        <img
                            src={tech.icon_url}
                            alt={tech.name}
                            loading="lazy"
                            className="w-9 h-9 rounded-lg object-contain bg-white/10 p-1 shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-sky-400/20 shrink-0" />
                    )}
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-sky-400 transition-colors">
                        {tech.name}
                    </h3>
                </div>

                {/* Description */}
                {tech.description && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
                        {tech.description}
                    </p>
                )}

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-sky-400 text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Acessar
                        <ExternalLink size={13} />
                    </span>
                </div>
            </div>
        </a>
    );
}

export default function TechCarousel({ technologies = [] }) {
    const [index, setIndex] = useState(0);

    if (technologies.length === 0) return null;

    const perPage = 3;
    const maxIndex = Math.max(0, technologies.length - perPage);

    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Section header */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-white">Ferramentas &amp; Tecnologias</h2>
                <p className="text-slate-400 text-sm mt-1">Tecnologias em destaque no mercado</p>
            </div>

            {/* Carousel */}
            <div className="relative">
                {/* Overflow container */}
                <div className="overflow-hidden">
                    <div
                        className="flex gap-6 transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(calc(-${index} * (100% / ${perPage} + ${(perPage - 1) * 24 / perPage}px)))` }}
                    >
                        {technologies.map((tech) => (
                            <div
                                key={tech.id}
                                className="min-w-0 shrink-0"
                                style={{ width: `calc((100% - ${(perPage - 1) * 24}px) / ${perPage})` }}
                            >
                                <TechCard tech={tech} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prev arrow */}
                {index > 0 && (
                    <button
                        onClick={prev}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-colors shadow-lg z-10"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {/* Next arrow */}
                {index < maxIndex && (
                    <button
                        onClick={next}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-colors shadow-lg z-10"
                        aria-label="Próxima"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>

            {/* Dots */}
            {technologies.length > perPage && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                i === index ? 'bg-sky-400' : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                            aria-label={`Ir para slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
