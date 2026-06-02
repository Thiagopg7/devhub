import { useEffect, useState, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArrowLeft, Calendar, Clock, Tag, Copy, Check, Share2 } from 'lucide-react';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
}

function estimateReadTime(content) {
    if (!content) return 1;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

/* Extract h2/h3 headings from HTML string */
function extractHeadings(html) {
    if (!html || typeof document === 'undefined') return [];
    const div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(html);
    return [...div.querySelectorAll('h2, h3')].map((el, i) => {
        const id = el.id || `heading-${i}`;
        el.id = id;
        return { id, text: el.textContent, level: el.tagName.toLowerCase() };
    });
}

/* Reading progress bar */
function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return <div className="readbar" style={{ width: `${progress}%` }} />;
}

/* Copy to clipboard button */
function CopyLinkBtn() {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} aria-label="Copiar link"
            className="w-9 h-9 grid place-items-center rounded-lg transition-colors"
            style={{ background: '#15243a', border: '1px solid rgba(150,178,208,0.18)', color: copied ? '#3cbdf8' : '#7b8da3' }}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
    );
}

export default function BlogShow({ post }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const proseRef = useRef(null);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    const ogTitle       = post.meta_title || post.title;
    const ogDescription = post.meta_description || post.description;
    const readTime      = estimateReadTime(post.content);

    /* Inject IDs into headings after render */
    useEffect(() => {
        if (!proseRef.current) return;
        const nodes = [...proseRef.current.querySelectorAll('h2, h3')];
        const items = nodes.map((el, i) => {
            if (!el.id) el.id = `h-${i}`;
            return { id: el.id, text: el.textContent, level: el.tagName.toLowerCase() };
        });
        setHeadings(items);
    }, [post.content]);

    /* Highlight active TOC item on scroll */
    useEffect(() => {
        if (headings.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
        );
        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [headings]);

    const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';

    return (
        <PublicLayout>
            <ReadingProgressBar />

            <Head title={`${ogTitle} — ${siteName}`}>
                {ogDescription && <meta name="description" content={ogDescription} />}
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={ogTitle} />
                {ogDescription && <meta property="og:description" content={ogDescription} />}
                <meta property="og:url" content={route('blog.show', post.slug)} />
                {post.banner_image_url && <meta property="og:image" content={post.banner_image_url} />}
            </Head>

            {/* ── Article pagehead ─────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 600, height: 600, right: -100, top: -200, background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 font-mono text-xs mb-8" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-[#3cbdf8] transition-colors">Blog</Link>
                        {post.category && (
                            <>
                                <span>/</span>
                                <Link href={route('blog.category', post.category.slug)} className="hover:text-[#3cbdf8] transition-colors">
                                    {post.category.name}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="truncate max-w-[200px]" style={{ color: '#eaf1fa' }}>{post.title}</span>
                    </nav>

                    {post.category && (
                        <Link href={route('blog.category', post.category.slug)}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-semibold mb-5 transition-colors"
                            style={{ background: 'rgba(60,189,248,0.12)', color: '#3cbdf8', border: '1px solid rgba(60,189,248,0.2)' }}>
                            <Tag size={11} /> {post.category.name}
                        </Link>
                    )}

                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mb-4"
                        style={{ fontSize: 'clamp(30px,4.5vw,52px)' }}>
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="mb-6 max-w-[64ch] text-lg" style={{ color: '#b6c5d8' }}>{post.description}</p>
                    )}

                    {/* Byline */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full grid place-items-center font-display font-semibold text-xs text-white shrink-0"
                                style={{ background: 'linear-gradient(135deg,#3cbdf8,#2a9be0)' }}>DH</div>
                            <div>
                                <div className="text-sm font-semibold text-white">Equipe DevHub</div>
                                <div className="text-xs" style={{ color: '#7b8da3' }}>Engenharia &amp; Conteúdo</div>
                            </div>
                        </div>
                        <span className="w-px h-8" style={{ background: 'rgba(150,178,208,0.18)' }} />
                        <span className="flex items-center gap-1.5 text-sm font-mono" style={{ color: '#7b8da3' }}>
                            <Calendar size={13} /> {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-mono" style={{ color: '#7b8da3' }}>
                            <Clock size={13} /> {readTime} min de leitura
                        </span>

                        {/* Share */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs font-mono" style={{ color: '#7b8da3' }}>Compartilhar</span>
                            <CopyLinkBtn />
                        </div>
                    </div>

                    {/* Cover image */}
                    {post.banner_image_url && (
                        <div className="mt-8 rounded-2xl overflow-hidden" style={{ maxHeight: 400 }}>
                            <img src={post.banner_image_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </section>

            {/* ── Article body + TOC ──────────────────────────────── */}
            <div style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="flex gap-14 items-start">

                        {/* Prose */}
                        <article className="min-w-0 flex-1">
                            <Link href="/blog"
                                className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-[#3cbdf8]"
                                style={{ color: '#7b8da3' }}>
                                <ArrowLeft size={15} /> Voltar ao blog
                            </Link>

                            {sanitizedContent && (
                                <div
                                    ref={proseRef}
                                    className="prose prose-invert prose-sky max-w-none
                                        prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-100
                                        prose-p:text-slate-300 prose-p:leading-relaxed
                                        prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-slate-100
                                        prose-code:text-sky-300 prose-code:bg-[#101f30] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.875em] prose-code:font-mono
                                        prose-pre:bg-[#101f30] prose-pre:border prose-pre:border-[rgba(150,178,208,0.12)] prose-pre:rounded-2xl
                                        prose-blockquote:border-l-[#3cbdf8] prose-blockquote:text-slate-400 prose-blockquote:not-italic
                                        prose-img:rounded-2xl
                                        prose-li:text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                            )}
                        </article>

                        {/* TOC sidebar */}
                        {headings.length > 0 && (
                            <aside className="hidden xl:block sticky top-24 w-56 shrink-0">
                                <h5 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#7b8da3' }}>
                                    Neste artigo
                                </h5>
                                <ul className="space-y-1.5">
                                    {headings.map(({ id, text, level }) => (
                                        <li key={id}>
                                            <a href={`#${id}`}
                                                className={`block text-sm leading-snug transition-colors ${level === 'h3' ? 'pl-3' : ''}`}
                                                style={{ color: activeId === id ? '#3cbdf8' : '#7b8da3' }}
                                                onMouseEnter={e => e.currentTarget.style.color='#b6c5d8'}
                                                onMouseLeave={e => e.currentTarget.style.color = activeId === id ? '#3cbdf8' : '#7b8da3'}>
                                                {text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                                    <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#7b8da3' }}>Compartilhar</div>
                                    <CopyLinkBtn />
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
