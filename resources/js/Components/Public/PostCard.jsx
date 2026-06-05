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
    backend:    { bg: 'var(--surface)', accent: 'var(--accent)',  label: 'bg-[var(--accent)]/10'  },
    frontend:   { bg: '#0e1e2e', accent: '#61dafb',  label: 'bg-[#61dafb]/10'  },
    ia:         { bg: '#120e2a', accent: 'var(--violet)',  label: 'bg-[var(--violet)]/10'  },
    banco:      { bg: '#0e2228', accent: 'var(--teal)',  label: 'bg-[var(--teal)]/10'  },
    carreira:   { bg: '#1e1505', accent: 'var(--gold)',  label: 'bg-[var(--gold)]/10'  },
    default:    { bg: 'var(--surface)', accent: 'var(--accent)',  label: 'bg-[var(--accent)]/10'  },
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
        <article className="card post-card-hover group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[5px]">

            <Link href={route('blog.show', post.slug)} className="relative block aspect-video overflow-hidden">
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
                <div className="absolute inset-x-0 bottom-0 h-[3px] scale-x-0 origin-left transition-transform duration-[400ms] group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--accent),var(--violet))]" />
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-3 font-mono text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                    {post.category && (
                        <Link
                            href={route('blog.category', post.category.slug)}
                            className="inline-flex items-center gap-1.5 leading-none transition-colors"
                            style={{ color: 'var(--accent)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}><circle cx="12" cy="12" r="5"/></svg>
                            {post.category.name}
                        </Link>
                    )}
                    <span className="inline-flex items-center gap-1 leading-none">
                        <Calendar size={11} style={{ display: 'block', flexShrink: 0 }} />
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    </span>
                </div>

                <h3 className="font-display font-semibold text-[18.5px] leading-[1.25] tracking-[-0.01em] mb-2 line-clamp-2">
                    <Link href={route('blog.show', post.slug)}
                        className="transition-colors text-white hover:text-[var(--accent)]">
                        {post.title}
                    </Link>
                </h3>

                {post.description && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
                        {post.description}
                    </p>
                )}

                <Link
                    href={route('blog.show', post.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium mt-auto transition-all hover:gap-2.5"
                    style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}
                >
                    Ler artigo
                    <ArrowRight size={14} />
                </Link>
            </div>
        </article>
    );
}
