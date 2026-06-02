import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

const GLYPH_PALETTE = {
    backend:    { bg: '#101f30', accent: '#3cbdf8',  label: 'bg-[#3cbdf8]/10'  },
    frontend:   { bg: '#0e1e2e', accent: '#61dafb',  label: 'bg-[#61dafb]/10'  },
    ia:         { bg: '#120e2a', accent: '#7b86ff',  label: 'bg-[#7b86ff]/10'  },
    banco:      { bg: '#0e2228', accent: '#2fd9c2',  label: 'bg-[#2fd9c2]/10'  },
    carreira:   { bg: '#1e1505', accent: '#f0b65a',  label: 'bg-[#f0b65a]/10'  },
    default:    { bg: '#101f30', accent: '#3cbdf8',  label: 'bg-[#3cbdf8]/10'  },
};

function glyphFor(category) {
    const slug = category?.slug?.toLowerCase() ?? '';
    if (slug.includes('backend'))  return GLYPH_PALETTE.backend;
    if (slug.includes('frontend')) return GLYPH_PALETTE.frontend;
    if (slug.includes('ia') || slug.includes('dados')) return GLYPH_PALETTE.ia;
    if (slug.includes('banco') || slug.includes('dados')) return GLYPH_PALETTE.banco;
    if (slug.includes('carreira') || slug.includes('devops')) return GLYPH_PALETTE.carreira;
    return GLYPH_PALETTE.default;
}

export default function PostCard({ post }) {
    const palette = glyphFor(post.category);

    return (
        <article className="post-card group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[5px]"
            style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)', boxShadow: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(150,178,208,0.24)'; e.currentTarget.style.boxShadow='0 18px 40px -22px rgba(0,0,0,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(150,178,208,0.12)'; e.currentTarget.style.boxShadow='none'; }}>

            {/* Media / glyph */}
            <div className="relative aspect-video overflow-hidden">
                {post.banner_image_url ? (
                    <img
                        src={post.banner_image_url}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full grid place-items-center" style={{ background: palette.bg }}>
                        <span className="font-display font-semibold text-center leading-tight px-4 text-lg"
                            style={{ color: palette.accent, opacity: 0.85 }}>
                            {post.category?.name ?? 'DevHub'}
                        </span>
                    </div>
                )}
                {/* Hover bar */}
                <div className="post-bar" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-3 font-mono text-[11.5px]" style={{ color: '#7b8da3' }}>
                    {post.category && (
                        <Link
                            href={route('blog.category', post.category.slug)}
                            className="inline-flex items-center gap-1.5 transition-colors"
                            style={{ color: '#3cbdf8' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
                            {post.category.name}
                        </Link>
                    )}
                    <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                    </span>
                </div>

                <h3 className="font-display font-semibold text-[18.5px] leading-[1.25] tracking-[-0.01em] mb-2 line-clamp-2 transition-colors text-white group-hover:text-[#3cbdf8]">
                    {post.title}
                </h3>

                {post.description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: '#7b8da3' }}>
                        {post.description}
                    </p>
                )}

                <Link
                    href={route('blog.show', post.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium mt-auto transition-all hover:gap-2.5"
                    style={{ color: '#3cbdf8', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}
                >
                    Ler artigo
                    <ArrowRight size={14} />
                </Link>
            </div>
        </article>
    );
}
