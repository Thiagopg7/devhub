import { useEffect, useState, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
import Reveal from '@/Components/Public/Reveal';
import { Calendar, Clock, Tag, Check, ArrowLeft, ArrowRight } from 'lucide-react';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function estimateReadTime(content) {
    if (!content) return 1;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

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

/* ── Share helpers ───────────────────────────────────────────── */
function shareUrl(platform, url, title) {
    const enc = encodeURIComponent;
    if (platform === 'x')
        return `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
    if (platform === 'linkedin')
        return `https://www.linkedin.com/shareArticle?mini=true&url=${enc(url)}&title=${enc(title)}`;
    return '#';
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.3L4 21H1l7.5-8.6L.5 3H7l4.5 5.8L17.5 3zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 005 0 2.5 2.5 0 00-2.52-2.5zM3 8.98h4v12.02H3V8.98zM10 8.98h3.8v1.64h.06c.53-1 1.83-2.06 3.76-2.06 4 0 4.74 2.64 4.74 6.07v6.37h-4v-5.65c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.99v5.74H10V8.98z" />
        </svg>
    );
}

function CopyLinkBtn() {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} aria-label="Copiar link"
            className="w-9 h-9 grid place-items-center rounded-lg transition-all hover:-translate-y-0.5"
            style={{
                background: '#15243a',
                border: '1px solid rgba(150,178,208,0.18)',
                color: copied ? '#3cbdf8' : '#7b8da3',
            }}>
            {copied
                ? <Check size={14} />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" /><path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" /></svg>
            }
        </button>
    );
}

function ShareButtons({ url, title, className = '' }) {
    const btnCls = "w-9 h-9 grid place-items-center rounded-lg transition-all hover:-translate-y-0.5";
    const btnStyle = { background: '#15243a', border: '1px solid rgba(150,178,208,0.18)', color: '#7b8da3' };
    const hoverIn  = e => { e.currentTarget.style.background = '#3cbdf8'; e.currentTarget.style.color = '#03121d'; e.currentTarget.style.borderColor = 'transparent'; };
    const hoverOut = e => { e.currentTarget.style.background = '#15243a'; e.currentTarget.style.color = '#7b8da3'; e.currentTarget.style.borderColor = 'rgba(150,178,208,0.18)'; };

    return (
        <div className={`flex gap-2 ${className}`}>
            <a href={shareUrl('x', url, title)} target="_blank" rel="noopener noreferrer"
                aria-label="Compartilhar no X" className={btnCls} style={btnStyle}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <XIcon />
            </a>
            <a href={shareUrl('linkedin', url, title)} target="_blank" rel="noopener noreferrer"
                aria-label="Compartilhar no LinkedIn" className={btnCls} style={btnStyle}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <LinkedInIcon />
            </a>
            <CopyLinkBtn />
        </div>
    );
}

/* ── Main component ──────────────────────────────────────────── */
export default function BlogShow({ post, prevPost = null, nextPost = null, relatedPosts = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const proseRef = useRef(null);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    const ogTitle       = post.meta_title || post.title;
    const ogDescription = post.meta_description || post.description;
    const readTime      = estimateReadTime(post.content);
    const pageUrl       = typeof window !== 'undefined' ? window.location.href : route('blog.show', post.slug);

    const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';

    /* Inject IDs into headings after render */
    useEffect(() => {
        if (!proseRef.current) return;
        const nodes = [...proseRef.current.querySelectorAll('h2, h3')];
        const items = nodes.map((el, i) => {
            if (!el.id) el.id = `h-${i}`;
            return { id: el.id, text: el.textContent, level: el.tagName.toLowerCase() };
        });
        setHeadings(items);
    }, [sanitizedContent]);

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

    /* Inject copy buttons into <pre> blocks */
    useEffect(() => {
        if (!proseRef.current) return;
        proseRef.current.querySelectorAll('pre').forEach(pre => {
            if (pre.closest('.codeblock-wrapper')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'codeblock-wrapper';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const btn = document.createElement('button');
            btn.textContent = 'Copiar';
            btn.className = 'codeblock-copy';
            btn.setAttribute('aria-label', 'Copiar código');
            btn.addEventListener('click', () => {
                const code = pre.querySelector('code') || pre;
                navigator.clipboard.writeText(code.textContent ?? '');
                btn.textContent = '✓ Copiado!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
            });
            wrapper.appendChild(btn);
        });
    }, [sanitizedContent]);

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

            {/* ── Article pagehead ───────────────────────────────── */}
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

                    {/* Category pill */}
                    {post.category && (
                        <Link href={route('blog.category', post.category.slug)}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-semibold mb-5 transition-colors"
                            style={{ background: 'rgba(60,189,248,0.12)', color: '#3cbdf8', border: '1px solid rgba(60,189,248,0.2)' }}>
                            <Tag size={11} /> {post.category.name}
                        </Link>
                    )}

                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mb-4"
                        style={{ fontSize: 'clamp(30px,4.5vw,52px)', maxWidth: '820px' }}>
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="mb-6 max-w-[64ch]" style={{ color: '#b6c5d8', fontSize: 'clamp(17px,1.6vw,20px)' }}>
                            {post.description}
                        </p>
                    )}

                    {/* Byline */}
                    <div className="flex flex-wrap items-center gap-4 mt-7">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full grid place-items-center font-display font-semibold text-xs text-white shrink-0"
                                style={{ background: 'linear-gradient(135deg,#3cbdf8,#2a9be0)' }}>DH</div>
                            <div>
                                <div className="text-sm font-semibold text-white">Equipe DevHub</div>
                                <div className="text-xs" style={{ color: '#7b8da3' }}>Engenharia &amp; Conteúdo</div>
                            </div>
                        </div>
                        <span className="w-px h-8 shrink-0" style={{ background: 'rgba(150,178,208,0.18)' }} />
                        <span className="inline-flex items-center gap-2 text-sm font-mono" style={{ color: '#7b8da3' }}>
                            <Calendar size={13} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                            {formatDate(post.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm font-mono" style={{ color: '#7b8da3' }}>
                            <Clock size={13} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                            {readTime} min de leitura
                        </span>

                        <div className="flex items-center gap-3 ml-auto">
                            <span className="text-xs font-mono hidden sm:block" style={{ color: '#7b8da3' }}>Compartilhar</span>
                            <ShareButtons url={pageUrl} title={post.title} />
                        </div>
                    </div>

                    {/* Cover image */}
                    {post.banner_image_url && (
                        <div className="mt-10 rounded-2xl overflow-hidden"
                            style={{ maxHeight: 420, border: '1px solid rgba(150,178,208,0.18)' }}>
                            <img src={post.banner_image_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </section>

            {/* ── Article body + TOC ─────────────────────────────── */}
            <div style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-14 items-start pt-16 pb-10">

                        {/* Prose */}
                        <article className="min-w-0 flex-1">
                            {sanitizedContent && (
                                <div
                                    ref={proseRef}
                                    className="prose prose-invert prose-sky max-w-none
                                        prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-headings:scroll-mt-24
                                        prose-h2:text-[28px] prose-h2:mt-[2em] prose-h2:leading-tight
                                        prose-h3:text-[21px] prose-h3:mt-[1.7em]
                                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-[17px]
                                        prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-white prose-strong:font-bold
                                        prose-code:text-sky-300 prose-code:bg-[#101f30] prose-code:border prose-code:border-[rgba(150,178,208,0.15)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.86em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                        prose-pre:bg-[#0b1623] prose-pre:border prose-pre:border-[rgba(150,178,208,0.18)] prose-pre:rounded-xl prose-pre:p-5
                                        prose-blockquote:border-l-[#3cbdf8] prose-blockquote:border-l-2 prose-blockquote:text-slate-400 prose-blockquote:not-italic prose-blockquote:pl-5
                                        prose-img:rounded-2xl prose-img:border prose-img:border-[rgba(150,178,208,0.15)]
                                        prose-li:text-slate-300 prose-li:text-[17px]
                                        prose-ul:gap-2 prose-ol:gap-2"
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                            )}

                            {/* ── Author box ─────────────────────────────────── */}
                            <Reveal className="flex items-start gap-5 rounded-2xl p-6 mt-14"
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}>
                                <div className="w-16 h-16 rounded-2xl grid place-items-center font-display font-bold text-xl text-white shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#3cbdf8,#2a9be0)' }}>
                                    DH
                                </div>
                                <div>
                                    <div className="font-display font-semibold text-white text-base">Equipe DevHub</div>
                                    <div className="text-xs font-mono mb-3" style={{ color: '#3cbdf8' }}>Engenharia &amp; Conteúdo</div>
                                    <p className="text-sm leading-relaxed" style={{ color: '#b6c5d8' }}>
                                        Conteúdo produzido pela equipe do DevHub — desenvolvedores que escrevem sobre o que usam no dia a dia.
                                        Tutoriais testados, arquiteturas reais e nenhum "hello world" sem propósito.
                                    </p>
                                </div>
                            </Reveal>

                            {/* ── Article nav prev / next ─────────────────────── */}
                            {(prevPost || nextPost) && (
                                <Reveal className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    {prevPost ? (
                                        <Link href={route('blog.show', prevPost.slug)}
                                            className="group flex flex-col gap-2 rounded-2xl p-5 transition-all"
                                            style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.12)'}>
                                            <span className="inline-flex items-center gap-1.5 font-mono text-xs" style={{ color: '#7b8da3' }}>
                                                <ArrowLeft size={12} /> Anterior
                                            </span>
                                            <span className="text-sm font-semibold text-white leading-snug group-hover:text-[#3cbdf8] transition-colors line-clamp-2">
                                                {prevPost.title}
                                            </span>
                                        </Link>
                                    ) : <div />}

                                    {nextPost ? (
                                        <Link href={route('blog.show', nextPost.slug)}
                                            className="group flex flex-col gap-2 rounded-2xl p-5 transition-all text-right"
                                            style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.12)' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.12)'}>
                                            <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs" style={{ color: '#7b8da3' }}>
                                                Próximo <ArrowRight size={12} />
                                            </span>
                                            <span className="text-sm font-semibold text-white leading-snug group-hover:text-[#3cbdf8] transition-colors line-clamp-2">
                                                {nextPost.title}
                                            </span>
                                        </Link>
                                    ) : <div />}
                                </Reveal>
                            )}
                        </article>

                        {/* TOC sidebar */}
                        {headings.length > 0 && (
                            <aside className="hidden xl:block sticky top-24 shrink-0" style={{ width: 248 }}>
                                <h5 className="font-mono text-[11.5px] uppercase tracking-[.12em] mb-4" style={{ color: '#7b8da3' }}>
                                    Neste artigo
                                </h5>
                                <ul className="flex flex-col gap-0.5 m-0 p-0 list-none"
                                    style={{ borderLeft: '1px solid rgba(150,178,208,0.15)' }}>
                                    {headings.map(({ id, text, level }) => {
                                        const isActive = activeId === id;
                                        return (
                                            <li key={id} className="m-0 p-0">
                                                <a href={`#${id}`}
                                                    className="block text-[13.5px] leading-snug transition-colors"
                                                    style={{
                                                        padding: '8px 0 8px 16px',
                                                        marginLeft: -1,
                                                        paddingLeft: level === 'h3' ? 28 : 16,
                                                        borderLeft: `2px solid ${isActive ? '#3cbdf8' : 'transparent'}`,
                                                        color: isActive ? '#3cbdf8' : '#7b8da3',
                                                        fontWeight: isActive ? 600 : 400,
                                                    }}
                                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#eaf1fa'; }}
                                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#7b8da3'; }}>
                                                    {text}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="mt-7 pt-5" style={{ borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                                    <div className="font-mono text-[11.5px] uppercase tracking-[.12em] mb-3" style={{ color: '#7b8da3' }}>
                                        Compartilhar
                                    </div>
                                    <ShareButtons url={pageUrl} title={post.title} />
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Related posts ──────────────────────────────────── */}
            {relatedPosts.length > 0 && (
                <section style={{ background: '#0c1828', borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <Reveal className="mb-10">
                            <span className="eyebrow">Continue lendo</span>
                            <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3"
                                style={{ fontSize: 'clamp(24px,3vw,34px)' }}>
                                Artigos relacionados
                            </h2>
                        </Reveal>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((p, i) => (
                                <Reveal key={p.id} delay={i * 100}>
                                    <PostCard post={p} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
