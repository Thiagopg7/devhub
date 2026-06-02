import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
import Newsletter from '@/Components/Public/Newsletter';
import {
    ChevronLeft, ChevronRight, Search, X,
    LayoutGrid, Server, Monitor, Cpu, Database, TrendingUp, Tag,
} from 'lucide-react';

function categoryIcon(slug) {
    if (!slug) return LayoutGrid;
    const s = slug.toLowerCase();
    if (s.includes('backend') || s.includes('back-end')) return Server;
    if (s.includes('frontend') || s.includes('front-end')) return Monitor;
    if (s.includes('ia') || s.includes('dados') || s.includes('data') || s.includes('ml')) return Cpu;
    if (s.includes('banco') || s.includes('database') || s.includes('db')) return Database;
    if (s.includes('carreira') || s.includes('career')) return TrendingUp;
    return Tag;
}

export default function BlogIndex({ posts, filters = {}, categories = [], totalPosts = 0 }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const { data, current_page, last_page, prev_page_url, next_page_url } = posts;

    const [busca, setBusca] = useState(filters.busca || '');
    const categoriaAtiva = filters.categoria || null;

    const navigate = (params) => {
        const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
        router.get(route('blog.index'), clean, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate({ busca: busca.trim(), categoria: categoriaAtiva });
    };

    const limparBusca = () => {
        setBusca('');
        navigate({ categoria: categoriaAtiva });
    };

    const selecionarCategoria = (slug) => {
        navigate({ busca: busca.trim(), categoria: slug });
    };

    const paginatorBtn = "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors";
    const pageBtn = "inline-flex items-center justify-center min-w-[40px] px-3 py-2 text-sm rounded-xl transition-colors";

    const getPageNumbers = (current, last) => {
        if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
        const pages = [1];
        if (current > 3) pages.push('...');
        for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
        if (current < last - 2) pages.push('...');
        pages.push(last);
        return pages;
    };

    const pageUrl = (page) => route('blog.index', {
        page,
        ...(filters.busca ? { busca: filters.busca } : {}),
        ...(filters.categoria ? { categoria: filters.categoria } : {}),
    });

    const AllIcon = LayoutGrid;
    const activeCount = categoriaAtiva
        ? (categories.find(c => c.slug === categoriaAtiva)?.posts_count ?? 0)
        : totalPosts;

    return (
        <PublicLayout>
            <Head title={`Blog — ${siteName}`}>
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Blog — ${siteName}`} />
                <meta property="og:description" content="Artigos sobre tecnologia, inovação e negócios" />
                <meta property="og:url" content={route('blog.index')} />
            </Head>

            {/* Page header */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 600, height: 600, right: -100, top: -200, background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 font-mono text-xs mb-8" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>Blog</span>
                    </nav>

                    <span className="eyebrow">O hub de conteúdo</span>
                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                        style={{ fontSize: 'clamp(34px,5vw,56px)' }}>
                        Todos os artigos
                    </h1>
                    <p className="mb-8 max-w-[60ch]" style={{ color: '#b6c5d8', fontSize: 16 }}>
                        Tutoriais, guias e reflexões sobre desenvolvimento web, arquitetura, banco de dados e carreira.{' '}
                        Busque por palavra-chave ou filtre por trilha.
                    </p>

                    {/* Search bar + count */}
                    <div className="flex items-center gap-3 mb-4">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7b8da3' }} />
                            <input
                                type="search"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar artigos…"
                                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm placeholder-[#7b8da3] focus:outline-none transition-colors"
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.18)', color: '#eaf1fa' }}
                                onFocus={e => e.target.style.borderColor = '#3cbdf8'}
                                onBlur={e => e.target.style.borderColor = 'rgba(150,178,208,0.18)'}
                            />
                        </form>
                        {filters.busca && (
                            <button type="button" onClick={limparBusca}
                                className="px-3 py-3 rounded-xl transition-colors hover:text-white shrink-0"
                                style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#7b8da3' }}
                                title="Limpar busca">
                                <X size={16} />
                            </button>
                        )}
                        <span className="font-mono text-sm shrink-0" style={{ color: '#7b8da3' }}>
                            {activeCount} artigos
                        </span>
                    </div>

                    {/* Category pills */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {/* Todos */}
                            <button
                                onClick={() => selecionarCategoria(null)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={!categoriaAtiva ? {
                                    background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)',
                                    color: '#03121d',
                                } : {
                                    background: '#101f30',
                                    border: '1px solid rgba(150,178,208,0.18)',
                                    color: '#b6c5d8',
                                }}>
                                <AllIcon size={14} />
                                Todos
                                <span className="font-mono text-xs opacity-75">{totalPosts}</span>
                            </button>

                            {categories.map((cat) => {
                                const Icon = categoryIcon(cat.slug);
                                const isActive = categoriaAtiva === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => selecionarCategoria(cat.slug)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                        style={isActive ? {
                                            background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)',
                                            color: '#03121d',
                                        } : {
                                            background: '#101f30',
                                            border: '1px solid rgba(150,178,208,0.18)',
                                            color: '#b6c5d8',
                                        }}>
                                        <Icon size={14} />
                                        {cat.name}
                                        <span className="font-mono text-xs opacity-75">{cat.posts_count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Posts grid */}
            <section style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    {data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map((post) => <PostCard key={post.id} post={post} />)}
                            </div>

                            {/* Pagination */}
                            {last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-12">
                                    {prev_page_url ? (
                                        <Link href={prev_page_url}
                                            className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#3cbdf8'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.18)'}>
                                            <ChevronLeft size={16} /> Anterior
                                        </Link>
                                    ) : (
                                        <span className={paginatorBtn} style={{ border: '1px solid rgba(150,178,208,0.08)', color: '#7b8da3', cursor: 'not-allowed' }}>
                                            <ChevronLeft size={16} /> Anterior
                                        </span>
                                    )}

                                    {getPageNumbers(current_page, last_page).map((page, i) =>
                                        page === '...' ? (
                                            <span key={`e${i}`} className="px-1 text-sm" style={{ color: '#7b8da3' }}>…</span>
                                        ) : page === current_page ? (
                                            <span key={page} className={`${pageBtn} font-semibold`}
                                                style={{ background: '#3cbdf8', color: '#03121d', border: '1px solid #3cbdf8' }}>
                                                {page}
                                            </span>
                                        ) : (
                                            <Link key={page} href={pageUrl(page)}
                                                className={`${pageBtn} hover:text-[#3cbdf8]`}
                                                style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = '#3cbdf8'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.18)'}>
                                                {page}
                                            </Link>
                                        )
                                    )}

                                    {next_page_url ? (
                                        <Link href={next_page_url}
                                            className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#3cbdf8'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(150,178,208,0.18)'}>
                                            Próximo <ChevronRight size={16} />
                                        </Link>
                                    ) : (
                                        <span className={paginatorBtn} style={{ border: '1px solid rgba(150,178,208,0.08)', color: '#7b8da3', cursor: 'not-allowed' }}>
                                            Próximo <ChevronRight size={16} />
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24" style={{ color: '#7b8da3' }}>
                            {filters.busca || filters.categoria ? (
                                <>
                                    <p className="text-lg">
                                        Nenhum resultado encontrado
                                        {filters.busca && <> para <span style={{ color: '#eaf1fa' }}>"{filters.busca}"</span></>}
                                        {filters.categoria && <> nesta categoria</>}.
                                    </p>
                                    <button onClick={() => navigate({})} className="text-sm mt-2 transition-colors hover:text-[#76d3ff]" style={{ color: '#3cbdf8' }}>
                                        Limpar filtros
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg">Nenhuma publicação disponível ainda.</p>
                                    <p className="text-sm mt-1">Volte em breve!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
