import { Link } from '@inertiajs/react';
import { Calendar, Clock, Tag } from 'lucide-react';
import PageHero from '@/Components/Public/PageHero';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import ShareButtons from '@/Components/Public/ShareButtons';
import AuthorBadge from '@/Components/Public/ui/AuthorBadge';
import { formatDate } from '@/lib/utils';

const COVER_PALETTE = {
    backend:  { bg: 'radial-gradient(120% 120% at 30% 20%,#163a52,#0c1c2e)', accent: 'var(--accent)' },
    frontend: { bg: 'radial-gradient(120% 120% at 30% 20%,#163a52,#0c1c2e)', accent: '#61dafb' },
    ia:       { bg: 'radial-gradient(120% 120% at 30% 20%,#2a2c5a,#131430)', accent: 'var(--violet)' },
    banco:    { bg: 'radial-gradient(120% 120% at 30% 20%,#12423c,#0a1f24)', accent: 'var(--teal)' },
    carreira: { bg: 'radial-gradient(120% 120% at 30% 20%,#3d2f17,#1c1407)', accent: 'var(--gold)' },
    default:  { bg: 'radial-gradient(120% 120% at 30% 20%,#243347,#111c2a)', accent: 'var(--accent)' },
};

function coverPalette(category) {
    const slug = category?.slug?.toLowerCase() ?? '';
    if (slug.includes('backend'))  return COVER_PALETTE.backend;
    if (slug.includes('frontend')) return COVER_PALETTE.frontend;
    if (slug.includes('ia') || slug.includes('dados')) return COVER_PALETTE.ia;
    if (slug.includes('banco'))    return COVER_PALETTE.banco;
    if (slug.includes('carreira')) return COVER_PALETTE.carreira;
    return COVER_PALETTE.default;
}

export default function ArticleHeader({ post, readTime, pageUrl }) {
    const palette = coverPalette(post.category);

    const crumbs = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        ...(post.category ? [{ label: post.category.name, href: route('blog.category', post.category.slug) }] : []),
        { label: post.title, truncate: true },
    ];

    return (
        <PageHero py="py-14">
            <Breadcrumb items={crumbs} />

            {post.category && (
                <Link href={route('blog.category', post.category.slug)}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-semibold mb-5 transition-colors"
                    style={{ background: 'rgba(60,189,248,0.12)', color: 'var(--accent)', border: '1px solid rgba(60,189,248,0.2)' }}>
                    <Tag size={11} /> {post.category.name}
                </Link>
            )}

            <h1 className="font-display font-semibold text-white leading-tight tracking-tight mb-4"
                style={{ fontSize: 'clamp(30px,4.5vw,52px)', maxWidth: '820px' }}>
                {post.title}
            </h1>

            {post.description && (
                <p className="mb-6 max-w-[64ch]" style={{ color: 'var(--text-body)', fontSize: 'clamp(17px,1.6vw,20px)' }}>
                    {post.description}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-7">
                <AuthorBadge size="sm" author={post.user} />
                <span className="w-px h-8 shrink-0" style={{ background: 'var(--border-2)' }} />
                <span className="inline-flex items-center gap-2 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    <Calendar size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {formatDate(post.published_at)}
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {readTime} min de leitura
                </span>

                <div className="flex items-center gap-3 ml-auto">
                    <span className="text-xs font-mono hidden sm:block" style={{ color: 'var(--text-muted)' }}>Compartilhar</span>
                    <ShareButtons url={pageUrl} title={post.title} />
                </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden"
                style={{ height: 'clamp(220px,28vw,360px)', border: '1px solid var(--border-2)' }}>
                {post.banner_image_url ? (
                    <img src={post.banner_image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full grid place-items-center" style={{ background: palette.bg }}>
                        <span className="font-display font-bold text-center leading-tight px-8"
                            style={{ color: palette.accent, opacity: 0.85, fontSize: 'clamp(22px,3vw,38px)' }}>
                            {post.category?.name ?? 'DevHub'}
                        </span>
                    </div>
                )}
            </div>
        </PageHero>
    );
}
